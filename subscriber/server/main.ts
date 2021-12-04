import { setUpEntrance } from "./entrance";
import { Subject } from "rxjs";
import { RequestArrayBuffer, ResponseArrayBuffer } from "../share/types";
import { setUpCommunicator } from "./communicator";

async function start() {
  const entranceToCommunicator = new Subject<RequestArrayBuffer>();
  const communicatorToEntrance = new Subject<ResponseArrayBuffer>();

  await setUpCommunicator(entranceToCommunicator, communicatorToEntrance);
  await setUpEntrance(entranceToCommunicator, communicatorToEntrance);
}

start();
