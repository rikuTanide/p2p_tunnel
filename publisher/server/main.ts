import * as Puppeteer from "puppeteer";
import * as express from "express";
import { blobToRequestObjects } from "../../subscriber/share/blob_to_request";
import { RequestObject } from "../../subscriber/share/types";

const fs = require("fs");


export async function setUp() {
  const app = express();
  app.get("/connection_id", (req, res) => {
    const id = (req.query as { id: string }).id;
    fs.writeFileSync("..\\publisher_peer_id.txt", id);
    console.log("ready");
  });
  app.post("/on_request", async (req, res) => {
    console.log("ooo");
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
    // const resAB = await responseToBlob(response);
    // res.send(resAB);
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
): Promise<ArrayBuffer> {
  return new Promise((resolve) => {
    const body: number[] = [];
    req.on("data", (data) => {
      body.push(...data);
    });
    req.on("end", () => {
      const ab = new Uint8Array(body);
      res.end();
      resolve(ab);
    });
  });
}

setUp();
