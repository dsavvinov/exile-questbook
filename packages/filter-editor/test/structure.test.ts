import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "@questbook/filter-editor";
import type { BlockStatement, LootFilter } from "@questbook/filter-editor";

const TESTDATA = join(import.meta.dirname, "..", "testdata");
const filters = readdirSync(TESTDATA).filter((f) => f.endsWith(".filter"));

interface Counts {
  blocks: number;
  conditions: number;
  actions: number;
  continues: number;
  trivia: number;
  unknown: number;
  unknownKeywords: Set<string>;
}

function count(filter: LootFilter): Counts {
  const c: Counts = {
    blocks: 0, conditions: 0, actions: 0, continues: 0,
    trivia: 0, unknown: 0, unknownKeywords: new Set(),
  };
  const tally = (s: BlockStatement): void => {
    if (s.kind === "condition") c.conditions++;
    else if (s.kind === "action") c.actions++;
    else if (s.kind === "continue") c.continues++;
    else if (s.kind === "trivia") c.trivia++;
    else {
      c.unknown++;
      c.unknownKeywords.add(s.keyword);
    }
  };
  for (const item of filter.items) {
    if (item.kind === "block") {
      c.blocks++;
      for (const s of item.statements) tally(s);
    } else tally(item);
  }
  return c;
}

/**
 * A round trip passes vacuously if every line were treated as trivia and
 * echoed back, so these assert that parsing actually classified the file.
 */
describe.each(filters)("%s", (name) => {
  const source = readFileSync(join(TESTDATA, name), "utf8");
  const filter = parse(source);
  const c = count(filter);

  it("finds blocks", () => {
    expect(c.blocks).toBeGreaterThan(100);
  });

  it("classifies conditions", () => {
    expect(c.conditions).toBeGreaterThan(100);
  });

  it("accounts for every line exactly once", () => {
    // Counted independently of the parser's own splitter, so this is an
    // oracle rather than a restatement of the implementation.
    const lines = source === ""
      ? 0
      : source.split("\n").length - (source.endsWith("\n") ? 1 : 0);
    const statements = c.conditions + c.actions + c.continues + c.unknown;
    expect(c.blocks + statements + c.trivia).toBe(lines);
  });

  it("recognises every keyword the filter uses", () => {
    expect([...c.unknownKeywords]).toEqual([]);
  });
});

it("the corpus covers actions and Continue somewhere", () => {
  const totals = filters
    .map((n) => count(parse(readFileSync(join(TESTDATA, n), "utf8"))))
    .reduce((a, b) => ({ ...a, actions: a.actions + b.actions, continues: a.continues + b.continues }));
  expect(totals.actions).toBeGreaterThan(1000);
  expect(totals.continues).toBeGreaterThan(0);
});
