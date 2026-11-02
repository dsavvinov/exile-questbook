# Diary

Thoughts on the harness and the setup around it. Nothing here is about the app.

This file sits outside `docs/` on purpose: everything under `docs/` is owned and
reviewed, and this is neither.

## 2026-11-02 — reviewed diffs should stay reviewed

We need a mechanism that marks some diffs as reviewed and does not re-surface
them on later edits.

The case: a big change comes in, you read through it, and you do not like one
part of it. You ask the agent to fix that part. After the fix, you want to
review only the lines that changed since you looked — not the whole change
again.
