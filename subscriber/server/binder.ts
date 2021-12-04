import { randomUUID } from "crypto";
import {
  RequestArray,
  RequestObject,
  ResponseArray,
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

type Callback = (response: ResponseObject) => void;
export class Binder {
  private map = new Map<string, Callback>();
  constructor(
    private outgoing: Subject<RequestArray>,
    private income: Observable<ResponseArray>
  ) {
    income.subscribe(async (ab) => {
      this.onResponse(ab);
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
      const callback: Callback = (req) => resolve(req);
      this.map.set(requestID, callback);
      this.outgoing.next(ab);
    });
  }

  private onResponse(ab: ResponseArray) {
    const { requestID, response } = arrayBufferToResponseObject(ab);
    const callback = this.map.get(requestID);
    if (!callback) return;
    this.map.delete(requestID);
    callback(response);
  }
}

function createRequestID(): string {
  return randomUUID();
}
