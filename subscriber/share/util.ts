export function toText(ab: ArrayBuffer): string {
  const decoder = new TextDecoder();
  return decoder.decode(ab);
}

export function concat(items: Uint8Array[]) {
  let size = 0;
  for (const a of items) size += a.length;
  const res = new Uint8Array(size);
  let i = 0;
  for (const a of items) {
    res.set(a, i);
    i += a.length;
  }
  return res;
}
