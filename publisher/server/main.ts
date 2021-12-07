import * as Puppeteer from "puppeteer";
import { setUpServer } from "./server";

const flags = require("flags");

export function main() {
  const bindOptions = getFlags();
  setUp(`${bindOptions[0]}:${bindOptions[1]}`);
}

function getFlags(): [string, number] {
  flags.defineString("host");
  flags.defineInteger("port");
  const f = process.argv.slice(3);
  flags.parse(f);
  const host = flags.get("host") || "localhost";
  const port = flags.get("port") || 8000;

  return [host, port];
}

export async function setUp(originalHost: string) {
  const bindPort = await setUpServer(originalHost);
  console.log(`bind to ${originalHost}`);
  const browser = await Puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`http://localhost:${bindPort}/`);
}
