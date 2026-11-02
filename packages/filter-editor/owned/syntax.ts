/**
 * The lossless layer.
 *
 * Every byte of the source file is recoverable from these nodes. That is the
 * point of the layer: the app writes presets into a filter the player already
 * owns, often a hand-tuned file of several hundred thousand lines, and must not
 * reformat the parts it did not touch.
 *
 * Nothing here is interpreted. `Sockets >= 5GGG` is a keyword, an operator and
 * one token; what `5GGG` means belongs to the layer above.
 *
 * There is no category of insignificant line. Comments and blank lines carry
 * no instruction to the game, but they carry the author's intent and the file's
 * shape, and this app edits files other people wrote. Each kind of line is
 * named for what it is.
 *
 * A statement is a line. The format is line-oriented, not token-oriented: the
 * community guide states that a block's conditions "must start on the next
 * line", and that a block is a collection of lines ending at the next line
 * containing Show or Hide. A condition split across several lines does not
 * parse, in the game or here.
 *
 * These are classes rather than interfaces so that building one is an import.
 * TypeScript is structural, so an object literal satisfies an interface without
 * ever referring to the module that declared it — which would let a component
 * depend on this one while the dependency graph stayed empty.
 */

/**
 * A value token exactly as it appeared.
 *
 * The opening and closing quotes are kept separately rather than as one
 * `quoted` flag, because a filter being hand-edited can hold an unterminated
 * quote, and a single flag cannot tell that from a closed pair. Writing such a
 * line back has to leave it unterminated rather than silently repairing it.
 */
export class ValueToken {
  constructor(
    /** Whitespace preceding the token, verbatim. */
    readonly ws: string,
    /** The quote that opened the token, or null if it was bare. */
    readonly openQuote: '"' | null,
    /** The quote that closed it, or null if the source left it open. */
    readonly closeQuote: '"' | null,
    /** The token text, without any surrounding quotes. */
    readonly text: string,
  ) {}

  render(): string {
    return this.ws + (this.openQuote ?? "") + this.text + (this.closeQuote ?? "");
  }
}

/** An operator exactly as it appeared. */
export class OperatorToken {
  constructor(
    /** Whitespace preceding the operator, verbatim. */
    readonly ws: string,
    readonly text: string,
  ) {}

  render(): string {
    return this.ws + this.text;
  }
}

/** A line holding nothing but whitespace. */
export class BlankLine {
  readonly kind: "blank" = "blank";
  constructor(
    /** The line's full text, without its terminator. */
    readonly raw: string,
    readonly eol: string,
  ) {}

  render(): string {
    return this.raw + this.eol;
  }
}

/** A line holding nothing but a comment. */
export class CommentLine {
  readonly kind: "comment" = "comment";
  constructor(readonly raw: string, readonly eol: string) {}

  render(): string {
    return this.raw + this.eol;
  }
}

/**
 * A line that is neither blank, a comment, nor a statement.
 *
 * It is kept verbatim so the file can still be written back, but it is a
 * distinct kind rather than a comment. A filter being hand-edited can hold a
 * line like this, and treating it as a comment would mean reasoning about the
 * player's filter as though the line were deliberately inert.
 */
export class MalformedLine {
  readonly kind: "malformed" = "malformed";
  constructor(readonly raw: string, readonly eol: string) {}

  render(): string {
    return this.raw + this.eol;
  }
}

/**
 * A line of the form `indent keyword [operator] value* trailing`.
 *
 * The operator is optional in the source and its absence is meaningful, so a
 * missing operator and an explicit `==` are different nodes.
 */
export class StatementLine {
  readonly kind: "statement" = "statement";
  constructor(
    readonly indent: string,
    readonly keyword: string,
    readonly operator: OperatorToken | null,
    readonly values: readonly ValueToken[],
    /** Everything after the last value: whitespace, and any trailing comment. */
    readonly trailing: string,
    readonly eol: string,
  ) {}

  render(): string {
    let out = this.indent + this.keyword;
    if (this.operator !== null) out += this.operator.render();
    for (const value of this.values) out += value.render();
    return out + this.trailing + this.eol;
  }
}

export type SyntaxLine =
  | BlankLine
  | CommentLine
  | MalformedLine
  | StatementLine;
