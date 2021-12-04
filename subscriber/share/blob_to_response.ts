import {
  Headers,
  Headline,
  RequestObject,
  ResponseArray,
  ResponseObject,
} from "./types";
import { REQUEST_ID_LENGTH } from "../server/consts";
import { toText } from "./util";

export function arrayBufferToResponseObject(ab: ResponseArray): {
  requestID: string;
  response: ResponseObject;
} {
  const requestID = toText(ab.slice(0, REQUEST_ID_LENGTH));
  const statusStart = REQUEST_ID_LENGTH;
  const statusLength = 32 / 8;
  const status = new Uint32Array(
    ab.slice(statusStart, statusStart + statusLength).buffer
  )[0];
  if (!status) throw "status nai";

  const splitterStart = statusStart + statusLength;
  const splittersLength = (32 / 8) * 2;
  const splittersBlob = ab.slice(
    splitterStart,
    splitterStart + splittersLength
  );
  const splitters = new Uint32Array(splittersBlob.buffer);
  const headersLength = splitters[0];
  const bodyLength = splitters[1];
  if (headersLength === undefined || bodyLength === undefined) {
    throw "length not found";
  }
  const headersStart = splitterStart + splittersLength;
  const bodyStart = headersStart + headersLength;

  const headers = decodeHeaders(
    ab.slice(headersStart, headersStart + headersLength)
  );
  const body = ab.slice(bodyStart);

  return {
    requestID,
    response: {
      status: status,
      headers: headers,
      body: body,
    },
  };
}

function decodeHeaders(array: Uint8Array): Headers {
  const json = toText(array);
  return JSON.parse(json);
}
