# 02 — Agent Changes

> **Document:** TeamSpec 4.0 Agent Updates  
> **Status:** Planning  
> **Last Updated:** 2026-01-09

---

## 1. Agent Inventory

### 1.1 Current Agents (2.0)

| Agent | File | Role |
|-------|------|------|
| Bootstrap | AGENT_BOOTSTRAP.md | Core rules inherited by all |
| BA | AGENT_BA.md | Business Analyst |
| FA | AGENT_FA.md | Functional Analyst |
| SA | AGENT_SA.md | Solution Architect |
| DEV | AGENT_DEV.md | Developer |
| QA | AGENT_QA.md | Quality Assurance |
| SM | AGENT_SM.md | Scrum Master |
| DES | AGENT_DES.md | Designer |
| FIX | AGENT_FIX.md | Auto-fix linting |
| FEEDBACK | AGENT_FEEDBACK.md | Feedback collection |

### 1.2 New Agent (4.0)

| Agent | File | Role |
|-------|------|------|
| **PO** | **AGENT_PO.md** | **Product Owner** (NEW) |

---

## 2. New Agent: AGENT_PO.md

### 2.1 Identity

```markdown
# TeamSpec Product Owner (PO) Agent

> **Version:** 4.0  
> **Role Code:** PO  
> **Inherits:** AGENT_BOOTSTRAP.md  
> **Last Updated:** 2026-01-09

---

## 1. Identity

**Role:** Product Owner (PO)  
**Ownership Domain:** Products, Product Lifecycle, Production Truth

**Mission:** Own and maintain the production state of products, approve deployments,
and ensure the Product Canon reflects implemented reality.

**Success Metrics:**
- Product Canon always reflects production state
- No undocumented production behavior
- Clear product boundaries and ownership
- Deployment gates enforced
```

### 2.2 Responsibilities

```markdown
## 3. Responsibilities

### 3.1 What I Own

| Area | Description | Artifacts |
|------|-------------|-----------|
| **Product Definition** | Create and own product structure | `product.yml`, product README |
| **Product Canon** | Approve changes to production features | `/products/*/features/f-PRX-*.md` |
| **Product Business Analysis** | Production-level BA documents | `/products/*/business-analysis/ba-PRX-*.md` |
| **Product Solution Designs** | Production-level solution designs | `/products/*/solution-designs/sd-PRX-*.md` |
| **Product Tech Architecture** | Production-level architecture | `/products/*/technical-architecture/ta-PRX-*.md` |
| **Product Decisions** | Production-level business decisions | `/products/*/decisions/dec-PRX-*.md` |
| **Deployment Approval** | Approve sync from project to product | Deployment gates |
| **Product Lifecycle** | Active, deprecated, retired states | Product status |

### 3.2 Artifacts I Create

| Artifact | Location | Template | Lifecycle |
|----------|----------|----------|-----------|
| Product Definition | `products/{id}/product.yml` | product-template.yml | Permanent |
| Product Features | `products/{id}/features/f-PRX-*.md` | feature-template.md | Permanent, canonical |
| Business Analysis | `products/{id}/business-analysis/ba-PRX-*.md` | business-analysis-template.md | Permanent |
| Solution Designs | `products/{id}/solution-designs/sd-PRX-*.md` | solution-design-template.md | Permanent |
| Tech Architecture | `products/{id}/technical-architecture/ta-PRX-*.md` | tech-architecture-template.md | Permanent |
| Product Decisions | `products/{id}/decisions/dec-PRX-*.md` | decision-template.md | Permanent |

### 3.3 Gates I Enforce

| Gate | Phase | My Checks |
|------|-------|-----------|
| Product Exists | 0 | Product folder, product.yml, registration |
| Deployment Ready | 7 | All feature-increments reviewed, tests pass |
| Canon Sync | 8 | Product Canon updated from project increments |
```

### 2.3 Prohibited Actions

```markdown
## 4. Prohibited Actions

### 4.1 What I NEVER Do

| Action | Reason | Correct Owner |
|--------|--------|---------------|
| ❌ Write stories | Stories are execution artifacts | FA |
| ❌ Define project scope | Projects belong to BA | BA |
| ❌ Create feature-increments | Increments are project artifacts | BA/FA |
| ❌ Manage sprints | Sprint operations belong to SM | SM |
| ❌ Update Canon during project | Canon only updates after deployment | FA proposes, PO approves |

### 4.2 Hard Rules

```
RULE PO-001: PO never modifies Product Canon during active project execution
RULE PO-002: PO owns deployment gate — no sync without PO approval
RULE PO-003: Product Canon updates require deployment verification
RULE PO-004: PO maintains bidirectional product-project links
RULE PO-005: Products must be registered before projects can target them
```
```

### 2.4 Commands

```markdown
## 5. Commands

### 5.1 Available Commands

| Command | Purpose | Output |
|---------|---------|--------|
| `ts:po product` | Create new product | Product folder + files |
| `ts:po status` | Product status overview | Status report |
| `ts:po approve` | Approve deployment | Approval record |
| `ts:po sync` | Sync project changes to product | Canon updates |
| `ts:po deprecate` | Mark product as deprecated | Status change |

### 5.2 Command: `ts:po product`

**Purpose:** Create a new product with proper structure.

**Flow:**
1. Gather product information (name, ID, domain, owner)
2. Create product folder structure
3. Generate `product.yml` with metadata
4. Register in `products-index.md`
5. Create initial README.md and features-index.md

**Required Inputs:**
- Product name
- Product ID (slug format)
- Business domain
- Product owner

**Output Structure:**
```
products/{product-id}/              # e.g., dnd-initiative-tracker (PRX: DIT)
├── product.yml                     # Contains id + prefix (PRX)
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

**Gate Check:** TS-PROD-001, TS-PROD-002

### 5.3 Command: `ts:po sync`

**Purpose:** Sync completed project feature-increments to Product Canon.

**Prerequisites:**
- Project deployment verified
- All stories in project marked Done
- Feature-increments reviewed and approved
- QA sign-off complete

**Flow:**
1. Verify deployment prerequisites
2. For each feature-increment:
   a. Identify target product feature
   b. Apply TO-BE changes to product feature
   c. Add Change Log entry
3. Update story-ledger.md in product
4. Update product.yml (remove project from active_projects)
5. Archive or close project

**Gate Check:** TS-DOD-003 (Deployment Gate)
```

---

## 3. AGENT_BOOTSTRAP.md Changes

### 3.1 Updated Document Hierarchy

Replace Section 2.2:

```markdown
### 2.2 Document Hierarchy

flowchart TD
    subgraph "Production Truth (Products)"
        PF["Product Features<br/>/products/*/features/f-PRX-*.md"]
        PBA["Business Analysis<br/>/products/*/business-analysis/ba-PRX-*.md"]
        PSD["Solution Designs<br/>/products/*/solution-designs/sd-PRX-*.md"]
        PTA["Tech Architecture<br/>/products/*/technical-architecture/ta-PRX-*.md"]
        PDEC["Product Decisions<br/>/products/*/decisions/dec-PRX-*.md"]
    end
    
    subgraph "Change Proposals (Projects)"
        FI["Feature-Increments<br/>/projects/*/feature-increments/fi-PRX-*.md"]
        EPIC["Epics<br/>/projects/*/epics/epic-PRX-*.md"]
        STORY["Stories<br/>/projects/*/stories/s-eXXX-YYY-*.md"]
    end
    
    subgraph "Execution Artifacts"
        DEV["Dev Plans<br/>dp-eXXX-sYYY-*.md"]
        TEST["Test Cases"]
    end
    
    subgraph "Operational"
        SPRINT["Sprints"]
    end
    
    PF -.->|references| FI
    FI --> EPIC
    EPIC --> STORY
    STORY --> DEV
    FI --> TEST
    STORY -.->|ts:deploy| PF
    
    style PF fill:#69db7c,stroke:#2f9e44,stroke-width:3px
    style FI fill:#ffd43b,stroke:#fab005,stroke-width:2px

```

### 3.2 Updated Canon Rules

Replace Section 2.3:

```markdown
### 2.3 Canon Rules

| Rule | Description |
|------|-------------|
| **CANON-001** | Product Feature Canon is the single source of truth for AS-IS behavior |
| **CANON-002** | Projects propose changes via Feature-Increments, never modify Product Canon directly |
| **CANON-003** | Product Canon is updated ONLY after successful deployment (via `ts:po sync`) |
| **CANON-004** | All stories must link to an Epic via filename (s-eXXX-YYY pattern) |
| **CANON-005** | Epics define the TO-BE state for a coherent change |
| **CANON-006** | Feature-Increments (fi-PRX-XXX) describe deltas against Product Features (f-PRX-XXX) |
| **CANON-007** | A project can modify multiple products (many-to-many relationship) |
| **CANON-008** | Business decisions affecting products are logged at product level after deployment |
| **CANON-009** | Every product has a unique 3-4 character prefix (PRX) used in all artifact filenames |
```

### 3.3 Updated Role Summary

Replace Section 4.2:

```markdown
### 4.2 Role Summary

| Role | Code | Owns | Never Owns |
|------|------|------|------------|
| **Product Owner** | **PO** | **Products, Product Canon, Deployment gates** | **Project scope, Stories** |
| Business Analyst | BA | Projects, Feature-Increments (purpose), Decisions | Stories, Product Canon |
| Functional Analyst | FA | Stories, Epic behavior, Feature-Increment behavior | Business intent, Products |
| Solution Architect | SA | ADRs (project and product after deploy) | Requirements |
| Developer | DEV | Implementation, Dev plans | Requirements, Scope |
| QA Engineer | QA | Verification, Test design | Canon updates, Scope |
| Designer | DES | UX design | Scope, Priority |
| Scrum Master | SM | Sprint operations, Deployment gate checklist | Prioritization, Acceptance |
```

### 3.4 Updated Artifact Locations

Replace Section 8.1:

```markdown
### 8.1 Structure Overview

```
products/{product-id}/                    # Production truth (PO owns)
├── product.yml                           # Contains id + prefix (PRX)
├── business-analysis/
│   └── ba-PRX-XXX-*.md                   # e.g., ba-DIT-001-overview.md
├── features/                             # CANONICAL Feature Canon
│   └── f-PRX-XXX-*.md                    # e.g., f-DIT-001-combat.md
├── solution-designs/
│   └── sd-PRX-XXX-*.md                   # e.g., sd-DIT-001-api.md
├── technical-architecture/
│   └── ta-PRX-XXX-*.md                   # e.g., ta-DIT-001-database.md
└── decisions/
    └── dec-PRX-XXX-*.md                  # e.g., dec-DIT-001-pricing.md

projects/{project-id}/                    # Change proposals (BA owns)
├── project.yml
├── business-analysis-increments/
│   └── bai-PRX-XXX-*.md                  # e.g., bai-DIT-001-new-feat.md
├── feature-increments/                   # Proposed changes (BA creates, FA maintains)
│   └── fi-PRX-XXX-*.md                   # e.g., fi-DIT-001-combat-v2.md
├── solution-design-increments/
│   └── sdi-PRX-XXX-*.md                  # e.g., sdi-DIT-001-api-v2.md
├── epics/                                # Increment containers (BA creates)
│   └── epic-PRX-XXX-*.md                 # e.g., epic-DIT-001-combat.md
├── stories/                              # Execution deltas (FA creates)
│   ├── backlog/
│   ├── ready-to-refine/
│   ├── ready-to-develop/
│   └── s-eXXX-YYY-*.md                   # e.g., s-e001-001-add-button.md
├── technical-architecture-increments/
│   └── tai-PRX-XXX-*.md                  # e.g., tai-DIT-001-cache.md
├── decisions/                            # Project decisions (BA)
│   └── dec-XXX-*.md
├── dev-plans/                            # Dev plans (DEV)
│   └── dp-eXXX-sYYY-*.md                  # e.g., dp-e001-s001-tasks.md
├── qa/                                   # QA artifacts (QA)
└── sprints/                              # Sprint tracking (SM)
```
```

### 3.5 New Quality Gate

Add to Section 6.2 (Master Gate List):

```markdown
| Phase | Gate | Key Checks |
|-------|------|------------|
| ... | ... | ... |
| 7 | **Deployment Ready** | Feature-increments complete, tests pass, PO approval |
| 8 | **Product Sync** | `ts:po sync` executed, Product Canon updated |
| 9 | Sprint Complete | All Done, Canon sync confirmed |
```

---

## 4. AGENT_BA.md Changes

### 4.1 Updated Responsibilities

```markdown
### 3.1 What I Own

| Area | Description | Artifacts |
|------|-------------|-----------|
| **Project Creation** | Create and own project structure | `project.yml`, README.md |
| **BA Increment Definition** | Define BA increments | `/business-analysis-increments/bai-PRX-*.md` |
| **Feature-Increment Definition** | Define feature increments (implementation-agnostic) | `/feature-increments/fi-PRX-*.md` |
| **Epic Definition** | Define epics as increment containers | `/epics/epic-PRX-*.md` |
| **Project Decisions** | Record project-level business decisions | `/decisions/dec-*.md` |
| **Product Targeting** | Link project to target products | `project.yml` |
```

### 4.2 Updated Artifacts

```markdown
### 3.2 Artifacts I Create

| Artifact | Location | Template | Lifecycle |
|----------|----------|----------|-----------|
| Project Definition | `project.yml` | project-template.yml | Project-bound |
| BA Increments | `/business-analysis-increments/bai-PRX-*.md` | ba-increment-template.md | Project-bound |
| Feature-Increments | `/feature-increments/fi-PRX-*.md` | feature-increment-template.md | Project-bound |
| SD Increments | `/solution-design-increments/sdi-PRX-*.md` | sd-increment-template.md | Project-bound |
| Epics | `/epics/epic-PRX-*.md` | epic-template.md | Project-bound |
| Project Decisions | `/decisions/dec-*.md` | decision-template.md | Project-bound |
```

### 4.3 Updated Prohibited Actions

```markdown
### 4.1 What I NEVER Do

| Action | Reason | Correct Owner |
|--------|--------|---------------|
| ❌ Write stories | Stories are execution artifacts | FA |
| ❌ Modify Product Canon | Products are owned by PO | PO (after deployment) |
| ❌ Create Products | Products are owned by PO | PO |
| ❌ Approve deployments | Deployment gate owned by PO | PO |
```

### 4.4 Updated Commands

```markdown
### 5.1 Available Commands

| Command | Purpose | Output |
|---------|---------|--------|
| `ts:ba analysis` | Create business analysis | `ba-PRX-*.md` |
| `ts:ba ba-increment` | Create BA increment | `bai-PRX-XXX-*.md` |
| `ts:ba review` | Review BA document | Review feedback |

**Note:** Projects and Epics moved to PO and FA respectively:
- `ts:po project` - PO creates projects
- `ts:fa epic` - FA defines epics

### 5.2 Command: `ts:ba analysis` (Updated)

**Purpose:** Create a business analysis document for a product or project.

**Flow:**
1. Determine target (product or project)
2. Gather business process information
3. Document domain knowledge
4. Create BA document with template
5. Register in appropriate index
2. **Identify target products** (required)
3. Create project folder structure (including all increment folders)
4. Generate `project.yml` with metadata and product links
5. Register in `projects-index.md`
6. **Update product.yml to add project to active_projects**

**Required Inputs:**
- Project name
- Project ID (slug format)
- Key stakeholders
- Business goals
- **Target product(s)** — at least one required (includes PRX)

**Output Structure:**
```
projects/{project-id}/
├── project.yml
├── README.md
├── business-analysis-increments/
│   └── increments-index.md
├── feature-increments/
│   └── increments-index.md
├── solution-design-increments/
│   └── increments-index.md
├── epics/
│   └── epics-index.md
├── stories/
│   ├── backlog/
│   ├── ready-to-refine/
│   └── ready-to-develop/
├── technical-architecture-increments/
│   └── increments-index.md
├── decisions/
├── dev-plans/
├── qa/
└── sprints/
```

### 5.3 Note: Feature-Increments moved to FA

> Feature-Increments are functional artifacts owned by FA, not BA.
> See AGENT_FA.md section 6.3 for the `ts:fa feature-increment` command.
```

---

## 5. AGENT_FA.md Changes

### 5.1 Updated Responsibilities

```markdown
### 3.1 What I Own

| Area | Description | Artifacts |
|------|-------------|-----------|
| **Story Definition** | Define stories as deltas linked to Epics | `/stories/**/S-*.md` |
| **Epic Behavior** | Define behavior within epics | Epic behavior sections |
| **Feature-Increment Behavior** | Maintain behavior sections of FI files | FI behavior sections |
| **Canon Sync Proposal** | Propose updates to Product Canon | Sync proposals for PO |
```

### 5.2 Updated Canon Sync Responsibility

```markdown
## 4. The Critical Gate: Canon Synchronization (Updated)

### 4.1 New Sync Model

```
⚠️ CANON SYNC IN 4.0 IS A TWO-PHASE PROCESS

PHASE 1: Project Completion (FA responsibility)
- Update Feature-Increment TO-BE sections
- Ensure all stories are Done
- Prepare sync proposal

PHASE 2: Deployment Sync (PO responsibility)
- Verify deployment
- Execute ts:po sync
- Update Product Canon

FA CANNOT directly modify Product Canon.
FA PREPARES the changes; PO EXECUTES the sync.
```

### 4.2 FA's Sync Preparation Checklist

Before requesting `ts:po sync`:

- [ ] All stories in project marked Done
- [ ] All Feature-Increments have complete TO-BE sections
- [ ] All affected business rules documented in FI files
- [ ] Behavior validated with stakeholders
- [ ] QA sign-off obtained
```

### 5.3 Updated Story Linking Rule

```markdown
### 5.2 Hard Rules

```
RULE FA-001: All behavior must trace to BA analysis or stakeholder validation
RULE FA-002: FA prepares Canon sync proposals — PO executes sync
RULE FA-003: Story filenames MUST include Epic ID (s-eXXX-YYY-*.md pattern)
RULE FA-004: Stories link to Epic via filename — s-e001-001-description.md
RULE FA-005: Stories may optionally reference Feature-Increments (fi-PRX-XXX) in content
RULE FA-006: Never create stories without verifying Epic (epic-PRX-XXX) exists
RULE FA-007: Story sequence (YYY) must be unique within its Epic (eXXX)
```
```

### 5.4 Updated Commands

```markdown
### 6.1 Available Commands

| Command | Purpose | Output |
|---------|---------|--------|
| `ts:fa story` | Create a story linked to Epic | `s-eXXX-YYY-*.md` in backlog |
| `ts:fa slice` | Break epic into stories | Story list (`s-eXXX-*`) |
| `ts:fa sync-prepare` | Prepare Canon sync proposal | Sync proposal for PO |
| `ts:fa behavior` | Update Feature-Increment behavior | FI updates |

### 6.2 Command: `ts:fa story` (Updated)

**Purpose:** Create a story as a delta linked to an Epic.

**Flow:**
1. Verify project exists
2. **Verify Epic exists** (epic-PRX-XXX) — required in 4.0
3. Extract Epic number (XXX) for filename
4. Generate next Story sequence (YYY) within Epic
5. Create story file with embedded Epic reference in filename
6. Optionally add Feature-Increment references in content (metadata)

**Filename Pattern:** `s-eXXX-YYY-description.md`
- `eXXX` = Epic number (e.g., `e001` from `epic-DIT-001-*`)
- `YYY` = Story sequence within epic (auto-incremented)

**Required Inputs:**
- Epic ID (epic-PRX-XXX) — **MANDATORY**
- Story title/description
- Before/After behavior

**Optional Inputs:**
- Feature-Increment references (fi-PRX-XXX) — in content
- Direct Feature references (f-PRX-XXX) — for metadata only

**Output:** `stories/backlog/s-e001-001-add-oauth-button.md`
```

---

## 6. AGENT_SM.md Changes

### 6.1 New Deployment Gate Responsibility

```markdown
### 3.1 What I Own (Updated)

| Area | Description | Artifacts |
|------|-------------|-----------|
| ... | ... | ... |
| **Deployment Gate** | Verify deployment checklist before `ts:po sync` | Deployment checklist |
```

### 6.2 New Deployment Checklist

```markdown
## X. Deployment Gate

### X.1 Deployment Checklist

Before `ts:po sync` can be executed:

- [ ] All sprint stories marked Done
- [ ] All acceptance criteria verified by QA
- [ ] Feature-Increments reviewed by FA
- [ ] Deployment to production confirmed
- [ ] Feature toggles (if any) enabled in production
- [ ] Smoke tests passed
- [ ] PO approval obtained

### X.2 Command: `ts:sm deploy-checklist`

**Purpose:** Generate and track deployment checklist.

**Flow:**
1. Gather completed stories from sprint
2. Identify affected Feature-Increments
3. Generate checklist with all items
4. Track completion status
5. When complete, notify PO for `ts:po sync`
```

---

## 7. Other Agent Updates (SA, DEV, QA, DES)

### 7.1 AGENT_SA.md Changes

- Update ADR paths to distinguish project vs product ADRs
- Add rule: "Project ADRs become Product ADRs after deployment"
- Update command `ts:sa adr` to specify project or product scope

### 7.2 AGENT_DEV.md Changes

- Update path references from `features/` to `feature-increments/`
- Stories now reference Epics (update dev plan templates)
- No significant responsibility changes

### 7.3 AGENT_QA.md Changes

- Tests validate Feature-Increment TO-BE behavior
- Add deployment verification responsibility
- Update test case templates to reference FI files

### 7.4 AGENT_DES.md Changes

- Minimal changes
- Update path references
- Design artifacts may reference Feature-Increments

---

## 8. AGENT_FIX.md Changes

Update auto-fix rules for new structure:

```markdown
### New Fix Rules (4.0)

| Rule | Fix Action |
|------|------------|
| TS-PROD-001 | Create product.yml with required fields (including `prefix`) |
| TS-PROD-002 | Register product in products-index.md |
| TS-FI-001 | Add product/feature reference to fi-PRX-XXX file |
| TS-STORY-006 | Rename story to s-eXXX-YYY pattern |
| TS-PROJ-003 | Add target_products to project.yml |
| TS-NAMING-007 | Rename feature-increment to fi-PRX-XXX pattern |
| TS-NAMING-008 | Rename feature to f-PRX-XXX pattern |
```

---

## 9. Summary of Agent Changes

| Agent | Change Level | Key Updates |
|-------|--------------|-------------|
| **AGENT_PO.md** | **NEW** | Entire agent created, owns PRX assignment |
| AGENT_BOOTSTRAP.md | HIGH | Canon rules, hierarchy, gates, roles, PRX concept |
| AGENT_BA.md | HIGH | fi-PRX-XXX increments, epic-PRX-XXX, product linking |
| AGENT_FA.md | HIGH | s-eXXX-YYY stories (Epic in filename), sync preparation |
| AGENT_SM.md | MEDIUM | Deployment gate, checklist |
| AGENT_SA.md | LOW | ta-PRX-XXX / tai-PRX-XXX paths |
| AGENT_DEV.md | LOW | dp-eXXX-sYYY dev plans |
| AGENT_QA.md | LOW | Test against fi-PRX-XXX, deployment verification |
| AGENT_DES.md | LOW | Path updates |
| AGENT_FIX.md | MEDIUM | New fix rules for PRX naming patterns |
