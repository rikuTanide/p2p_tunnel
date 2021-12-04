import { Headline, Headers, RequestObject } from "./types";
import { REQUEST_ID_LENGTH } from "../server/consts";

export function blobToRequestObjects(
  requestAB: ArrayBuffer
): { requestID: string; request: RequestObject } | undefined {
  const requestID = toText(requestAB.slice(0, REQUEST_ID_LENGTH));

  const splittersLength = (32 / 8) * 3;
  const splittersBlob = requestAB.slice(
    REQUEST_ID_LENGTH,
    REQUEST_ID_LENGTH + splittersLength
  );
  const splitters = new Uint32Array(new Uint8Array(splittersBlob).buffer);
  const headlineLength = splitters[0];
  const headersLength = splitters[1];
  const bodyLength = splitters[2];
  if (
    headlineLength === undefined ||
    headersLength === undefined ||
    bodyLength === undefined
  ) {
    return;
  }
  const splitterStart = REQUEST_ID_LENGTH;
  const headlineStart = splitterStart + splittersLength;
  const headersStart = headlineStart + headlineLength;
  const bodyStart = headersStart + headersLength;
  const headline = decodeHeadline(
    requestAB.slice(headlineStart, headlineStart + headlineLength)
  );
  const headers = decodeHeaders(
    requestAB.slice(headersStart, headersStart + headersLength)
  );
  const body = requestAB.slice(bodyStart);

  return {
    requestID: requestID,
    request: {
      headline,
      headers,
      body,
    },
  };
}

function toText(ab: ArrayBuffer): string {
  const decoder = new TextDecoder();
  return decoder.decode(ab);
}

function decodeHeadline(ab: ArrayBuffer): Headline {
  const json = toText(ab);
  return JSON.parse(json);
}

function decodeHeaders(ab: ArrayBuffer): Headers {
  const json = toText(ab);
  return JSON.parse(json);
}
