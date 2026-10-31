# Exile Questbook

A quest tracker for Path of Exile. Scope, stack and architecture are not settled
yet — nothing has been built beyond this harness.

## How to use this file

This file is always in your context, so it carries only two things: the index of
instruction docs, and writing style — the one rule that applies to every
response, so it cannot live behind a lookup.

Everything else is in `docs/agents/`. Read a doc when its "read when" condition
matches your task, and leave the rest. If nothing covers what you are about to
do, say so rather than inventing a convention.

## Instruction index

| Doc | Read when |
| --- | --- |
| `docs/agents/process-rules.md` | Before pushing, opening a pull request, or taking any other action that leaves the local machine. |
| `docs/agents/comprehension-mechanisms.md` | Before adding or changing a component, an API, a contract, a critical input or output, or a concern — and before proposing any design decision. These changes need explicit user review. |

---

## Writing style

Applies to everything you write: chat replies, commit messages, PR descriptions,
code comments, docs, issue reports.

### Simplified Technical English

Write in the spirit of Simplified Technical English (ASD-STE100): plain words,
short sentences, one idea per sentence, consistent names for the same thing,
active voice.

Borrow the plainness of the language, not a reduction of the content. What goes
away is decorative vocabulary, hedging, inflated register, and smart-sounding
phrasing that carries no information. The explanation stays as deep and as
precise as the subject needs. Never simplify *what you say* in order to sound
simple; simplify *how you say it*, and let the substance stand at full strength.

### Be concise by scope, never by compression

Most write-ups fail on density, not length.

Buy concision by moderating **what you present and what you omit**, never by
compressing what stays. Spanning many terms, concepts and class names and then
stripping the prose to make it short leaves something still impossible to read.

Instead: select the limited set of concepts genuinely needed to understand the
matter, and introduce them one by one, each before the sentence that depends on
it.

That set should be **four to six concepts**. Needing more is a strong signal
that something is off. Assume your case is not one of the rare exceptions: if
the reader misses some depth they can ask for it, but the extra noise is not
that easily fixable.

If a case genuinely cannot fit in six, split the concepts into cohesive chunks.
Explain one chunk in depth, summarise it so the reader can offload the detail
and carry only the summary forward, then move to the next. Keep the chunks in
linear sequence — an earlier chunk never needs knowledge from a later one.

### The three ways text fails

When something you wrote did not land, that is a defect in the text, not in the
reader. Do not defend the previous version and do not apologise at length.
Diagnose which of the three buckets below applies, then rewrite — do not patch.
Appending clarification to a text that already lost the reader makes it longer
and no clearer.

**1. Conceptual overload.** Too many semantically heavy words, and the reader
does not carry the meaning you assumed:

- *Terms the reader does not know.* Explain them, or use plainer wording.
- *Invented terms.* Prefer an existing well-known term. If none exists, define
  yours before using it.
- *Inconsistent terms.* The same thing under slightly different wordings reads
  as several different things. Pick one wording and keep it.
- *"How" before "why".* Say what the code is for, then how it does it.
- *Overquoting source code.* Every symbol you name is one more term the reader
  must hold. Quote only the code the explanation turns on.
- *Smart lingo.* "This buys us an opaque transformation of the data" instead of
  "Clients won't know how the data is transformed, so we can swap the
  implementation later." Say the second one.

**2. Jumpy narrative.** You referred to things explained only further down, or
never. Reorder so every concept is introduced before its first use, and fill the
gaps you skipped.

**3. Overcompressed text.** You threw away the lexical glue that makes prose
readable, instead of limiting what you describe. The hallmark is telegraphic
notation:

> network call + ui responsiveness -> async call

when what the reader needed was:

> To check for updates, we need to access the network. That call can be slow —
> the user may be on a spotty WiFi connection. If we made it a blocking call,
> the whole UI would appear frozen. So we do it in a background task.

### Before you send it

- Count the concepts you introduced. Over six, cut scope — not words.
- Check each one is introduced before its first use.
- Check the same thing is called the same name throughout.
- Read it as someone who knows the domain but not this code. Every sentence they
  could not answer "what is that?" for is a defect.
