import type {
  OperatorToken,
  StatementLine,
  SyntaxLine,
  TriviaLine,
  ValueToken,
} from "../owned/syntax.ts";
import { OPERATORS } from "../owned/keywords.ts";

interface RawLine {
  readonly body: string;
  readonly eol: string;
}

/**
 * Splits on newlines, keeping each line's own terminator.
 *
 * A file ending in a newline produces no trailing empty line, because the
 * terminator belongs to the last line that exists. Mixed CRLF and LF survive,
 * since the terminator is recorded per line rather than per file.
 */
function splitLines(text: string): RawLine[] {
  const out: RawLine[] = [];
  let i = 0;
  while (i < text.length) {
    const nl = text.indexOf("\n", i);
    if (nl === -1) {
      out.push({ body: text.slice(i), eol: "" });
      break;
    }
    let body = text.slice(i, nl);
    let eol = "\n";
    if (body.endsWith("\r")) {
      body = body.slice(0, -1);
      eol = "\r\n";
    }
    out.push({ body, eol });
    i = nl + 1;
  }
  return out;
}

const INDENT_AND_KEYWORD = /^([ \t]*)([A-Za-z][A-Za-z0-9]*)/;

function readOperator(body: string, at: number): { op: OperatorToken; next: number } | null {
  let i = at;
  while (i < body.length && (body[i] === " " || body[i] === "\t")) i++;
  for (const text of OPERATORS) {
    if (body.startsWith(text, i)) {
      return { op: { ws: body.slice(at, i), text }, next: i + text.length };
    }
  }
  return null;
}

function readValue(body: string, at: number): { value: ValueToken; next: number } | null {
  let i = at;
  while (i < body.length && (body[i] === " " || body[i] === "\t")) i++;
  if (i >= body.length || body[i] === "#") return null;
  const ws = body.slice(at, i);

  if (body[i] === '"') {
    const close = body.indexOf('"', i + 1);
    // An unterminated quote takes the rest of the line, so no input is dropped.
    if (close === -1) {
      const value: ValueToken = {
        ws,
        openQuote: '"',
        closeQuote: null,
        text: body.slice(i + 1),
      };
      return { value, next: body.length };
    }
    const value: ValueToken = {
      ws,
      openQuote: '"',
      closeQuote: '"',
      text: body.slice(i + 1, close),
    };
    return { value, next: close + 1 };
  }

  let j = i;
  while (j < body.length && body[j] !== " " && body[j] !== "\t") j++;
  const value: ValueToken = {
    ws,
    openQuote: null,
    closeQuote: null,
    text: body.slice(i, j),
  };
  return { value, next: j };
}

function lexLine(raw: RawLine): SyntaxLine {
  const { body, eol } = raw;
  const trivia = (): TriviaLine => ({ kind: "trivia", raw: body, eol });

  const head = INDENT_AND_KEYWORD.exec(body);
  if (!head) return trivia();

  const indent = head[1] ?? "";
  const keyword = head[2] ?? "";
  let at = indent.length + keyword.length;

  const op = readOperator(body, at);
  let operator: OperatorToken | null = null;
  if (op) {
    operator = op.op;
    at = op.next;
  }

  const values: ValueToken[] = [];
  for (;;) {
    const v = readValue(body, at);
    if (!v) break;
    values.push(v.value);
    at = v.next;
  }

  const statement: StatementLine = {
    kind: "statement",
    indent,
    keyword,
    operator,
    values,
    trailing: body.slice(at),
    eol,
  };
  return statement;
}

/** Lexes a filter into lines. Never throws: anything unrecognised is trivia. */
export function lex(text: string): SyntaxLine[] {
  return splitLines(text).map(lexLine);
}
