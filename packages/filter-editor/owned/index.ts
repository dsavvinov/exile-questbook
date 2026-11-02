/**
 * FilterEditor: a parsed representation of a loot filter, and the facilities
 * for editing it.
 *
 * Two layers. `syntax.ts` is lossless and uninterpreted; `model.ts` is typed
 * and holds a backref into the syntax for every node. Parsing goes up; editing
 * and writing go back down.
 *
 * Start at `LootFilter.parse`.
 */

export {
  BlankLine,
  CommentLine,
  MalformedLine,
  OperatorToken,
  StatementLine,
  ValueToken,
} from "./syntax.ts";
export type { SyntaxLine } from "./syntax.ts";

export {
  Action,
  Blank,
  Block,
  Comment,
  Condition,
  ContinueStatement,
  LootFilter,
  Malformed,
  UnknownStatement,
} from "./model.ts";
export type { BlockStatement, FilterItem } from "./model.ts";

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
