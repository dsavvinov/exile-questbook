# Process rules

## Do not push before review

Nothing reaches the remote until the user has reviewed it.

The order is:

1. Make the change.
2. Commit it locally.
3. Surface it for review — show the diff in the session.
4. Wait for the user to approve it.
5. Push.

Committing is not publishing, so commit freely. A local commit is a safe point
you can go back to, and it keeps the work from being lost if the session's
container is reclaimed. Pushing is the step that needs approval, because it is
the step other people can see.

The same holds for anything else that leaves the machine: opening a pull
request, posting a comment on an issue or a pull request, or any other action
that publishes. Approval for one push is approval for that push, not for the
next one.

If the user asked for a change and said nothing about review, they still review
it. Silence is not approval.

## Presenting work for review

Review has two jobs. Do both, in this order, every time.

### 1. The file split

Run `bash scripts/review-files.sh`. It lists every changed file and puts it in
the owned or the unowned group. The grouping is computed from the repository
structure, not judged by you. If the rule is wrong, fix the script.

Present the whole list. **Omitting a file is not allowed**, however
uninteresting it looks. This is the only check that catches code written into
`src/` that belonged in `owned/`. The opposite mistake surfaces by itself,
because owned files are reviewed anyway, but a file left off this list is
invisible for good.

Give each file a one-sentence summary of what changed in it.

Then make an editorial pass over the summaries: where several say nearly the
same thing, present those files under one summary. Do this **after** writing
all of them, never while writing them. Grouping as you go bends what you say
about a file so that it fits a group. Grouping afterwards changes only how the
summaries are presented, and it changes no meaning.

### 2. The owned diffs

Run `bash scripts/review-diff.sh`. Present every diff it returns, in full. This
is the material the user actually reviews, so it is not summarised.

### Render it yourself

Everything the user needs to see goes in your reply, as text. Tool output is
not a substitute for it.
