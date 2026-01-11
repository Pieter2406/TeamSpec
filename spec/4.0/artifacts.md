<!-- DO NOT EDIT - Generated from registry.yml -->

# TeamSpec 4.0 Artifacts

> **Status:** Normative  
> **Source:** [registry.yml](registry.yml)

---

## Overview

All TeamSpec artifacts follow strict naming conventions and location rules.

---

## Product-Level Artifacts (Production Truth)

These artifacts live in `products/{product-id}/` and represent AS-IS state.

| Artifact | Location | Pattern | Example | Owner |
|----------|----------|---------|---------|-------|
| Product | `products/{product-id}/` | `product.yml` | `product.yml` | PO |
| Feature | `products/{product-id}/features/` | `f-{PRX}-{NNN}-{description}.md` | `f-ACME-001-user-login.md` | FA |
| Business Analysis | `products/{product-id}/business-analysis/` | `ba-{PRX}-{NNN}-{description}.md` | `ba-ACME-001-checkout-process.md` | BA |
| Solution Design | `products/{product-id}/solution-designs/` | `sd-{PRX}-{NNN}-{description}.md` | `sd-ACME-001-payment-integration.md` | SA |
| Tech Architecture | `products/{product-id}/technical-architecture/` | `ta-{PRX}-{NNN}-{description}.md` | `ta-ACME-001-microservices.md` | SA |
| Decision | `products/{product-id}/decisions/` | `dec-{PRX}-{NNN}-{description}.md` | `dec-ACME-001-payment-provider.md` | PO |
| Regression Test | `products/{product-id}/qa/regression-tests/` | `rt-f-{PRX}-{NNN}-{description}.md` | `rt-f-ACME-001-user-login-regression.md` | QA |

---

## Project-Level Artifacts (Change Proposals)

These artifacts live in `projects/{project-id}/` and represent TO-BE state.

| Artifact | Location | Pattern | Example | Owner |
|----------|----------|---------|---------|-------|
| Project | `projects/{project-id}/` | `project.yml` | `project.yml` | PO |
| Feature-Increment | `projects/{project-id}/feature-increments/` | `fi-{PRX}-{NNN}-{description}.md` | `fi-ACME-001-oauth-login.md` | FA |
| Epic | `projects/{project-id}/epics/` | `epic-{PRX}-{NNN}-{description}.md` | `epic-ACME-001-authentication-overhaul.md` | FA |
| Story | `projects/{project-id}/stories/{state}/` | `s-e{EEE}-{SSS}-{description}.md` | `s-e001-042-add-google-oauth.md` | FA |
| Dev Plan | `projects/{project-id}/dev-plans/` | `dp-e{EEE}-s{SSS}-{description}.md` | `dp-e001-s042-oauth-implementation.md` | DEV |
| Test Case | `projects/{project-id}/qa/test-cases/` | `tc-fi-{PRX}-{NNN}-{description}.md` | `tc-fi-ACME-001-oauth-login-tests.md` | QA |
| Bug Report | `projects/{project-id}/qa/bug-reports/` | `bug-{PRX}-{NNN}-{description}.md` | `bug-ACME-042-oauth-timeout.md` | QA |
| BA Increment | `projects/{project-id}/business-analysis-increments/` | `bai-{PRX}-{NNN}-{description}.md` | `bai-ACME-001-checkout-redesign.md` | BA |
| SD Increment | `projects/{project-id}/solution-design-increments/` | `sdi-{PRX}-{NNN}-{description}.md` | `sdi-ACME-001-oauth-architecture.md` | SA |
| TA Increment | `projects/{project-id}/technical-architecture-increments/` | `tai-{PRX}-{NNN}-{description}.md` | `tai-ACME-001-auth-refactor.md` | SA |
| Sprint | `projects/{project-id}/sprints/` | `sprint-{N}/` | `sprint-1/` | SM |

---

## Naming Pattern Key

| Symbol | Meaning | Example |
|--------|---------|---------|
| `{PRX}` | Product prefix (3-4 uppercase chars) | `ACME` |
| `{NNN}` | Sequential number (3 digits) | `001` |
| `{EEE}` | Epic number (3 digits) | `001` |
| `{SSS}` | Story sequence within epic (3 digits) | `042` |
| `{N}` | Sprint number | `1` |
| `{description}` | Kebab-case description | `user-login` |
| `{state}` | Story state folder | `backlog`, `done` |

---

## Story State Folders

Stories move between folders as they progress:

| Folder | Meaning |
|--------|---------|
| `stories/backlog/` | Ready for sprint planning |
| `stories/ready-to-refine/` | Needs refinement |
| `stories/in-progress/` | Under development |
| `stories/done/` | Completed |
| `stories/deferred/` | Postponed |
| `stories/out-of-scope/` | Removed from project |

---

## QA Two-Layer Model

### Project Test Cases

- **Purpose:** Validate Feature-Increments during project
- **Location:** `projects/{project-id}/qa/test-cases/`
- **Pattern:** `tc-fi-{PRX}-{NNN}-{description}.md`
- **Targets:** `fi-PRX-NNN` (Feature-Increment)

### Product Regression Tests

- **Purpose:** Long-term regression coverage for deployed features
- **Location:** `products/{product-id}/qa/regression-tests/`
- **Pattern:** `rt-f-{PRX}-{NNN}-{description}.md`
- **Targets:** `f-PRX-NNN` (Feature)

### Regression Impact Record

- **Purpose:** Record regression assessment for each FI at deployment
- **Location:** `projects/{project-id}/qa/regression-impact/`
- **Pattern:** `ri-fi-{PRX}-{NNN}.md`
- **Required Fields:**
  - `fi_id`: Reference to Feature-Increment
  - `assessment`: `update-required` | `no-impact`
  - `rationale`: Explanation of impact assessment
  - `regression_tests`: List of `rt-f-*` files created/updated (if update-required)
- **Lint Rule:** `TS-QA-003`

### Promotion Rule

At deployment gate:
1. For each `fi-PRX-NNN` delivered:
   - Create `ri-fi-PRX-NNN.md` with assessment, AND
   - If `assessment: update-required`: update/create `rt-f-PRX-NNN-*` in product
   - If `assessment: no-impact`: document rationale

---

## Workspace Structure

```
products/                           # PRODUCTION TRUTH (AS-IS)
└── {product-id}/
    ├── product.yml
    ├── features/
    │   └── f-PRX-NNN-*.md
    ├── business-analysis/
    │   └── ba-PRX-NNN-*.md
    ├── solution-designs/
    │   └── sd-PRX-NNN-*.md
    ├── technical-architecture/
    │   └── ta-PRX-NNN-*.md
    ├── decisions/
    │   └── dec-PRX-NNN-*.md
    └── qa/
        └── regression-tests/
            └── rt-f-PRX-NNN-*.md

projects/                           # CHANGE PROPOSALS (TO-BE)
└── {project-id}/
    ├── project.yml
    ├── feature-increments/
    │   └── fi-PRX-NNN-*.md
    ├── epics/
    │   └── epic-PRX-NNN-*.md
    ├── stories/
    │   ├── backlog/
    │   ├── ready-to-refine/
    │   ├── in-progress/
    │   ├── done/
    │   ├── deferred/
    │   └── out-of-scope/
    │       └── s-eXXX-YYY-*.md
    ├── dev-plans/
    │   └── dp-eXXX-sYYY-*.md
    ├── qa/
    │   ├── test-cases/
    │   │   └── tc-fi-PRX-NNN-*.md
    │   ├── bug-reports/
    │   │   └── bug-PRX-NNN-*.md
    │   └── regression-impact/
    │       └── ri-fi-PRX-NNN.md
    ├── business-analysis-increments/
    │   └── bai-PRX-NNN-*.md
    ├── solution-design-increments/
    │   └── sdi-PRX-NNN-*.md
    ├── technical-architecture-increments/
    │   └── tai-PRX-NNN-*.md
    └── sprints/
        └── sprint-N/
```
