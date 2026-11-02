/**
 * The typed layer.
 *
 * Every node carries a backref to the syntax line it came from, so an edit
 * made here lands on exactly the span it was read from and nothing else in the
 * file moves.
 *
 * Statements are classified, not yet interpreted: a `Condition` knows it is a
 * condition and which keyword it uses. Per-keyword value types — the ones that
 * make `HasExplicitMod >= 2 "of Haast"` express *at least two of these mods*
 * rather than a comparison against a string — are not built yet.
 */

import type {
  BlankLine,
  CommentLine,
  MalformedLine,
  StatementLine,
  SyntaxLine,
} from "./syntax.ts";

/** A line holding nothing but whitespace. */
export interface Blank {
  readonly kind: "blank";
  readonly syntax: BlankLine;
}

/** A line holding nothing but a comment. */
export interface Comment {
  readonly kind: "comment";
  readonly syntax: CommentLine;
}

/**
 * A line that could not be read as a statement.
 *
 * Kept so the file writes back intact, and kept apart from comments so that
 * anything reasoning about the filter can tell a comment from a line the
 * player probably did not mean to write.
 */
export interface Malformed {
  readonly kind: "malformed";
  readonly syntax: MalformedLine;
}

/** A condition: it decides which items the enclosing block matches. */
export interface Condition {
  readonly kind: "condition";
  readonly keyword: string;
  readonly syntax: StatementLine;
}

/** An action: it decides what the player sees for a matched item. */
export interface Action {
  readonly kind: "action";
  readonly keyword: string;
  readonly syntax: StatementLine;
}

/** `Continue`: matching does not stop at this block. */
export interface ContinueStatement {
  readonly kind: "continue";
  readonly syntax: StatementLine;
}

/**
 * A statement whose keyword is not in the known vocabulary.
 *
 * This is not an error path. GGG adds keywords every league, so a filter using
 * one this build has never heard of is expected, and it has to survive being
 * read and written back.
 */
export interface UnknownStatement {
  readonly kind: "unknown";
  readonly keyword: string;
  readonly syntax: StatementLine;
}

export type BlockStatement =
  | Condition
  | Action
  | ContinueStatement
  | UnknownStatement
  | Blank
  | Comment
  | Malformed;

/** A `Show`, `Hide` or `Minimal` block, with everything it contains. */
export interface Block {
  readonly kind: "block";
  readonly blockKeyword: string;
  readonly header: StatementLine;
  readonly statements: readonly BlockStatement[];
}

/**
 * An item at the top level of the file: a block, a line outside any block, or
 * a statement that appears outside any block.
 */
export type FilterItem =
  | Block
  | Blank
  | Comment
  | Malformed
  | UnknownStatement;

/** A parsed loot filter. */
export interface LootFilter {
  readonly items: readonly FilterItem[];
}

export type { SyntaxLine, StatementLine, BlankLine, CommentLine, MalformedLine };
