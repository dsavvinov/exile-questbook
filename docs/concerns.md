# Concerns

A concern is a broad category of problem the implementation has to solve.
Contracts are grouped by concern. See
`docs/agents/comprehension-mechanisms.md` for the definition.

## Rate limiting

The stash API is rate limited. That bounds how often `PlayerStashesState` can be
refreshed, and therefore how quickly a smart preset can react to the player's
situation changing.
