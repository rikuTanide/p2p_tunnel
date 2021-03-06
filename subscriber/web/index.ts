import { DataConnection } from "skyway-js";

const Peer = require("skyway-js");

const publisherPeerID = new URLSearchParams(document.location.search).get(
  "publisher_peer_id"
)!;

let con: DataConnection | undefined;

function createUrl() {
  const wsUrl = new URL("/", window.location.href);
  wsUrl.protocol = "ws";
  wsUrl.host;
  wsUrl.pathname = "/ws";
  return wsUrl;
}

const ws = new WebSocket(createUrl());
ws.addEventListener("message", (e) => {
  con!.send(e.data);
});

const peer = new Peer({ key: "b7248a9f-7245-4c45-9802-2bfcfbe964d4" });
peer.on("open", () => {
  con = peer.connect(publisherPeerID);
  con!.on("data", (data) => {
    ws.send(data);
  });
});
