"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestObjectToBlob = void 0;
function requestObjectToBlob(requestID, requestObjects) {
    const body = requestObjects.body;
    const headline = new TextEncoder().encode(JSON.stringify(requestObjects.headline));
    const headers = new TextEncoder().encode(JSON.stringify(requestObjects.headers));
    const splitters = new Uint32Array([
        headline.length,
        headers.length,
        body.byteLength,
    ]).buffer;
    return Uint8Array.from([
        ...new TextEncoder().encode(requestID),
        ...new Uint8Array(splitters),
        ...headline,
        ...headers,
        ...body,
    ]);
}
exports.requestObjectToBlob = requestObjectToBlob;
//# sourceMappingURL=request_to_blob.js.map