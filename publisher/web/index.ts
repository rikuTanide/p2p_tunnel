const  Peer =  require("skyway-js");

// function createUrl() {
//     const wsUrl = new URL("/", window.location.href);
//     wsUrl.protocol = "ws";
//     wsUrl.host;
//     wsUrl.pathname = "/ws";
//     return wsUrl;
// }
//
// const ws = new WebSocket(createUrl());
// ws.addEventListener("open", () => {
//     ws.send(new Blob(["fuga"]));
// });

const peer = new Peer({key: "b7248a9f-7245-4c45-9802-2bfcfbe964d4"});
peer.on("open", () => {
    console.log(peer.id)
})
peer.on("connection", connection => {
    console.log("connect:", connection.id)
    connection.on("message", message=>{
        console.log(message);
    });
    connection.on("data", async message=>{
        console.log(message);
    });
});