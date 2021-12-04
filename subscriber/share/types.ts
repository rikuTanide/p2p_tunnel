export type RequestArrayBuffer = ArrayBuffer;
export type ResponseArrayBuffer = ArrayBuffer;

export type Headers = { [key: string]: string[] };

export interface RequestObject {
  headline: Headline;
  headers: Headers;
  body: ArrayBuffer;
}

export interface Headline {
  method: string;
  url: string;
}

export interface ResponseObject {
  headers: Headers;
  body: ArrayBuffer;
}

// binder
export type Requester = (requestID: string, request: RequestArrayBuffer) => void;
