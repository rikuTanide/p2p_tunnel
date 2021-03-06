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
exports.setUpServer = void 0;
const express = require("express");
const blob_to_request_1 = require("../../share/blob_to_request");
const proxy_1 = require("./proxy");
const path = require("path");
function setUpServer(originalHost) {
    const app = express();
    app.get("/publisher_id", (req, res) => {
        onPublisherID(req, res);
    });
    app.post("/on_request", (req, res) => __awaiter(this, void 0, void 0, function* () {
        yield onRequest(req, res, originalHost);
    }));
    app.use("/", express.static(path.join(__dirname, "../web/dist")));
    const server = app.listen();
    return server.address().port;
}
exports.setUpServer = setUpServer;
function onPublisherID(req, res) {
    const publisherID = req.query.id;
    res.end();
    console.log(`publisherID is ${publisherID}`);
}
function onRequest(req, res, originalHost) {
    return __awaiter(this, void 0, void 0, function* () {
        const bodyAB = yield readBodyAB(req);
        const requestObject = yield (0, blob_to_request_1.blobToRequestObjects)(bodyAB);
        if (!requestObject) {
            console.log("error");
            res.status(500);
            res.send("blob parse error.");
            return;
        }
        const { requestID, request } = requestObject;
        const response = yield (0, proxy_1.proxy)(requestID, request, originalHost);
        res.status(200);
        res.setHeader("content-length", response.byteLength);
        res.write(response);
        res.end();
    });
}
function readBodyAB(req) {
    return new Promise((resolve) => {
        const body = [];
        req.on("data", (data) => {
            body.push(...data);
        });
        req.on("end", () => {
            const ab = new Uint8Array(body);
            resolve(ab);
        });
    });
}
//# sourceMappingURL=server.js.map