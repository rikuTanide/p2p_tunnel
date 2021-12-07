import { Headers, Startline, RequestObject } from "./types";
import { REQUEST_ID_LENGTH } from "../server/consts";
import { toText } from "./util";
import { gunzipSync} from "zlib";

export function blobToRequestObjects(
  compressed: Uint8Array
): { requestID: string; request: RequestObject } | undefined {
  const requestAB = new Uint8Array(gunzipSync(compressed));
  const requestID = toText(requestAB.slice(0, REQUEST_ID_LENGTH));

  const splittersLength = (32 / 8) * 3;
  const splittersBlob = requestAB.slice(
    REQUEST_ID_LENGTH,
    REQUEST_ID_LENGTH + splittersLength
  );
  const splitters = new Uint32Array(new Uint8Array(splittersBlob).buffer);
  const startlineLength = splitters[0];
  const headersLength = splitters[1];
  const bodyLength = splitters[2];
  if (
    startlineLength === undefined ||
    headersLength === undefined ||
    bodyLength === undefined
  ) {
    return;
  }
  const splitterStart = REQUEST_ID_LENGTH;
  const startlineStart = splitterStart + splittersLength;
  const headersStart = startlineStart + startlineLength;
  const bodyStart = headersStart + headersLength;
  const startline = decodeStartline(
    requestAB.slice(startlineStart, startlineStart + startlineLength)
  );
  const headers = decodeHeaders(
    requestAB.slice(headersStart, headersStart + headersLength)
  );
  const body = requestAB.slice(bodyStart);

  return {
    requestID: requestID,
    request: {
      startline: startline,
      headers,
      body,
    },
  };
}

function decodeStartline(array: Uint8Array): Startline {
  const json = toText(array);
  return JSON.parse(json);
}

function decodeHeaders(array: Uint8Array): Headers {
  const json = toText(array);
  return JSON.parse(json);
}
