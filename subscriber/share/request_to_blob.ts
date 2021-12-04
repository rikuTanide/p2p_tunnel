import { RequestArray, RequestObject } from "./types";

export function requestObjectToBlob(
  requestID: string,
  requestObjects: RequestObject
): RequestArray {
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
    ...body,
  ]);
}
