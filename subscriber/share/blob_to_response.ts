import {RequestObject, ResponseArrayBuffer, ResponseObject} from "./types";

export function blobToResponseObject(blob: ResponseArrayBuffer): ResponseObject {
    return {
        body: new Uint8Array(0),
        headers: {},
    }
}
