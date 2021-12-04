import { RequestArrayBuffer, RequestObject } from "./types";

export function requestObjectToBlob(
  requestID: string,
  requestObjects: RequestObject
): RequestArrayBuffer {
  const body = requestObjects.body;
  const headline = new TextEncoder().encode(
    JSON.stringify(requestObjects.headline)
  );
  const headers = new TextEncoder().encode(
    JSON.stringify(requestObjects.headers)
  );
  const splitters = new Uint32Array([
    headline.length,
    headers.length,
    body.byteLength,
  ]).buffer;

  return Uint8Array.from([
    ...new TextEncoder().encode(requestID),
    ...new Uint8Array(splitters),
    ...headline,
    ...headers,
    ...new Uint8Array(body),
  ]);
}
