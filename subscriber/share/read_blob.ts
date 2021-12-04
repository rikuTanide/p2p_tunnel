const fs = require("fs");

export function readBlob(ab: ArrayBuffer): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(ab, { encoding: "utf-8" }, (data) => {
      resolve(data);
    });
  });
}
