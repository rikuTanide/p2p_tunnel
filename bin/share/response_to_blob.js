"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseObjectToBlob = void 0;
const zlib_1 = require("zlib");
const util_1 = require("./util");
function responseObjectToBlob(requestID, responseObject) {
    const headers = new TextEncoder().encode(JSON.stringify(responseObject.headers));
    const body = responseObject.body;
    const splitters = new Uint32Array([headers.length, body.byteLength]).buffer;
    const plain = (0, util_1.concat)([
        new TextEncoder().encode(requestID),
        new Uint8Array(new Uint32Array([responseObject.status]).buffer),
        new Uint8Array(splitters),
        headers,
        body,
    ]);
    return (0, zlib_1.gzipSync)(plain);
}
exports.responseObjectToBlob = responseObjectToBlob;
//# sourceMappingURL=response_to_blob.js.map