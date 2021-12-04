import * as express from "express";
import { Blob } from "node:buffer";

type Headers = { [key: string]: string[] };

interface RequestObject {
  headline: Headline;
  headers: Headers;
  body: Blob;
}

interface Headline {
  method: string;
  url: string;
}

export function setUpListener() {
  const app = express();
  app.use("/", async (req, res) => {
    const headline = getHeadline(req);
    const headers = getHeaders(req);
    const body = await getBody(req);

    const requestObjects: RequestObject = {
      headline,
      headers,
      body,
    };
    const requestBlob = await requestObjectToBlob(requestObjects); // await 消す
    await blobToRequestObjects(requestBlob);
    res.write("ok");
    res.end();
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

async function getBody(req: express.Request): Promise<Blob> {
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
      console.log("data", data);
      data.copy(body, index, 0);
      index += data.length;
    });
    req.on("end", () => {
      console.log("body len", body.length);
      const blob = new Blob([body]);
      resolve(blob);
    });
  });
}

async function requestObjectToBlob(
  requestObjects: RequestObject
): Promise<Blob> {
  const headline = new Blob([JSON.stringify(requestObjects.headline)]);
  const headers = new Blob([JSON.stringify(requestObjects.headers)]);
  const splitters = new Uint32Array([
    headline.size,
    headers.size,
    requestObjects.body.size,
  ]).buffer as Buffer;
  console.log("request");
  console.log("splitters", splitters);
  console.log(headline.size);
  console.log(headers.size);
  console.log(requestObjects.body.size);

  console.log(await headline.arrayBuffer());
  console.log(await headers.arrayBuffer());
  console.log(await requestObjects.body.arrayBuffer());

  return new Blob([splitters, headline, headers, requestObjects.body]);
}

async function blobToRequestObjects(
  requestBlob: Blob
): Promise<RequestObject | undefined> {
  const splittersLength = (32 / 8) * 3;
  const splittersBlob = requestBlob.slice(0, splittersLength);
  const splitters = new Uint32Array(await splittersBlob.arrayBuffer());
  const headlineLength = splitters[0];
  const headersLength = splitters[1];
  const bodyLength = splitters[2];
  console.log("response");
  console.log(headlineLength);
  console.log(headersLength);
  console.log(bodyLength);
  if (
    headlineLength === undefined ||
    headersLength === undefined ||
    bodyLength === undefined
  ) {
    return;
  }
  const headline = await decodeHeadline(
    requestBlob.slice(splittersLength, splittersLength + headlineLength)
  );
  const headers = await decodeHeaders(
    requestBlob.slice(
      splittersLength + headlineLength,
      splittersLength + headlineLength + headersLength
    )
  );
  const body = await decodeBody(
    requestBlob.slice(splittersLength + headlineLength + headersLength)
  );
  console.log("end");
  return undefined;
}

async function decodeHeadline(blob: Blob) {
  console.log(await blob.arrayBuffer());
}

async function decodeHeaders(blob: Blob) {
  console.log(await blob.arrayBuffer());
}

async function decodeBody(blob: Blob) {
  console.log(await blob.arrayBuffer());
}
