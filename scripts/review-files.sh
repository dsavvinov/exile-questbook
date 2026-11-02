#!/usr/bin/env bash
# Lists every file changed since a ref, grouped into owned and unowned.
#
# Owned is the material that requires review:
#   packages/*/owned/*   the reviewed half of a component
#   docs/components/*    the component docs
#   docs/concerns.md     the concerns
# Everything else is unowned.
#
# The split is computed here rather than judged by eye. A model deciding which
# group a file belongs in is unreliable, and this is the check that catches code
# written into src/ that belonged in owned/. If the rule is wrong, fix it here.
#
#   bash scripts/review-files.sh            # since the last reviewed push
#   bash scripts/review-files.sh HEAD~2     # since some other ref
set -euo pipefail

REF="${1:-origin/default}"

# Register untracked files with the index so new files appear in the diff.
git add --intent-to-add --all >/dev/null 2>&1 || true

is_owned() {
  case "$1" in
    packages/*/owned/*) return 0 ;;
    docs/components/*)  return 0 ;;
    docs/concerns.md)   return 0 ;;
    *)                  return 1 ;;
  esac
}

owned=()
unowned=()

while IFS=$'\t' read -r status path extra; do
  [ -n "${status:-}" ] || continue
  # A rename or copy carries the destination path in the third field.
  case "$status" in
    R*|C*) path="${extra:-$path}" ;;
  esac
  entry=$(printf '  %-3s %s' "$status" "$path")
  if is_owned "$path"; then owned+=("$entry"); else unowned+=("$entry"); fi
done < <(git diff "$REF" --name-status)

printf 'OWNED (%d)\n' "${#owned[@]}"
[ "${#owned[@]}" -gt 0 ] && printf '%s\n' "${owned[@]}" | sort -k2
printf '\nUNOWNED (%d)\n' "${#unowned[@]}"
[ "${#unowned[@]}" -gt 0 ] && printf '%s\n' "${unowned[@]}" | sort -k2
printf '\nTOTAL %d\n' $(( ${#owned[@]} + ${#unowned[@]} ))
