import { randomUUID } from "crypto";
import {
  RequestArrayBuffer,
  Requester,
  RequestObject,
  ResponseArrayBuffer,
  ResponseObject,
} from "../share/types";
import { Observable, Subject } from "rxjs";
import { readBlob } from "../share/read_blob";
import { requestObjectToBlob } from "../share/request_to_blob";
import { REQUEST_ID_LENGTH } from "./consts";
import { blobToRequestObjects } from "../share/blob_to_request";

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

  public onRequest(request: RequestObject): Promise<ResponseArrayBuffer> {
    return new Promise(async (resolve) => {
      const requestID = createRequestID();
      console.log(requestID);
      const ab = requestObjectToBlob(requestID, request);
      const callback: Callback = (req) => resolve(req);
      this.map.set(requestID, callback);
      this.outgoing.next(ab);
    });
  }

  private onResponse(id: string, response: ResponseArrayBuffer) {
    const callback = this.map.get(id);
    if (!callback) return;
    callback(response);
  }
}

function createRequestID(): string {
  return randomUUID();
}
