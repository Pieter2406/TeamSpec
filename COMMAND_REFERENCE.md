# TeamSpec 4.0 — Command Reference

> **Version:** 4.0  
> **Last Updated:** 2026-01-09

---

## Quick Reference by Role

| Role | Commands |
|------|----------|
| **PO** | `ts:po product`, `ts:po project`, `ts:po status`, `ts:po approve`, `ts:po sync`, `ts:po deprecate` |
| **BA** | `ts:ba analysis`, `ts:ba ba-increment`, `ts:ba decision`, `ts:ba review` |
| **FA** | `ts:fa feature`, `ts:fa feature-increment`, `ts:fa epic`, `ts:fa story`, `ts:fa slice`, `ts:fa sync-proposal`, `ts:fa storymap` |
| **SA** | `ts:sa adr`, `ts:sa design` |
| **DEV** | `ts:dev plan`, `ts:dev implement`, `ts:dev ready` |
| **QA** | `ts:qa test`, `ts:qa dor-check`, `ts:qa dod-check`, `ts:qa bug` |
| **SM** | `ts:sm sprint create`, `ts:sm sprint plan`, `ts:sm sprint close`, `ts:sm deploy-checklist` |
| **DES** | `ts:des wireframe`, `ts:des mockup` |
| **Universal** | `ts:status`, `ts:lint`, `ts:context`, `ts:agent`, `ts:deploy`, `ts:migrate`, `ts:fix` |

---

## Product Owner (PO) Commands

### `ts:po product`

Create a new product with proper structure.

```
ts:po product [product-id]
```

**Output:** Creates product folder with `product.yml`, README, features/, decisions/, etc.

---

### `ts:po project`

Create a new project targeting a product.

```
ts:po project [project-id] --product <product-id>
```

**Output:** Creates project folder structure linked to target product(s).

---

### `ts:po status`

Display product status overview.

```
ts:po status [product-id]
```

**Output:** Product metadata, feature count, active projects, recent changes.

---

### `ts:po approve`

Approve deployment readiness for a project.

```
ts:po approve <project-id>
```

**Prerequisites:** All stories Done, QA sign-off, deployment checklist complete.

---

### `ts:po sync`

Synchronize project changes to Product Canon.

```
ts:po sync <project-id> [--product <product-id>]
```

**Prerequisites:** `ts:po approve` complete, deployment verified in production.

---

### `ts:po deprecate`

Mark a product as deprecated.

```
ts:po deprecate <product-id> --reason <reason>
```

---

## Business Analyst (BA) Commands

### `ts:ba analysis`

Create a business analysis document.

```
ts:ba analysis <topic>
```

**Output:** `bai-PRX-XXX-{topic}.md` in business-analysis/ folder.

---

### `ts:ba ba-increment`

Create a business analysis increment (proposed business change).

```
ts:ba ba-increment <product-id> <topic>
```

**Output:** `bai-PRX-XXX-{topic}.md`

---

### `ts:ba decision`

Log a business decision.

```
ts:ba decision <topic>
```

**Output:** `dec-XXX-{topic}.md` in decisions/ folder.

---

### `ts:ba review`

Review business requirements for completeness.

```
ts:ba review <document-path>
```

---

## Functional Analyst (FA) Commands

### `ts:fa feature`

Create a new feature in a product.

```
ts:fa feature <product-id> <feature-name>
```

**Output:** `f-PRX-XXX-{name}.md` in product features/ folder.

---

### `ts:fa feature-increment`

Create a Feature-Increment proposing changes to a product feature.

```
ts:fa feature-increment <product-id> <feature-id>
```

**Output:** `fi-PRX-XXX-{name}.md` in project feature-increments/ folder.

**Note:** Automatically links project to product.

---

### `ts:fa epic`

Create an epic as an increment container.

```
ts:fa epic <product-id> <epic-name>
```

**Output:** `epic-PRX-XXX-{name}.md` in project epics/ folder.

---

### `ts:fa story`

Create a user story within an epic.

```
ts:fa story <epic-id> <story-name>
```

**Output:** `s-eXXX-YYY-{name}.md` in stories/ folder.

**Filename Pattern:**
- `eXXX` = Epic number (e.g., `e001`)
- `YYY` = Story sequence within epic (e.g., `001`)

---

### `ts:fa slice`

Slice an epic into stories.

```
ts:fa slice <epic-id>
```

**Output:** Multiple `s-eXXX-YYY-*.md` files.

---

### `ts:fa sync-proposal`

Propose Canon synchronization after story completion.

```
ts:fa sync-proposal <story-id>
```

---

### `ts:fa storymap`

Generate or update a story map.

```
ts:fa storymap [product-id]
```

**Output:** `storymap.md` with visual story organization.

---

## Solution Architect (SA) Commands

### `ts:sa adr`

Create an Architecture Decision Record.

```
ts:sa adr <topic>
```

**Output:** 
- Product-level: `ta-PRX-XXX-{topic}.md`
- Project-level: `tai-PRX-XXX-{topic}.md`

---

### `ts:sa design`

Create a solution design document.

```
ts:sa design <topic>
```

**Output:** Design document in solution-designs/ folder.

---

## Developer (DEV) Commands

### `ts:dev plan`

Create a dev plan for a story.

```
ts:dev plan <story-id>
```

**Output:** `dp-eNNN-sYYY.md` in dev-plans/ folder.

**Filename Pattern:**
- `eNNN` = Epic number (e.g., `e001`)
- `sYYY` = Story number (e.g., `s001`)

---

### `ts:dev implement`

Execute implementation of a story.

```
ts:dev implement <story-id>
```

---

### `ts:dev ready`

Move story to ready-to-develop.

```
ts:dev ready <story-id>
```

---

## Quality Assurance (QA) Commands

### `ts:qa test`

Design test cases for a story.

```
ts:qa test <story-id>
```

**Output:** Test case document in qa/test-cases/ folder.

---

### `ts:qa dor-check`

Validate Definition of Ready for a story.

```
ts:qa dor-check <story-id>
```

**Output:** DoR checklist validation report.

---

### `ts:qa dod-check`

Validate Definition of Done for a story.

```
ts:qa dod-check <story-id>
```

**Output:** DoD checklist validation report.

---

### `ts:qa bug`

Create a bug report.

```
ts:qa bug <title>
```

**Output:** `BUG-eNNN-sYYY-ZZZ.md` in qa/bugs/ folder.

---

## Scrum Master (SM) Commands

### `ts:sm sprint create`

Create a new sprint.

```
ts:sm sprint create [sprint-number]
```

**Output:** Sprint folder with sprint-goal.md.

---

### `ts:sm sprint plan`

Plan sprint backlog.

```
ts:sm sprint plan [--sprint <sprint-id>]
```

---

### `ts:sm sprint close`

Close sprint with metrics.

```
ts:sm sprint close [--sprint <sprint-id>]
```

**Output:** Sprint retrospective and metrics.

---

### `ts:sm deploy-checklist`

Generate and track deployment checklist.

```
ts:sm deploy-checklist [--sprint <sprint-id>]
```

**Output:** Deployment checklist document.

---

## Designer (DES) Commands

### `ts:des wireframe`

Create wireframe documentation.

```
ts:des wireframe <feature-id>
```

---

### `ts:des mockup`

Create mockup documentation.

```
ts:des mockup <feature-id>
```

---

## Universal Commands

### `ts:status`

Display workspace status overview.

```
ts:status [--product <id>] [--project <id>]
```

**Output:** Product/project overview, feature status, sprint status.

---

### `ts:lint`

Run TeamSpec linter.

```
ts:lint [--project <id>] [--fix]
```

**Linter Rule Categories:**
- `TS-PROD-*` — Product rules
- `TS-PROJ-*` — Project rules
- `TS-FI-*` — Feature-increment rules
- `TS-EPIC-*` — Epic rules
- `TS-FEAT-*` — Feature rules
- `TS-STORY-*` — Story rules
- `TS-ADR-*` — ADR rules
- `TS-DEVPLAN-*` — Dev plan rules
- `TS-DOD-*` — Definition of Done rules
- `TS-NAMING-*` — Naming convention rules

---

### `ts:context`

Show or validate team context.

```
ts:context show
ts:context validate
```

---

### `ts:agent`

Load a role-specific agent.

```
ts:agent <role>
```

**Available Roles:** `po`, `ba`, `fa`, `sa`, `dev`, `qa`, `sm`, `des`, `fix`

---

### `ts:deploy`

Execute deployment workflow.

```
ts:deploy <project-id> [--dry-run]
```

**Equivalent to:** `ts:sm deploy-checklist --verify && ts:po sync <project-id>`

---

### `ts:migrate`

Migrate workspace from legacy naming to 4.0 PRX naming.

```
ts:migrate [--dry-run] [--fix]
```

---

### `ts:fix`

Auto-fix linting errors.

```
ts:fix [--project <id>]
```

**Invokes:** AGENT_FIX to resolve lint errors.

---

## Artifact Naming Patterns

| Artifact | Pattern | Example |
|----------|---------|---------|
| Feature | `f-PRX-XXX-*.md` | `f-DIT-001-combat.md` |
| Feature-Increment | `fi-PRX-XXX-*.md` | `fi-DIT-001-combat-v2.md` |
| Epic | `epic-PRX-XXX-*.md` | `epic-DIT-001-combat-redesign.md` |
| Story | `s-eNNN-YYY-*.md` | `s-e001-001-add-button.md` |
| Dev Plan | `dp-eNNN-sYYY.md` | `dp-e001-s001.md` |
| Bug | `BUG-eNNN-sYYY-ZZZ.md` | `BUG-e001-s001-001.md` |
| ADR (Product) | `ta-PRX-XXX-*.md` | `ta-DIT-001-jwt.md` |
| ADR (Project) | `tai-PRX-XXX-*.md` | `tai-DIT-001-cache.md` |
| BA Increment | `bai-PRX-XXX-*.md` | `bai-DIT-001-pricing.md` |
| Decision | `dec-XXX-*.md` | `dec-001-vendor.md` |

---

## Lifecycle Phases

| Phase | Commands |
|-------|----------|
| **Product Setup** | `ts:po product` |
| **Project Setup** | `ts:po project` |
| **Planning** | `ts:fa feature-increment`, `ts:fa epic`, `ts:fa slice` |
| **Refinement** | `ts:fa story`, `ts:dev plan`, `ts:qa test` |
| **Execution** | `ts:sm sprint plan`, `ts:dev implement` |
| **Completion** | `ts:sm sprint close`, `ts:qa dod-check` |
| **Deployment** | `ts:sm deploy-checklist`, `ts:po approve`, `ts:deploy`, `ts:po sync` |

---

## Command Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          PRODUCT LIFECYCLE                              │
│                                                                         │
│  ts:po product ──→ Product Created ──→ ts:po status                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          PROJECT LIFECYCLE                              │
│                                                                         │
│  ts:po project ──────→ Project Created (with product link)             │
│        │                                                                │
│        ▼                                                                │
│  ts:fa feature-increment ──→ fi-PRX-XXX Created                        │
│        │                                                                │
│        ▼                                                                │
│  ts:fa epic ────────────→ epic-PRX-XXX Created                         │
│        │                                                                │
│        ▼                                                                │
│  ts:fa slice ───────────→ s-eXXX-YYY-*.md Created                      │
│        │                                                                │
│        ▼                                                                │
│  ts:dev plan ───────────→ dp-eNNN-sYYY.md Created                      │
│        │                                                                │
│        ▼                                                                │
│  ts:sm sprint plan ─────→ Stories in Sprint                            │
│        │                                                                │
│        ▼                                                                │
│  [Development & Testing]                                                │
│        │                                                                │
│        ▼                                                                │
│  ts:sm sprint close ────→ Sprint Complete                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         DEPLOYMENT LIFECYCLE                            │
│                                                                         │
│  ts:sm deploy-checklist ──→ Checklist Generated                        │
│        │                                                                │
│        ▼                                                                │
│  ts:po approve ──────────→ Deployment Approved                         │
│        │                                                                │
│        ▼                                                                │
│  [Deploy to Production]                                                 │
│        │                                                                │
│        ▼                                                                │
│  ts:po sync ─────────────→ Product Canon Updated                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```
