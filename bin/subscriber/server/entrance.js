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
exports.setUpEntrance = void 0;
const express = require("express");
const binder_1 = require("./binder");
function setUpEntrance(outgoing, income, host, port) {
    const binder = new binder_1.Binder(outgoing, income);
    const app = express();
    app.use("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const startline = getStartline(req);
        const headers = getHeaders(req);
        const body = yield getBody(req);
        const requestObjects = {
            startline,
            headers,
            body,
        };
        const response = yield binder.onRequest(requestObjects);
        res.status(response.status);
        Object.entries(response.headers).map(([k, v]) => res.setHeader(k, v));
        res.setHeader("content-length", response.body.byteLength);
        res.write(response.body);
        res.end();
    }));
    app.listen(port, host);
}
exports.setUpEntrance = setUpEntrance;
function getStartline(req) {
    return {
        method: req.method,
        url: req.url,
    };
}
function getHeaders(req) {
    const res = {};
    for (const key of Object.keys(req.headers)) {
        const value = req.headers[key];
        if (!value)
            continue;
        if (Array.isArray(value)) {
            res[key] = value;
        }
        else {
            res[key] = [value];
        }
    }
    return res;
}
function getBody(req) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const contentLengthStr = req.headers["content-length"];
            if (contentLengthStr === undefined) {
                resolve(new Uint8Array(0));
                return;
            }
            const length = parseInt(contentLengthStr, 10);
            const body = new Uint8Array(length);
            let index = 0;
            req.on("data", (data) => {
                data.copy(body, index, 0);
                index += data.length;
            });
            req.on("end", () => {
                resolve(body);
            });
        });
    });
}
//# sourceMappingURL=entrance.js.map