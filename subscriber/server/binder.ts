import { randomUUID } from "crypto";
import {
  RequestArrayBuffer,
  Requester,
  RequestObject,
  ResponseArrayBuffer,
  ResponseObject,
} from "../share/types";
import { Observable, Subject } from "rxjs";
import { REQUEST_ID_LENGTH } from "./main";
import { readBlob } from "../share/read_blob";

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

  public onRequest(request: RequestArrayBuffer): Promise<ResponseArrayBuffer> {
    return new Promise(async (resolve) => {
      const requestID = createRequestID();
      console.log(
        "randomUUID byte length: ",
        new TextEncoder().encode(requestID).length
      );
      const ab = Uint8Array.of(
        ...new TextEncoder().encode(requestID),
        ...new Uint8Array(request)
      );
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
  console.log("randomUUID string length: ", randomUUID().length);
  return randomUUID();
}
