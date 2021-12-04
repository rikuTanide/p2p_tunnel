import {RequestArrayBuffer, RequestObject} from "./types";

export function requestObjectToBlob(
  requestObjects: RequestObject
): RequestArrayBuffer {
  const body = requestObjects.body;
  const headline = new TextEncoder().encode(JSON.stringify(requestObjects.headline));
  const headers = new TextEncoder().encode(JSON.stringify(requestObjects.headers));
  const splitters = new Uint32Array([
    headline.length,
    headers.length,
    body.byteLength,
  ]).buffer;

  return  Uint8Array.of(
      ...new Uint8Array(splitters),
      ...headline,
      ...headers,
      ...new Uint8Array(body)
  );

}
