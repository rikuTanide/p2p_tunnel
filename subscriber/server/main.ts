import { setUpEntrance } from "./entrance";
import { Subject } from "rxjs";
import { RequestArray, ResponseArray } from "../share/types";
import { setUpCommunicator } from "./communicator";
const flags = require("flags");

function getFlags(): [string, number, string] {
  flags.defineString("host");
  flags.defineInteger("port");
  flags.defineString("id");
  flags.parse();
  const host = flags.get("host") || "localhost";
  const port = flags.get("port") || 8000;
  const id = flags.get("id");

  if (!id) throw "connection id is required.";

  return [host, port, id];
}

async function start(host: string, port: number, publisherPeerID: string) {
  const entranceToCommunicator = new Subject<RequestArray>();
  const communicatorToEntrance = new Subject<ResponseArray>();

  await setUpCommunicator(
    entranceToCommunicator,
    communicatorToEntrance,
    publisherPeerID
  );
  await setUpEntrance(
    entranceToCommunicator,
    communicatorToEntrance,
    host,
    port
  );
  console.log(`http://${host}:${port}/`);
}

const [host, port, connectionID] = getFlags();
start(host, port, connectionID);
