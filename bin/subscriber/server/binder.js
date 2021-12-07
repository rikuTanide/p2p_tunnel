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
exports.Binder = void 0;
const crypto_1 = require("crypto");
const request_to_blob_1 = require("../../share/request_to_blob");
const blob_to_response_1 = require("../../share/blob_to_response");
class Binder {
    constructor(outgoing, income) {
        this.outgoing = outgoing;
        this.income = income;
        this.map = new Map();
        income.subscribe((ab) => __awaiter(this, void 0, void 0, function* () {
            this.onResponse(ab);
        }));
    }
    onRequest(request) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const requestID = createRequestID();
            const ab = (0, request_to_blob_1.requestObjectToBlob)(requestID, request);
            const callback = (req) => resolve(req);
            this.map.set(requestID, callback);
            this.outgoing.next(ab);
        }));
    }
    onResponse(ab) {
        const { requestID, response } = (0, blob_to_response_1.blobToResponseObject)(ab);
        const callback = this.map.get(requestID);
        if (!callback)
            return;
        this.map.delete(requestID);
        callback(response);
    }
}
exports.Binder = Binder;
function createRequestID() {
    return (0, crypto_1.randomUUID)();
}
//# sourceMappingURL=binder.js.map