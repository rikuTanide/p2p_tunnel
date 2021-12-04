const  Peer =  require("skyway-js");

const peer = new Peer({key: "b7248a9f-7245-4c45-9802-2bfcfbe964d4"});
peer.on("open", () => {
    console.log(peer.id)
    const url = new URL("/connection_id", document.location.origin)
    url.searchParams.set("id", peer.id);
    fetch(url.toString());
})
peer.on("connection", connection => {
    console.log("connect:", connection.id)
    connection.on("message", message=>{
        console.log(message);
    });
    connection.on("data", async message=>{
        console.log(message);
        const res = await fetch("/on_request",{
            "method": "POST",
            body: message,
        } )
        const blob = await res.blob();
        connection.send(blob);
    });
});