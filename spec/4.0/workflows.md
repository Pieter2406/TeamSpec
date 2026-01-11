# TeamSpec 4.0 Workflows

> **Status:** Normative  
> **Source:** [registry.yml](registry.yml)

---

## Overview

TeamSpec 4.0 defines clear workflows for product/project management with explicit handoffs between roles.

---

## Product Creation Workflow

```mermaid
sequenceDiagram
    participant PO as Product Owner
    participant System as TeamSpec
    
    PO->>System: Create product
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
    
    PO->>System: Create project
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
    
    BA->>BA: Create business analysis
    FA->>FA: Create feature-increment
    FA->>FA: Create epic
    SA->>SA: Create solution design (if needed)
    SA->>SA: Create technical architecture (if architecture-impacting)
    FA->>FA: Create story
    DEV->>DEV: Create dev plan
    QA->>QA: Create test cases
    DEV->>DEV: Implement
    QA->>QA: Verify
```

---

## Story Lifecycle

```mermaid
stateDiagram-v2
    [*] --> backlog: Create story
    backlog --> ready_to_refine: Needs refinement
    ready_to_refine --> backlog: Refinement complete
    backlog --> in_progress: Sprint planning + DoR passed
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

## Deployment + Verification Workflow

> **Gate Owner:** SM (process)  
> **Gate Approver:** PO  
> **Gate Verifier:** QA

```mermaid
sequenceDiagram
    participant SM as Scrum Master
    participant QA as QA Engineer
    participant PO as Product Owner
    participant Ops as Operations
    
    Note over Ops: Pre-deploy: Code ready
    Ops->>Ops: Deploy to production
    Ops->>Ops: Enable feature toggles (if applicable)
    Ops->>SM: Deployed + toggles ON ✓
    Note over SM,PO: POST-DEPLOY Verification Gate
    SM->>SM: Run deployment checklist
    SM->>QA: Request verification
    QA->>QA: Verify all items
    QA->>QA: Create regression impact records
    QA->>SM: Sign-off ✓
    SM->>PO: Present checklist for approval
    PO->>PO: Review checklist
    PO->>SM: Approve ✓
    Note over PO: Gate passed → Canon Sync enabled
```

### Deployment Verification Gate Checks (per [gates.md](gates.md))

1. All sprint stories in terminal state (Done/Deferred/Out-of-Scope)
2. All Feature-Increments reviewed
3. **Code deployed to production**
4. **Feature toggles enabled** (or N/A)
5. Smoke tests passed in production
6. QA sign-off obtained
7. Regression impact recorded for each FI (`ri-fi-PRX-NNN.md`)
8. PO approval obtained

**Note:** SM owns the gate process (verification, checklist). PO has approval authority. SM does NOT perform the deploy — that is operations. The sequence is: **deploy → toggle ON → verification gate → ts:po sync**.

---

## Canon Sync Workflow

> **Gate Owner:** PO  
> **Precondition:** Deployment Verification gate passed

```mermaid
sequenceDiagram
    participant PO as Product Owner
    participant System as TeamSpec
    participant QA as QA Engineer
    
    Note over PO,System: Deployment Verification gate MUST be passed
    PO->>System: Sync to Canon
    System->>System: Validate deployment verification gate
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

**Note:** Regression tests (`rt-f-PRX-NNN`) are updated as part of deployment verification gate (before canon sync), not after sync.

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

1. SM creates sprint
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

1. Operations deploys to production
2. Operations enables feature toggles (if applicable)
3. SM runs verification checklist
4. QA verifies and records regression impact
5. PO approves deployment verification gate
6. PO syncs canon
