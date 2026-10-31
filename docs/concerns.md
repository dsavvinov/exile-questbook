# Concerns

A concern is a broad category of problem the implementation has to solve.
Contracts are grouped by concern. See
`docs/agents/comprehension-mechanisms.md` for the definition.

## Rate limiting

The stash API is rate limited. That bounds how often `PlayerStashesState` can be
refreshed, and therefore how quickly a smart preset can react to the player's
situation changing.

## Preset import and export

Presets travel between players. A preset authored by one person has to be usable
by another, which constrains what a preset may contain.

A player predicate therefore cannot be an arbitrary function; it has to be
serialisable. A preset also has to declare the custom states its predicate
depends on, so that the receiving player can be asked for them.
