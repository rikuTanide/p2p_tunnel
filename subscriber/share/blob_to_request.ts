import { RequestObject } from "./types";

async function blobToRequestObjects(
  requestBlob: Blob
): Promise<RequestObject | undefined> {
  const splittersLength = (32 / 8) * 3;
  const splittersBlob = requestBlob.slice(0, splittersLength);
  const splitters = new Uint32Array(await splittersBlob.arrayBuffer());
  const headlineLength = splitters[0];
  const headersLength = splitters[1];
  const bodyLength = splitters[2];
  console.log("response");
  console.log(headlineLength);
  console.log(headersLength);
  console.log(bodyLength);
  if (
    headlineLength === undefined ||
    headersLength === undefined ||
    bodyLength === undefined
  ) {
    return;
  }
  const headline = await decodeHeadline(
    requestBlob.slice(splittersLength, splittersLength + headlineLength)
  );
  const headers = await decodeHeaders(
    requestBlob.slice(
      splittersLength + headlineLength,
      splittersLength + headlineLength + headersLength
    )
  );
  const body = await decodeBody(
    requestBlob.slice(splittersLength + headlineLength + headersLength)
  );
  console.log("end");
  return undefined;
}

async function decodeHeadline(blob: Blob) {
  console.log(await blob.arrayBuffer());
}

async function decodeHeaders(blob: Blob) {
  console.log(await blob.arrayBuffer());
}

async function decodeBody(blob: Blob) {
  console.log(await blob.arrayBuffer());
}
