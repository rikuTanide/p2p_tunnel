import * as express from "express";
import * as expressWs from "express-ws";
import * as Puppeteer from "puppeteer";
import * as _ws from "ws";

function setUpListener() {
  const app = express();
  app.get("/", (req, res) => {
    res.write("hello");
    res.end();
  });
  app.listen(8000);
}

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
    process.exit(0);
  });
}

async function openCommunicatorPage() {
  const browser = await Puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:8001/");
}

// setUpListener();
setUpCommunicator();
