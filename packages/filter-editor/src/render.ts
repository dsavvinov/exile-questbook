import type { StatementLine, SyntaxLine } from "../owned/syntax.ts";
import type { Block, FilterItem, LootFilter } from "../owned/model.ts";

/** Writes one line back exactly as it was read. */
export function renderLine(line: SyntaxLine): string {
  if (line.kind === "trivia") return line.raw + line.eol;
  return renderStatement(line);
}

export function renderStatement(s: StatementLine): string {
  let out = s.indent + s.keyword;
  if (s.operator) out += s.operator.ws + s.operator.text;
  for (const v of s.values) {
    out += v.ws + (v.openQuote ?? "") + v.text + (v.closeQuote ?? "");
  }
  return out + s.trailing + s.eol;
}

function renderBlock(block: Block): string {
  let out = renderStatement(block.header);
  for (const st of block.statements) out += renderLine(st.syntax);
  return out;
}

function renderItem(item: FilterItem): string {
  return item.kind === "block" ? renderBlock(item) : renderLine(item.syntax);
}

/** Writes a filter back out. */
export function render(filter: LootFilter): string {
  let out = "";
  for (const item of filter.items) out += renderItem(item);
  return out;
}
