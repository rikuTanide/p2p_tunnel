import fetch, { Headers, HeadersInit } from "node-fetch";
import * as Puppeteer from "puppeteer";
import * as express from "express";
import { blobToRequestObjects } from "../../subscriber/share/blob_to_request";
import { responseObjectToBlob } from "../../subscriber/share/response_to_blob";
import * as SharedTypes from "../../subscriber/share/types";
import {
  RequestObject,
  ResponseArray,
  ResponseObject,
} from "../../subscriber/share/types";
import { AddressInfo } from "net";
import { setUpServer } from "./server";

export async function proxy(
  requestID: string,
  request: RequestObject,
  originalHost
): Promise<ResponseArray> {
  const url = new URL(request.headline.url, "http://localhost:3000/");

  const res = await fetch(url.toString(), {
    method: request.headline.method,
    headers: toFetchHeaders(request.headers, originalHost),
    compress: false,
    body: request.body.byteLength === 0 ? undefined : request.body,
  });
  const responseObject: ResponseObject = {
    status: res.status,
    headers: toCarryHeaders(res.headers),
    body: new Uint8Array(await res.arrayBuffer()),
  };
  return responseObjectToBlob(requestID, responseObject);
}

function toCarryHeaders(headers: Headers) {
  const res: SharedTypes.Headers = {};
  for (const [key, value] of headers.entries()) {
    res[key] = [value];
  }
  return res;
}

function toFetchHeaders(
  headers: SharedTypes.Headers,
  originalHost: string
): HeadersInit {
  const res: string[][] = [];
  for (const [key, values] of Object.entries(headers)) {
    if (key === "host") {
      res.push([key, originalHost]);
      continue;
    }
    for (const value of values) {
      res.push([key, value]);
    }
  }
  return res;
}
