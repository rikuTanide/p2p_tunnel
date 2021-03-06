import * as expressWs from "express-ws";
import * as express from "express";
import { WebSocket } from "ws";
import * as Puppeteer from "puppeteer";
import { RequestArray, ResponseArray } from "../../share/types";
import { Observable, Subject } from "rxjs";
import { AddressInfo } from "net";
import path = require("path");

class WebSocketBinder {
  private set: Set<WebSocket> = new Set();

  public register(ws: WebSocket) {
    this.set.add(ws);
  }
  public async sendByWebSockets(blob: RequestArray) {
    for (const ws of this.set) ws.send(blob);
  }

  public unlink(ws: WebSocket) {
    this.set.delete(ws);
  }
}

export async function setUpCommunicator(
  income: Observable<RequestArray>,
  outgoing: Subject<ResponseArray>,
  publisherPeerID: string
) {
  const wsb = new WebSocketBinder();

  const app = expressWs(express()).app;
  app.use("/", express.static(path.join(__dirname, "../web/dist")));
  app.ws("/ws", (ws, req) => onWsOpen(ws, req, wsb, outgoing));
  const server = app.listen();
  const port = (server.address() as AddressInfo).port;

  await openCommunicatorPage(port, publisherPeerID);

  income.subscribe((blob) => {
    wsb.sendByWebSockets(blob);
  });
}

function onWsOpen(
  ws: WebSocket,
  req: express.Request,
  wsb: WebSocketBinder,
  outgoing: Subject<ResponseArray>
) {
  wsb.register(ws);
  ws.on("message", (msg: ArrayBuffer) => {
    outgoing.next(new Uint8Array(msg));
  });
  ws.on("close", () => wsb.unlink(ws));
}

async function openCommunicatorPage(port: number, publisherPeerID: string) {
  const browser = await Puppeteer.launch();
  const page = await browser.newPage();
  const url = new URL("http://localhost/");
  url.port = port.toString();

  url.searchParams.set("publisher_peer_id", publisherPeerID);
  await page.goto(url.toString());
}
