import * as expressWs from "express-ws";
import * as express from "express";
import { WebSocket } from "ws";
import * as Puppeteer from "puppeteer";
import {
  RequestArrayBuffer,
  Requester,
  ResponseArrayBuffer,
} from "../share/types";
import { Observable, Subject, Subscribable } from "rxjs";

class WebSocketBinder {
  private set: Set<WebSocket> = new Set();

  public register(ws: WebSocket) {
    this.set.add(ws);
  }
  public async sendByWebSockets(blob: RequestArrayBuffer) {
    for (const ws of this.set) ws.send(blob);
  }

  public unlink(ws: WebSocket) {
    this.set.delete(ws);
  }
}

export async function setUpCommunicator(
  income: Observable<RequestArrayBuffer>,
  outgoing: Subject<ResponseArrayBuffer>
) {
  const wsb = new WebSocketBinder();

  const app = expressWs(express()).app;
  app.use("/", express.static("./web/dist"));
  app.ws("/ws", (ws, req) => onWsOpen(ws, req, wsb, outgoing));
  app.listen(8001);

  await openCommunicatorPage();

  income.subscribe((blob) => {
    wsb.sendByWebSockets(blob);
  });
}

function onWsOpen(
  ws: WebSocket,
  req: express.Request,
  wsb: WebSocketBinder,
  outgoing: Subject<ResponseArrayBuffer>
) {
  wsb.register(ws);
  ws.on("message", (msg: ArrayBuffer) => {
    console.log("typeof message", typeof msg);
    outgoing.next(msg);
  });
  ws.on("close", () => wsb.unlink(ws));
}

async function openCommunicatorPage() {
  const browser = await Puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:8001/");
}
