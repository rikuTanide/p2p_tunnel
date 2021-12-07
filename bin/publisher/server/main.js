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
exports.setUp = exports.main = void 0;
const Puppeteer = require("puppeteer");
const server_1 = require("./server");
const flags = require("flags");
function main() {
    const bindOptions = getFlags();
    setUp(`${bindOptions[0]}:${bindOptions[1]}`);
}
exports.main = main;
function getFlags() {
    flags.defineString("host");
    flags.defineInteger("port");
    const f = process.argv.slice(3);
    flags.parse(f);
    const host = flags.get("host") || "localhost";
    const port = flags.get("port") || 8000;
    return [host, port];
}
function setUp(originalHost) {
    return __awaiter(this, void 0, void 0, function* () {
        const bindPort = yield (0, server_1.setUpServer)(originalHost);
        console.log(`bind to ${originalHost}`);
        const browser = yield Puppeteer.launch();
        const page = yield browser.newPage();
        yield page.goto(`http://localhost:${bindPort}/`);
    });
}
exports.setUp = setUp;
//# sourceMappingURL=main.js.map