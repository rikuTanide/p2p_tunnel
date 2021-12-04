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
  status: number;
  headers: Headers;
  body: ArrayBuffer;
}
