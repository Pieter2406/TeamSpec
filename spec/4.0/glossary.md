# TeamSpec 4.0 Glossary

> **Status:** Normative  
> **Source:** [registry.yml](registry.yml)

---

## Core Concepts

### Product Canon

The complete set of production-truth documentation for a product.

- **Location:** `products/{product-id}/`
- **Includes:** features, business-analysis, solution-designs, technical-architecture, decisions, regression-tests
- **Status:** AS-IS (what is currently deployed)
- **Owner:** PO (approval authority)

**Note:** This is the umbrella term. All production truth lives here.

### Feature Canon

The behavioral subset of Product Canon — system behavior truth.

- **Location:** `products/{product-id}/features/`
- **Contains:** `f-PRX-NNN-*.md` files

**Note:** A subset of Product Canon, not a separate concept.

### Feature-Increment

A project artifact proposing changes to a product feature.

- **Location:** `projects/{project-id}/feature-increments/`
- **Contains:** `fi-PRX-NNN-*.md` files with AS-IS/TO-BE sections
- **Abbreviation:** FI
- **Status:** TO-BE (proposed state)
- **Owner:** FA

**Note:** TO-BE state becomes Feature Canon after deployment + sync.

### Epic

A coherent grouping of stories delivering a business outcome.

- **Location:** `projects/{project-id}/epics/`
- **Contains:** `epic-PRX-NNN-*.md` files
- **Owner:** FA

**Note:** All stories must link to an epic via filename.

### Story

A delta describing a change proposed by a Feature-Increment.

- **Location:** `projects/{project-id}/stories/{state}/`
- **Contains:** `s-eXXX-YYY-*.md` files
- **Owner:** FA

**Note:** Stories describe CHANGES, not full behavior.

### PRX (Product Prefix)

A unique 3-4 uppercase character identifier for each product.

- **Examples:** `ACME`, `DIT`, `BILL`
- **Assigned by:** PO at product creation
- **Rule:** NEVER changes after assignment

**Note:** Used in ALL artifact filenames for traceability.

---

## Roles

### PO (Product Owner)

Owns Products, Product Canon, Projects, and Canon sync execution.

### BA (Business Analyst)

Owns Business Analysis artifacts and domain knowledge documentation.

### FA (Functional Analyst)

Owns Features, Feature-Increments, Epics, and Stories.

### SA (Solution Architect)

Owns Solution Designs, Technical Architecture, and ADRs.

### DEV (Developer)

Owns Implementation and Dev plans.

### QA (QA Engineer)

Owns Project test cases, Product regression tests, and deployment verification.

### SM (Scrum Master)

Owns Sprint operations and deployment checklist.

### DES (Designer)

Owns UX/UI design artifacts.

---

## Gates

### DoR (Definition of Ready)

Checklist verified before a story enters development.

- **Owner:** FA
- **Verifier:** SM

### DoD (Definition of Done)

Checklist verified before a story is marked complete.

- **Owner:** FA
- **Verifier:** QA

### Deployment Gate

Checklist verified before code is deployed to production.

- **Owner:** SM
- **Approver:** PO
- **Verifier:** QA

### Canon Sync Gate

Gate for synchronizing project changes to Product Canon.

- **Owner:** PO
- **Precondition:** Deployment gate passed
- **Command:** `ts:po sync`
- **Timing:** POST-DEPLOY ONLY

---

## Artifact States

### Story States

| State | Meaning |
|-------|---------|
| `backlog/` | Not yet refined |
| `ready-to-refine/` | Needs refinement |
| `in-progress/` | Under development |
| `done/` | Completed |
| `deferred/` | Postponed |
| `out-of-scope/` | Removed from scope |

---

## Commands

### Command Syntax

- **User invocation:** Space-based (`ts:po sync`)
- **Machine IDs:** Dot-based (`po.sync`)

### Command Categories

| Prefix | Role | Purpose |
|--------|------|---------|
| `ts:po` | Product Owner | Product/project management, canon sync |
| `ts:ba` | Business Analyst | Business analysis artifacts |
| `ts:fa` | Functional Analyst | Features, FIs, epics, stories |
| `ts:sa` | Solution Architect | TA, SD, technical increments |
| `ts:dev` | Developer | Dev plans, implementation |
| `ts:qa` | QA Engineer | Test cases, verification |
| `ts:sm` | Scrum Master | Sprint operations |

---

## Removed Commands

| Command | Replacement | Reason | Removed In |
|---------|-------------|--------|------------|
| `ts:deploy` | `ts:po sync` | Conflicted with ts:po sync; one mechanism is clearer | 4.0 |
| `ts:ba epic` | `ts:fa epic` | BA does not own epics; FA does | 4.0 |
| `ts:ba feature` | `ts:fa feature` | BA does not own features; FA does | 4.0 |
| `ts:sa design` | `ts:sa sd` | Aligned with artifact naming | 4.0 |
| `ts:sa adr` | `ts:sa ta` | Aligned with artifact naming | 4.0 |

---

## Deprecated Terms

| Old Term | New Term | Reason |
|----------|----------|--------|
| "Canon" (unqualified) | "Product Canon" or "Feature Canon" | Ambiguous usage |
