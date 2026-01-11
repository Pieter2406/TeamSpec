# TeamSpec 4.0 Workflows

> **Status:** Normative  
> **Source:** [registry.yml](registry.yml)

---

## Overview

TeamSpec 4.0 defines clear workflows for product/project management with explicit handoffs between roles. All commands referenced here exist in [commands.md](commands.md).

---

## Product Creation Workflow

```mermaid
sequenceDiagram
    participant PO as Product Owner
    participant System as TeamSpec
    
    PO->>System: ts:po product
    System->>PO: Enter product name, PRX
    PO->>System: ACME, PRX=ACME
    System->>System: Create products/acme-webshop/
    System->>System: Create product.yml (PRX=ACME)
    System->>System: Create folder structure
    System->>PO: Product created ✓
```

### Outputs

- `products/{product-id}/product.yml`
- `products/{product-id}/features/`
- `products/{product-id}/business-analysis/`
- `products/{product-id}/solution-designs/`
- `products/{product-id}/technical-architecture/`
- `products/{product-id}/decisions/`
- `products/{product-id}/qa/regression-tests/`

---

## Project Creation Workflow

```mermaid
sequenceDiagram
    participant PO as Product Owner
    participant System as TeamSpec
    
    PO->>System: ts:po project
    System->>PO: Enter project name, target product(s)
    PO->>System: Q1-Auth-Overhaul, targets ACME
    System->>System: Create projects/q1-auth-overhaul/
    System->>System: Create project.yml (targets: ACME)
    System->>System: Create folder structure
    System->>PO: Project created ✓
```

### Outputs

- `projects/{project-id}/project.yml`
- `projects/{project-id}/feature-increments/`
- `projects/{project-id}/epics/`
- `projects/{project-id}/stories/` (with state folders)
- `projects/{project-id}/dev-plans/`
- `projects/{project-id}/qa/test-cases/`
- `projects/{project-id}/qa/bug-reports/`
- `projects/{project-id}/qa/regression-impact/`
- `projects/{project-id}/sprints/`

---

## Feature Development Workflow

```mermaid
sequenceDiagram
    participant BA as Business Analyst
    participant FA as Functional Analyst
    participant SA as Solution Architect
    participant DEV as Developer
    participant QA as QA Engineer
    
    BA->>BA: ts:ba analysis (business context)
    FA->>FA: ts:fa feature-increment (fi-PRX-NNN)
    FA->>FA: ts:fa epic (epic-PRX-NNN)
    SA->>SA: ts:sa sd (if needed)
    SA->>SA: ts:sa ta (if architecture-impacting)
    FA->>FA: ts:fa story (s-eXXX-YYY)
    DEV->>DEV: ts:dev plan (dp-eXXX-sYYY)
    QA->>QA: ts:qa test (tc-fi-PRX-NNN)
    DEV->>DEV: ts:dev implement
    QA->>QA: ts:qa verify
```

---

## Story Lifecycle

```mermaid
stateDiagram-v2
    [*] --> backlog: ts:fa story
    backlog --> ready_to_refine: Needs refinement
    ready_to_refine --> backlog: DoR passed
    backlog --> in_progress: Sprint planning
    in_progress --> done: DoD passed
    in_progress --> deferred: Postponed
    in_progress --> out_of_scope: Removed
    done --> [*]
    deferred --> backlog: Reactivated
```

### State Folders

| Folder | Meaning |
|--------|---------|
| `stories/backlog/` | Ready for sprint |
| `stories/ready-to-refine/` | Needs refinement |
| `stories/in-progress/` | Under development |
| `stories/done/` | Completed |
| `stories/deferred/` | Postponed |
| `stories/out-of-scope/` | Removed |

---

## Deployment Workflow

> **Gate Owner:** SM (process)  
> **Gate Approver:** PO  
> **Gate Verifier:** QA

```mermaid
sequenceDiagram
    participant SM as Scrum Master
    participant QA as QA Engineer
    participant PO as Product Owner
    participant Ops as Operations
    
    SM->>SM: ts:sm deploy-checklist
    SM->>QA: Request verification
    QA->>QA: ts:qa verify (all items)
    QA->>QA: Create ri-fi-PRX-NNN for each FI
    QA->>SM: Sign-off ✓
    SM->>PO: Present checklist for approval
    PO->>PO: Review checklist
    PO->>SM: Approve deployment ✓
    SM->>Ops: Handoff to operations
    Ops->>Ops: Deploy to production
    Ops->>SM: Deployed ✓
```

### Deployment Gate Checks (per [gates.md](gates.md))

1. All sprint stories in terminal state (Done/Deferred/Out-of-Scope)
2. All Feature-Increments reviewed
3. QA sign-off obtained
4. Regression impact recorded for each FI (`ri-fi-PRX-NNN.md`)
5. Code deployed to production
6. Smoke tests passed

**Note:** SM owns the gate process (verification, checklist). PO has approval authority. SM does NOT perform the deploy - that is operations.

---

## Canon Sync Workflow

> **Gate Owner:** PO  
> **Precondition:** Deployment gate passed

```mermaid
sequenceDiagram
    participant PO as Product Owner
    participant System as TeamSpec
    participant QA as QA Engineer
    
    Note over PO,System: Deployment gate MUST be passed
    PO->>System: ts:po sync
    System->>System: Validate deployment gate
    System->>System: Merge FI TO-BE → Feature Canon
    System->>System: Merge increments → Canon
    System->>PO: Sync complete ✓
    Note over QA: rt-f-* already updated (pre-deployment)
```

### Sync Effect

| Source (Project) | Target (Product) | Action |
|------------------|------------------|--------|
| `fi-PRX-NNN-*.md` TO-BE | `f-PRX-NNN-*.md` | Merge/update |
| `bai-PRX-NNN-*.md` | `ba-PRX-NNN-*.md` | Merge/update |
| `sdi-PRX-NNN-*.md` | `sd-PRX-NNN-*.md` | Merge/update |
| `tai-PRX-NNN-*.md` | `ta-PRX-NNN-*.md` | Merge/update |

**Note:** Regression tests (`rt-f-PRX-NNN`) are updated BEFORE deployment (part of deployment gate verification), not after sync.

---

## Role Handoffs

| From | To | Artifact | Trigger |
|------|----|----------|---------|
| BA | FA | Business analysis complete | BA review done |
| FA | DEV | Story ready | DoR passed |
| DEV | QA | Code complete | PR created |
| QA | FA | Verified | DoD checks passed |
| SM | PO | Deployment ready | Checklist complete |
| PO | — | Canon synced | `ts:po sync` executed |

---

## Sprint Ceremonies

### Sprint Planning

1. SM creates sprint: `ts:sm sprint`
2. PO prioritizes backlog
3. FA refines stories
4. Team commits to sprint

### Sprint Review

1. Demo completed stories
2. QA presents verification results
3. FA confirms DoD compliance

### Sprint Retrospective

Team retrospective facilitated by SM.

### Deployment

1. SM runs checklist: `ts:sm deploy-checklist`
2. QA verifies and records regression impact
3. PO approves
4. Operations deploys to production
5. PO syncs canon: `ts:po sync`
