var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Peer = require("skyway-js");
const peer = new Peer({ key: "b7248a9f-7245-4c45-9802-2bfcfbe964d4" });
peer.on("open", () => {
    console.log(peer.id);
    const url = new URL("/connection_id", document.location.origin);
    url.searchParams.set("id", peer.id);
    fetch(url.toString());
});
peer.on("connection", (connection) => {
    connection.on("data", (message) => __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch("/on_request", {
            method: "POST",
            body: message,
        });
        const blob = yield res.blob();
        connection.send(blob);
    }));
});
//# sourceMappingURL=index.js.map