# TeamSpec 4.0 Implementation Plan

> **Date:** 2026-01-11  
> **Status:** Ready for execution (reviewed & hardened)  
> **Goal:** Make TeamSpec 100% internally consistent and ready to ship  
> **Effort:** ~2 weeks (treat as real sprint, not casual edits)

---

## Executive Summary

This plan transforms TeamSpec from "functionally 4.0 but documentationally broken" to **fully consistent and drift-resistant**.

### What We're Building

| Before | After |
|--------|-------|
| README is "source of truth" (but contradicts itself) | README is entrypoint; `/spec/4.0/registry.yml` is the law |
| Ownership scattered across docs/agents | Single ownership matrix, generated to all surfaces |
| `ts:deploy` vs `ts:po sync` confusion | `ts:po sync` is canonical; `ts:deploy` is deprecated alias |
| QA artifacts location unclear | Two-layer model: project test cases + product regression tests |
| "Canon" used ambiguously | Product Canon > Feature Canon hierarchy defined once |
| No CI enforcement | Banlist + parity + generated-files-up-to-date checks |

### Phase Overview

| Phase | Days | Deliverable |
|-------|------|-------------|
| 0: Lock Decisions | 1 | `DECISION-001-operating-model.md` |
| 1A: Truth Audit | 2 | `truth-audit.md` (discrepancies resolved) |
| 1: Create Spec Structure | 3 | `spec/4.0/registry.yml` + core docs |
| 5: Generation Pipeline | 4 | `scripts/generate-spec.js` + generated docs |
| 2: Fix Agent Prompts | 5 | All agents consistent with registry |
| 3: Fix CLI/Shipped Surfaces | 6-7 | 4.0 branding everywhere |
| 4: Update README | 8 | README → entrypoint + links |
| 6: CI Enforcement | 9 | Banlist, parity, golden workspace tests |
| 7: Consolidation | 10 | Single-source strategy enforced |
| 8: Linter Updates | 11 | QA coverage rules |

---

## Problem Statement

The current TeamSpec codebase is **functionally 4.0** but **documentationally broken**:

1. **README does too many jobs** — marketing, tutorial, architecture, governance rules all mixed together
2. **Internal contradictions** — ownership, commands, and sync mechanisms conflict across sections
3. **No single source of truth** — agents, README, and tooling each "pick a truth" independently
4. **2.0 branding in 4.0 code** — CLI creates 4.0 structure but claims "TeamSpec 2.0"

**Consequence:** Different people (and AI models) interpret different sections as authoritative, guaranteeing drift.

---

## Target State

After implementation:

1. **One normative spec** — All rules live in `/spec/4.0/` (machine-readable registry + generated tables)
2. **README is entrypoint only** — Links to spec, doesn't duplicate rules
3. **Zero contradictions** — Ownership, commands, sync all defined once
4. **4.0 branding everywhere** — No "TeamSpec 2.0" in shipped surfaces
5. **Agents generated from registry** — Role tables, commands, prohibitions all from one source
6. **CI enforces truth** — Banlist, parity checks, generated-files-up-to-date checks

---

## Key Decisions (Locked)

These decisions were made during review and are **non-negotiable** for this implementation:

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Spec location | `/spec/4.0/` (not `/docs/spec/4.0/`) | Normative content deserves root-level visibility; `/docs/` invites "docs mindset" casual edits |
| Command syntax | Space-based for users (`ts:po sync`), dot-based for machine IDs (`po.sync`) | Eliminates "is it `:` or space?" confusion |
| `ts:deploy` handling | **Deprecated alias** → prints warning + redirects to `ts:po sync` | Hard removal causes churn; alias gives migration runway |
| QA artifact model | Project test cases (`tc-fi-*`) + Product regression tests (`rt-f-*`) | Two-layer model with explicit promotion workflow |
| Canon terminology | **Product Canon** (umbrella) > **Feature Canon** (behavioral subset) | Define hierarchy once, ban ambiguous "Canon" usage |
| Gate ownership | Distinguish **Owner** (accountable) vs **Verifier** vs **Approver** | Prevents "who owns DoR?" arguments |

---

## Implementation Phases

### Phase 0: Lock Decisions (Day 1)

Before any code changes, lock these decisions:

| Decision | Options | Recommended |
|----------|---------|-------------|
| Operating model | 4.0-only / dual-mode | **4.0-only** |
| Canon sync mechanism | `ts:po sync` only / `ts:deploy` only / both with defined relationship | **`ts:po sync` primary** (`ts:deploy` as deprecated alias) |
| Project owner | BA / PO | **PO** (BA provides business analysis input) |
| Feature owner | BA / FA | **FA** (BA provides business intent) |
| Feature-Increment owner | BA / FA | **FA** (FA creates, PO approves sync) |
| Epic owner | BA / FA | **FA** |
| Canon update timing | Pre-deploy / Post-deploy only | **Post-deploy only** (via `ts:po sync`) |

**Deliverable:** `spec/4.0/decisions/DECISION-001-operating-model.md`

---

### Phase 1A: Truth Audit (Day 1-2) — NEW

**Critical checkpoint before writing registry.yml.**

This phase prevents encoding wrong assumptions into the new source of truth.

#### 1A.1 Extract Current Normative Rules

| Source | Extract |
|--------|---------|
| `agents/AGENT_BOOTSTRAP.md` | Ownership rules, folder structures, gates |
| Each role agent (`AGENT_PO.md`, etc.) | Artifacts owned, paths used, commands referenced |
| `cli/lib/linter.js` | Enforced rules and their patterns |
| `cli/test/fixtures/valid-4.0/` | Structure the linter considers valid |

#### 1A.2 Document Discrepancies

Create `spec/4.0/audit/truth-audit.md`:

```markdown
# Truth Audit Results

## Ownership Discrepancies
| Artifact | Bootstrap Says | Agent Says | Linter Enforces | Resolution |
|----------|---------------|------------|-----------------|------------|
| Projects | PO | BA (README) | TS-PROJ-* | → PO |
| ...      | ...           | ...        | ...             | → ...      |

## Path Discrepancies
| Artifact | Agent Path | Linter Path | Resolution |
|----------|-----------|-------------|------------|
| QA test cases | /qa/test-cases/tc-f-* | ? | → projects/*/qa/test-cases/tc-fi-* |
| ...      | ...       | ...         | → ...      |

## Command Discrepancies
| Command | Agent Says | CLI Implements | Resolution |
|---------|-----------|----------------|------------|
| ts:ba epic | exists | does not exist | → REMOVE (use ts:fa epic) |
| ts:deploy | exists | exists | → DEPRECATED (use ts:po sync) |
```

#### 1A.3 Resolve Before Proceeding

**Gate:** Phase 1 cannot start until all discrepancies have explicit resolutions.

---

### Phase 1: Create Spec Structure (Day 2-3)

Create the normative spec directory (note: `/spec/4.0/` not `/docs/spec/4.0/`):

```
spec/4.0/
├── index.md                    # What is normative, how to read this
├── registry.yml                # SINGLE SOURCE: roles, artifacts, commands, gates
├── model.md                    # Product/Project/Canon model + invariants
├── artifacts.md                # Artifact types, locations, naming patterns
├── roles.md                    # Generated from registry.yml
├── workflows.md                # Phases + handoffs (no commands)
├── gates.md                    # DoR/DoD/Deployment/Sync exact rules
├── commands.md                 # CLI + agent commands, generated from registry
├── glossary.md                 # Definitions: Canon, Feature, FI, Epic, Story
├── audit/                      # Truth audit artifacts (from Phase 1A)
│   └── truth-audit.md
└── decisions/                  # ADR-lite for locked decisions
    └── DECISION-001-operating-model.md
```

#### 1.1 Create `registry.yml` (THE source of truth)

```yaml
# spec/4.0/registry.yml
# This file is the SINGLE SOURCE OF TRUTH for TeamSpec 4.0
# All tables in README, agents, and docs are GENERATED from this file
# DO NOT EDIT generated files directly — edit this registry and regenerate

version: "4.0"
model: "Product-Canon"

# =============================================================================
# TERMINOLOGY (Canon Hierarchy - define once, use everywhere)
# =============================================================================
glossary:
  product-canon:
    definition: "The complete set of production-truth documentation for a product"
    includes: ["features", "business-analysis", "solution-designs", "technical-architecture", "decisions", "regression-tests"]
    note: "This is the umbrella term. All production truth lives here."
  
  feature-canon:
    definition: "The behavioral subset of Product Canon - system behavior truth"
    location: "products/{product-id}/features/"
    note: "A subset of Product Canon, not a separate concept"
    
  feature-increment:
    definition: "A project artifact proposing changes to a product feature"
    location: "projects/{project-id}/feature-increments/"
    abbreviation: "FI"
    note: "TO-BE state that becomes Feature Canon after deployment + sync"

# =============================================================================
# ROLES (with Owner vs Verifier vs Approver distinction)
# =============================================================================
roles:
  PO:
    name: "Product Owner"
    owns:
      - "Products (product.yml, structure)"
      - "Product Canon (approval authority)"
      - "Projects (project.yml, scope)"
      - "PRX assignment"
      - "Deployment gates"
      - "Canon sync execution"
    creates:
      - "products/{id}/product.yml"
      - "projects/{id}/project.yml"
      - "products/{id}/decisions/dec-PRX-*.md"
    reviews:
      - "Feature-Increments (for sync)"
      - "Project scope"
    refuses:
      - "Stories"
      - "Technical design"
      - "Sprint management"
    commands:
      - "ts:po product"
      - "ts:po project"
      - "ts:po sync"
      - "ts:po status"

  BA:
    name: "Business Analyst"
    owns:
      - "Business Analysis artifacts"
      - "Domain knowledge documentation"
      - "Business process documentation"
    creates:
      - "products/{id}/business-analysis/ba-PRX-*.md"
      - "projects/{id}/business-analysis-increments/bai-PRX-*.md"
    reviews:
      - "Feature-Increments (business intent)"
    refuses:
      - "Projects (PO owns)"
      - "Features (FA owns)"
      - "Feature-Increments (FA owns)"
      - "Epics (FA owns)"
      - "Stories"
      - "Technical design"
    commands:
      - "ts:ba analysis"
      - "ts:ba ba-increment"
      - "ts:ba review"

  FA:
    name: "Functional Analyst"
    owns:
      - "Features (f-PRX-*.md)"
      - "Feature-Increments (fi-PRX-*.md)"
      - "Epics (epic-PRX-*.md)"
      - "Stories (s-eXXX-YYY-*.md)"
      - "Sync proposals (prepared for PO)"
    creates:
      - "products/{id}/features/f-PRX-*.md"
      - "projects/{id}/feature-increments/fi-PRX-*.md"
      - "projects/{id}/epics/epic-PRX-*.md"
      - "projects/{id}/stories/**/s-eXXX-YYY-*.md"
    reviews:
      - "BA artifacts (for feature translation)"
      - "Stories (for Done status)"
    refuses:
      - "Products (PO owns)"
      - "Projects (PO owns)"
      - "Business intent changes (BA owns)"
      - "Technical design (SA owns)"
      - "Canon sync execution (PO owns)"
    commands:
      - "ts:fa feature"
      - "ts:fa feature-increment"
      - "ts:fa epic"
      - "ts:fa story"
      - "ts:fa sync-proposal"

  SA:
    name: "Solution Architect"
    owns:
      - "Solution Designs (sd-PRX-*.md)"
      - "Technical Architecture (ta-PRX-*.md)"
      - "ADRs"
    creates:
      - "products/{id}/solution-designs/sd-PRX-*.md"
      - "products/{id}/technical-architecture/ta-PRX-*.md"
      - "projects/{id}/solution-design-increments/sdi-PRX-*.md"
      - "projects/{id}/technical-architecture-increments/tai-PRX-*.md"
    reviews:
      - "Feature-Increments (technical feasibility)"
    refuses:
      - "Business requirements"
      - "Features (FA owns)"
      - "Stories"
    commands:
      - "ts:sa design"
      - "ts:sa adr"

  DEV:
    name: "Developer"
    owns:
      - "Implementation"
      - "Dev plans (dp-eXXX-sYYY-*.md)"
    creates:
      - "projects/{id}/dev-plans/dp-eXXX-sYYY-*.md"
    reviews:
      - "Stories (for implementation clarity)"
      - "ADRs"
    refuses:
      - "Feature definitions"
      - "Scope changes"
    commands:
      - "ts:dev plan"
      - "ts:dev implement"

  QA:
    name: "QA Engineer"
    owns:
      - "Project test cases (tc-fi-PRX-*.md)"
      - "Product regression tests (rt-f-PRX-*.md)"
      - "Bug reports"
      - "Deployment verification"
    creates:
      - "projects/{id}/qa/test-cases/tc-fi-PRX-NNN-*.md"      # Project: FI coverage
      - "projects/{id}/qa/bug-reports/bug-PRX-NNN-*.md"
      - "products/{id}/qa/regression-tests/rt-f-PRX-NNN-*.md" # Product: regression suite
    reviews:
      - "Stories (for testability)"
      - "Feature-Increments (for test coverage)"
    verifies:
      - "DoD compliance"
      - "Deployment readiness (smoke tests)"
    refuses:
      - "Feature definitions"
      - "Canon updates (except regression tests)"
    commands:
      - "ts:qa test"
      - "ts:qa verify"
      - "ts:qa regression"
    promotion_rule: |
      At deployment gate, QA must confirm regression coverage is updated:
      - For each fi-PRX-NNN delivered, either:
        - Update/create rt-f-PRX-NNN-* regression docs, or
        - Record "no regression impact" explicitly

  SM:
    name: "Scrum Master"
    owns:
      - "Sprint operations"
      - "Deployment checklist (verification, not approval)"
      - "Process facilitation"
    creates:
      - "projects/{id}/sprints/sprint-N/*"
    reviews:
      - "DoR compliance"
      - "Deployment readiness"
    refuses:
      - "Prioritization (PO decides)"
      - "Acceptance (FA decides)"
      - "Scope changes"
    commands:
      - "ts:sm sprint"
      - "ts:sm deploy-checklist"

  DES:
    name: "Designer"
    owns:
      - "UX/UI design artifacts"
    creates:
      - "Design documents"
    reviews:
      - "Features (for UX implications)"
    refuses:
      - "Technical implementation"
      - "Scope decisions"
    commands: []  # No CLI commands currently

# =============================================================================
# ARTIFACTS
# =============================================================================
artifacts:
  # Product-level (permanent, production truth)
  product:
    location: "products/{product-id}/product.yml"
    naming: "product.yml"
    owner: "PO"
    
  feature:
    location: "products/{product-id}/features/"
    naming: "f-{PRX}-{NNN}-{description}.md"
    example: "f-ACME-001-user-login.md"
    owner: "FA"
    
  business-analysis:
    location: "products/{product-id}/business-analysis/"
    naming: "ba-{PRX}-{NNN}-{description}.md"
    example: "ba-ACME-001-checkout-process.md"
    owner: "BA"

  # Project-level (temporary, change proposals)
  project:
    location: "projects/{project-id}/project.yml"
    naming: "project.yml"
    owner: "PO"
    
  feature-increment:
    location: "projects/{project-id}/feature-increments/"
    naming: "fi-{PRX}-{NNN}-{description}.md"
    example: "fi-ACME-001-oauth-login.md"
    owner: "FA"
    
  epic:
    location: "projects/{project-id}/epics/"
    naming: "epic-{PRX}-{NNN}-{description}.md"
    example: "epic-ACME-001-authentication-overhaul.md"
    owner: "FA"
    
  story:
    location: "projects/{project-id}/stories/{state}/"
    naming: "s-e{EEE}-{SSS}-{description}.md"
    example: "s-e001-042-add-google-oauth.md"
    owner: "FA"
    note: "EEE=epic number, SSS=story sequence within epic"
    
  dev-plan:
    location: "projects/{project-id}/dev-plans/"
    naming: "dp-e{EEE}-s{SSS}-{description}.md"
    example: "dp-e001-s042-oauth-implementation.md"
    owner: "DEV"

  # QA artifacts (two-layer model)
  project-test-case:
    location: "projects/{project-id}/qa/test-cases/"
    naming: "tc-fi-{PRX}-{NNN}-{description}.md"
    example: "tc-fi-ACME-001-oauth-login-tests.md"
    owner: "QA"
    targets: "fi-PRX-NNN (Feature-Increment)"
    note: "Project-scoped test cases for FI validation"
    
  product-regression-test:
    location: "products/{product-id}/qa/regression-tests/"
    naming: "rt-f-{PRX}-{NNN}-{description}.md"
    example: "rt-f-ACME-001-user-login-regression.md"
    owner: "QA"
    targets: "f-PRX-NNN (Feature)"
    note: "Product-scoped regression tests promoted from project test cases"

# =============================================================================
# GATES (with Owner vs Verifier vs Approver distinction)
# =============================================================================
gates:
  dor:
    name: "Definition of Ready"
    owner: "FA"
    verifier: "SM"
    checks:
      - "Story linked to Epic via filename (s-eXXX-YYY)"
      - "Feature-Increment exists and has AS-IS/TO-BE"
      - "Acceptance Criteria are testable"
      - "No TBD/placeholder content"
      - "Estimate assigned"
      
  dod:
    name: "Definition of Done"
    owner: "FA"
    verifier: "QA"
    checks:
      - "All AC verified by QA"
      - "Code reviewed and merged"
      - "Tests passing"
      - "Feature-Increment TO-BE section complete"
      - "Ready for deployment"
      
  deployment:
    name: "Deployment Gate"
    owner: "SM"
    approver: "PO"
    verifier: "QA"
    checks:
      - "All sprint stories in terminal state (Done/Deferred/Out-of-Scope)"
      - "All Feature-Increments reviewed"
      - "QA sign-off obtained"
      - "Regression coverage confirmed (rt-f-* updated or 'no impact' recorded)"
      - "Code deployed to production"
      - "Smoke tests passed"
    trigger: "SM runs ts:sm deploy-checklist"
    
  canon-sync:
    name: "Canon Sync Gate"
    owner: "PO"
    precondition: "Deployment gate passed"
    action: "ts:po sync"
    effect: "Feature-Increment TO-BE merged into Product Feature Canon"
    timing: "POST-DEPLOY ONLY"

# =============================================================================
# COMMANDS (space-based invocation, dot-based machine IDs)
# =============================================================================
commands:
  # PO commands
  - id: po.product
    invocation: "ts:po product"
    role: "PO"
    purpose: "Create new product"
    output: "products/{id}/ structure"
    
  - id: po.project
    invocation: "ts:po project"
    role: "PO"
    purpose: "Create new project"
    output: "projects/{id}/ structure"
    
  - id: po.sync
    invocation: "ts:po sync"
    role: "PO"
    purpose: "Sync project changes to Product Canon (post-deploy)"
    precondition: "Deployment gate passed"
    effect: "FI TO-BE → Feature Canon"
    changes: ["products/**"]
    
  # FA commands
  - id: fa.feature
    invocation: "ts:fa feature"
    role: "FA"
    purpose: "Create feature in Product Canon"
    output: "products/{id}/features/f-PRX-*.md"
    
  - id: fa.feature-increment
    invocation: "ts:fa feature-increment"
    role: "FA"
    purpose: "Create feature-increment in project"
    output: "projects/{id}/feature-increments/fi-PRX-*.md"
    
  - id: fa.epic
    invocation: "ts:fa epic"
    role: "FA"
    purpose: "Create epic in project"
    output: "projects/{id}/epics/epic-PRX-*.md"
    
  - id: fa.story
    invocation: "ts:fa story"
    role: "FA"
    purpose: "Create story linked to epic"
    output: "projects/{id}/stories/backlog/s-eXXX-YYY-*.md"

  # QA commands
  - id: qa.test
    invocation: "ts:qa test"
    role: "QA"
    purpose: "Create test cases for Feature-Increment"
    output: "projects/{id}/qa/test-cases/tc-fi-PRX-*.md"
    
  - id: qa.regression
    invocation: "ts:qa regression"
    role: "QA"
    purpose: "Update product regression tests"
    output: "products/{id}/qa/regression-tests/rt-f-PRX-*.md"

  # DEPRECATED (alias with warning)
  - id: deploy
    invocation: "ts:deploy"
    status: "DEPRECATED"
    replacement: "ts:po sync"
    behavior: "Prints deprecation warning, then executes ts:po sync"
    removal_version: "5.0"
    reason: "Conflicted with ts:po sync; one mechanism is clearer"
    
  # REMOVED (will error if used)
  - id: ba.epic
    invocation: "ts:ba epic"
    status: "REMOVED"
    replacement: "ts:fa epic"
    reason: "BA does not own Epics; FA does"
    
  - id: ba.feature
    invocation: "ts:ba feature"
    status: "REMOVED"
    replacement: "ts:fa feature"
    reason: "BA does not own Features; FA does"
```

#### 1.2 Create `index.md`

```markdown
# TeamSpec 4.0 Specification

> **Status:** Normative  
> **Version:** 4.0  
> **Last Updated:** 2026-01-11

This directory contains the **authoritative specification** for TeamSpec 4.0.

## What is Normative

Everything in this directory is **normative** (rules that must be followed):

| Document | Purpose |
|----------|---------|
| [registry.yml](registry.yml) | **THE** source of truth — roles, artifacts, commands, gates |
| [model.md](model.md) | Product/Project/Canon model and invariants |
| [artifacts.md](artifacts.md) | Artifact types, locations, naming patterns |
| [roles.md](roles.md) | Role ownership matrix (generated from registry) |
| [workflows.md](workflows.md) | Phases and handoffs |
| [gates.md](gates.md) | DoR/DoD/Deployment/Sync rules |
| [commands.md](commands.md) | CLI and agent commands (generated from registry) |
| [glossary.md](glossary.md) | Term definitions |

## How to Use This Spec

1. **For humans:** Read the .md files for understanding
2. **For tooling:** Parse registry.yml for automation
3. **For agents:** Role tables and commands come from registry.yml
4. **For README/docs:** Tables are generated, not hand-written

## Invariants

These rules are **always true** in TeamSpec 4.0:

1. Product Canon is updated **only after deployment** (via `ts:po sync`)
2. Every artifact has **exactly one owner role**
3. Stories link to Epics **via filename** (`s-eXXX-YYY-*.md`)
4. Feature-Increments describe **AS-IS (current) and TO-BE (proposed)**
5. PRX (product prefix) is **immutable** after product creation
```

---

### Phase 2: Fix Agent Prompts (Day 2-3)

Using registry.yml as source, fix all agent contradictions.

#### 2.1 Fix Ownership Contradictions

| File | Current | Fix |
|------|---------|-----|
| `agents/README.md` Quick Reference | "BA: Projects, Feature-Increments" | "BA: Business Analysis" |
| `agents/README.md` By Artifact | "Projects, Feature-Increments: BA" | "Projects: PO, Feature-Increments: FA" |
| `agents/AGENT_FA.md:225,254,881,888` | "BA creates the Epic/feature first: ts:ba epic" | "FA creates: ts:fa epic" |
| `agents/AGENT_BOOTSTRAP.md:§2.5` | Keep as-is (correct) | — |

#### 2.2 Fix Command References

| File | Remove | Replace With |
|------|--------|--------------|
| `agents/AGENT_FA.md` | `ts:ba epic` | `ts:fa epic` |
| `agents/AGENT_FA.md` | `ts:ba feature` | `ts:fa feature` |
| `agents/AGENT_DES.md` | `ts:ba feature review` | `ts:fa feature review` |
| `agents/README.md` | `ts:deploy` | `ts:po sync` (or remove) |
| `cli/teamspec-core/agents/README.md` | `ts:ba epic`, `ts:ba feature` | Remove entirely |

#### 2.3 Fix Example IDs

| File | Current | Fix |
|------|---------|-----|
| `agents/AGENT_FA.md:921-967` | `S-042`, `F-001` | `s-e001-042-oauth-login`, `f-ACME-001-user-auth` |
| `agents/AGENT_QA.md:715-835` | `F-001` | `f-ACME-001-user-auth` |
| `cli/teamspec-core/copilot-instructions.md:224-229` | `F-NNN`, `S-NNN` | `f-PRX-NNN-*`, `s-eXXX-YYY-*` |

#### 2.4 Add CORE Section to Each Agent

Add at top of each agent (after header):

```markdown
## CORE (for small models)

**Identity:** [Role] Agent for TeamSpec 4.0 Product-Canon model

**Hard Rules:**
1. [Role] owns: [list from registry]
2. [Role] creates: [list from registry]
3. [Role] NEVER: [refuses list from registry]
4. When unsure: ASK, don't guess
5. Output: Minimal, no placeholders

**Read-Only Mode:** If I lack info to create artifacts, I CAN still:
- Explain concepts
- Review existing content
- Suggest next steps
- Draft templates (without saving)
```

---

### Phase 3: Fix CLI and Shipped Surfaces (Day 3-4)

#### 3.1 CLI Banner/Help

| File | Line | Current | Fix |
|------|------|---------|-----|
| `cli/lib/cli.js` | 185 | "Bootstrap TeamSpec 2.0 Feature Canon Operating Model" | "Bootstrap TeamSpec 4.0 Product-Canon Operating Model" |
| `cli/lib/cli.js` | 1336 | "TeamSpec 2.0 initialized successfully" | "TeamSpec 4.0 initialized successfully" |

#### 3.2 CLI README

| File | Line | Current | Fix |
|------|------|---------|-----|
| `cli/README.md` | 4 | "Bootstrap TeamSpec 2.0 Feature Canon Operating Model" | "Bootstrap TeamSpec 4.0 Product-Canon Operating Model" |
| `cli/README.md` | description | Feature Canon references | Product-Canon references |

#### 3.3 Copilot Instructions

**Full rewrite required.** Replace `cli/teamspec-core/copilot-instructions.md` with 4.0 version.

Key changes:
- Title: "Copilot Instructions for TeamSpec 4.0"
- Model: "Product-Canon operating model"
- Structure: `products/` + `projects/` (not `projects/{id}/features/`)
- Examples: 4.0 naming patterns
- Link to spec: "For rules: spec/4.0/"

#### 3.4 Config Files

| File | Current | Fix |
|------|---------|-----|
| `cli/teamspec-core/teamspec.yml` | `version: "2.0"`, `features: "projects/{project-id}/features"` | `version: "4.0"`, remove 2.0 paths |
| `.teamspec/teamspec.yml` | Same | Same |

#### 3.5 Template READMEs

| File | Current | Fix |
|------|---------|-----|
| `templates/README.md` | "TeamSpec 2.0 Templates" | "TeamSpec 4.0 Templates" |
| `.teamspec/templates/README.md` | Same | Same |
| `cli/teamspec-core/templates/README.md` | Check | Update if 2.0 |

#### 3.6 Implement ts:deploy Deprecation Alias

In CLI command handler:

```javascript
// When ts:deploy is invoked:
console.warn('⚠️  DEPRECATED: ts:deploy will be removed in TeamSpec 5.0');
console.warn('   Use ts:po sync instead');
console.warn('   Migration: https://teamspec.dev/docs/migration/deploy-to-sync');
// Then execute ts:po sync
```

---

### Phase 4: Update Main README (Day 5-6)

Transform README from "source of truth" to "entrypoint + links".

#### 4.1 Add Normative vs Informative Section

Add near top:

```markdown
## Normative vs Informative

| Content | Location | Status |
|---------|----------|--------|
| **Rules** (roles, commands, gates) | [spec/4.0/](spec/4.0/) | **Normative** |
| **Overview** (what/why/quickstart) | This README | Informative |
| **Tutorials** | docs/guides/ | Informative |

If this README conflicts with spec/4.0/, **the spec wins**.
```

#### 4.2 Replace Duplicated Tables with Links

Replace role ownership table with:

```markdown
### Role Boundaries

See [spec/4.0/roles.md](spec/4.0/roles.md) for the authoritative ownership matrix.

Quick summary:
- **PO** owns Products + Projects
- **FA** owns Features + Feature-Increments + Epics + Stories
- **BA** owns Business Analysis
- **SA** owns Solution Designs + Technical Architecture
- **QA** owns Test Cases (project) + Regression Tests (product)
```

#### 4.3 Fix Canon Sync Narrative

Replace conflicting sections with:

```markdown
### Canon Update Lifecycle

1. **During project:** Feature-Increments describe AS-IS (current) and TO-BE (proposed)
2. **Story completion:** FA marks stories Done after QA verification
3. **Deployment:** Code deployed to production
4. **Post-deploy sync:** PO runs `ts:po sync` to merge FI TO-BE into Product Canon
5. **Regression update:** QA confirms regression test coverage (rt-f-* files)

**Canon is NEVER updated before deployment.**
```

#### 4.4 Define Canon Hierarchy Explicitly

Add to README glossary/model section:

```markdown
### Canon Hierarchy

- **Product Canon** = all production truth for a product
  - Location: `products/{product-id}/`
  - Includes: features, business-analysis, solution-designs, technical-architecture, decisions, regression-tests
  
- **Feature Canon** = behavioral subset of Product Canon
  - Location: `products/{product-id}/features/`
  - Contains: f-PRX-NNN-*.md files
  
- **Feature-Increments** = project deltas proposing future truth
  - Location: `projects/{project-id}/feature-increments/`
  - Contains: fi-PRX-NNN-*.md files with AS-IS/TO-BE sections

Do not use "Canon" unqualified — always specify Product Canon or Feature Canon.
```

---

### Phase 5: Generation Pipeline (Day 6-7) — NEW

**The core of "registry-driven" — without this, "generated" is aspirational.**

#### 5.1 Create Generation Script

Create `scripts/generate-spec.js`:

```javascript
#!/usr/bin/env node
/**
 * Generate spec documents from registry.yml
 * 
 * Usage: node scripts/generate-spec.js
 * 
 * Generates:
 * - spec/4.0/roles.md (from registry.yml roles section)
 * - spec/4.0/commands.md (from registry.yml commands section)
 * - spec/4.0/artifacts.md (from registry.yml artifacts section)
 * - Agent CORE blocks (injected into each agent)
 */

const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

const REGISTRY_PATH = 'spec/4.0/registry.yml';
const GENERATED_HEADER = '<!-- DO NOT EDIT - Generated from registry.yml -->\n\n';

function loadRegistry() {
  const content = fs.readFileSync(REGISTRY_PATH, 'utf8');
  return yaml.load(content);
}

function generateRolesMd(registry) {
  let md = GENERATED_HEADER;
  md += '# Roles\n\n';
  md += '| Role | Owns | Creates | Refuses |\n';
  md += '|------|------|---------|--------|\n';
  
  for (const [id, role] of Object.entries(registry.roles)) {
    md += `| **${id}** (${role.name}) | ${role.owns.join(', ')} | ${role.creates.join(', ')} | ${role.refuses.join(', ')} |\n`;
  }
  
  return md;
}

function generateCommandsMd(registry) {
  let md = GENERATED_HEADER;
  md += '# Commands\n\n';
  md += '| Invocation | Role | Purpose | Status |\n';
  md += '|------------|------|---------|--------|\n';
  
  for (const cmd of registry.commands) {
    const status = cmd.status || 'Active';
    md += `| \`${cmd.invocation}\` | ${cmd.role || '-'} | ${cmd.purpose || cmd.reason} | ${status} |\n`;
  }
  
  return md;
}

// ... additional generation functions

function main() {
  const registry = loadRegistry();
  
  fs.writeFileSync('spec/4.0/roles.md', generateRolesMd(registry));
  fs.writeFileSync('spec/4.0/commands.md', generateCommandsMd(registry));
  
  console.log('✅ Generated spec files from registry.yml');
}

main();
```

#### 5.2 CI Check for Generated Files

Create `scripts/check-generated.js`:

```javascript
#!/usr/bin/env node
/**
 * Verify generated files are up-to-date with registry.yml
 * 
 * Usage: node scripts/check-generated.js
 * Exit code: 0 if up-to-date, 1 if stale
 */

const { execSync } = require('child_process');

// Regenerate to temp location
execSync('node scripts/generate-spec.js --output .generated-check');

// Diff against actual
const files = ['roles.md', 'commands.md', 'artifacts.md'];
let stale = false;

for (const file of files) {
  const diff = execSync(`git diff --no-index spec/4.0/${file} .generated-check/${file} || true`);
  if (diff.toString().trim()) {
    console.error(`❌ ${file} is stale — regenerate with: npm run generate`);
    stale = true;
  }
}

// Cleanup
execSync('rm -rf .generated-check');

process.exit(stale ? 1 : 0);
```

#### 5.3 Package.json Scripts

```json
{
  "scripts": {
    "generate": "node scripts/generate-spec.js",
    "check:generated": "node scripts/check-generated.js"
  }
}
```

---

### Phase 6: CI Enforcement (Day 7-8)

#### 6.1 Refined Banlist Check

Create `scripts/check-banlist.js`:

```javascript
#!/usr/bin/env node
/**
 * Check for banned strings that indicate 2.0 remnants
 * 
 * Bans specific misleading strings, NOT legitimate concepts like "Feature Canon"
 */

const BANNED = [
  { pattern: /TeamSpec 2\.0/, reason: '2.0 branding in 4.0 codebase' },
  { pattern: /Feature Canon operating model/, reason: 'Old model name (use Product-Canon)' },
  { pattern: /projects\/\{project-id\}\/features/, reason: '2.0 path structure' },
  { pattern: /ts:ba epic/, reason: 'Removed command (use ts:fa epic)' },
  { pattern: /ts:ba feature(?!\s+review)/, reason: 'Removed command (use ts:fa feature)' },
];

// These are NOT banned (legitimate concepts):
// - "Feature Canon" (as subset of Product Canon)
// - "Canon" (when properly qualified)
// - "ts:deploy" (deprecated but aliased, will warn at runtime)

const ALLOWED_PATHS = [
  /review\//,           // Review/audit documents can reference old patterns
  /teamspec_test\//,    // Test fixtures
  /fixtures\//,         // Test fixtures
  /CHANGELOG/,          // Historical changelog
  /migration/,          // Migration guides need to reference old patterns
  /spec\/.*\/audit\//,  // Truth audit documents
];

// ... implementation
```

#### 6.2 Parity Check

Create `scripts/check-parity.js`:

```javascript
// Verify agents/, .teamspec/agents/, cli/teamspec-core/agents/ are identical
// Verify templates/, .teamspec/templates/, cli/teamspec-core/templates/ are identical
```

#### 6.3 Golden Workspace Test — NEW

Create `scripts/test-golden-workspace.js`:

```javascript
#!/usr/bin/env node
/**
 * Integration test: verify CLI creates correct 4.0 workspace
 * 
 * 1. Pack the CLI as tarball
 * 2. Install into temp folder
 * 3. Run teamspec init
 * 4. Verify 4.0 markers present
 * 5. Run teamspec lint (should pass)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const TEMP_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'teamspec-golden-'));

function run(cmd, cwd = TEMP_DIR) {
  return execSync(cmd, { cwd, encoding: 'utf8' });
}

function verify4_0Markers() {
  // Check copilot-instructions.md mentions 4.0
  const copilot = fs.readFileSync(
    path.join(TEMP_DIR, '.teamspec', 'copilot-instructions.md'), 
    'utf8'
  );
  if (!copilot.includes('TeamSpec 4.0')) {
    throw new Error('copilot-instructions.md missing "TeamSpec 4.0"');
  }
  if (copilot.includes('TeamSpec 2.0')) {
    throw new Error('copilot-instructions.md contains "TeamSpec 2.0"');
  }
  
  // Check teamspec.yml version
  const config = fs.readFileSync(
    path.join(TEMP_DIR, '.teamspec', 'teamspec.yml'),
    'utf8'
  );
  if (!config.includes('version: "4.0"')) {
    throw new Error('teamspec.yml version is not 4.0');
  }
  
  // Check folder structure
  const hasProdDir = fs.existsSync(path.join(TEMP_DIR, 'products'));
  const hasProjDir = fs.existsSync(path.join(TEMP_DIR, 'projects'));
  if (!hasProdDir || !hasProjDir) {
    throw new Error('Missing products/ or projects/ directory');
  }
}

try {
  console.log('📦 Packing CLI...');
  run('npm pack', path.join(__dirname, '..', 'cli'));
  
  console.log('📂 Creating test workspace...');
  run(`npm init -y`);
  run(`npm install ../cli/teamspec-*.tgz`);
  
  console.log('🚀 Running teamspec init...');
  run('npx teamspec init');
  
  console.log('🔍 Verifying 4.0 markers...');
  verify4_0Markers();
  
  console.log('✅ Golden workspace test passed');
  process.exit(0);
} catch (error) {
  console.error('❌ Golden workspace test failed:', error.message);
  process.exit(1);
} finally {
  // Cleanup
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });
}
```

#### 6.4 Package.json Scripts (Complete)

Add to `cli/package.json`:

```json
{
  "scripts": {
    "generate": "node scripts/generate-spec.js",
    "check:banlist": "node scripts/check-banlist.js",
    "check:parity": "node scripts/check-parity.js",
    "check:generated": "node scripts/check-generated.js",
    "test:golden": "node scripts/test-golden-workspace.js",
    "pretest": "npm run check:banlist && npm run check:parity && npm run check:generated",
    "test:all": "npm test && npm run test:golden"
  }
}
```

---

### Phase 7: Consolidate Directories (Day 9-10)

#### 7.1 Single Source Strategy

| Content | Authoritative | Copies (generated/synced) |
|---------|--------------|---------------------------|
| Agents | `agents/` | `.teamspec/agents/`, `cli/teamspec-core/agents/` |
| Templates | `templates/` | `.teamspec/templates/`, `cli/teamspec-core/templates/` |
| Spec | `spec/4.0/` | (no copies — single location) |

#### 7.2 Build Step

Add to CLI init process:
1. Copy `agents/` → target `.teamspec/agents/`
2. Copy `templates/` → target `.teamspec/templates/`
3. Copy `spec/4.0/` → target `.teamspec/spec/4.0/` (optional, for offline reference)
4. Generate `copilot-instructions.md` from spec

---

### Phase 8: Linter Updates (Day 10-11)

#### 8.1 Add Regression Coverage Rules

```javascript
// TS-QA-001: Project FI must have test cases
// If fi-PRX-NNN exists and is marked ready, tc-fi-PRX-NNN must exist
rules.push({
  id: 'TS-QA-001',
  name: 'Feature-Increment test coverage',
  check: (workspace) => {
    for (const fi of workspace.featureIncrements) {
      if (fi.status === 'ready-for-deployment') {
        const tcExists = workspace.hasFile(`projects/*/qa/test-cases/tc-${fi.id}-*.md`);
        if (!tcExists) {
          return { error: `Missing test cases for ${fi.id}` };
        }
      }
    }
  }
});

// TS-QA-002: Deployment requires regression update confirmation
// At deployment gate, rt-f-* files must be updated OR explicit "no impact" recorded
```

---

## Execution Checklist (Revised Timeline)

### Week 1

#### Day 1: Lock Decisions
- [ ] Create `spec/4.0/decisions/DECISION-001-operating-model.md`
- [ ] Document all locked decisions (sync mechanism, ownership, timing)

#### Day 2: Truth Audit (Phase 1A)
- [ ] Extract current rules from AGENT_BOOTSTRAP + role agents
- [ ] Extract current linter enforced rules
- [ ] Create `spec/4.0/audit/truth-audit.md` with discrepancies
- [ ] **Gate:** All discrepancies resolved before proceeding

#### Day 3: Create Spec Structure (Phase 1)
- [ ] Create `spec/4.0/` directory structure
- [ ] Create `registry.yml` with all roles/artifacts/commands/gates
- [ ] Create `index.md` and `glossary.md`

#### Day 4: Generate Spec Documents (Phase 5)
- [ ] Implement `scripts/generate-spec.js`
- [ ] Generate `roles.md` from registry
- [ ] Generate `commands.md` from registry
- [ ] Create `model.md`, `artifacts.md`, `workflows.md`, `gates.md`

#### Day 5: Fix Agent Prompts (Phase 2)
- [ ] Fix `agents/README.md` ownership table
- [ ] Fix `agents/AGENT_FA.md` command references (ts:ba → ts:fa)
- [ ] Fix `agents/AGENT_DES.md` command references
- [ ] Fix example IDs in all agents (S-042 → s-e001-042-*)
- [ ] Add CORE section to all agents
- [ ] Sync agent fixes to `.teamspec/agents/` and `cli/teamspec-core/agents/`

### Week 2

#### Day 6: Fix CLI and Shipped Surfaces (Phase 3)
- [ ] Fix `cli/lib/cli.js` banner (2.0 → 4.0)
- [ ] Fix `cli/README.md` (2.0 → 4.0)
- [ ] Implement `ts:deploy` deprecation alias
- [ ] Fix `teamspec.yml` files (version + structure)
- [ ] Fix `templates/README.md` files

#### Day 7: Rewrite Copilot Instructions
- [ ] Full rewrite of `cli/teamspec-core/copilot-instructions.md` for 4.0
- [ ] Verify no 2.0 patterns in new version

#### Day 8: Update Main README (Phase 4)
- [ ] Add Normative vs Informative section
- [ ] Replace duplicated tables with links to spec
- [ ] Fix Canon sync narrative
- [ ] Add Canon hierarchy definition

#### Day 9: CI Enforcement (Phase 6)
- [ ] Create `scripts/check-banlist.js` (refined, not over-broad)
- [ ] Create `scripts/check-parity.js`
- [ ] Create `scripts/check-generated.js`
- [ ] Create `scripts/test-golden-workspace.js`
- [ ] Add CI scripts to package.json

#### Day 10: Consolidation & Testing (Phase 7)
- [ ] Update CLI init to copy from authoritative sources
- [ ] Run full lint suite
- [ ] Run banlist check (expect 0 violations)
- [ ] Run parity check (expect 100% match)
- [ ] Run generated files check
- [ ] Run golden workspace test

#### Day 11: QA & Buffer
- [ ] Manual review of all agent prompts
- [ ] End-to-end walkthrough: init → create product → create project → create story → sync
- [ ] Fix any discovered issues
- [ ] Update linter rules for QA coverage (Phase 8)

---

## Success Criteria (Expanded)

| Criterion | Test | Owner |
|-----------|------|-------|
| No "TeamSpec 2.0" in shipped surfaces | `npm run check:banlist` passes | CI |
| Agent files identical across directories | `npm run check:parity` passes | CI |
| Generated files up-to-date | `npm run check:generated` passes | CI |
| Golden workspace is 4.0 | `npm run test:golden` passes | CI |
| Linter enforces 4.0 rules | `valid-4.0` fixture passes, `broken-4.0` fails | CI |
| Zero ownership contradictions | registry.yml has exactly one owner per artifact | Manual |
| Zero command contradictions | No agent references removed commands | Manual |
| README links to spec | README contains "spec/4.0/" links | Manual |
| Spec is self-consistent | registry.yml parses, generates valid .md | CI |
| ts:deploy shows deprecation | Running ts:deploy prints warning | Manual |
| QA two-layer model works | tc-fi-* in projects, rt-f-* in products | Manual |

---

## Risk Mitigation (Expanded)

| Risk | Mitigation |
|------|------------|
| Spec drift from code | CI parity checks, generated tables, check:generated |
| Agent inconsistency | CORE section, registry-driven generation |
| User confusion during transition | Clear "4.0-only" messaging, ts:deploy deprecation warning |
| Existing 2.0 workspaces | `teamspec migrate` command (already exists) |
| Registry encodes wrong truth | Phase 1A truth audit before encoding |
| Generated files edited directly | "DO NOT EDIT" headers, CI check:generated |
| QA regression suite rots | Explicit promotion rule + linter enforcement |
| Timeline slips | 2-day buffer (Day 11), sprint-level tracking |

---

## Migration Note for ts:deploy Users

If you previously used `ts:deploy`, use `ts:po sync` instead:

```bash
# Old (deprecated, will warn)
ts:deploy

# New (recommended)
ts:po sync
```

Both commands require deployment gate to be passed first. The only difference is naming — `ts:po sync` better reflects that the PO executes canon synchronization.
