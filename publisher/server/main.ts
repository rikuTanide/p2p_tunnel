import * as Puppeteer from "puppeteer";
import * as express from "express";
import { blobToRequestObjects } from "../../subscriber/share/blob_to_request";
import { arrayBufferToResponseObject } from "../../subscriber/share/blob_to_response";
import { responseObjectToArrayBuffer } from "../../subscriber/share/response_to_blob";
import {
  RequestObject,
  ResponseObject,
  ResponseArray,
} from "../../subscriber/share/types";
import * as SharedTypes from "../../subscriber/share/types";
import fetch, { Headers, HeadersInit } from "node-fetch";
const fs = require("fs");

export async function setUp() {
  const app = express();
  app.get("/connection_id", (req, res) => {
    const id = (req.query as { id: string }).id;
    fs.writeFileSync("..\\publisher_peer_id.txt", id);
    console.log("ready");
    res.end();
  });
  app.post("/on_request", async (req, res) => {
    const bodyAB = await readBodyAB(req, res);
    const requestObject = await blobToRequestObjects(bodyAB);
    if (!requestObject) {
      console.log("error");
      res.status(500);
      res.send("blob parse error.");
      return;
    }
    const { requestID, request } = requestObject;
    const response = await proxy(requestID, request);
    res.status(200);
    res.setHeader("content-length", response.byteLength);
    res.write(response);
    res.end();
  });
  app.use("/", express.static("./web/dist"));
  await app.listen(8002);

  const browser = await Puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:8002/");
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

async function proxy(
  requestID: string,
  request: RequestObject
): Promise<ResponseArray> {
  const url = new URL(request.headline.url, "http://localhost:3000/");

  const res = await fetch(url.toString(), {
    method: request.headline.method,
    headers: toFetchHeaders(request.headers),
    compress: false,
    body: request.body.byteLength === 0 ? undefined : request.body,
  });
  const responseObject: ResponseObject = {
    status: res.status,
    headers: toCarryHeaders(res.headers),
    body: new Uint8Array(await res.arrayBuffer()),
  };
  return responseObjectToArrayBuffer(requestID, responseObject);
}

function toCarryHeaders(headers: Headers) {
  const res: SharedTypes.Headers = {};
  for (const [key, value] of headers.entries()) {
    res[key] = [value];
  }
  return res;
}

function toFetchHeaders(headers: SharedTypes.Headers): HeadersInit {
  const res: string[][] = [];
  for (const [key, values] of Object.entries(headers)) {
    for (const value of values) {
      res.push([key, value]);
    }
  }
  return res;
}

setUp();
