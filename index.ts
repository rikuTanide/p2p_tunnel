#!/usr/bin/env node
import * as sub from "./subscriber/server/main";
import * as pub from "./publisher/server/main";

const subCommand = process.argv[2] as "pub" | "sub" | undefined;

if (subCommand === "sub") {
  sub.main();
} else if (subCommand === "pub") {
  pub.main();
} else {
  console.log("Please specify a subcommand.");
  console.log("for example:");
  console.log("p2p_tunnel pub -host=localhost --port=3000");
  console.log("p2p_tunnel pub -host=localhost --port=8000 --id=xxxx");
}
