# Exile Questbook

A quest tracker for Path of Exile. Scope, stack and architecture are not settled
yet — nothing has been built beyond this harness.

## How to use this file

This file is always in your context. It carries only two things:

1. **The instruction index** — so you always know *what* guidance exists,
   without having to hold all of it.
2. **Writing style** — the one rule that applies to every response, so it cannot
   live behind a lookup.

Everything else lives in `docs/agents/`. Each row of the index says when to read
that doc. Read a doc when its condition matches your current task, and do not
read the rest. If you are about to do something and no row covers it, that is
information too: say so rather than inventing a convention.

## Instruction index

| Doc | Read when |
| --- | --- |
| _(none yet)_ | — |

---

## Writing style

This applies to everything you write: chat replies, commit messages, PR
descriptions, code comments, docs, issue reports.

### Simple Technical English

Write in the spirit of Simplified Technical English (ASD-STE100), the controlled
English used for aerospace maintenance manuals: plain words, short sentences,
one idea per sentence, consistent names for the same thing, active voice.

Borrow from STE the **plainness of the language**, not a reduction of the
content. STE exists to remove ambiguity and mannerism, not to make the reader
dumber. The explanation stays as deep and as precise as the subject needs. What
goes away is the decorative vocabulary, the hedging, the inflated register, and
the smart-sounding phrasing that carries no information.

So: never simplify *what you say* in order to sound simple. Simplify *how you
say it*, and let the substance stand at full strength.

### Be concise by scope, never by compression

This is where most write-ups fail, and the failure is not length but density.

Be concise, but buy the concision by moderating **what you present and what you
omit**, never by compressing what stays. Spanning a lot of terms, concepts and
class names and then stripping the punctuation and prose to make it lexically
short leaves something still impossible to read.

Instead: select the limited set of terms, abstractions and concepts genuinely
needed to understand the matter, then introduce them one by one, sequentially,
explaining each one — before the sentence that depends on them.

That set should be **four to six concepts**. Needing more is a strong signal
that something is off. There are legitimate exceptions, but they appear only in
genuinely hard and big problems. In case of doubt, always assume the case you
are working on is not one of those: if the reader misses some depth, it is easy
for them to follow up and ask for more detail; the extra noise is not that
easily fixable.

If you are absolutely certain a case cannot be explained in six, the answer is
still to moderate the reader's context, by splitting the concepts into cohesive
chunks:

- explain one chunk in depth, then summarise it, so the reader can partially
  offload it and carry only the summary forward;
- move to the next chunk;
- keep the chunks in linear sequence — an earlier chunk never needs knowledge
  from a later one, and a later chunk builds on the earlier ones.

### The three ways text fails

When something you wrote did not land, it is almost always one of these. The fix
differs per bucket, so identify the bucket first.

**1. Conceptual overload.** You used too many semantically heavy words, and the
reader does not carry the meaning you assumed. Frequent forms:

- *Legitimate terms the reader does not know.* Explain them, or use a plainer
  wording.
- *Invented terms.* Prefer an existing well-known term. If none exists,
  introduce and define yours explicitly before using it.
- *Inconsistent terms.* The same thing referred to under slightly different
  wordings reads as several different things. Pick one wording and keep it.
- *"How" before "why".* You described implementation detail before saying what
  the code achieves at a general level. Say what it is for, then how it does it.
- *Overquoting source code.* Every symbol you name is one more term the reader
  must hold. Quote only the code the explanation genuinely turns on.
- *Smart lingo.* "This buys us an opaque transformation of the data" instead of
  "Clients won't know how the data is transformed, so we can swap the
  implementation later if we need to." Say the second one.

**2. Jumpy narrative.** You referred to things you never explained, or explained
only further down, in text the reader had not reached yet. Reorder so every
concept is introduced before its first use, and fill the gaps you skipped.

**3. Overcompressed text.** You bought conciseness by throwing away the lexical
glue that makes prose readable, instead of by limiting what you describe. The
hallmark is telegraphic notation:

> network call + ui responsiveness -> async call

when what the reader needed was:

> To check for updates, we need to access the network. That call can be slow —
> the user may be on a spotty WiFi connection. If we made it a blocking call,
> the whole UI would appear frozen. So we do it in a background task.

### Before you send it

- Count the concepts you introduced. Over six, cut scope — not words.
- Check that each one is introduced before its first use.
- Check that the same thing is called the same name throughout.
- Read it as someone who knows the domain but not this code. Every sentence they
  could not answer "what is that?" for is a defect.

### If the reader did not follow

That is a defect in the text, not in the reader. Do not defend the previous
version, do not re-send it with a preamble, and do not apologise at length.
Diagnose which of the three buckets applies, and write it again.

Rewrite; do not patch. Appending a paragraph of clarification to a text that
already lost the reader makes it longer and no clearer.
