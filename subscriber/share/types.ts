export type RequestArray = Uint8Array;
export type ResponseArray = Uint8Array;

export type Headers = { [key: string]: string[] };

export interface RequestObject {
  headline: Headline;
  headers: Headers;
  body: Uint8Array;
}

export interface Headline {
  method: string;
  url: string;
}

export interface ResponseObject {
  status: number;
  headers: Headers;
  body: Uint8Array;
}
