import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parse, render } from "@questbook/filter-editor";

const TESTDATA = join(import.meta.dirname, "..", "testdata");
const filters = readdirSync(TESTDATA).filter((f) => f.endsWith(".filter"));

describe("round trip", () => {
  it("has filters to test against", () => {
    expect(filters.length).toBeGreaterThan(0);
  });

  for (const name of filters) {
    it(`re-emits ${name} byte for byte`, () => {
      const source = readFileSync(join(TESTDATA, name), "utf8");
      expect(render(parse(source))).toBe(source);
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
    "odd spacing": "Show   \n   Rarity   >=   Rare   \n",
  };

  for (const [label, source] of Object.entries(cases)) {
    it(label, () => {
      expect(render(parse(source))).toBe(source);
    });
  }
});
