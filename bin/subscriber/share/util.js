"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.concat = exports.toText = void 0;
function toText(ab) {
    const decoder = new TextDecoder();
    return decoder.decode(ab);
}
exports.toText = toText;
function concat(items) {
    let size = 0;
    for (const a of items)
        size += a.length;
    const res = new Uint8Array(size);
    let i = 0;
    for (const a of items) {
        res.set(a, i);
        i += a.length;
    }
    return res;
}
exports.concat = concat;
//# sourceMappingURL=util.js.map