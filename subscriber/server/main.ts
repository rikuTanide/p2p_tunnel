import { setUpEntrance } from "./entrance";
import { Subject } from "rxjs";
import { RequestArray, ResponseArray } from "../share/types";
import { setUpCommunicator } from "./communicator";

async function start() {
  const entranceToCommunicator = new Subject<RequestArray>();
  const communicatorToEntrance = new Subject<ResponseArray>();

  await setUpCommunicator(entranceToCommunicator, communicatorToEntrance);
  await setUpEntrance(entranceToCommunicator, communicatorToEntrance);
}

start();
