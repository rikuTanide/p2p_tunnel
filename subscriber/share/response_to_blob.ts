import { ResponseObject } from "./types";
import { concat } from "./util";

export function responseObjectToBlob(
  requestID: string,
  responseObject: ResponseObject
) {
  const headers = new TextEncoder().encode(
    JSON.stringify(responseObject.headers)
  );
  const body = responseObject.body;

  const splitters = new Uint32Array([headers.length, body.byteLength]).buffer;

  return concat([
    new TextEncoder().encode(requestID),
    new Uint8Array(new Uint32Array([responseObject.status]).buffer),
    new Uint8Array(splitters),
    headers,
    body,
  ]);
}
