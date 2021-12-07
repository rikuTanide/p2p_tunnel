"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxy = void 0;
const fetch = require("node-fetch");
const response_to_blob_1 = require("../../subscriber/share/response_to_blob");
function proxy(requestID, request, originalHost) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = new URL(request.headline.url, `http://${originalHost}/`);
        const res = yield fetch.default(url.toString(), {
            method: request.headline.method,
            headers: toFetchHeaders(request.headers, originalHost),
            compress: false,
            body: request.body.byteLength === 0 ? undefined : request.body,
        });
        const responseObject = {
            status: res.status,
            headers: toCarryHeaders(res.headers),
            body: new Uint8Array(yield res.arrayBuffer()),
        };
        return (0, response_to_blob_1.responseObjectToBlob)(requestID, responseObject);
    });
}
exports.proxy = proxy;
function toCarryHeaders(headers) {
    const res = {};
    for (const [key, value] of headers.entries()) {
        res[key] = [value];
    }
    return res;
}
function toFetchHeaders(headers, originalHost) {
    const res = [];
    for (const [key, values] of Object.entries(headers)) {
        if (key === "host") {
            res.push([key, originalHost]);
            continue;
        }
        for (const value of values) {
            res.push([key, value]);
        }
    }
    return res;
}
//# sourceMappingURL=proxy.js.map