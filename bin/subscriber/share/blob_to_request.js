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
    const headlineLength = splitters[0];
    const headersLength = splitters[1];
    const bodyLength = splitters[2];
    if (headlineLength === undefined ||
        headersLength === undefined ||
        bodyLength === undefined) {
        return;
    }
    const splitterStart = consts_1.REQUEST_ID_LENGTH;
    const headlineStart = splitterStart + splittersLength;
    const headersStart = headlineStart + headlineLength;
    const bodyStart = headersStart + headersLength;
    const headline = decodeHeadline(requestAB.slice(headlineStart, headlineStart + headlineLength));
    const headers = decodeHeaders(requestAB.slice(headersStart, headersStart + headersLength));
    const body = requestAB.slice(bodyStart);
    return {
        requestID: requestID,
        request: {
            headline,
            headers,
            body,
        },
    };
}
exports.blobToRequestObjects = blobToRequestObjects;
function decodeHeadline(array) {
    const json = (0, util_1.toText)(array);
    return JSON.parse(json);
}
function decodeHeaders(array) {
    const json = (0, util_1.toText)(array);
    return JSON.parse(json);
}
//# sourceMappingURL=blob_to_request.js.map