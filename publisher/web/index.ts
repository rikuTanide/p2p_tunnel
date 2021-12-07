const Peer = require("skyway-js");

const peer = new Peer({ key: "b7248a9f-7245-4c45-9802-2bfcfbe964d4" });
peer.on("open", () => {
  console.log(peer.id);
  const url = new URL("/publisher_id", document.location.origin);
  url.searchParams.set("id", peer.id);
  fetch(url.toString());
});
peer.on("connection", (connection) => {
  connection.on("data", async (message) => {
    const res = await fetch("/on_request", {
      method: "POST",
      body: message,
    });
    const blob = await res.blob();
    connection.send(blob);
  });
});
