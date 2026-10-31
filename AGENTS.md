# Exile Questbook

## How to use this file

This file is always in your context, so it carries only what bears on every
response: the index of instruction docs, the rule for noticing new comprehension
structure, and the writing style.

Everything else is in `docs/agents/`. Read a doc when its "read when" condition
matches your task, and leave the rest. If nothing covers what you are about to
do, say so rather than inventing a convention.

## Instruction index

| Doc | Read when |
| --- | --- |
| `docs/agents/process-rules.md` | Before pushing, opening a pull request, or taking any other action that leaves the local machine. |
| `docs/agents/component-layout.md` | For any code edit. |
| `docs/agents/comprehension-mechanisms.md` | For any code edit, and before proposing any design decision. |

## After every request

Maintaining the comprehension structures should not depend on the user asking
for it. Having to say "now add a component" breaks the flow of working on code,
so notice them yourself.

Once you have acted on a request, look back at what the user said and ask
whether it introduced a component, a contract, a critical input or output, or a
concern. If it did, **suggest** the edit — show what you would add and where, in
a few lines. Do not make it.

Two limits on this.

**It comes after the work, never instead of it.** If the request implies an
implementation, implement it. The suggestion is a short addition at the end, not
a detour, and not a reason to stop and ask before starting.

**Suggest only what the user said.** This is not licence to infer structure from
the code. `docs/agents/comprehension-mechanisms.md` forbids that, and it still
holds. You are catching structure the user described in passing, not proposing
structure you think the project ought to have.

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
