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
exports.main = void 0;
const entrance_1 = require("./entrance");
const rxjs_1 = require("rxjs");
const communicator_1 = require("./communicator");
const flags = require("flags");
function main() {
    const [host, port, connectionID] = getFlags();
    start(host, port, connectionID);
}
exports.main = main;
function getFlags() {
    flags.defineString("host");
    flags.defineInteger("port");
    flags.defineString("id");
    const f = process.argv.slice(3);
    flags.parse(f);
    const host = flags.get("host") || "localhost";
    const port = flags.get("port") || 8000;
    const id = flags.get("id");
    if (!id)
        throw "connection id is required.";
    return [host, port, id];
}
function start(host, port, publisherPeerID) {
    return __awaiter(this, void 0, void 0, function* () {
        const entranceToCommunicator = new rxjs_1.Subject();
        const communicatorToEntrance = new rxjs_1.Subject();
        yield (0, communicator_1.setUpCommunicator)(entranceToCommunicator, communicatorToEntrance, publisherPeerID);
        yield (0, entrance_1.setUpEntrance)(entranceToCommunicator, communicatorToEntrance, host, port);
        console.log(`http://${host}:${port}/`);
    });
}
//# sourceMappingURL=main.js.map