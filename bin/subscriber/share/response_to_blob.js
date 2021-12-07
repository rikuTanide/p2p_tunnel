"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseObjectToBlob = void 0;
function responseObjectToBlob(requestID, responseObject) {
    const headers = new TextEncoder().encode(JSON.stringify(responseObject.headers));
    const body = responseObject.body;
    const splitters = new Uint32Array([headers.length, body.byteLength]).buffer;
    return Uint8Array.from([
        ...new TextEncoder().encode(requestID),
        ...new Uint8Array(new Uint32Array([responseObject.status]).buffer),
        ...new Uint8Array(splitters),
        ...headers,
        ...body,
    ]);
}
exports.responseObjectToBlob = responseObjectToBlob;
//# sourceMappingURL=response_to_blob.js.map