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

import { parseFilter } from "../src/parse.ts";
import type {
  BlankLine,
  CommentLine,
  MalformedLine,
  StatementLine,
  SyntaxLine,
} from "./syntax.ts";

/** A line holding nothing but whitespace. */
export class Blank {
  readonly kind: "blank" = "blank";
  constructor(readonly syntax: BlankLine) {}
  render(): string {
    return this.syntax.render();
  }
}

/** A line holding nothing but a comment. */
export class Comment {
  readonly kind: "comment" = "comment";
  constructor(readonly syntax: CommentLine) {}
  render(): string {
    return this.syntax.render();
  }
}

/**
 * A line that could not be read as a statement.
 *
 * Kept so the file writes back intact, and kept apart from comments so that
 * anything reasoning about the filter can tell a comment from a line the
 * player probably did not mean to write.
 */
export class Malformed {
  readonly kind: "malformed" = "malformed";
  constructor(readonly syntax: MalformedLine) {}
  render(): string {
    return this.syntax.render();
  }
}

/** A condition: it decides which items the enclosing block matches. */
export class Condition {
  readonly kind: "condition" = "condition";
  constructor(readonly keyword: string, readonly syntax: StatementLine) {}
  render(): string {
    return this.syntax.render();
  }
}

/** An action: it decides what the player sees for a matched item. */
export class Action {
  readonly kind: "action" = "action";
  constructor(readonly keyword: string, readonly syntax: StatementLine) {}
  render(): string {
    return this.syntax.render();
  }
}

/** `Continue`: matching does not stop at this block. */
export class ContinueStatement {
  readonly kind: "continue" = "continue";
  constructor(readonly syntax: StatementLine) {}
  render(): string {
    return this.syntax.render();
  }
}

/**
 * A statement whose keyword is not in the known vocabulary.
 *
 * This is not an error path. GGG adds keywords every league, so a filter using
 * one this build has never heard of is expected, and it has to survive being
 * read and written back.
 */
export class UnknownStatement {
  readonly kind: "unknown" = "unknown";
  constructor(readonly keyword: string, readonly syntax: StatementLine) {}
  render(): string {
    return this.syntax.render();
  }
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
export class Block {
  readonly kind: "block" = "block";
  constructor(
    readonly blockKeyword: string,
    readonly header: StatementLine,
    readonly statements: readonly BlockStatement[],
  ) {}

  render(): string {
    let out = this.header.render();
    for (const statement of this.statements) out += statement.render();
    return out;
  }
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
export class LootFilter {
  constructor(readonly items: readonly FilterItem[]) {}

  /**
   * Reads filter source.
   *
   * - Never throws, and never discards input. A filter editor that refuses to
   *   open next league's filter is useless, and new keywords arrive every
   *   league.
   * - A statement whose keyword is outside the known vocabulary becomes an
   *   `UnknownStatement`, not an error.
   * - A line that is neither blank, a comment, nor a statement becomes a
   *   `Malformed`. It is not filed as a comment: anything reasoning about the
   *   filter can tell the two apart.
   * - `Import` is not resolved. It becomes an `UnknownStatement` and is written
   *   back untouched, so a filter that imports others is read as the single
   *   file it is, not as the filter the game would assemble.
   */
  static parse(source: string): LootFilter {
    return parseFilter(source);
  }

  /**
   * Writes the filter back out as source.
   *
   * - A filter parsed and rendered without being edited produces output
   *   identical to the input, including whitespace, comments, quoting style,
   *   line endings, and the presence or absence of a final newline.
   * - That identity is over text, not bytes. Bytes match only when the caller
   *   decodes and re-encodes with the same encoding. The game accepts ANSI as
   *   well as UTF-8, so a filter written as ANSI and read as UTF-8 comes back
   *   changed. Choosing the encoding is the caller's job.
   */
  render(): string {
    let out = "";
    for (const item of this.items) out += item.render();
    return out;
  }
}

export type { SyntaxLine, StatementLine, BlankLine, CommentLine, MalformedLine };
