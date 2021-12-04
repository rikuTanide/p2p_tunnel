import * as express from "express";
import { Binder } from "./binder";
import {
  RequestObject,
  Headline,
  Headers,
  ResponseObject,
  ResponseArrayBuffer,
  RequestArrayBuffer,
} from "../share/types";
import { Observable, Subject } from "rxjs";
import {arrayBufferToResponseObject} from "../share/blob_to_response";

export function setUpEntrance(
  outgoing: Subject<RequestArrayBuffer>,
  income: Observable<ResponseArrayBuffer>
) {
  const binder = new Binder(outgoing, income);
  const app = express();
  app.use("/", async (req, res) => {
    const headline = getHeadline(req);
    const headers = getHeaders(req);
    const body = await getBody(req);

    res.send("tmp");

    const requestObjects: RequestObject = {
      headline,
      headers,
      body,
    };
    await binder.onRequest(requestObjects)

    const response = arrayBufferToResponseObject(
        await binder.onRequest(requestObjects)
    );
    // Object.entries(response.headers).map(([k, v]) => res.setHeader(k, v));
    // res.send(response.body);
    // res.end();
  });
  app.listen(8000);
}

function getHeadline(req: express.Request): Headline {
  return {
    method: req.method,
    url: req.url,
  };
}

function getHeaders(req: express.Request): Headers {
  const res: Headers = {};
  for (const key of Object.keys(req.headers)) {
    const value = req.headers[key];
    if (!value) continue;
    if (Array.isArray(value)) {
      res[key] = value;
    } else {
      res[key] = [value];
    }
  }
  return res;
}

async function getBody(req: express.Request): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const contentLengthStr = req.headers["content-length"];
    if (contentLengthStr === undefined) {
      reject();
      return;
    }
    const length = parseInt(contentLengthStr, 10);
    const body = new Uint8Array(length);
    let index = 0;
    req.on("data", (data: Buffer) => {
      data.copy(body, index, 0);
      index += data.length;
    });
    req.on("end", () => {
      resolve(body);
    });
  });
}
