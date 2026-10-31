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
