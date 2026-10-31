import type { SyntaxLine, StatementLine } from "../owned/syntax.ts";
import type {
  Block,
  BlockStatement,
  FilterItem,
  LootFilter,
} from "../owned/model.ts";
import {
  ACTION_KEYWORDS,
  BLOCK_KEYWORDS,
  CONDITION_KEYWORDS,
} from "../owned/keywords.ts";
import { lex } from "./lex.ts";

const BLOCKS: ReadonlySet<string> = new Set(BLOCK_KEYWORDS);
const CONDITIONS: ReadonlySet<string> = new Set(CONDITION_KEYWORDS);
const ACTIONS: ReadonlySet<string> = new Set(ACTION_KEYWORDS);

function classify(line: StatementLine): BlockStatement {
  const k = line.keyword;
  if (k === "Continue") return { kind: "continue", syntax: line };
  if (CONDITIONS.has(k)) return { kind: "condition", keyword: k, syntax: line };
  if (ACTIONS.has(k)) return { kind: "action", keyword: k, syntax: line };
  return { kind: "unknown", keyword: k, syntax: line };
}

/**
 * Groups lines into blocks.
 *
 * Trivia reaching this point inside a block stays in that block. Comments in a
 * filter usually introduce the block below them, so attaching a run of trailing
 * comments to the block above is the wrong half of the time. It does not affect
 * writing the file back, but it will matter once presets are inserted between
 * blocks, which is where this should be revisited.
 */
export function parseLines(lines: readonly SyntaxLine[]): LootFilter {
  const items: FilterItem[] = [];
  let open: { header: StatementLine; statements: BlockStatement[] } | null = null;

  const close = (): void => {
    if (!open) return;
    const block: Block = {
      kind: "block",
      blockKeyword: open.header.keyword,
      header: open.header,
      statements: open.statements,
    };
    items.push(block);
    open = null;
  };

  for (const line of lines) {
    if (line.kind === "statement" && BLOCKS.has(line.keyword)) {
      close();
      open = { header: line, statements: [] };
      continue;
    }
    if (line.kind === "trivia") {
      if (open) open.statements.push({ kind: "trivia", syntax: line });
      else items.push({ kind: "trivia", syntax: line });
      continue;
    }
    const classified = classify(line);
    if (open) open.statements.push(classified);
    else items.push({ kind: "unknown", keyword: line.keyword, syntax: line });
  }
  close();

  return { items };
}

/** Parses filter source into the typed model. Never throws. */
export function parse(text: string): LootFilter {
  return parseLines(lex(text));
}
