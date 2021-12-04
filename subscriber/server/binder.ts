import { randomUUID } from "crypto";
import {
  RequestArrayBuffer,
  RequestObject,
  ResponseArrayBuffer,
  ResponseObject,
} from "../share/types";
import * as SharedTypes from "../share/types";
import { Observable, Subject } from "rxjs";
import { readBlob } from "../share/read_blob";
import { requestObjectToBlob } from "../share/request_to_blob";
import { REQUEST_ID_LENGTH } from "./consts";
import { blobToRequestObjects } from "../share/blob_to_request";
import { responseObjectToArrayBuffer } from "../share/response_to_blob";
import fetch, { Headers } from "node-fetch";
import { arrayBufferToResponseObject } from "../share/blob_to_response";

type Callback = (response: ResponseArrayBuffer) => void;
export class Binder {
  private map = new Map<string, Callback>();
  constructor(
    private outgoing: Subject<RequestArrayBuffer>,
    private income: Observable<ResponseArrayBuffer>
  ) {
    income.subscribe(async (ab) => {
      const requestID = await readBlob(ab.slice(0, REQUEST_ID_LENGTH));
      const body = ab.slice(REQUEST_ID_LENGTH) as ResponseArrayBuffer;
      this.onResponse(requestID, body);
    });
  }

  public onRequest(request: RequestObject): Promise<ResponseObject> {
    return new Promise(async (resolve, reject) => {
      const requestID = createRequestID();
      const ab = requestObjectToBlob(requestID, request);
      const resAb = blobToRequestObjects(ab);
      if (!resAb) {
        reject();
        return;
      }
      const res = (await this.proxy(requestID, resAb.request)).response;
      resolve(res);
      // const callback: Callback = (req) => resolve(req);
      // this.map.set(requestID, callback);
      // this.outgoing.next(ab);
    });
  }

  private onResponse(id: string, response: ResponseArrayBuffer) {
    const callback = this.map.get(id);
    if (!callback) return;
    callback(response);
  }

  private async proxy(requestID: string, request: RequestObject) {
    const url = new URL(request.headline.url, "http://localhost:3000/");

    const res = await fetch(url.toString(), {
      method: request.headline.method,
      body: request.body,
    });
    const responseObject: ResponseObject = {
      status: res.status,
      headers: this.toHeaders(res.headers),
      body: await res.arrayBuffer(),
    };
    const responseArrayBuffer = responseObjectToArrayBuffer(
      requestID,
      responseObject
    );
    return arrayBufferToResponseObject(responseArrayBuffer);
  }

  private toHeaders(headers: Headers) {
    const res: SharedTypes.Headers = {};
    for (const [key, value] of headers.entries()) {
      res[key] = [value];
    }
    return res;
  }
}

function createRequestID(): string {
  return randomUUID();
}
