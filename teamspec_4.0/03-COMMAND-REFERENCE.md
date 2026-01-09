# 03 — Command Reference

> **Document:** TeamSpec 4.0 Command Inventory  
> **Status:** Planning  
> **Last Updated:** 2026-01-09

---

## 1. Command Change Summary

### 1.1 Overview

| Status | Count | Commands |
|--------|-------|----------|
| **NEW** | 7 | `ts:po *`, `ts:fa feature-increment`, `ts:sm deploy-checklist`, `ts:deploy`, `ts:migrate` |
| **ALTERED** | 7 | `ts:po project`, `ts:fa epic`, `ts:fa story`, `ts:fa slice`, `ts:status`, `ts:lint`, `ts:context` |
| **REMOVED** | 3 | `ts:ba feature`, `ts:fa sync`, `ts:ba link-product` (implicit in feature-increment) |
| **UNCHANGED** | 12 | `ts:dev *`, `ts:qa *`, `ts:sa adr`, `ts:ba decision`, etc. |

---

## 2. New Commands

### 2.1 Product Owner Commands (`ts:po`)

#### `ts:po product`

**Purpose:** Create a new product with proper structure.

**Owner:** PO

**Syntax:**
```
ts:po product [product-id]
```

**Flow:**
1. Prompt for product name (if not provided)
2. Generate product ID from name (slugified)
3. **Prompt for Product Prefix (PRX)** — 3-4 uppercase chars
4. Create product folder structure
5. Generate `product.yml` with metadata (including PRX)
6. Register in `products-index.md`
7. Create initial feature-index and story-ledger

**Output:**
```
products/{product-id}/              # e.g., dnd-initiative-tracker
├── product.yml                     # Contains id + prefix (e.g., DIT)
├── README.md
├── business-analysis/
│   └── README.md
├── features/
│   ├── features-index.md
│   └── story-ledger.md
├── solution-designs/
│   └── README.md
├── technical-architecture/
│   └── README.md
└── decisions/
    └── README.md
```

**Linter Rules Enforced:** TS-PROD-001, TS-PROD-002

---

#### `ts:po status`

**Purpose:** Display product status overview.

**Owner:** PO

**Syntax:**
```
ts:po status [product-id]
```

**Output:**
- Product metadata
- Feature count and status
- Active projects modifying this product
- Recent changes (from story-ledger)
- Pending deployments

---

#### `ts:po approve`

**Purpose:** Approve deployment readiness for a project.

**Owner:** PO

**Syntax:**
```
ts:po approve <project-id>
```

**Prerequisites:**
- All stories in project Done
- QA sign-off complete
- Deployment checklist complete (from SM)

**Output:**
- Approval record in project
- Unlocks `ts:po sync` for this project

---

#### `ts:po sync`

**Purpose:** Synchronize project changes to Product Canon.

**Owner:** PO

**Syntax:**
```
ts:po sync <project-id> [--product <product-id>]
```

**Prerequisites:**
- `ts:po approve` executed
- Deployment verified in production

**Flow:**
1. Load project's feature-increments
2. For each FI:
   a. Load target product feature
   b. Apply TO-BE changes
   c. Add Change Log entry referencing project/stories
3. Update product story-ledger.md
4. Remove project from product's active_projects
5. Mark project feature-increments as "synced"

**Output:**
- Updated Product Feature files
- Updated story-ledger.md
- Sync confirmation report

**Linter Rules Enforced:** TS-DOD-003

---

#### `ts:po deprecate`

**Purpose:** Mark a product as deprecated.

**Owner:** PO

**Syntax:**
```
ts:po deprecate <product-id> --reason <reason>
```

**Flow:**
1. Update product.yml status to "deprecated"
2. Add deprecation notice to README
3. Log decision in product decisions folder

---

### 2.2 Functional Analyst Commands (New)

#### `ts:fa feature-increment`

**Purpose:** Create a Feature-Increment proposing changes to a product feature.

**Owner:** FA

**Syntax:**
```
ts:fa feature-increment <product-id> <feature-id>
```

**Flow:**
1. Verify product exists (TS-PROD-001)
2. Get product PRX from product.yml
3. Verify feature exists in product (f-PRX-XXX)
4. Generate next fi-PRX-XXX ID
5. Create FI file with:
   - Product reference (with PRX)
   - Feature reference (f-PRX-XXX)
   - AS-IS (auto-populated from product feature)
   - TO-BE (empty, to be filled)
6. Register in increments-index.md

**Output:**
```
projects/{project-id}/feature-increments/fi-PRX-XXX-{name}.md
```

**Example:**
```
ts:fa feature-increment dnd-initiative-tracker f-DIT-001-combat
# Creates: fi-DIT-001-combat-v2.md
```

**Linter Rules Enforced:** TS-FI-001, TS-FI-002

**Implicit Product Linking:**
When creating a feature-increment, the command automatically:
1. Links project to product in `project.yml` (if not already linked)
2. Adds project to product's `active_projects` list
3. No separate `ts:ba link-product` command needed

---

### 2.3 Scrum Master Commands (New)

#### `ts:sm deploy-checklist`

**Purpose:** Generate and track deployment checklist.

**Owner:** SM

**Syntax:**
```
ts:sm deploy-checklist [--sprint <sprint-id>]
```

**Flow:**
1. Gather completed stories from current/specified sprint
2. Identify affected feature-increments
3. Generate deployment checklist
4. Track completion status

**Output:**
- Deployment checklist document
- Status tracking file

---

### 2.4 Universal Commands (New)

#### `ts:deploy`

**Purpose:** Execute deployment workflow.

**Owner:** Any (with appropriate permissions)

**Syntax:**
```
ts:deploy <project-id> [--dry-run]
```

**Flow:**
1. Verify `ts:po approve` complete
2. Execute deployment checklist verification
3. Confirm deployment to production
4. Trigger `ts:po sync`

**Alias for:**
```
ts:sm deploy-checklist --verify && ts:po sync <project-id>
```

---

#### `ts:migrate`

**Purpose:** Migrate TeamSpec 2.0 workspace to 4.0.

**Owner:** Any

**Syntax:**
```
ts:migrate [--dry-run] [--fix]
```

**Flow:**
See [07-MIGRATION-GUIDE.md](./07-MIGRATION-GUIDE.md)

---

## 3. Altered Commands

### 3.1 `ts:po project` (Altered)

**Change:** Now requires target product(s).

**2.0 Behavior:**
- Creates standalone project
- No product reference required

**4.0 Behavior:**
- Must specify at least one target product
- Updates product.yml with project reference
- Creates project.yml with target_products section

**New Required Input:**
- Target product ID(s)

**New Flow Steps:**
- Step 2.5: Verify target product exists
- Step 5.5: Update product.yml active_projects

---

### 3.2 `ts:fa epic` (Altered)

**Change:** Epics are now mandatory increment containers with PRX in filename.

**2.0 Behavior:**
- Optional story grouping
- Loose feature association
- Filename: `EPIC-XXX-*.md`

**4.0 Behavior:**
- Required container for stories
- Must link to feature-increments (fi-PRX-XXX)
- Defines coherent TO-BE increment
- **Filename: `epic-PRX-XXX-*.md`** (lowercase with PRX)

**New Required Fields:**
- Linked feature-increments (fi-PRX-XXX references)
- TO-BE state description
- Impact on products

**Example:**
```
ts:fa epic dnd-initiative-tracker "Combat Redesign"
# Creates: epic-DIT-001-combat-redesign.md
```

---

### 3.3 `ts:fa story` (Altered)

**Change:** Stories must link to Epic via filename, not just content.

**2.0 Behavior:**
- Must link to Feature (F-XXX) in content
- Before/After delta format
- Filename: `S-XXX-*.md`

**4.0 Behavior:**
- **Epic ID embedded in filename** (`s-eXXX-YYY-*.md`)
- May optionally reference Feature-Increments (fi-PRX-XXX) in content
- May optionally reference Product Features (f-PRX-XXX) — metadata only
- Before/After delta format (unchanged)

**Filename Pattern:** `s-eXXX-YYY-description.md`
- `eXXX` = Epic number (e.g., `e001`)
- `YYY` = Story sequence within epic (e.g., `001`)

**Example:**
```
ts:fa story epic-DIT-001-combat "Add Initiative Button"
# Creates: s-e001-001-add-initiative-button.md
```

**Validation:**
- Fail if Epic doesn't exist
- Warn if no FI reference in content

---

### 3.4 `ts:fa slice` (Altered)

**Change:** Now slices Epics into stories with embedded Epic IDs.

**2.0 Behavior:**
- Slice feature into stories (S-XXX-*.md)

**4.0 Behavior:**
- Slice Epic into stories (s-eXXX-YYY-*.md)
- Each story filename includes parent Epic number
- Stories reference Epic's feature-increments in content

**New Syntax:**
```
ts:fa slice <epic-id>
```

**Example:**
```
ts:fa slice epic-DIT-001-combat
# Creates: s-e001-001-*.md, s-e001-002-*.md, s-e001-003-*.md
```

---

### 3.5 `ts:status` (Altered)

**Change:** Now shows products and projects.

**2.0 Output:**
- Project overview
- Feature status
- Sprint status

**4.0 Output:**
- **Product overview** (if products exist)
- Project overview with product links
- Feature-Increment status
- Sprint status
- Deployment status

---

### 3.6 `ts:lint` (Altered)

**Change:** New rule categories for products.

**2.0 Rules:**
- TS-PROJ-*, TS-FEAT-*, TS-STORY-*, TS-ADR-*, etc.

**4.0 Rules:**
- **TS-PROD-*** (new product rules)
- **TS-FI-*** (new feature-increment rules)
- **TS-EPIC-*** (enhanced epic rules)
- Updated TS-STORY-* (Epic linking)
- Updated TS-PROJ-* (product targeting)

---

### 3.7 `ts:context show` / `ts:context validate` (Altered)

**Change:** Now includes product context.

**4.0 Output:**
- Team context (unchanged)
- Product registry
- Product-project mappings
- Version indicator (4.0)

---

## 4. Removed Commands

### 4.1 `ts:ba feature` (Removed)

**Reason:** Features now belong to Products, not Projects.

**Replacement:**
| Use Case | New Command |
|----------|-------------|
| Create product feature | `ts:po product` (initial) + manual edit |
| Propose feature change | `ts:fa feature-increment` |
| Create new capability | `ts:fa feature-increment` with "New Feature" type |

**Migration:**
- Existing features in projects are migrated to products
- New features for greenfield products created by PO

---

### 4.2 `ts:fa sync` (Removed)

**Reason:** Canon synchronization is now part of the deployment workflow, owned by PO.

**Replacement:**
| Use Case | New Command |
|----------|-------------|
| Sync Canon after deployment | `ts:po sync` (PO executes after production deployment) |
| Prepare deployment | `ts:sm deploy-checklist` |
| Approve deployment | `ts:po approve` |

**Rationale:**
- Canon sync is a **product-level** decision, not a project task
- Sync only happens **after deployment to production** is verified
- PO owns the Product Canon, so PO executes the sync

---

### 4.3 `ts:ba link-product` (Removed)

**Reason:** Product linking is implicit when creating feature-increments.

**Replacement:**
- Product linking happens automatically when running `ts:fa feature-increment`
- No explicit linking command needed

---

## 5. Unchanged Commands

| Command | Owner | Purpose |
|---------|-------|---------|
| `ts:dev plan` | DEV | Create dev plan for story (dp-eXXX-sYYY-*.md) |
| `ts:dev implement` | DEV | Execute implementation |
| `ts:dev ready` | DEV | Move story to ready-to-develop |
| `ts:qa test` | QA | Design test cases |
| `ts:qa dor-check` | QA | Validate Definition of Ready |
| `ts:qa dod-check` | QA | Validate Definition of Done |
| `ts:sa adr` | SA | Create ADR (ta-PRX-XXX or tai-PRX-XXX) |
| `ts:ba decision` | BA | Log project decision (dec-XXX-*.md) |
| `ts:sm sprint create` | SM | Create new sprint |
| `ts:sm sprint plan` | SM | Plan sprint backlog |
| `ts:sm sprint close` | SM | Close sprint with metrics |
| `ts:agent <role>` | Any | Load role-specific agent |

---

## 6. Command Relationships Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          PRODUCT LIFECYCLE                              │
│                                                                         │
│  ts:po product ──→ Product Created ──→ ts:po status                    │
│        │                                    │                           │
│        └───────────────┬────────────────────┘                           │
│                        ▼                                                │
│              Product Ready for Projects                                 │
└─────────────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          PROJECT LIFECYCLE                              │
│                                                                         │
│  ts:po project ──────→ Project Created (with product link)             │
│        │                                                                │
│        ▼                                                                │
│  ts:fa feature-increment ──→ fi-PRX-XXX Created (auto-links product)   │
│        │                                                                │
│        ▼                                                                │
│  ts:fa epic ────────────→ epic-PRX-XXX Created (links to FIs)        │
│        │                                                                │
│        ▼                                                                │
│  ts:fa slice ─────────────→ s-eXXX-YYY-*.md Created (link to Epic)     │
│        │                                                                │
│        ├──→ ts:fa story    (create individual stories)                 │
│        │                                                                │
│        ▼                                                                │
│  ts:dev plan ─────────────→ dp-eXXX-sYYY-*.md Created                   │
│        │                                                                │
│        ▼                                                                │
│  ts:sm sprint plan ───────→ Stories in Sprint                          │
│        │                                                                │
│        ▼                                                                │
│  [Development & Testing]                                                │
│        │                                                                │
│        ▼                                                                │
│  ts:sm sprint close ──────→ Sprint Complete                            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         DEPLOYMENT LIFECYCLE                            │
│                                                                         │
│  ts:sm deploy-checklist ──→ Deployment Checklist Generated             │
│        │                                                                │
│        ▼                                                                │
│  ts:po approve ──────────→ Deployment Approved                         │
│        │                                                                │
│        ▼                                                                │
│  [Deploy to Production]                                                 │
│        │                                                                │
│        ▼                                                                │
│  ts:deploy ──────────────→ ts:po sync ──→ Product Canon Updated        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Command Quick Reference

### 7.1 By Role

| Role | Commands | Output Pattern |
|------|----------|----------------|
| **PO** | `ts:po product`, `ts:po project`, `ts:po status`, `ts:po approve`, `ts:po sync`, `ts:po deprecate` | Products with PRX |
| **BA** | `ts:ba ba-increment`, `ts:ba decision` | `bai-PRX-XXX` |
| **FA** | `ts:fa feature-increment`, `ts:fa epic`, `ts:fa story`, `ts:fa slice`, `ts:fa storymap` | `fi-PRX-XXX`, `epic-PRX-XXX`, `s-eXXX-YYY-*.md` |
| **SA** | `ts:sa adr` | `ta-PRX-XXX`, `tai-PRX-XXX` |
| **DEV** | `ts:dev plan`, `ts:dev implement`, `ts:dev ready` | `dp-eXXX-sYYY-*.md` |
| **QA** | `ts:qa test`, `ts:qa dor-check`, `ts:qa dod-check` | Test cases |
| **SM** | `ts:sm sprint create`, `ts:sm sprint plan`, `ts:sm sprint close`, `ts:sm deploy-checklist` | Sprint folders |
| **Any** | `ts:status`, `ts:lint`, `ts:context`, `ts:agent`, `ts:deploy`, `ts:migrate` | Reports |

### 7.2 By Lifecycle Phase

| Phase | Commands |
|-------|----------|
| **Product Setup** | `ts:po product` |
| **Project Setup** | `ts:po project` |
| **Planning** | `ts:fa feature-increment`, `ts:ba epic`, `ts:fa slice` |
| **Refinement** | `ts:fa story`, `ts:dev plan`, `ts:qa test` |
| **Execution** | `ts:sm sprint plan`, `ts:dev implement` |
| **Completion** | `ts:sm sprint close` |
| **Deployment** | `ts:sm deploy-checklist`, `ts:po approve`, `ts:deploy`, `ts:po sync` |
