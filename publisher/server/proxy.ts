import * as fetch from "node-fetch";
import { Headers, HeadersInit } from "node-fetch";
import { responseObjectToBlob } from "../../share/response_to_blob";
import * as SharedTypes from "../../share/types";
import {
  RequestObject,
  ResponseArray,
  ResponseObject,
} from "../../share/types";

export async function proxy(
  requestID: string,
  request: RequestObject,
  originalHost
): Promise<ResponseArray> {
  const url = new URL(request.startline.url, `http://${originalHost}/`);

  const res = await fetch.default(url.toString(), {
    method: request.startline.method,
    headers: toFetchHeaders(request.headers, originalHost),
    compress: false,
    body: request.body.byteLength === 0 ? undefined : request.body,
  });
  const responseObject: ResponseObject = {
    status: res.status,
    headers: toCarryHeaders(res.headers),
    body: new Uint8Array(await res.arrayBuffer()),
  };
  return responseObjectToBlob(requestID, responseObject);
}

function toCarryHeaders(headers: Headers) {
  const res: SharedTypes.Headers = {};
  for (const [key, value] of headers.entries()) {
    res[key] = [value];
  }
  return res;
}

function toFetchHeaders(
  headers: SharedTypes.Headers,
  originalHost: string
): HeadersInit {
  const res: string[][] = [];
  for (const [key, values] of Object.entries(headers)) {
    if (key === "host") {
      res.push([key, originalHost]);
      continue;
    }
    for (const value of values) {
      res.push([key, value]);
    }
  }
  return res;
}
