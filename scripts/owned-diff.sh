#!/usr/bin/env bash
# Show changes to owned code — the half that requires review.
#
# Defaults to diffing against origin/default, so it shows everything not yet
# reviewed and pushed. Pass a ref to compare against something else.
#
#   bash scripts/owned-diff.sh            # unreviewed owned changes
#   bash scripts/owned-diff.sh HEAD~1     # owned changes in the last commit
set -euo pipefail

REF="${1:-origin/default}"

# Register untracked files with the index so new owned files appear in the diff.
# --intent-to-add records the path only; it stages no content.
git add --intent-to-add --all -- '*/owned/*' >/dev/null 2>&1 || true

git diff "$REF" -- '*/owned/*'
