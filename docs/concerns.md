# Concerns

A concern is a broad category of problem the implementation has to solve.
Contracts are grouped by concern. See
`docs/agents/comprehension-mechanisms.md` for the definition.

## Rate limiting

The stash API is rate limited. That bounds how often `PlayerStashesState` can be
refreshed, and therefore how quickly a smart preset can react to the player's
situation changing.

## Extensions

Things come into the app from outside. Presets are the obvious case, but a
preset drags along the custom state entries its predicate depends on, and more
kinds will follow — so the concern is extensions in general, not preset import
and export specifically.

A player predicate therefore cannot be an arbitrary function; it has to be
serialisable. An extension also has to declare the custom state entries it
needs, so the receiving player can be asked for them. That is what the `Custom`
namespace in `PlayerState` is extensible for.
