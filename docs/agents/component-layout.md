# Component layout

This doc covers components that have source code. Not all do — see
`comprehension-mechanisms.md`, where the component doc in `docs/components/` is
the primary record and the code is what implements it.

A component with source is a package under `packages/`, in the npm workspace
defined by the root `package.json`. Its component doc points at it.

Contracts on a component with source live in doc comments on the owned element
they constrain, not in the component doc.

## The two halves

A component's code is split into two halves that depend on each other. Both are
ordinary TypeScript. Neither is a declaration file or a mirror of the other, and
nothing is written twice.

**`owned/` is the half the user reviews.** It is also the only half other
components may depend on.

**`src/` is everything else.** Internals. It can change without review,
precisely because nothing outside the package can reach it.

Ownership and visibility are the same line on purpose. If a symbol needs to be
used by another component, it has to move into `owned/` and get reviewed. If it
is free to churn, it stays in `src/` and nobody outside can couple to it.

## package.json

```json
{
  "name": "@questbook/<component>",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "types": "./owned/index.ts",
      "default": "./src/index.ts"
    }
  }
}
```

`types` must be listed **before** `default`. Export conditions are matched in
the order they appear, so reversing them makes `default` win for every consumer
and silently disables the split.

`src/index.ts` re-exports the owned half, so that importers get the real
implementation at runtime:

```ts
export * from "../owned/index.ts";
```

## What this buys

TypeScript resolves imports through the `types` condition and therefore sees
only `owned/`. A component reaching into another component's internals fails the
typecheck:

```
error TS2305: Module '@questbook/comp-a' has no exported member 'scratchHelper'
```

Bundlers resolve through `default` and get `src/`, so the shipped code is the
real thing.

Treat this check as a convenience, not as the thing that matters. The split is
the point; the typecheck just notices when it is crossed.

## What it does not do

It enforces that dependencies go through owned code. It does not enforce **which**
components may depend on which. A flat mesh where every component imports every
other one's owned half passes this check.

If the component tree is meant to constrain dependency direction, that needs a
separate rule and is not set up yet.
