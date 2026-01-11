# Phased Review Plan (Updated after agent-prompt review)

> **Updated:** 2026-01-11

This plan verifies TeamSpec 4.0 (Product-Canon) implementation completeness, identifies remaining legacy remnants, checks documentation consistency across all user-facing surfaces, validates that CLI + linter behavior match the documented rules, and **ensures agent prompts are internally consistent and reliable across model families**.

This repo is treated as **greenfield 4.0** unless the team explicitly decides otherwise.

## Recent scope change (why this was updated)
A cleanup pass deleted several legacy/old sources, including:
- `teamspec_4.0/` (previous 4.0 planning docs)
- `roles/` (workflow/spec docs)
- `projects/teamspec-mvp/` (example project artifacts)

A detailed review of agent prompts identified **hard internal contradictions** that will cause inconsistent behavior across GPT/Claude/Gemini (and even the same model on different days). These must be fixed before agents are reliable.

---

## Phase 0 — Establish sources of truth (SST) + lock mode decision
**Goal:** Make an irreversible-for-the-sprint decision about the operating model and declare a single ship payload.

Checklist:
- Record the intended shipped model (default): **4.0-only**.
- Declare the authoritative locations for "installed instance" content:
  - `cli/teamspec-core/` (likely ship payload)
  - `.teamspec/` (local installed copy)
  - `.github/` (Copilot instructions)

Deliverable:
- ADR-lite / Decision entry documenting:
  - Decision: 4.0-only (or dual-mode if explicitly chosen)
  - Rationale: confusion risk, support cost, compatibility stance
  - Consequences: what must be updated, what CI will forbid

Exit criteria:
- Decision recorded (ADR-lite / Decision entry) and treated as sprint-locked.
- Authoritative source directories declared for: agents, templates, config, instructions.
- Parity mechanism defined (build/copy step or CI parity check) for generated copies (`.teamspec/`, `.github/`).

---

## Phase 1 — Inventory remaining version drift + enforce bans
**Goal:** Eliminate 2.0 messaging/path-shapes from non-legacy areas and prevent regression.

Steps:
- Scan for "TeamSpec 2.0", "Feature Canon operating model", and `projects/<project-id>/features` patterns.
- **Also scan for "Feature Canon" used where "Product Canon" is meant** (terminology drift).
- Specifically audit these high-impact user entrypoints:
  - `.github/copilot-instructions.md`
  - `.teamspec/teamspec.yml`
  - `cli/teamspec-core/teamspec.yml`
  - `cli/README.md`
  - `templates/README.md` and `.teamspec/templates/README.md`

- Define a banlist for non-legacy areas (4.0-only):
  - Strings: "TeamSpec 2.0", "Feature Canon operating model"
  - Path-shape assumptions: `projects/<project-id>/features/` as the default truth location
  - **Terminology drift**: "Feature Canon" used to describe the 4.0 model (should be "Product Canon")
- Add CI enforcement proposal:
  - Fail if banlist matches occur outside approved exceptions (e.g., `review/`, `teamspec_test/`, or explicitly named fixtures).

Deliverable:
- Updated drift table with: file, current claim (2.0/4.0), required action.
- Banlist + allowed exceptions documented (so CI is deterministic).

Exit criteria:
- No "installed instance" documents claim 2.0.
- Banlist has zero matches outside allowed exceptions.
- "Feature Canon" only appears in explicit 2.0 legacy context or migration docs.

---

## Phase 2 — Agents/Bootstrap integrity & packaging parity
**Goal:** Prove agent content is internally consistent and the shipped bundle matches the source.

Steps:
- Compare content parity (diff/checksum) across:
  - `agents/`
  - `.teamspec/agents/`
  - `cli/teamspec-core/agents/`
- Verify internal integrity:
  - Every role agent inherits bootstrap rules (or explicitly embeds the bootstrap content)
  - Rule IDs and gates don't conflict (e.g., PO vs SM deployment responsibilities; FA vs QA acceptance boundaries)
  - Version/Last Updated headers follow a consistent scheme

Deliverable:
- Parity report (what differs where) + a recommendation for single-source + generation mechanism.

Exit criteria:
- Single authoritative agent source declared.
- Automated copy/build step OR CI parity check defined to keep derived copies identical.

---

## Phase 2.5 — Agent prompt consistency audit (CRITICAL)
**Goal:** Eliminate internal contradictions that cause unreliable agent behavior across model families.

### 2.5.1 — Ownership model consistency

**Problem identified:** Agents README, Bootstrap, BA agent, and PO agent contradict each other on who owns Projects, Feature-Increments, and Decisions.

Steps:
- Create a **single canonical ownership table** (Role → Owns / Creates / Reviews / Refuses).
- Compare each agent's "Owns", "Creates", "I will not" sections against the canonical table.
- Fix all deviations so every file agrees.

**Canonical ownership table (PROPOSED — validate and lock):**

| Role | Owns | Creates | Reviews | Refuses |
|------|------|---------|---------|---------|
| PO | Products, Product roadmap | product.yml, products-index | Project scope | Stories, technical decisions |
| BA | Business Analysis artifacts | ba-*.md, project.yml, decisions | Features, FI scope | Implementation, deployment |
| FA | Features, Feature-Increments, Stories | f-*.md, fi-*.md, stories | BA artifacts | Architecture, deployment |
| SA | Architecture, Tech decisions | ADRs, ta-*.md, sd-*.md | FI technical feasibility | Business requirements |
| DEV | Implementation, Dev plans | dp-*.md, code | Stories, ADRs | Feature definitions |
| QA | Test cases, Bug reports | test-*.md, bug-*.md | Stories, FI | Feature ownership |
| SM | Process, Sprints | sprint-*.md | DoR/DoD compliance | Content of deliverables |
| DES | Design artifacts | design-*.md | UI/UX in features | Technical implementation |

**Specific contradictions to resolve:**
- README says BA owns Projects + Feature-Increments + decisions.
- Bootstrap says PO owns Projects + Project Decisions, BA "never owns" Projects.
- BA agent says BA cannot create Projects, cannot create Feature-Increments.
- PO agent claims project ownership ("manage projects…", gates include "Project Exists").

Exit criteria:
- One truth table exists as authoritative source.
- All agent files + README agree with that table (zero contradictions).

### 2.5.2 — Command consistency

**Problem identified:** FA agent tells users to call BA commands (`ts:ba epic`, `ts:ba feature`) that BA agent explicitly forbids.

Steps:
- Extract all `ts:<role> <command>` references from every agent.
- Cross-check against `COMMAND_REFERENCE.md` and the agents README.
- For each command referenced in escalation text, verify the target agent actually allows it.

**Specific fixes needed:**
- FA agent references `ts:ba epic` and `ts:ba feature` — BA agent forbids these.
- `ts:deploy` vs `ts:po sync` — define the relationship or remove one.
- DES agent: README advertises `ts:des` but DES agent may not define a command section.

Exit criteria:
- No agent references a command that the target agent forbids.
- Every advertised command exists and is documented consistently.

### 2.5.3 — Example ID hygiene

**Problem identified:** SM's example story IDs are `S-042`, `S-043` but canonical naming is `s-eXXX-YYY-description.md`. Small models imitate examples more than rules.

Steps:
- Grep all agents for example artifact IDs (`S-`, `F-`, `EPIC-`, etc.).
- Replace all 2.0-style examples with 4.0-style (`s-e001-001-*`, `f-PRX-001-*`, `epic-PRX-001-*`).
- Verify examples match linter naming patterns.

Exit criteria:
- Zero 2.0-style example IDs in agent prompts.
- All examples pass `NAMING_PATTERNS_V4` regex.

### 2.5.4 — Agent prompt structure improvements

**Goal:** Make prompts reliable across GPT/Claude/Gemini small tiers.

Steps:
- Add a **"20-line CORE" section at the top of every agent**:
  - Role identity (1–2 lines)
  - 5–8 hard rules (bullets)
  - What I do when info is missing (ask/refuse)
  - Output style (minimal)
- Re-state **read-only mode** (2–3 lines) inside each agent (don't rely on Bootstrap always being pasted).
- Remove doc-only fluff (Mermaid diagrams, marketing README content) from prompts — keep them behavior-first.

Exit criteria:
- Every agent has a front-loaded CORE section (< 25 lines).
- Every agent includes read-only mode summary.
- No Mermaid diagrams or long explanatory content in agent files intended as system prompts.

---

## Phase 3 — CLI behavior vs docs
**Goal:** Ensure the CLI's docs and runtime output match its actual behavior.

Steps:
- Compare `cli/README.md` against `cli/lib/cli.js` help/banner output.
- Ensure banners/help text describe 4.0 if that's the shipping model.
- Confirm the CLI creates the expected 4.0 structure (products + product.yml; projects + feature-increments).

Deliverable:
- A short alignment matrix: "What docs say" vs "What CLI does" + mismatch list.

Exit criteria:
- CLI docs and CLI help output agree on version/model.

---

## Phase 4 — Linter behavior vs docs (fixture-based proof)
**Goal:** Confirm linter rules match the documented model and are verifiably applied.

Steps:
- Run lint using the local entrypoint (repo version): `node .\cli\bin\teamspec-init.js lint`.
- Run lint using the installed `teamspec lint` command (if used in docs) and capture exit code.
- Reconcile differences (version skew, PATH pointing to global install, etc.).
- Validate 4.0 enforcement with two controlled fixtures:
  1. Minimal valid 4.0 workspace (must pass) — `cli/test/fixtures/valid-4.0/`
  2. Minimal broken 4.0 workspace (must fail) — `cli/test/fixtures/broken-4.0/`
     - Must trigger expected rule IDs (at minimum): TS-PROD-* and at least one of TS-FI-* / TS-EPIC-*.
     - Evidence must include the rule IDs observed (not just "failed").

Deliverable:
- Evidence file with command lines, outputs, and exit codes.
- Fixture definitions (folders/files) and expected pass/fail outcomes.

Exit criteria:
- A single recommended lint invocation is documented (and it behaves consistently).
- Broken fixture reliably fails with expected rule IDs.

---

## Phase 5 — Redundancy & deletion candidates (post-cleanup)
**Goal:** Identify what is still redundant and can be removed safely.

Steps:
- Re-evaluate duplication now that `teamspec_4.0/` and `roles/` are gone.
- Focus remaining redundancy:
  - `templates/` vs `.teamspec/templates/` vs `cli/teamspec-core/templates/`
  - `agents/` vs `.teamspec/agents/` vs `cli/teamspec-core/agents/`
  - multiple copies of Copilot instructions

Deliverable:
- Updated deletion candidate list with: rationale, risk, and "safe removal order".

Exit criteria:
- A minimal set of authoritative directories remains (or a build/copy step is defined).

---

## Phase 6 — Documentation consistency sweep
**Goal:** Ensure all remaining docs reference real paths and consistent commands.

Steps:
- Fix broken references to deleted folders (`teamspec_4.0/`, `roles/`).
- Verify command names match `COMMAND_REFERENCE.md`.
- Ensure templates README(s) match the installed template set.

Exit criteria:
- No dead links to deleted folders.
- No contradictory version claims in top-level docs.

---

## Summary: What's genuinely good (preserve these)

* **Bootstrap is solid**: escalation protocol, read-only mode, and "ask vs refuse" decision table reduce hallucination-by-momentum.
* **Role prompts have teeth**: PO/BA/SM have clear "I will not do X" blocks and escalation scripts.
* **Deployment gate split is workable**: SM runs the checklist while PO owns the sync approval (when stated consistently).

## Summary: What's broken (fix before shipping)

| Issue | Impact | Phase |
|-------|--------|-------|
| Ownership contradictions (BA/PO/FA triangle) | Models "pick a truth" inconsistently | 2.5.1 |
| Command references to forbidden commands | Workflows break | 2.5.2 |
| Example IDs use wrong format | Small models copy examples | 2.5.3 |
| "Feature Canon" vs "Product Canon" drift | Terminology confusion | 1 |
| No front-loaded CORE section | Small models unreliable | 2.5.4 |
| Read-only mode not in every agent | Refuse-everything fallback | 2.5.4 |

---

## Questions for team lead / Agile expert
(See `review/05-questions-for-agile-expert.md`.)
