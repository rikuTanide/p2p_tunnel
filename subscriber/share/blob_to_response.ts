import {Headers, Headline, RequestObject, ResponseArrayBuffer, ResponseObject} from "./types";
import {REQUEST_ID_LENGTH} from "../server/consts";
import {toText} from "./util";

export function arrayBufferToResponseObject(
  ab: ResponseArrayBuffer
): { requestID: string, response: ResponseObject } {
  const requestID = toText(ab.slice(0, REQUEST_ID_LENGTH));
  console.log(requestID);
  const statusStart = REQUEST_ID_LENGTH;
  const statusLength = (32 / 8);
  const status = new Uint32Array( new Uint8Array(ab.slice(statusStart, statusStart + statusLength)).buffer)[0];
  console.log("status", status)
  if (!status) throw "status nai";

  const splitterStart = statusStart + statusLength;
  const splittersLength = (32 / 8) * 2;
  const splittersBlob = ab.slice(
      splitterStart,
      splitterStart + splittersLength
  );
  const splitters = new Uint32Array(new Uint8Array(splittersBlob).buffer);
  console.log(splitters)
  const headersLength = splitters[0];
  const bodyLength = splitters[1];
  if (
      headersLength === undefined ||
      bodyLength === undefined
  ) {
    throw "length not found"
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
    }
  }
}

function decodeHeaders(ab: ArrayBuffer): Headers {
  const json = toText(ab);
  return JSON.parse(json);
}