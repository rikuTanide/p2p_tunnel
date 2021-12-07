import { RequestArray, RequestObject } from "./types";
import {gzipSync, gunzipSync} from "zlib";
import { concat } from "./util";

export function requestObjectToBlob(
  requestID: string,
  requestObjects: RequestObject
): RequestArray {
  const body = requestObjects.body;
  const startline = new TextEncoder().encode(
    JSON.stringify(requestObjects.startline)
  );
  const headers = new TextEncoder().encode(
    JSON.stringify(requestObjects.headers)
  );
  const splitters = new Uint32Array([
    startline.length,
    headers.length,
    body.byteLength,
  ]).buffer;

  const plain = concat([
    new TextEncoder().encode(requestID),
    new Uint8Array(splitters),
    startline,
    headers,
    body,
  ]);
  return gzipSync(plain);
}
