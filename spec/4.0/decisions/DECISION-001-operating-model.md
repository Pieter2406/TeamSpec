# DECISION-001: TeamSpec 4.0 Operating Model

> **Date:** 2026-01-11  
> **Status:** Approved  
> **Decision Makers:** Product Operations Team

---

## Context

TeamSpec evolved from version 2.0 (Feature Canon model) to 4.0 (Product-Canon model). During this evolution, several design decisions required explicit documentation to prevent drift and ensure consistency across all surfaces.

---

## Decisions

### 1. Operating Model

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Model Name | **Product-Canon** | Products are production truth (AS-IS); Projects propose changes (TO-BE) |
| Version | **4.0-only** | No dual-mode support; clean break from 2.0 |

### 2. Canon Sync Mechanism

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Primary Command | **`ts:po sync`** | PO owns canon sync; command reflects ownership |
| `ts:deploy` | **Deprecated alias** | Prints warning, executes `ts:po sync`; removal in 5.0 |
| Sync Timing | **Post-deploy only** | Canon is never updated before deployment |

### 3. Artifact Ownership

| Artifact | Owner | Rationale |
|----------|-------|-----------|
| Products | **PO** | PO owns production truth |
| Projects | **PO** | PO owns project scope and approval |
| Features | **FA** | FA owns behavioral specifications |
| Feature-Increments | **FA** | FA owns change proposals |
| Epics | **FA** | FA owns epic-level grouping |
| Stories | **FA** | FA owns story specifications |
| Business Analysis | **BA** | BA owns business domain knowledge |
| Solution Design | **SA** | SA owns technical design |
| Test Cases (project) | **QA** | QA owns project-level testing |
| Regression Tests (product) | **QA** | QA owns product-level regression suite |

### 4. QA Artifact Model

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Model | **Two-layer** | Project test cases + Product regression tests |
| Project Test Cases | `tc-fi-PRX-NNN-*.md` in `projects/*/qa/test-cases/` | FI-scoped validation |
| Product Regression | `rt-f-PRX-NNN-*.md` in `products/*/qa/regression-tests/` | Feature-scoped regression suite |
| Promotion Rule | Explicit at deployment gate | QA confirms regression coverage updated |

### 5. Canon Terminology

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Hierarchy | **Product Canon > Feature Canon** | Product Canon is umbrella; Feature Canon is behavioral subset |
| Usage Rule | Always qualify "Canon" | "Product Canon" or "Feature Canon", never bare "Canon" |

### 6. Gate Ownership Model

| Gate | Owner | Verifier | Approver |
|------|-------|----------|----------|
| DoR (Definition of Ready) | FA | SM | — |
| DoD (Definition of Done) | FA | QA | — |
| Deployment Gate | SM | QA | PO |
| Canon Sync Gate | PO | — | — |

### 7. Command Syntax

| Decision | Choice | Rationale |
|----------|--------|-----------|
| User Invocation | **Space-based** (`ts:po sync`) | Natural reading |
| Machine IDs | **Dot-based** (`po.sync`) | Unambiguous parsing |

### 8. Spec Location

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Location | **`/spec/4.0/`** | Root-level visibility; normative content deserves prominence |
| NOT `/docs/spec/4.0/` | Rejected | `/docs/` invites "docs mindset" casual edits |

---

## Consequences

1. All surfaces (agents, CLI, README, templates) must align with these decisions
2. `ts:deploy` will show deprecation warning until TeamSpec 5.0
3. BA no longer owns Projects, Features, or Feature-Increments (corrects 2.0 ambiguity)
4. Registry.yml is the single source of truth; generated files derive from it

---

## Related Documents

- [registry.yml](../registry.yml) — Normative spec data
- [08-implementation-plan.md](../../../review/08-implementation-plan.md) — Implementation plan
