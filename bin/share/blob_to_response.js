"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blobToResponseObject = void 0;
const consts_1 = require("./consts");
const util_1 = require("./util");
const zlib_1 = require("zlib");
function blobToResponseObject(compressed) {
    const ab = new Uint8Array((0, zlib_1.gunzipSync)(compressed));
    const requestID = (0, util_1.toText)(ab.slice(0, consts_1.REQUEST_ID_LENGTH));
    const statusStart = consts_1.REQUEST_ID_LENGTH;
    const statusLength = 32 / 8;
    const status = new Uint32Array(ab.slice(statusStart, statusStart + statusLength).buffer)[0];
    if (!status)
        throw "status nai";
    const splitterStart = statusStart + statusLength;
    const splittersLength = (32 / 8) * 2;
    const splittersBlob = ab.slice(splitterStart, splitterStart + splittersLength);
    const splitters = new Uint32Array(splittersBlob.buffer);
    const headersLength = splitters[0];
    const bodyLength = splitters[1];
    if (headersLength === undefined || bodyLength === undefined) {
        throw "length not found";
    }
    const headersStart = splitterStart + splittersLength;
    const bodyStart = headersStart + headersLength;
    const headers = decodeHeaders(ab.slice(headersStart, headersStart + headersLength));
    const body = ab.slice(bodyStart);
    return {
        requestID,
        response: {
            status: status,
            headers: headers,
            body: body,
        },
    };
}
exports.blobToResponseObject = blobToResponseObject;
function decodeHeaders(array) {
    const json = (0, util_1.toText)(array);
    return JSON.parse(json);
}
//# sourceMappingURL=blob_to_response.js.map