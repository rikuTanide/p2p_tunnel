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
  console.log(headline.length, headers.length, body.byteLength);
  const splitters = new Uint32Array([
    headline.length,
    headers.length,
    body.byteLength,
  ]).buffer;

  console.log(new Uint8Array(splitters).buffer);

  return Uint8Array.of(
    ...new TextEncoder().encode(requestID),
    ...new Uint8Array(splitters),
    ...headline,
    ...headers,
    ...new Uint8Array(body)
  );
}
