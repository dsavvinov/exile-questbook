#!/usr/bin/env bash
# Show changes to reviewed material: owned code and the comprehension structures.
#
# Defaults to diffing against origin/default, the last reviewed and pushed
# state, so it shows everything still awaiting review.
#
#   bash scripts/review-diff.sh            # unreviewed changes
#   bash scripts/review-diff.sh HEAD~1     # reviewed material in the last commit
set -euo pipefail

REF="${1:-origin/default}"
PATHS=('*/owned/*' 'docs/components' 'docs/concerns.md')

# Register untracked files with the index so new files appear in the diff.
# --intent-to-add records the path only; it stages no content.
git add --intent-to-add --all -- "${PATHS[@]}" >/dev/null 2>&1 || true

git diff "$REF" -- "${PATHS[@]}"
