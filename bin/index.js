#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sub = require("./subscriber/server/main");
const pub = require("./publisher/server/main");
const subCommand = process.argv[2];
if (subCommand === "sub") {
    sub.main();
}
else if (subCommand === "pub") {
    pub.main();
}
else {
    console.log("Please specify a subcommand.");
    console.log("for example:");
    console.log("p2p_tunnel pub -host=localhost --port=3000");
    console.log("p2p_tunnel pub -host=localhost --port=8000 --id=xxxx");
}
//# sourceMappingURL=index.js.map