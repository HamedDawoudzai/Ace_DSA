/** Collapse blank lines so snippets render tight (single-spaced) in pre/code blocks. */
export function compactCodeBlock(source: string): string {
  return source
    .trim()
    .replace(/\r\n/g, "\n")
    .replace(/\n(?:[ \t]*\n)+/g, "\n");
}
