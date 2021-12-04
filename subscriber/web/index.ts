import  {DataConnection} from "skyway-js";
const Peer = require("skyway-js");

let con: DataConnection|undefined;

function createUrl() {
  const wsUrl = new URL("/", window.location.href);
  wsUrl.protocol = "ws";
  wsUrl.host;
  wsUrl.pathname = "/ws";
  return wsUrl;
}

const ws = new WebSocket(createUrl());
ws.addEventListener("open", () => {
  ws.send(new Blob(["fuga"]));
});
ws.addEventListener("message", e => {
  console.log(e.data)
   con!.send(e.data);
});

const peer = new Peer({key:"b7248a9f-7245-4c45-9802-2bfcfbe964d4" });
peer.on("open", () => {
  con = peer.connect("Fuoyyz62qwnRi5Bg");
});
