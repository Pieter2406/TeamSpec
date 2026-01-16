# TeamSpec 4.0 Lint Rules

> **Status:** Normative  
> **Source:** [registry.yml](registry.yml)

---

## Overview

TeamSpec enforces consistency through linter rules. Each rule has a unique ID, clear intent, and specific checks. Rules are enforced by `ts:lint` and can be auto-fixed by `ts:fix`.

---

## Rule Categories

| Prefix | Category | Description |
|--------|----------|-------------|
| TS-PROJ | Project Structure | Project folder and registration rules |
| TS-PROD | Product Structure | Product folder and registration rules |
| TS-FI | Feature-Increment | FI content and linking rules |
| TS-EPIC | Epic | Epic structure and naming rules |
| TS-STORY | Story | Story format and delta compliance |
| TS-NAMING | Naming Conventions | Artifact filename patterns |
| TS-DOD | Definition of Done | DoD gate compliance |
| TS-DOR | Definition of Ready | DoR gate compliance |
| TS-QA | QA Coverage | Test coverage and regression rules |
| MV | Marker Vocabulary | Frontmatter and section marker compliance |

---

## Project Rules (TS-PROJ)

### TS-PROJ-001: Project folder must be registered

**Intent:** Every project folder must be tracked in the projects index.

**Checks:**
- Project folder exists under `projects/`
- Project ID appears in `projects/projects-index.md`

**Failure Message:**
```
Project 'my-project' is not registered in projects-index.md
```

**Owner:** PO

---

### TS-PROJ-002: project.yml required with minimum metadata

**Intent:** Every project must have configuration with required fields.

**Checks:**
- `projects/{id}/project.yml` exists
- Required fields present: `id`, `name`, `status`

**Failure Message:**
```
project.yml is missing for project 'my-project'
project.yml is missing required field: 'status'
```

**Owner:** PO

---

## Product Rules (TS-PROD)

### TS-PROD-001: Product folder must be registered

**Intent:** Every product folder must be tracked in the products index.

**Checks:**
- Product folder exists under `products/`
- Product ID appears in `products/products-index.md`

**Failure Message:**
```
Product 'acme-webshop' is not registered in products-index.md
```

**Owner:** PO

---

### TS-PROD-002: product.yml required with PRX

**Intent:** Every product must have configuration with unique prefix.

**Checks:**
- `products/{id}/product.yml` exists
- Required fields present: `id`, `name`, `prefix` (PRX)
- PRX matches pattern: 3-4 uppercase characters

**Failure Message:**
```
product.yml is missing for product 'acme-webshop'
product.yml is missing required field: 'prefix'
PRX 'acme' does not match pattern [A-Z]{3,4}
```

**Owner:** PO

---

## Feature-Increment Rules (TS-FI)

### TS-FI-001: Feature-Increment must have AS-IS and TO-BE sections

**Intent:** FIs describe changes, requiring current and proposed state.

**Checks:**
- FI markdown contains `## AS-IS` or `## Current State` section
- FI markdown contains `## TO-BE` or `## Proposed State` section

**Failure Message:**
```
Feature-Increment 'fi-ACME-001-oauth.md' is missing AS-IS section
Feature-Increment 'fi-ACME-001-oauth.md' is missing TO-BE section
```

**Owner:** FA

---

### TS-FI-002: Feature-Increment must link to target Feature

**Intent:** FIs must reference which Product Feature they modify.

**Checks:**
- FI frontmatter or content references `f-PRX-NNN`
- Referenced Feature exists in Product Canon

**Failure Message:**
```
Feature-Increment 'fi-ACME-001' does not reference a target feature
Feature 'f-ACME-001' referenced by FI does not exist
```

**Owner:** FA

---

## Epic Rules (TS-EPIC)

### TS-EPIC-001: Epic file naming convention

**Intent:** Epics follow PRX naming pattern.

**Checks:**
- Epic filename matches `epic-{PRX}-{NNN}-{description}.md`

**Failure Message:**
```
Epic file 'EPIC-001-auth.md' does not match naming convention: epic-PRX-XXX-description.md
```

**Owner:** FA

---

## Story Rules (TS-STORY)

### TS-STORY-001: Story must link to Epic via filename

**Intent:** All stories must belong to an Epic.

**Checks:**
- Story filename matches `s-e{EEE}-{SSS}-{description}.md`
- Epic number in filename corresponds to existing Epic

**Failure Message:**
```
Story 'S-001-add-oauth.md' does not match naming convention: s-eXXX-YYY-description.md
Story 's-e999-001-test.md' references non-existent epic 999
```

**Owner:** FA

---

### TS-STORY-002: Story describes delta, not full behavior

**Intent:** Stories describe changes, not complete system behavior.

**Checks:**
- Story content contains delta language (adds, changes, removes, modifies)
- Story references Feature-Increment

**Failure Message:**
```
Story 's-e001-042' appears to describe full behavior instead of delta
```

**Severity:** Warning  
**Owner:** FA

---

## Naming Rules (TS-NAMING)

### TS-NAMING-FI: Feature-Increment file naming convention

**Intent:** FIs follow PRX naming pattern.

**Checks:**
- FI filename matches `fi-{PRX}-{NNN}-{description}.md`

**Failure Message:**
```
Feature-Increment file 'FI-001-oauth.md' does not match naming convention: fi-PRX-XXX-description.md
```

**Owner:** FA

---

### TS-NAMING-PRODUCT: Product folder naming convention

**Intent:** Product folders use lowercase with dashes.

**Checks:**
- Product folder name matches `[a-z][a-z0-9-]*`

**Failure Message:**
```
Product folder 'ACME_Webshop' does not match naming convention: lowercase-with-dashes
```

**Owner:** PO

---

## DoD Rules (TS-DOD)

### TS-DOD-001: Story must have all AC verified

**Intent:** Done stories have verified acceptance criteria.

**Checks:**
- Story in `done/` folder has AC section
- All AC items marked as verified

**Failure Message:**
```
Story 's-e001-042' in done/ has unverified acceptance criteria
```

**Owner:** FA  
**Verifier:** QA

---

### TS-DOD-003: Product sync after deployment

**Intent:** Canon must be synced after deployment.

**Checks:**
- If project has `deployment.deployed_date` set
- Then `deployment.canon_synced` must also be set

**Failure Message:**
```
Project deployed but Product Canon not synced. Run ts:po sync
```

**Severity:** Blocker  
**Owner:** PO

---

## QA Rules (TS-QA)

### TS-QA-001: Deployed Feature-Increment must have test coverage

**Intent:** All deployed FIs have corresponding test cases.

**Checks:**
- For each `fi-PRX-NNN` in deployed project
- Corresponding `tc-fi-PRX-NNN-*.md` exists

**Failure Message:**
```
Deployed FI 'fi-ACME-001' has no test coverage. Expected: tc-fi-ACME-001-*.md
```

**Severity:** Warning  
**Owner:** QA

---

### TS-QA-002: Deployment without regression confirmation

**Intent:** Deployments must confirm regression test status.

**Checks:**
- If project has `deployment.deployed_date` set
- Then `deployment.regression_confirmed` must be true

**Failure Message:**
```
Deployment without regression test confirmation. Add regression_confirmed: true to project.yml after verification
```

**Severity:** Warning  
**Owner:** QA

---

### TS-QA-003: Regression impact must be recorded for each FI

**Intent:** Every deployed FI needs explicit regression assessment.

**Checks:**
- For each `fi-PRX-NNN` in deployed project:
  - `ri-fi-PRX-NNN.md` MUST exist with valid `assessment` field
- If `assessment: update-required`:
  - `regression_tests` field must exist and be non-empty
  - Each listed `rt-f-*` file must exist in `products/{id}/qa/regression-tests/`
- If `assessment: no-impact`:
  - `rationale` field must exist and be non-empty

**Failure Messages:**
```
FI 'fi-ACME-001' has no regression impact record. Create ri-fi-ACME-001.md
ri-fi-ACME-001.md has assessment: update-required but no regression_tests listed
ri-fi-ACME-001.md lists rt-f-ACME-001-auth.md but file does not exist
ri-fi-ACME-001.md has assessment: no-impact but no rationale provided
```

**Severity:** Error (blocks deployment gate)  
**Owner:** QA

---

## Marker Vocabulary Rules (MV)

> Reference: [marker-vocabulary.md](marker-vocabulary.md)

### MV-001: artifact_kind present and valid

**Intent:** Every artifact must declare its type for LLM retrieval.

**Checks:**
- Frontmatter contains `artifact_kind` field
- Value is from controlled vocabulary (feature, fi, story, epic, etc.)

**Failure Message:**
```
Missing required frontmatter field: artifact_kind
Invalid artifact_kind: 'thing'. Must be one of: feature, fi, story, epic, ...
```

**Severity:** Error  
**Owner:** All roles

---

### MV-002: spec_version present

**Intent:** Artifacts must declare which spec version they follow.

**Checks:**
- Frontmatter contains `spec_version` field

**Failure Message:**
```
Missing required frontmatter field: spec_version
```

**Severity:** Error  
**Owner:** All roles

---

### MV-003: role_owner present and valid

**Intent:** Every artifact must declare its owning role.

**Checks:**
- Frontmatter contains `role_owner` field
- Value is valid role code (FA, BA, PO, SA, DEV, QA, SM, DES)

**Failure Message:**
```
Missing required frontmatter field: role_owner
Invalid role_owner: 'PM'. Must be one of: FA, BA, PO, SA, DEV, QA, SM, DES
```

**Severity:** Error  
**Owner:** All roles

---

### MV-004: keywords present

**Intent:** Artifacts should have keywords to aid LLM retrieval.

**Checks:**
- Frontmatter contains `keywords` field (array)

**Failure Message:**
```
Missing recommended frontmatter field: keywords (aids LLM retrieval)
```

**Severity:** Warning  
**Owner:** All roles

---

### MV-005: title present and valid length

**Intent:** Artifacts must have a human-readable title for display in teamspec_viewer.

**Checks:**
- Frontmatter contains `title` field (string)
- Title length is between 20 and 40 characters

**Failure Message:**
```
Missing required frontmatter field: title
Title "X" is too short (N chars). Must be 20-40 characters.
Title "X..." is too long (N chars). Must be 20-40 characters.
```

**Severity:** Error  
**Owner:** All roles

---

### MV-010: ## Purpose section exists

**Intent:** Every artifact should explain its purpose.

**Checks:**
- Document contains `## Purpose` or `## 1. Purpose` section

**Failure Message:**
```
Missing required section: ## Purpose
```

**Severity:** Error  
**Owner:** All roles

---

### MV-011: ## Links section exists

**Intent:** Artifacts should link to related documents.

**Checks:**
- Document contains `## Links` or `## Related` section

**Failure Message:**
```
Missing recommended section: ## Links
```

**Severity:** Warning  
**Owner:** All roles

---

## Severity Levels

| Level | Meaning | Effect |
|-------|---------|--------|
| **Blocker** | Cannot proceed | Blocks gate passage |
| **Error** | Must fix | Fails lint check |
| **Warning** | Should fix | Reported but doesn't fail |
| **Info** | Suggestion | Informational only |

---

## Running the Linter

```bash
# Lint entire workspace
ts:lint

# Lint specific project
ts:lint --project my-project

# Auto-fix fixable issues
ts:fix

# Check specific rule
ts:lint --rule TS-QA-003
```
