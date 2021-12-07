export type RequestArray = Uint8Array;
export type ResponseArray = Uint8Array;

export type Headers = { [key: string]: string[] };

export interface RequestObject {
  startline: Startline;
  headers: Headers;
  body: Uint8Array;
}

export interface Startline {
  method: string;
  url: string;
}

export interface ResponseObject {
  status: number;
  headers: Headers;
  body: Uint8Array;
}
