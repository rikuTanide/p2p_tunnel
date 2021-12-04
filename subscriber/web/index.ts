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
