import type { StatementLine, SyntaxLine } from "../owned/syntax.ts";
import {
  Action,
  Blank,
  Block,
  Comment,
  Condition,
  ContinueStatement,
  LootFilter,
  Malformed,
  UnknownStatement,
} from "../owned/model.ts";
import type { BlockStatement, FilterItem } from "../owned/model.ts";
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
  if (k === "Continue") return new ContinueStatement(line);
  if (CONDITIONS.has(k)) return new Condition(k, line);
  if (ACTIONS.has(k)) return new Action(k, line);
  return new UnknownStatement(k, line);
}

/**
 * Groups lines into blocks.
 *
 * A blank or comment line inside a block stays in that block. Comments in a
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
    items.push(new Block(open.header.keyword, open.header, open.statements));
    open = null;
  };

  const place = (node: BlockStatement & FilterItem): void => {
    if (open) open.statements.push(node);
    else items.push(node);
  };

  for (const line of lines) {
    switch (line.kind) {
      case "statement":
        if (BLOCKS.has(line.keyword)) {
          close();
          open = { header: line, statements: [] };
        } else {
          const node = classify(line);
          if (open) open.statements.push(node);
          else items.push(new UnknownStatement(line.keyword, line));
        }
        break;
      case "blank":
        place(new Blank(line));
        break;
      case "comment":
        place(new Comment(line));
        break;
      case "malformed":
        place(new Malformed(line));
        break;
      default: {
        const unreachable: never = line;
        throw new Error(`unhandled line kind: ${String(unreachable)}`);
      }
    }
  }
  close();

  return new LootFilter(items);
}

/** Reads filter source. Reached through `LootFilter.parse`. */
export function parseFilter(source: string): LootFilter {
  return parseLines(lex(source));
}
