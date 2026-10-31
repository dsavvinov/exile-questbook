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
- `owned/index.ts` — `parse` and `render`.
- `src/` — lexer, parser and renderer implementations.

## API

`owned/index.ts`.

## Contracts

Attached to the declarations in `owned/`.

## Critical inputs and outputs

Not specified yet.

## Not built yet

Per-keyword value types. A condition currently knows that it is a condition and
which keyword it uses, but not what its values mean. `HasExplicitMod >= 2 "of
Haast" "of Tzteosh"` is the case that forces this: the `>= 2` is a count of how
many of the listed mods must be present, not a comparison against a string, and
no generic node can say that.
