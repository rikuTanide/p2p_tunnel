import * as express from "express";
import * as expressWs from "express-ws";
import * as Puppeteer from "puppeteer";
import * as _ws from "ws";
import { setUpListener } from "./entrance";

async function setUpCommunicator() {
  const app = expressWs(express()).app;
  app.use("/", express.static("./web/dist"));
  app.ws("/ws", (ws, req) => onWsOpen(ws, req));
  app.listen(8001);

  await openCommunicatorPage();
}

function onWsOpen(ws: _ws.WebSocket, req: express.Request) {
  ws.on("message", (msg) => {
    console.log(msg);
  });
}

async function openCommunicatorPage() {
  const browser = await Puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:8001/");
}

setUpListener();
// setUpCommunicator();
