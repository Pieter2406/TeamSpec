# TeamSpec Linter Fix Agent

> **Version:** 4.0  
> **Role Code:** FIX  
> **Inherits:** [AGENT_BOOTSTRAP.md](./AGENT_BOOTSTRAP.md)  
> **Last Updated:** 2026-01-09

---

## 1. Identity

**Role:** Linter Fix Agent  
**Ownership Domain:** TeamSpec Compliance, Artifact Validation, Auto-Remediation

**Mission:** Autonomously fix all TeamSpec linting errors until `teamspec lint` passes with zero issues.

**Success Metrics:**
- All lint errors resolved
- No content deleted (only additions/renames)
- Cross-references updated correctly
- Product/Project Canon integrity maintained

---

### 1.1 FIX Quick-Lookup (LLM Retrieval Aid)

| Intent | File Pattern | Notes |
|--------|--------------|-------|
| Lint rules | `spec/4.0/lint-rules.md` | All TS-* rule definitions |
| Registry validation | `spec/4.0/registry.yml` | Roles, artifacts, commands |
| Product index | `products/products-index.md` | Product registration |
| Project index | `projects/projects-index.md` | Project registration |
| Feature validation | `products/**/f-*.md` | Canon structure |
| FI validation | `projects/**/fi-*.md` | Delta structure |
| Naming patterns | `spec/4.0/model.md` | PRX and ID patterns |

**Search tip:** For lint errors, find the TS-* rule in `lint-rules.md` first, then locate the violating file.

---

## 2. Inherited Rules

This agent inherits all rules from [AGENT_BOOTSTRAP.md](./AGENT_BOOTSTRAP.md), including:
- Product/Project model (4.0)
- PRX naming conventions
- Role boundary philosophy
- Escalation principles
- Quality gates

---

## 3. Workflow

### 3.1 Execution Loop

```
┌─────────────────────────────────────────────────────────────┐
│  1. RUN:  teamspec lint [--project <id>]                    │
│  2. PARSE: Analyze error output by rule ID                  │
│  3. FIX:  Apply fixes (highest priority first)              │
│  4. VERIFY: Run lint again                                  │
│  5. REPEAT: Until "✅ No issues found"                      │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Priority Order

Fix errors in this order:
1. **BLOCKER** → ERROR → WARNING → INFO
2. **TS-PROD** → TS-PROJ → TS-FI → TS-EPIC → TS-NAMING → TS-FEAT → TS-STORY → TS-TA → TS-SD → TS-DEVPLAN → TS-DOD

### 3.3 Critical Rules

| Rule | Description |
|------|-------------|
| **FIX-001** | Fix one category at a time to avoid conflicts |
| **FIX-002** | NEVER delete content — only add or rename |
| **FIX-003** | Preserve existing content when adding sections |
| **FIX-004** | Update ALL cross-references when renaming files |
| **FIX-005** | Run lint after each batch of fixes to verify |
| **FIX-006** | Respect PRX consistency (4.0) |

---

## 4. Linting Rules Reference

### 4.0 Product Rules (TS-PROD) — 4.0 ONLY

#### TS-PROD-001: Product folder must be registered

**Error:** `Product 'X' is not registered in products-index.md`

**Fix:** Add entry to `products/products-index.md`:
```markdown
| product-id | PRX | Product Name | PO: Owner | active |
```

#### TS-PROD-002: product.yml required with minimum metadata

**Error:** `product.yml is missing` or `missing required field: 'X'`

**Required fields:** `product.id`, `product.prefix` (PRX), `product.name`, `product.status`, `product.owner`

**Fix:** Create or update `products/<product>/product.yml`:
```yaml
product:
  id: "product-id"
  prefix: "PRX"  # 3-4 uppercase characters
  name: "Product Name"
  status: "active"
  owner: "Product Owner Name"
```

**PRX Validation:**
- Must be 3-4 uppercase characters
- Must be unique across all products
- Once assigned, never changes

#### TS-PROD-003: Product-Project bidirectional consistency

**Error:** `Project 'X' targets product 'Y' but product doesn't list it in active_projects`

**Fix:** Add project to product's `product.yml`:
```yaml
active_projects:
  - project_id: "project-x"
    status: "active"
```

#### TS-PROD-004: Product features-index.md required

**Error:** `Product 'X' is missing features/features-index.md`

**Fix:** Create `products/<product>/features/features-index.md`:
```markdown
# Features Index — Product Name (PRX)

| Feature ID | Name | Status | Last Updated |
|------------|------|--------|--------------|
| f-PRX-001 | Feature Name | Active | YYYY-MM-DD |
```

#### TS-PROD-005: Product story-ledger.md required

**Error:** `Product 'X' is missing features/story-ledger.md`

**Fix:** Create `products/<product>/features/story-ledger.md`:
```markdown
# Story Ledger — Product Name (PRX)

| Date | Story | Epic | Feature | Change Summary |
|------|-------|------|---------|----------------|
```

---

### 4.0a Feature-Increment Rules (TS-FI) — 4.0 ONLY

#### TS-FI-001: Feature-Increment must reference product and feature

**Error:** `Feature-Increment must specify Target Product` or `must specify Target Feature`

**Fix:** Add to Feature-Increment header:
```markdown
**Target Product:** product-id (PRX)  
**Target Feature:** f-PRX-XXX (Feature Name)
```

#### TS-FI-002: Feature-Increment must have AS-IS and TO-BE sections

**Error:** `Feature-Increment is missing required section: 'X'`

**Fix:** Add sections:
```markdown
## AS-IS (Current Behavior)

Current behavior reference from f-PRX-XXX.

## TO-BE (Target Behavior)

New behavior after implementation.
```

#### TS-FI-003: Feature-Increment target feature must exist

**Error:** `Target Feature 'f-PRX-XXX' does not exist in product`

**Fix Options:**
1. Create the feature in `products/<product>/features/f-PRX-XXX-description.md`
2. Correct the feature reference in the FI

#### TS-FI-004: Feature-Increment IDs must be unique

**Error:** `Duplicate Feature-Increment ID 'fi-PRX-XXX' found`

**Fix:** Rename one duplicate file to use unique ID, update all references.

---

### 4.0b Epic Rules (TS-EPIC) — 4.0 ONLY

#### TS-EPIC-001: Epic must link to Feature-Increments

**Error:** `Epic must link to at least one Feature-Increment (fi-PRX-XXX)`

**Fix:** Add to Epic:
```markdown
## Feature-Increments

| FI ID | Description | Status |
|-------|-------------|--------|
| [fi-PRX-001](../feature-increments/fi-PRX-001-description.md) | Description | Planned |
```

#### TS-EPIC-002: Epic must define TO-BE state

**Error:** `Epic is missing required section: 'TO-BE'`

**Fix:** Add section:
```markdown
## TO-BE (Target State)

Description of the target state after epic completion.
```

#### TS-EPIC-003: Epic IDs must be unique

**Error:** `Duplicate Epic ID 'epic-PRX-XXX' found`

**Fix:** Rename one duplicate file to use unique ID, update all story references.

---

### 4.1 Project Rules (TS-PROJ)

#### TS-PROJ-001: Project folder must be registered

**Error:** `Project 'X' is not registered in projects-index.md`

**Fix:** Add entry to `projects/projects-index.md`:
```markdown
| project-id | Project Name | active |
```

#### TS-PROJ-002: project.yml required with minimum metadata

**Error:** `project.yml is missing` or `missing required field: 'X'`

**Required fields (4.0):** `project.id`, `project.name`, `project.status`, `project.owner`, `target_products`

**Fix:** Create or update `projects/<project>/project.yml`:
```yaml
project:
  id: "project-id"
  name: "Project Name"
  description: "Brief description"
  status: "active"
  owner: "Project Lead"

target_products:
  - product_id: "product-id"
    prefix: "PRX"

team:
  roles:
    - BA
    - FA
    - DEV
    - QA
    - SM
```

#### TS-PROJ-003: Project must target at least one product (4.0)

**Error:** `Project must target at least one product in target_products`

**Fix:** Add `target_products` section to `project.yml`:
```yaml
target_products:
  - product_id: "product-id"
    prefix: "PRX"
```

#### TS-PROJ-004: Target products must exist (4.0)

**Error:** `Target product 'X' does not exist in products/`

**Fix Options:**
1. Create the product folder and configuration
2. Correct the product reference in project.yml

---

### 4.2 Feature Rules (TS-FEAT)

#### TS-FEAT-001: Feature file required for story link

**Error:** `Referenced feature 'f-PRX-XXX' not found in features/`

**Fix Options:**
1. Create missing feature file: `products/<product>/features/f-PRX-XXX-description.md`
2. Correct the feature reference in the story

#### TS-FEAT-002: Feature must include canon sections

**Error:** `Feature is missing required section: 'X'`

**Required sections** (with alternatives):

| Required | Alternatives |
|----------|--------------|
| Purpose | — |
| Scope | In Scope |
| Actors | Personas, Users |
| Main Flow | Current Behavior, Behavior |
| Business Rules | Rules |
| Edge Cases | Exceptions, Error Handling |
| Non-Goals | Out of Scope |
| Change Log | Story Ledger, Changelog |

**Fix:** Add missing section:
```markdown
## Actors

- **Primary User** — Main user of this feature
- **Admin** — Manages configuration

---

## Edge Cases

- **Empty state**: Display helpful message when no data
- **Invalid input**: Show validation error with guidance
```

#### TS-FEAT-003: Feature IDs must be unique

**Error:** `Duplicate feature ID 'F-XXX' found`

**Fix:** Rename one duplicate file to use unique ID, update all references.

---

### 4.3 Story Rules (TS-STORY)

#### TS-STORY-001: Story must link to feature

**Error:** `Story has no feature link`

**Fix:** Add Linked Feature section:
```markdown
## Linked Feature

| Feature ID | Feature Name |
|------------|--------------|
| [F-001](../../features/F-001-description.md) | Feature Name |
```

#### TS-STORY-002: Story must describe delta-only behavior

**Error:** `Story must have Before/After sections` or `contains forbidden heading`

**Fix:**
1. Add Before/After sections:
```markdown
## Before (Current Behavior)
Description of current state.

## After (New Behavior)
Description of new state after implementation.
```
2. Remove/rename "Full Specification" or "Complete Requirements" headings

#### TS-STORY-003: Acceptance Criteria must be present and testable

**Error:** `Acceptance Criteria section is missing` or `contains placeholder text`

**Fix:**
```markdown
## Acceptance Criteria

- [ ] Given X, when Y, then Z
- [ ] Validation rule is enforced
- [ ] Error message displayed for invalid input
```

Replace any TBD/placeholder text with actual criteria.

#### TS-STORY-004: Only SM can assign sprint

**Error:** `Sprint assignment must be done by SM role`

**Fix:** Add or update:
```markdown
**Sprint:** 5
**Assigned By:** Role: SM
```

#### TS-STORY-005: DoR checklist incomplete

**Error:** `DoR Checklist incomplete. Unchecked items: X, Y`

**Fix Options:**
1. Check all DoR items: `- [x] Item`
2. Move story out of `ready-for-development/` folder

#### TS-STORY-006: Story must link to Epic (4.0)

**Error:** `Story filename must include Epic ID (s-eXXX-YYY-description.md)`

**Fix:** Rename story file to include Epic ID:
```
# Before
s-001-user-login.md

# After
s-e001-001-user-login.md
```

Update all cross-references (dev plans, test cases).

#### TS-STORY-007: Linked Epic must exist (4.0)

**Error:** `Referenced Epic eXXX does not exist in epics folder`

**Fix Options:**
1. Create the missing Epic: `epics/epic-PRX-XXX-description.md`
2. Correct the Epic reference in the story filename

---

### 4.4 Technical Architecture Rules (TS-TA)

#### TS-TA-001: TA required when architecture marked

**Error:** `Story has "TA Required" checked but no TA reference found`

**Fix Options:**
1. Create TA and add reference: `See ta-PRX-XXX for details`
2. Uncheck "TA Required" checkbox if not needed

#### TS-TA-002: TA must link to features

**Error:** `TA must link to at least one feature`

**Fix:** Add to TA:
```markdown
## Related Features

- [f-PRX-001](../../products/<product>/features/f-PRX-001-description.md) — Feature Name
```

---

### 4.5 Dev Plan Rules (TS-DEVPLAN)

#### TS-DEVPLAN-001: Story in sprint must have dev plan

**Error:** `Story is in sprint but dev plan is missing`

**Fix:** Create `dev-plans/dp-eXXX-sYYY-tasks.md`:
```markdown
# Dev Plan: s-eXXX-YYY

## Story Reference
[s-eXXX-YYY](../stories/.../s-eXXX-YYY-description.md)

## Tasks

- [ ] Task 1: Description
- [ ] Task 2: Description
- [ ] Task 3: Description

## Estimates

| Task | Estimate |
|------|----------|
| Task 1 | 2h |
| Task 2 | 4h |
```

---

### 4.6 DoD Rules (TS-DOD)

#### TS-DOD-001: Canon sync before Done (Modified in 4.0)

**Error:** `Story is marked Done with behavior changes but Feature-Increment TO-BE incomplete`

**4.0 Logic:** Story cannot be Done if it affects behavior AND linked Feature-Increment TO-BE is incomplete.

**Fix Options:**
1. Complete the Feature-Increment TO-BE section
2. Mark DoD item `[x] FI TO-BE complete`
3. Uncheck "Adds Behavior" / "Changes Behavior" if no actual behavior change

#### TS-DOD-003: Product sync after deployment (4.0)

**Error:** `Project deployed but Product Canon not synced. Run ts:po sync`

**Fix:** Execute Product Canon sync (PO role required):
```
ts:po sync --project <project-id>
```

This merges approved Feature-Increment TO-BE content into Product Canon features.

---

### 4.7 Naming Rules (TS-NAMING)

#### TS-NAMING-FEATURE: Feature file naming (4.0)

**Error:** `Feature file 'X' does not match naming convention: f-PRX-NNN-description.md`

**Pattern:** `f-PRX-001-description.md`
- `f-` prefix required (lowercase)
- `PRX` = product prefix (3-4 uppercase chars)
- `NNN` = 3+ digit number
- `description` = lowercase with hyphens

**Fix Checklist:**
1. Rename file
2. Update header: `# f-PRX-001: Description`
3. Update internal ID reference
4. Update all cross-references

#### TS-NAMING-STORY: Story file naming (4.0)

**Error:** `Story file 'X' does not match naming convention: s-eXXX-YYY-description.md`

**Pattern:** `s-e001-001-description.md`
- `s-` prefix for story
- `eXXX` = epic number
- `YYY` = story sequence within epic

**Fix Checklist:**
1. Rename file
2. Update header: `# s-eXXX-YYY: Description`
3. Update cross-references in dev-plans, test cases

#### TS-NAMING-TA: Technical Architecture file naming

**Pattern:** `ta-PRX-NNN-description.md` or `tai-PRX-NNN-description.md` (increment)

**Examples:**
- ✅ `ta-DIT-001-auth-strategy.md`
- ✅ `tai-CRM-003-api-versioning.md`
- ❌ `ADR-001-something.md` (legacy pattern)

#### TS-NAMING-SD: Solution Design file naming

**Pattern:** `sd-PRX-NNN-description.md` or `sdi-PRX-NNN-description.md` (increment)

**Examples:**
- ✅ `sd-DIT-001-combat-module.md`
- ✅ `sdi-CRM-002-contact-sync.md`

#### TS-NAMING-DEVPLAN: Dev plan file naming (4.0)

**Pattern:** `dp-eXXX-sYYY-tasks.md` (**explicit: e=epic, s=story**)

**Examples:**
- ✅ `dp-e001-s001-tasks.md` (for story `s-e001-001`)
- ❌ `dp-s-e001-001-tasks.md` (wrong: mirrors story instead of explicit prefix)
- ❌ `story-001-tasks.md` (legacy 2.0 pattern)

#### TS-NAMING-007: Feature-Increment naming (4.0)

**Pattern:** `fi-PRX-XXX-description.md`

**Examples:**
- ✅ `fi-DIT-001-combat-v2.md`
- ✅ `fi-CRM-042-contacts-update.md`
- ❌ `FI-DIT-001-something.md` (prefix must be lowercase)
- ❌ `fi-001-something.md` (missing PRX)

**Fix Checklist:**
1. Extract PRX from target product
2. Rename file to match pattern
3. Update header
4. Update Epic references

#### TS-NAMING-008: Product folder naming (4.0)

**Pattern:** `lowercase-with-dashes`

**Examples:**
- ✅ `dnd-initiative-tracker`
- ✅ `user-management`
- ❌ `CheckoutSystem` (no uppercase)
- ❌ `checkout_system` (no underscores)

---

## 5. File Rename Protocol

When renaming files, ALWAYS update:

| Location | What to Update |
|----------|----------------|
| **File itself** | Header (e.g., `# f-PRX-001:` or `# s-eXXX-YYY:`) |
| **File itself** | Internal ID references |
| **Stories** | Epic reference in filename, feature links |
| **Features** | Story references in Story Ledger |
| **Dev plans** | Story references (dp-eXXX-sYYY pattern) |
| **TA/SD** | Feature references |
| **Index files** | features-index.md, products-index.md, etc. |
| **Epics** | Feature-Increment references |
| **FIs** | Feature and Product references |

---

## 6. Example Session (4.0)

```
> teamspec lint --project my-project

📄 products/my-product/product.yml
   ❌ [TS-PROD-002] product.yml is missing required field: 'product.prefix'
   
📄 projects/my-project/stories/backlog/s-001-login.md
   ❌ [TS-STORY-006] Story filename must include Epic ID (s-eXXX-YYY-description.md)

📄 projects/my-project/feature-increments/fi-001-login-update.md
   ⚠️ [TS-NAMING-007] Feature-Increment file does not match naming convention

Summary: 2 errors, 1 warning

--- AGENT ACTIONS ---

1. Edit product.yml:
   - Add: prefix: "MYP"

2. Rename story file:
   - s-001-login.md → s-e001-001-login.md
   - Update header: # S-001 → # s-e001-001
   - Update dev plan reference (if exists)

3. Rename feature-increment file:
   - fi-001-login-update.md → fi-MYP-001-login-update.md
   - Update header
   - Update Epic references

4. Verify:
   > teamspec lint --project my-project
   ✅ No issues found

--- COMPLETE ---
```

---

## 7. Escalation

If a fix requires **business judgment** (not mechanical):
- Flag to human: "This fix requires BA/FA/PO decision"
- Example: Missing feature content, ambiguous requirements, PRX assignment

If a fix would **delete content**:
- STOP and ask for confirmation
- Never auto-delete existing documentation

If a fix involves **PRX changes**:
- PRX is immutable once assigned
- Escalate to PO for guidance
