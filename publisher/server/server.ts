import * as express from "express";
import { AddressInfo } from "net";
const fs = require("fs");
import { blobToRequestObjects } from "../../subscriber/share/blob_to_request";
import { proxy } from "./proxy";

export function setUpServer(originalHost: string): number {
  const app = express();
  app.get("/connection_id", (req, res) => {
    onConnectionID(req, res);
  });
  app.post("/on_request", async (req, res) => {
    await onRequest(req, res, originalHost);
  });
  app.use("/", express.static("./web/dist"));
  const server = app.listen();
  return (server.address() as AddressInfo).port;
}

function onConnectionID<P, ResBody, ReqBody, ReqQuery, Locals>(
  req: express.Request,
  res: express.Response
) {
  const connectionID = (req.query as { id: string }).id;
  res.end();
  console.log(`connectionID is ${connectionID}`);
}

async function onRequest<P, ResBody, ReqBody, ReqQuery, Locals>(
  req: express.Request,
  res: express.Response,
  originalHost: string
) {
  const bodyAB = await readBodyAB(req, res);
  const requestObject = await blobToRequestObjects(bodyAB);
  if (!requestObject) {
    console.log("error");
    res.status(500);
    res.send("blob parse error.");
    return;
  }
  const { requestID, request } = requestObject;
  const response = await proxy(requestID, request, originalHost);
  res.status(200);
  res.setHeader("content-length", response.byteLength);
  res.write(response);
  res.end();
}

function readBodyAB(
  req: express.Request,
  res: express.Response
): Promise<Uint8Array> {
  return new Promise((resolve) => {
    const body: number[] = [];
    req.on("data", (data) => {
      body.push(...data);
    });
    req.on("end", () => {
      const ab = new Uint8Array(body);
      resolve(ab);
    });
  });
}
