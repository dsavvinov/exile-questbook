# Comprehension mechanisms

## What this is for

The user does not review every line of this project. A specific part is
designated for review and must receive it. This doc defines that part.

The designated part is not a set of files. It is four structures that describe
what the project is and how its pieces behave for the people and code that use
them. Together they are the **comprehension structures**. Their purpose is to
let the user understand and check the system without reading the implementation.

Keeping them accurate is a hard requirement, not a documentation nicety.

## Surface every change as a diff

When your work changes any comprehension structure, show that change **as a
diff** in the session. This covers all four structures, and it covers additions,
edits and deletions alike.

A change the user did not see as a diff has not been reviewed, whatever else was
said about it in the session.

## Never fill gaps yourself

This information comes from the user. It will often be incomplete: a component
with no contracts, an API with no critical inputs recorded, a concern nobody has
named yet.

**That is a valid state.** Leave the gap, and say it is there.

Do not infer a contract from the code. Do not invent a concern because a
component looks like it ought to have one. Do not guess a critical value. A
missing piece of structure is explicitly preferred to a plausible-looking piece
the user never said — the gap is visible, and a wrong entry is not.

## How the four fit together

A **component** is an area of code. Components form a tree. Each component has
an API, and that API carries **contracts** and **critical inputs and outputs**.
Contracts are grouped by **concern**.

### 1. Components tree

The project is split into components: disjoint areas of code, each with a clear
responsibility. Disjoint means no piece of code belongs to two components.

Each component states what it does, and carries the structures below.

Components form a natural hierarchy. The root component is the application
itself.

### 2. Concerns

A concern is a broad category of problem that the implementation has to solve.

Some are generic: logging, concurrency, UI. Others are specific to this
application: user configuration, filter compatibility.

Concerns are also the grouping axis for contracts, which is what the next
section uses them for.

### 3. Contracts

Every component has an API for its clients. A client is not only another
component — the users of the application are clients too. That is why the root
component has an API as well.

An API expresses more than its principal signature. It carries contracts: the
properties its clients need to be able to rely on.

Write a contract as a **short, atomic statement** — one property per statement.
Group the statements by concern.

### 4. Critical inputs and outputs

An API signature accepts broad types. It takes an integer and returns a string,
which says nothing about which integers matter.

A critical input or output fixes a specific, important value: given the integer
42, the result is the string "The answer to everything".

Each one needs two parts:

- **The value itself**, recorded in a structured form so it can be checked.
- **An explanation in prose** of how and why that input or output arises.

The explanation carries the meaning. A fixed value with no account of where it
comes from is not reviewable.

## Where these live

| Structure | Location |
| --- | --- |
| Components | One Markdown file per component in `docs/components/` |
| Contracts | Doc comments on the owned element they constrain |
| Critical inputs and outputs | Beside the contracts, under the same rule |
| Concerns | `docs/concerns.md` |

### Components are written, not derived from code

The component doc comes first, and the code follows it where there is code at
all.

This is deliberate. A component can be drafted before it is built, and drafted
incompletely — three contracts recorded and the fourth left unknown. That is the
normal state, and the whole mechanism depends on it being allowed. Source code
cannot be left incomplete in the same way; it compiles or it does not.

Some components have no source counterpart at all. The application itself is
one: its clients are the people using it, so its surface is the product rather
than an exported symbol.

So a component doc either:

- **points at the source files that implement it**, in which case its contracts
  and critical inputs and outputs live in doc comments on the owned elements; or
- **has no source**, in which case it expresses its API schematically in code
  snippets, and states its contracts and critical inputs and outputs in prose.

Both are first-class. A component without code is not a placeholder for one
with code.

### Contracts attach to the element they constrain

A contract belongs in a doc comment on the specific method or entity it
constrains, wherever there is one to attach it to. That is the default, not one
of two equal options.

Prose in the component doc is the fallback, for when it cannot attach: the
component has no source, or the contract constrains the component as a whole
rather than any single element.

A contract written in prose because there was no code yet moves into a doc
comment once the code exists. Leaving it behind creates a second place to look,
and then a second place to drift.

## What "surface as a diff" means here

Reviewed material is owned code plus the comprehension structures, so the diff
is scoped to those paths:

```
bash scripts/review-diff.sh
```

It covers `*/owned/*`, `docs/components/` and `docs/concerns.md`. It defaults to
comparing against `origin/default` — the last reviewed and pushed state — so it
shows everything still awaiting review. Pass a ref to compare against something
else.

Because the rule is mechanical, it can be checked rather than remembered.
