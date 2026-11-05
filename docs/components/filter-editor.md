# FilterEditor

Provides a parsed representation of the filter, and the facilities for editing
it.

Parent: FilterInsight.

## What it does

Turns a loot filter into a representation that can be inspected and changed,
and offers the operations that change it.

Two layers:

- **The lossless layer** (`owned/syntax.ts`) holds every byte of the source —
  whitespace, comments, quoting style, line endings. Nothing is interpreted.
  A line is blank, a comment, a statement, or malformed. There is no category
  of insignificant line: this app edits files other people wrote, so the shape
  of the file and the author's comments matter as much as the rules do.
  The format is line-oriented — a condition cannot be split across lines — so
  the lexer is too.
- **The typed layer** (`owned/model.ts`) holds blocks and classified
  statements, each with a backref to the syntax line it came from.

The split exists because the app writes presets into a filter the player
already owns, which may be hundreds of thousands of hand-tuned lines. An edit
has to land on exactly the span it came from and leave the rest untouched.

## Source

`packages/filter-editor`.

- `owned/syntax.ts` — the lossless layer.
- `owned/model.ts` — the typed layer.
- `owned/keywords.ts` — the vocabulary, from the official documentation.
- `owned/index.ts` — the surface other components import.
- `src/` — the lexer and the block grouper.

## API

`owned/index.ts`. Start at `LootFilter.parse(source)` and `filter.render()`.

Nodes are classes, not interfaces. TypeScript is structural, so a component
could satisfy an interface declared here with an object literal and never
import anything from this package — the typecheck would pass and the
dependency graph would stay empty. A constructor makes the dependency real.

## Contracts

Attached to the declarations in `owned/`.

## Critical inputs and outputs

On `LootFilter.parse` in `owned/model.ts`. The inputs are the published filters
under `testdata/`, and the outputs are the properties each of them must have
when parsed.

## Encoding is the caller's problem

The round trip is over text. Bytes match only when the file is decoded and
re-encoded with the same encoding, and the game accepts ANSI as well as UTF-8.
Whatever ends up reading filters from disk has to decide which, and reading an
ANSI filter as UTF-8 corrupts it silently.

## Not built yet

Per-keyword value types. A condition currently knows that it is a condition and
which keyword it uses, but not what its values mean. `HasExplicitMod >= 2 "of
Haast" "of Tzteosh"` is the case that forces this: the `>= 2` is a count of how
many of the listed mods must be present, not a comparison against a string, and
no generic node can say that.
