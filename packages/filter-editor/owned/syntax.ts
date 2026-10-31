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
 */

/**
 * A value token exactly as it appeared.
 *
 * The opening and closing quotes are recorded separately rather than as one
 * `quoted` flag, because a filter being hand-edited can hold an unterminated
 * quote, and a single flag cannot tell that from a closed pair. Writing such a
 * line back has to leave it unterminated rather than silently repairing it.
 */
export interface ValueToken {
  /** Whitespace preceding the token, verbatim. */
  readonly ws: string;
  /** The quote that opened the token, or null if it was bare. */
  readonly openQuote: '"' | null;
  /** The quote that closed it, or null if the source left it open. */
  readonly closeQuote: '"' | null;
  /** The token text, without any surrounding quotes. */
  readonly text: string;
}

/** Whether a token was written in quotes. */
export function isQuoted(value: ValueToken): boolean {
  return value.openQuote !== null;
}

/** An operator exactly as it appeared. */
export interface OperatorToken {
  /** Whitespace preceding the operator, verbatim. */
  readonly ws: string;
  readonly text: string;
}

/** A blank line, or a line holding only a comment. */
export interface TriviaLine {
  readonly kind: "trivia";
  /** The line's full text, without its terminator. */
  readonly raw: string;
  readonly eol: string;
}

/**
 * A line of the form `indent keyword [operator] value* trailing`.
 *
 * The operator is optional in the source and its absence is meaningful, so a
 * missing operator and an explicit `==` are different nodes.
 */
export interface StatementLine {
  readonly kind: "statement";
  readonly indent: string;
  readonly keyword: string;
  readonly operator: OperatorToken | null;
  readonly values: readonly ValueToken[];
  /** Everything after the last value: whitespace, and any trailing comment. */
  readonly trailing: string;
  readonly eol: string;
}

export type SyntaxLine = TriviaLine | StatementLine;
