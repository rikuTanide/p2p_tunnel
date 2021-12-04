export
function toText(ab: ArrayBuffer): string {
    const decoder = new TextDecoder();
    return decoder.decode(ab);
}
