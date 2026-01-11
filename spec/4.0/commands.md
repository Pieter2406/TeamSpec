<!-- DO NOT EDIT - Generated from registry.yml -->

# TeamSpec 4.0 Commands

> **Status:** Normative  
> **Source:** [registry.yml](registry.yml)

---

## Command Syntax

- **User invocation:** Space-based (`ts:po sync`)
- **Machine IDs:** Dot-based (`po.sync`)

---

## Active Commands

### PO Commands (Product Owner)

| Command | Purpose | Output |
|---------|---------|--------|
| `ts:po product` | Create new product with PRX prefix | `products/{id}/` structure |
| `ts:po project` | Create new project targeting product(s) | `projects/{id}/` structure |
| `ts:po sync` | Sync project changes to Product Canon (post-deploy) | Updated `products/**` |
| `ts:po status` | Product/project status overview | Status report |

### BA Commands (Business Analyst)

| Command | Purpose | Output |
|---------|---------|--------|
| `ts:ba analysis` | Create business analysis document | `products/{id}/business-analysis/ba-PRX-*.md` |
| `ts:ba ba-increment` | Create BA increment in project | `projects/{id}/business-analysis-increments/bai-PRX-*.md` |
| `ts:ba review` | Review artifacts for business intent | Review comments |

### FA Commands (Functional Analyst)

| Command | Purpose | Output |
|---------|---------|--------|
| `ts:fa feature` | Create feature in Product Canon | `products/{id}/features/f-PRX-*.md` |
| `ts:fa feature-increment` | Create feature-increment in project | `projects/{id}/feature-increments/fi-PRX-*.md` |
| `ts:fa epic` | Create epic in project | `projects/{id}/epics/epic-PRX-*.md` |
| `ts:fa story` | Create story linked to epic | `projects/{id}/stories/backlog/s-eXXX-YYY-*.md` |
| `ts:fa sync-proposal` | Prepare sync proposal for PO | Sync proposal document |

### SA Commands (Solution Architect)

| Command | Purpose | Output |
|---------|---------|--------|
| `ts:sa ta` | Create Technical Architecture document | `products/{id}/technical-architecture/ta-PRX-*.md` |
| `ts:sa ta-increment` | Create TA Increment in project | `projects/{id}/technical-architecture-increments/tai-PRX-*.md` |
| `ts:sa sd` | Create Solution Design document | `products/{id}/solution-designs/sd-PRX-*.md` |
| `ts:sa sd-increment` | Create SD Increment in project | `projects/{id}/solution-design-increments/sdi-PRX-*.md` |
| `ts:sa review` | Review technical approach | Technical assessment |

### DEV Commands (Developer)

| Command | Purpose | Output |
|---------|---------|--------|
| `ts:dev plan` | Create dev plan for story | `projects/{id}/dev-plans/dp-eXXX-sYYY-*.md` |
| `ts:dev implement` | Execute implementation | Code changes |

### QA Commands (QA Engineer)

| Command | Purpose | Output |
|---------|---------|--------|
| `ts:qa test` | Create test cases for Feature-Increment | `projects/{id}/qa/test-cases/tc-fi-PRX-*.md` |
| `ts:qa regression` | Update product regression tests | `products/{id}/qa/regression-tests/rt-f-PRX-*.md` |
| `ts:qa verify` | Validate DoD compliance | Verification report |

### SM Commands (Scrum Master)

| Command | Purpose | Output |
|---------|---------|--------|
| `ts:sm sprint` | Create/manage sprint | `projects/{id}/sprints/sprint-N/*` |
| `ts:sm deploy-checklist` | Run deployment readiness checklist | Deployment checklist |

### Universal Commands

| Command | Purpose | Output |
|---------|---------|--------|
| `ts:status` | Project/product status overview | Status report |
| `ts:lint` | Run linter | Lint report |
| `ts:fix` | Auto-fix lint errors | Fixed files |
| `ts:agent <role>` | Load role-specific agent | Agent loaded |

---

## Removed Commands

These commands are no longer available and will error if used.

| Command | Replacement | Reason | Removed In |
|---------|-------------|--------|------------|
| `ts:deploy` | `ts:po sync` | Conflicted with ts:po sync; one mechanism is clearer | 4.0 |
| `ts:ba epic` | `ts:fa epic` | BA does not own Epics; FA does | 4.0 |
| `ts:ba feature` | `ts:fa feature` | BA does not own Features; FA does | 4.0 |
| `ts:sa design` | `ts:sa sd` | Aligned with artifact naming | 4.0 |
| `ts:sa adr` | `ts:sa ta` | Aligned with artifact naming | 4.0 |

---

## CLI Commands (Terminal)

These commands are run in the terminal, not in chat.

| Command | Purpose |
|---------|---------|
| `teamspec init` | Initialize TeamSpec in a repository |
| `teamspec lint` | Lint project artifacts against TeamSpec rules |
| `teamspec lint --project <id>` | Lint specific project |
| `teamspec update` | Update TeamSpec core files |
| `teamspec migrate` | Migrate from older TeamSpec version |

---

## Command Categories by Role

| Role | Commands |
|------|----------|
| PO | `ts:po product`, `ts:po project`, `ts:po sync`, `ts:po status` |
| BA | `ts:ba analysis`, `ts:ba ba-increment`, `ts:ba review` |
| FA | `ts:fa feature`, `ts:fa feature-increment`, `ts:fa epic`, `ts:fa story`, `ts:fa sync-proposal` |
| SA | `ts:sa ta`, `ts:sa ta-increment`, `ts:sa sd`, `ts:sa sd-increment`, `ts:sa review` |
| DEV | `ts:dev plan`, `ts:dev implement` |
| QA | `ts:qa test`, `ts:qa regression`, `ts:qa verify` |
| SM | `ts:sm sprint`, `ts:sm deploy-checklist` |
| Any | `ts:status`, `ts:lint`, `ts:fix`, `ts:agent` |
