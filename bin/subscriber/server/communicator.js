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
exports.setUpCommunicator = void 0;
const expressWs = require("express-ws");
const express = require("express");
const Puppeteer = require("puppeteer");
const path = require("path");
class WebSocketBinder {
    constructor() {
        this.set = new Set();
    }
    register(ws) {
        this.set.add(ws);
    }
    sendByWebSockets(blob) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const ws of this.set)
                ws.send(blob);
        });
    }
    unlink(ws) {
        this.set.delete(ws);
    }
}
function setUpCommunicator(income, outgoing, publisherPeerID) {
    return __awaiter(this, void 0, void 0, function* () {
        const wsb = new WebSocketBinder();
        const app = expressWs(express()).app;
        app.use("/", express.static(path.join(__dirname, "../web/dist")));
        app.ws("/ws", (ws, req) => onWsOpen(ws, req, wsb, outgoing));
        const server = app.listen();
        const port = server.address().port;
        yield openCommunicatorPage(port, publisherPeerID);
        income.subscribe((blob) => {
            wsb.sendByWebSockets(blob);
        });
    });
}
exports.setUpCommunicator = setUpCommunicator;
function onWsOpen(ws, req, wsb, outgoing) {
    wsb.register(ws);
    ws.on("message", (msg) => {
        outgoing.next(new Uint8Array(msg));
    });
    ws.on("close", () => wsb.unlink(ws));
}
function openCommunicatorPage(port, publisherPeerID) {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield Puppeteer.launch();
        const page = yield browser.newPage();
        const url = new URL("http://localhost/");
        url.port = port.toString();
        url.searchParams.set("publisher_peer_id", publisherPeerID);
        yield page.goto(url.toString());
    });
}
//# sourceMappingURL=communicator.js.map