"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blobToRequestObjects = void 0;
const consts_1 = require("../server/consts");
const util_1 = require("./util");
function blobToRequestObjects(requestAB) {
    const requestID = (0, util_1.toText)(requestAB.slice(0, consts_1.REQUEST_ID_LENGTH));
    const splittersLength = (32 / 8) * 3;
    const splittersBlob = requestAB.slice(consts_1.REQUEST_ID_LENGTH, consts_1.REQUEST_ID_LENGTH + splittersLength);
    const splitters = new Uint32Array(new Uint8Array(splittersBlob).buffer);
    const startlineLength = splitters[0];
    const headersLength = splitters[1];
    const bodyLength = splitters[2];
    if (startlineLength === undefined ||
        headersLength === undefined ||
        bodyLength === undefined) {
        return;
    }
    const splitterStart = consts_1.REQUEST_ID_LENGTH;
    const startlineStart = splitterStart + splittersLength;
    const headersStart = startlineStart + startlineLength;
    const bodyStart = headersStart + headersLength;
    const startline = decodeStartline(requestAB.slice(startlineStart, startlineStart + startlineLength));
    const headers = decodeHeaders(requestAB.slice(headersStart, headersStart + headersLength));
    const body = requestAB.slice(bodyStart);
    return {
        requestID: requestID,
        request: {
            startline: startline,
            headers,
            body,
        },
    };
}
exports.blobToRequestObjects = blobToRequestObjects;
function decodeStartline(array) {
    const json = (0, util_1.toText)(array);
    return JSON.parse(json);
}
function decodeHeaders(array) {
    const json = (0, util_1.toText)(array);
    return JSON.parse(json);
}
//# sourceMappingURL=blob_to_request.js.map