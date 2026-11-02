import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { LootFilter } from "@questbook/filter-editor";

const TESTDATA = join(import.meta.dirname, "..", "testdata");
const filters = readdirSync(TESTDATA).filter((f) => f.endsWith(".filter"));

describe("round trip", () => {
  it("has filters to test against", () => {
    expect(filters.length).toBeGreaterThan(0);
  });

  for (const name of filters) {
    it(`re-emits ${name} byte for byte`, () => {
      const source = readFileSync(join(TESTDATA, name), "utf8");
      expect(LootFilter.parse(source).render()).toBe(source);
    });
  }
});

describe("round trip on awkward input", () => {
  const cases: Record<string, string> = {
    empty: "",
    "no trailing newline": "Show\n    SetFontSize 45",
    "CRLF": "Show\r\n    Rarity Rare\r\n",
    "mixed line endings": "Show\r\n    Rarity Rare\nHide\r\n",
    "blank lines and indentation": "\n\n   \nShow\n\t\tSetFontSize 45\n\n",
    "trailing comment": "    SetFontSize 45   # why 45\n",
    "no operator": "Quality 0\n",
    "explicit ==": "Quality == 0\n",
    "fused value": "Sockets >= 5GGG\n",
    "quoted list": 'BaseType == "Apex Cleaver" "Arcane Vestment"\n',
    "count then names": 'HasExplicitMod >= 2 "of Haast" "of Tzteosh"\n',
    "unknown keyword": "NextLeagueMechanic True\n",
    "unterminated quote": 'BaseType "Apex Cleaver\n',
    "comment only": "# just a comment\n",
    "indented comment": "    # indented comment\n",
    "malformed line": "123 this is not a statement\n",
    "malformed inside a block": "Show\n    !!! junk\n    Rarity Rare\n",
    "odd spacing": "Show   \n   Rarity   >=   Rare   \n",
  };

  for (const [label, source] of Object.entries(cases)) {
    it(label, () => {
      expect(LootFilter.parse(source).render()).toBe(source);
    });
  }
});

/**
 * The game accepts ANSI as well as UTF-8, and the byte-level round trip holds
 * only when the caller decodes with the encoding the file was written in.
 */
describe("encoding", () => {
  // "Café Bruël" in Windows-1252: é is 0xE9, ë is 0xEB.
  const cp1252 = Buffer.from([
    ...Buffer.from('Show\n    BaseType "Caf', "ascii"), 0xe9,
    ...Buffer.from(" Bru", "ascii"), 0xeb,
    ...Buffer.from('"\n', "ascii"),
  ]);

  it("round trips byte for byte when decoded as latin1", () => {
    const text = cp1252.toString("latin1");
    expect(Buffer.from(LootFilter.parse(text).render(), "latin1")).toEqual(cp1252);
  });

  it("does not round trip byte for byte when decoded as utf8", () => {
    const text = cp1252.toString("utf8");
    expect(Buffer.from(LootFilter.parse(text).render(), "utf8")).not.toEqual(cp1252);
  });

  it("still round trips as text whatever the decoding", () => {
    for (const enc of ["latin1", "utf8"] as const) {
      const text = cp1252.toString(enc);
      expect(LootFilter.parse(text).render()).toBe(text);
    }
  });
});
