import { Headline, Headers, RequestObject } from "./types";
import { REQUEST_ID_LENGTH } from "../server/consts";
import { toText } from "./util";

export function blobToRequestObjects(
  requestAB: Uint8Array
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

function decodeHeadline(array: Uint8Array): Headline {
  const json = toText(array);
  return JSON.parse(json);
}

function decodeHeaders(array: Uint8Array): Headers {
  const json = toText(array);
  return JSON.parse(json);
}
