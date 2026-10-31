# PlayerState

The model of the player's situation. Stores values addressed by namespace.

Parent: Application.

## What it does

Holds values in namespaces. The top-level namespaces are fixed by the app:

- **Stash** — what the player owns. Written by `StashScanner`.
- **Custom** — things the stash API cannot observe, such as whether the player
  has completed uber lab.
- **Config** — the player's settings, such as which filter is the managed one.

Only `Custom` is extensible. An imported extension can add entries to it, which
is how a shared preset brings along the custom state its predicate depends on.
`Stash` and `Config` are the app's own and are not extended.

## Source

Not implemented yet.

## API

Not specified yet.

## Contracts

Not specified yet.

## Critical inputs and outputs

Not specified yet.
