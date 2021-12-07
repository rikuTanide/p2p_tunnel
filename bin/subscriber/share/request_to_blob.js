"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestObjectToBlob = void 0;
const zlib_1 = require("zlib");
const util_1 = require("./util");
function requestObjectToBlob(requestID, requestObjects) {
    const body = requestObjects.body;
    const startline = new TextEncoder().encode(JSON.stringify(requestObjects.startline));
    const headers = new TextEncoder().encode(JSON.stringify(requestObjects.headers));
    const splitters = new Uint32Array([
        startline.length,
        headers.length,
        body.byteLength,
    ]).buffer;
    const plain = (0, util_1.concat)([
        new TextEncoder().encode(requestID),
        new Uint8Array(splitters),
        startline,
        headers,
        body,
    ]);
    return (0, zlib_1.gzipSync)(plain);
}
exports.requestObjectToBlob = requestObjectToBlob;
//# sourceMappingURL=request_to_blob.js.map