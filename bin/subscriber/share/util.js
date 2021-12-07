"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toText = void 0;
function toText(ab) {
    const decoder = new TextDecoder();
    return decoder.decode(ab);
}
exports.toText = toText;
//# sourceMappingURL=util.js.map