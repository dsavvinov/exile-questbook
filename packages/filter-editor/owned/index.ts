/**
 * FilterEditor: a parsed representation of a loot filter, and the facilities
 * for editing it.
 *
 * Two layers. `syntax.ts` is lossless and uninterpreted; `model.ts` is typed
 * and holds a backref into the syntax for every node. Parsing goes up; editing
 * and writing go back down.
 */

import type { LootFilter } from "./model.ts";
import { lex } from "../src/lex.ts";
import { parseLines } from "../src/parse.ts";
import { render as renderFilter } from "../src/render.ts";

export type {
  BlankLine,
  CommentLine,
  MalformedLine,
  OperatorToken,
  StatementLine,
  SyntaxLine,
  ValueToken,
} from "./syntax.ts";

export type {
  Action,
  Block,
  BlockStatement,
  Condition,
  ContinueStatement,
  Blank,
  Comment,
  FilterItem,
  LootFilter,
  Malformed,
  UnknownStatement,
} from "./model.ts";

export {
  ACTION_KEYWORDS,
  BLOCK_KEYWORDS,
  CONDITION_KEYWORDS,
  OPERATORS,
} from "./keywords.ts";
export type {
  ActionKeyword,
  BlockKeyword,
  ConditionKeyword,
  Operator,
} from "./keywords.ts";

/**
 * Parses filter source into the typed model.
 *
 * - Never throws, and never discards input. A filter editor that refuses to
 *   open next league's filter is useless, and new keywords arrive every league.
 * - A statement whose keyword is outside the known vocabulary is kept as an
 *   unknown statement, not an error.
 * - A line that is neither blank, a comment, nor a statement is kept as a
 *   malformed line. It is not filed as a comment: anything reasoning about the
 *   filter can tell the two apart.
 * - `Import` is not resolved. It parses as an unknown statement and is written
 *   back untouched, so a filter that imports others is read as the single file
 *   it is, not as the filter the game would assemble.
 */
export function parse(text: string): LootFilter {
  return parseLines(lex(text));
}

/**
 * Writes a filter back out as source.
 *
 * - A filter parsed and rendered without being edited produces output byte for
 *   byte identical to the input, including whitespace, comments, quoting style,
 *   line endings, and the presence or absence of a final newline.
 */
export function render(filter: LootFilter): string {
  return renderFilter(filter);
}
