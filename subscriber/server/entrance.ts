import * as express from "express";
import { Binder } from "./binder";
import {
  Headers,
  RequestArray,
  RequestObject,
  ResponseArray,
  Startline,
} from "../../share/types";
import { Observable, Subject } from "rxjs";

export function setUpEntrance(
  outgoing: Subject<RequestArray>,
  income: Observable<ResponseArray>,
  host: string,
  port: number
) {
  const binder = new Binder(outgoing, income);
  const app = express();
  app.use("/", async (req, res) => {
    const startline = getStartline(req);
    const headers = getHeaders(req);
    const body = await getBody(req);

    const requestObjects: RequestObject = {
      startline,
      headers,
      body,
    };
    const response = await binder.onRequest(requestObjects);
    res.status(response.status);
    Object.entries(response.headers).map(([k, v]) => res.setHeader(k, v));
    res.setHeader("content-length", response.body.byteLength);
    res.write(response.body);
    res.end();
  });
  app.listen(port, host);
}

function getStartline(req: express.Request): Startline {
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

async function getBody(req: express.Request): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const contentLengthStr = req.headers["content-length"];
    if (contentLengthStr === undefined) {
      resolve(new Uint8Array(0));
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
