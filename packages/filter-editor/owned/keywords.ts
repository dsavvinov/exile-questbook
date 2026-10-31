/**
 * The loot filter vocabulary, taken from the official documentation at
 * https://www.pathofexile.com/item-filter/about
 *
 * This list goes stale by design. GGG adds keywords with league mechanics and
 * removes them again: `GemQualityType` is already marked deleted upstream, and
 * three entries here were new when this was extracted. A keyword missing from
 * these lists is not an error — it parses as an unknown statement and
 * round-trips unchanged. See the filter syntax evolution concern.
 */

/** Block keywords. A block header opens a new block. */
export const BLOCK_KEYWORDS = ["Show", "Hide", "Minimal"] as const;

/** Comparison operators, longest first so that `==` is preferred over `=`. */
export const OPERATORS = ["==", "!=", ">=", "<=", "=", "!", "<", ">"] as const;

/** Conditions select which items a block matches. */
export const CONDITION_KEYWORDS = [
  "AlternateQuality",
  "AlwaysShow",  // PoE2-only
  "AnyEnchantment",
  "ArchnemesisMod",
  "AreaLevel",
  "BaseArmour",
  "BaseDefencePercentile",
  "BaseEnergyShield",
  "BaseEvasion",
  "BaseType",
  "BaseWard",
  "BlightedMap",
  "Class",
  "Corrupted",
  "CorruptedMods",
  "DropLevel",
  "ElderItem",
  "ElderMap",
  "EnchantmentPassiveNode",
  "EnchantmentPassiveNum",
  "Exceptional",  // New
  "Foulborn",
  "FracturedItem",
  "GemLevel",
  "GemQualityType",  // Deleted
  "HasCruciblePassiveTree",
  "HasEaterOfWorldsImplicit",
  "HasEnchantment",
  "HasExplicitMod",
  "HasImplicitMod",
  "HasInfluence",
  "HasSearingExarchImplicit",
  "HasVaalUniqueMod",  // PoE2-only
  "Height",
  "Identified",
  "Imbued",
  "IsVaalUnique",  // PoE2-only
  "ItemLevel",
  "LinkedSockets",
  "MapTier",
  "MemoryStrands",
  "MirageMap",  // New
  "Mirrored",
  "Quality",
  "Rarity",
  "Replica",
  "Scourged",
  "ShapedMap",
  "ShaperItem",
  "SocketGroup",
  "Sockets",
  "StackSize",
  "SynthesisedItem",
  "TransfiguredGem",
  "TwiceCorrupted",  // PoE2-only
  "UberBlightedMap",
  "UnidentifiedItemTier",  // PoE2-only
  "Vestigial",  // New
  "WaystoneTier",  // PoE2-only
  "Width",
  "ZanaMemory",
] as const;

/** Actions decide what the player sees for a matched item. */
export const ACTION_KEYWORDS = [
  "CustomAlertSound",
  "CustomAlertSoundOptional",
  "DisableDropSound",
  "DisableDropSoundIfAlertSound",
  "EnableDropSound",
  "EnableDropSoundIfAlertSound",
  "MinimapIcon",
  "PlayAlertSound",
  "PlayAlertSoundPositional",
  "PlayEffect",
  "SetBackgroundColor",
  "SetBorderColor",
  "SetFontSize",
  "SetTextColor",
] as const;

export type BlockKeyword = (typeof BLOCK_KEYWORDS)[number];
export type Operator = (typeof OPERATORS)[number];
export type ConditionKeyword = (typeof CONDITION_KEYWORDS)[number];
export type ActionKeyword = (typeof ACTION_KEYWORDS)[number];
