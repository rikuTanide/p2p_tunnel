import * as Puppeteer from "puppeteer";
import * as express from "express";
import { blobToRequestObjects } from "../../subscriber/share/blob_to_request";
import { responseObjectToBlob } from "../../subscriber/share/response_to_blob";
import * as SharedTypes from "../../subscriber/share/types";
import {
  RequestObject,
  ResponseArray,
  ResponseObject,
} from "../../subscriber/share/types";
import fetch, { Headers, HeadersInit } from "node-fetch";
import { AddressInfo } from "net";
import { setUpServer } from "./server";

const fs = require("fs");
const flags = require("flags");

function getFlags(): [string, number] {
  flags.defineString("host");
  flags.defineInteger("port");
  flags.parse();
  const host = flags.get("host") || "localhost";
  const port = flags.get("port") || 8000;

  return [host, port];
}

export async function setUp(originalHost: string) {
  const bindPort = await setUpServer(originalHost);
  const browser = await Puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`http://localhost:${bindPort}/`);
}

const bindOptions = getFlags();
setUp(`${bindOptions[0]}:${bindOptions[1]}`);
