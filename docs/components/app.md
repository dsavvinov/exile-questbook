# Application

The root component: the product as a whole.

Parent: none.

## What it does

Three parts:

- A loot filter editor driven by presets.
- A stash scanner that adjusts the applied presets to the player's situation.
- An overlay to track and manage the presets while playing.

The problem it solves: a Path of Exile loot filter cannot see the player's
situation, while the usefulness of a drop depends on it. An Offering to the
Goddess is worth picking up at league start and worth hiding later, and the
point in between moves depending on how many the player still needs.

## Source

None. The clients of this component are the people using the app, so its
surface is the product itself rather than an exported symbol.

## API

The clients of this component are players and preset authors, so its API is the
set of controls they have. Expressed schematically:

```ts
type FilterPreset    = { conditions: FilterCondition[] }
type SmartPreset     = { preset: FilterPreset; when: PlayerPredicate }
type PlayerState     = {
  stash:  Namespace   // what the player owns, written by StashScanner
  custom: Namespace   // what the API cannot observe; extensions add entries here
  config: Namespace   // the player's settings
}
type PlayerPredicate = (state: PlayerState) => boolean

// the managed filter — the loot filter this app edits.
// Null until the player picks one. They can switch it.
managedFilter(): LootFilter | null
setManagedFilter(filter: LootFilter): void

// presets — applied means the blocks are physically in the managed filter
apply(preset: FilterPreset): void
unapply(preset: FilterPreset): void
explain(preset: FilterPreset): Explanation

// smart presets — enabled means the predicate drives the applied state
enable(smart: SmartPreset): void

/**
 * Freezes the preset in whatever applied state the predicate last left it.
 * Disabling stops the automation; it does not unapply.
 */
disable(smart: SmartPreset): void

// player state
refreshStashes(): PlayerStashesState
declareCustomState(key, prompt): void
setCustomStateValue(key, value): void

// matching takes a filter and nothing else
matchItem(item: Item, filter: LootFilter): MatchResult
```

Player state builds the filter. Matching uses only the filter, and never player
state: the loot filter has to work inside the game, which has no idea whether
the player has completed uber lab. Once the filter is built, everything the
match needs is in it.

The two axes are independent, and conflating them is the easy mistake.

**Applied or unapplied** is physical, and belongs to every preset. Applied means
the preset's blocks are written into the filter file.

**Enabled or disabled** belongs only to smart presets, and is about automation.
Enabled means the predicate is evaluated against player state and the preset is
applied or unapplied accordingly. An enabled smart preset is not thereby
applied. The player does the enabling.

## Contracts

Attached to the declarations in the API above. None so far constrain the
component as a whole.

## Critical inputs and outputs

Not specified yet.
