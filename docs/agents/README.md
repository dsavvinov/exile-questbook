# Agent instruction docs

Each file here holds one coherent set of instructions for one kind of task.
`AGENTS.md` indexes them; nothing else points at them, so a doc that is not in
the index does not exist as far as an agent is concerned.

The split exists for progressive disclosure. `AGENTS.md` is always loaded, so an
agent always knows *what* guidance exists. The content is loaded only when the
task matches, so the agent is not carrying instructions it has no use for.

Rules for adding a doc:

- **One topic per file.** If a doc needs an "and" in its title, it is two docs.
- **Give it a precise "read when".** The index row is the only thing an agent
  sees by default, so it has to be enough to decide. "Read when working on the
  UI" is too vague to act on; "Read before adding or changing a React component"
  is actionable.
- **Keep it self-contained.** Assume the agent read `AGENTS.md` and this doc, and
  nothing else. If two docs need the same background, say it in both or promote
  it to `AGENTS.md`.
- **Add the index row in the same commit.** A doc without an index row is dead
  weight.

Inline exceptions in `AGENTS.md` are for guidance that applies unconditionally,
to every task. The bar is high, and two things currently clear it:

- **Writing style**, because it governs every piece of text an agent produces,
  so making it conditional would mean writing badly by default.
- **Noticing new comprehension structure**, because it fires once per request
  regardless of what the request is about. A trigger condition for it would have
  to read "always", which is not a trigger.
