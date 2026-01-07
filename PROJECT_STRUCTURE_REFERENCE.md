# Project Folder Structure Reference

## Overview

TeamSpec uses a standardized folder structure for each project that separates concerns by role and artifact type. This document serves as the canonical reference for the project folder organization.

## Root-Level Structure

```
projects/
├── projects-index.md           # Master list of all projects
├── {project-id}/               # Project folders (e.g., 'acme-webshop', 'teamspec')
│   ├── project.yml             # Project metadata and configuration
│   ├── README.md               # Project overview (optional)
│   ├── features/               # 📚 Feature Canon - Authoritative source of truth
│   ├── stories/                # 📝 User Stories - Implementation deltas
│   ├── sprints/                # 🏃 Sprint Management
│   ├── dev-plans/              # 📋 Development Task Breakdown
│   ├── decisions/              # 🎯 Decision Logs
│   ├── adr/                    # 🏗️  Architecture Decision Records
│   ├── qa/                     # ✅ Quality Assurance Artifacts
│   └── epics/                  # 🎯 Epic Definitions (optional)
```

## Detailed Folder Descriptions

### `features/` — Feature Canon ⭐

**Owner:** FA (Functional Analyst)  
**Purpose:** Single source of truth for system behavior  
**Lifespan:** Permanent, evolves over time

```
features/
├── features-index.md           # Master index of all features
├── story-ledger.md             # Append-only record of completed stories
├── F-001-feature-name.md       # Individual feature files
├── F-002-another-feature.md
└── ...
```

**Key Rules:**
- Features describe *current* system behavior (not planned behavior)
- Each feature file has a permanent identifier (F-XXX)
- Features include Purpose, Behavior, Business Rules, Acceptance Criteria
- Feature Canon is updated via FA sync after stories are completed
- Features are the reference for writing new stories

**File Structure (F-XXX.md):**
```markdown
# Feature: F-XXX — Feature Name

## Purpose
Why this feature exists, business value

## Behavior
Current system behavior (authoritative)

## Business Rules
Rules that govern behavior

## Acceptance Criteria
Measurable criteria

## Change Log
Record of significant changes with dates and story links
```

### `stories/` — User Stories

**Owner:** FA (draft), DEV (refinement), SM (sprint assignment)  
**Purpose:** Describe implementation deltas (changes to the system)  
**Lifespan:** Sprint-bound, then archived

```
stories/
├── backlog/                    # New stories, not yet refined
│   ├── S-001-story-title.md
│   └── ...
├── ready-to-refine/            # Stories ready for developer input
│   ├── S-002-story-title.md
│   └── ...
└── ready-for-development/      # Refined stories ready for sprint
    ├── S-003-story-title.md
    └── ...
```

**Workflow:**
1. FA creates story in `backlog/`
2. FA moves to `ready-to-refine/` after initial review
3. DEV refines and moves to `ready-for-development/`
4. SM moves to sprint folder when committed to sprint
5. After completion, story is archived; Feature Canon is updated

**File Structure (S-XXX.md):**
```markdown
# Story: S-XXX — Story Title

## Linked Features
- Feature: [F-001 — Feature Name](../../features/F-001-feature-name.md)

## As a [role]
I want to [action]
So that [benefit]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Development Plan
See [dev-plans/story-XXX-tasks.md](../../dev-plans/story-XXX-tasks.md)

## Notes
Context and additional details
```

### `sprints/` — Sprint Management

**Owner:** SM (Scrum Master)  
**Purpose:** Organize work by sprint, track progress  
**Lifespan:** Sprint-bound

```
sprints/
├── active-sprint.md            # Living document - current sprint status
├── sprint-1/
│   ├── sprint-goal.md          # Sprint goal and committed stories
│   └── ...
├── sprint-2/
│   ├── sprint-goal.md
│   └── ...
└── sprint-N/
    └── sprint-goal.md
```

**Key Files:**

#### `active-sprint.md`
Living document showing:
- Current sprint number and timeline
- Sprint goal
- List of committed stories
- Burndown chart
- Current velocity
- Health status

#### `sprint-N/sprint-goal.md`
```markdown
# Sprint N — Goal

**Timeline:** [Start Date] to [End Date]  
**Goal:** [Clear, measurable sprint goal]

## Committed Stories
- [ ] S-001 — Story Title
- [ ] S-002 — Story Title

## Metrics
- Estimated Capacity: X points
- Actual Committed: Y points
- Completed: Z points
```

### `dev-plans/` — Development Task Breakdown

**Owner:** DEV  
**Purpose:** Task-level breakdown for story implementation  
**Lifespan:** Story-bound

```
dev-plans/
├── story-001-tasks.md          # Tasks for S-001
├── story-002-tasks.md          # Tasks for S-002
└── ...
```

**File Structure (story-XXX-tasks.md):**
```markdown
# Development Plan: S-XXX — Story Title

**Story:** [Link to story](../../stories/ready-for-development/S-XXX.md)  
**Estimated Effort:** X hours  
**Actual Effort:** Y hours

## Task Breakdown

### Task 1: [Task description]
- **Effort:** 2h
- **Status:** [ ] Todo [ ] In Progress [x] Done
- **Description:** Clear task definition
- **Acceptance:** What "done" means

### Task 2: [Task description]
- **Effort:** 3h
- **Status:** [ ] Todo [ ] In Progress [x] Done

## Implementation Notes
Technical decisions, API endpoints, file changes, etc.

## Testing Strategy
How this will be validated
```

### `decisions/` — Decision Logs

**Owner:** Whole team (any role can log)  
**Purpose:** Record important project decisions and rationale  
**Lifespan:** Permanent

```
decisions/
├── DECISION-001-decision-title.md
├── DECISION-002-decision-title.md
└── ...
```

**File Structure:**
```markdown
# Decision: DECISION-XXX — Title

**Date:** YYYY-MM-DD  
**Decision Maker:** [Role/Person]  
**Status:** Proposed | Approved | Implemented | Superseded

## Problem Statement
What issue or question prompted this decision?

## Context
Relevant background and constraints

## Options Considered
1. Option A: [Description] — Pros/Cons
2. Option B: [Description] — Pros/Cons
3. Option C: [Description] — Pros/Cons

## Decision
[Chosen option and why]

## Consequences
What are the implications of this decision?

## Links
- Related Features: [F-XXX](../../features/F-XXX.md)
- Related Stories: [S-XXX](../../stories/ready-for-development/S-XXX.md)
- Related ADRs: [ADR-XXX](../adr/ADR-XXX.md)
```

### `adr/` — Architecture Decision Records

**Owner:** ARCH  
**Purpose:** Record technical decisions with long-term architectural impact  
**Lifespan:** Permanent (superseded records kept for history)

```
adr/
├── ADR-001-tech-stack.md       # Approved ADRs
├── ADR-002-database-choice.md
└── ...
```

**Status Types:**
- **Proposed** — New ADR awaiting review
- **Accepted** — Approved and in effect
- **Superseded** — Replaced by newer ADR
- **Deprecated** — No longer followed

**File Structure:**
```markdown
# ADR-XXX: [Decision Title]

**Status:** Proposed | Accepted | Superseded | Deprecated  
**Date:** YYYY-MM-DD  
**Author:** [Architect name]

## Problem
What technical decision needs to be made?

## Context
- Project constraints
- Technical landscape
- Team capabilities
- Performance requirements

## Decision
[The chosen technical approach]

## Rationale
Why this solution was chosen over alternatives

## Consequences
### Positive
- Benefit 1
- Benefit 2

### Negative
- Drawback 1
- Drawback 2

### Mitigations
How we'll address negative consequences

## Related
- Features: [F-XXX](../../features/F-XXX.md)
- Stories: [S-XXX](../../stories/ready-for-development/S-XXX.md)
- Decisions: [DECISION-XXX](../decisions/DECISION-XXX.md)
- Supersedes: [ADR-YYY](./ADR-YYY.md) (if applicable)
- Superseded By: [ADR-ZZZ](./ADR-ZZZ.md) (if applicable)
```

### `qa/` — Quality Assurance Artifacts

**Owner:** TEST  
**Purpose:** Test design, test cases, and validation artifacts  
**Lifespan:** Evolves with features

```
qa/
├── test-cases/
│   ├── F-001-test-cases.md     # Test cases for F-001
│   ├── F-002-test-cases.md
│   └── ...
├── test-results.md             # Summary of test execution results
└── automation-strategy.md       # Automation plan and progress
```

**File Structure (F-XXX-test-cases.md):**
```markdown
# Test Cases: F-XXX — Feature Name

**Feature:** [F-XXX](../../features/F-XXX.md)

## Test Case: TC-001 — [Test scenario]
**Type:** Unit | Integration | E2E | Manual  
**Related Story:** [S-XXX](../../stories/ready-for-development/S-XXX.md)

### Setup
Steps to prepare test environment

### Steps
1. Action 1
2. Action 2
3. Action 3

### Expected Result
What should happen

### Actual Result
[Filled in during execution]

### Status
[ ] Pass [ ] Fail [ ] Blocked

---
## Test Case: TC-002 — [Test scenario]
...
```

### `epics/` — Epic Definitions (Optional)

**Owner:** BA  
**Purpose:** Group related features into larger initiatives  
**Lifespan:** Permanent

```
epics/
├── EPIC-001-epic-name.md       # Grouping of related features
├── EPIC-002-epic-name.md
└── ...
```

**File Structure:**
```markdown
# Epic: EPIC-XXX — Epic Name

**Business Value:** [Why this epic matters]  
**Timeline:** [Expected delivery]  
**Related Features:** 
- [F-001](../../features/F-001.md)
- [F-002](../../features/F-002.md)

## Overview
Strategic importance and scope

## Success Criteria
How we'll know this epic is successful
```

---

## Folder Ownership by Role

| Folder | Owner | Responsibilities |
|--------|-------|------------------|
| `features/` | FA | Create, update, sync |
| `stories/backlog/` | FA | Create and review |
| `stories/ready-to-refine/` | FA → DEV | Move ready stories; DEV refines |
| `stories/ready-for-development/` | DEV → SM | Refined stories; SM assigns to sprints |
| `sprints/` | SM | Create, manage, close sprints |
| `dev-plans/` | DEV | Create task breakdowns |
| `decisions/` | Whole team | Anyone can propose; BA/ARCH approve |
| `adr/` | ARCH | Create technical decisions |
| `qa/` | TEST | Design tests, record results |
| `epics/` | BA | Define business groupings |

---

## Story Workflow States

Stories move through folders based on their state:

```
backlog/
    ↓
    (FA reviews → ready for dev refinement)
    ↓
ready-to-refine/
    ↓
    (DEV refines → ready for sprint commitment)
    ↓
ready-for-development/
    ↓
    (SM assigns to sprint)
    ↓
sprints/sprint-N/story.md
    ↓
    (Work completed → Feature Canon updated)
    ↓
Archive (story-ledger.md)
```

---

## Naming Conventions

### Feature Files
- **Format:** `F-XXX-kebab-case-name.md`
- **Example:** `F-001-user-authentication.md`, `F-042-payment-processing.md`
- **Rule:** Sequential numbering, descriptive names

### Story Files
- **Format:** `S-XXX-kebab-case-name.md`
- **Example:** `S-001-add-login-form.md`, `S-015-implement-oauth.md`
- **Rule:** Sequential numbering, action-oriented names

### Decision Files
- **Format:** `DECISION-XXX-kebab-case-name.md`
- **Example:** `DECISION-001-use-postgresql.md`

### ADR Files
- **Format:** `ADR-XXX-kebab-case-name.md`
- **Example:** `ADR-001-microservices-architecture.md`

### Sprint Folders
- **Format:** `sprint-N/` where N is sequential
- **Example:** `sprint-1/`, `sprint-2/`, `sprint-15/`

### Development Plans
- **Format:** `story-XXX-tasks.md` (flat, no sprint prefix)
- **Example:** `story-001-tasks.md`, `story-042-tasks.md`

---

## Cross-References

All documents should link to related artifacts:

```markdown
- **Features** link to related **Decisions** and **ADRs**
- **Stories** link to their **Features** and **Development Plans**
- **Development Plans** link to their **Stories**
- **Test Cases** link to their **Features** and **Stories**
- **Decisions** link to related **Features**, **Stories**, and **ADRs**
- **ADRs** link to related **Decisions** and **Features**
```

Use relative markdown links:
```markdown
[F-001](../../features/F-001-name.md)
[S-042](../../stories/ready-for-development/S-042-name.md)
[ADR-003](../adr/ADR-003-name.md)
```

---

## Quick Reference Checklist

### When Creating a Feature
- [ ] Create in `features/`
- [ ] Add to `features-index.md`
- [ ] Include: Purpose, Behavior, Rules, Acceptance Criteria
- [ ] Add to Feature Canon (permanent)

### When Creating a Story
- [ ] Create in `stories/backlog/`
- [ ] Link to Feature in "Linked Features" section
- [ ] Include: As a / I want / So that, Acceptance Criteria
- [ ] Assign sequential S-XXX number

### When Refining a Story
- [ ] Move from `backlog/` to `ready-to-refine/`
- [ ] Add technical clarifications
- [ ] Remove ambiguities

### When a Story is Ready for Dev
- [ ] DEV moves to `ready-for-development/`
- [ ] Create `dev-plans/story-XXX-tasks.md`
- [ ] Link story to dev plan

### When Assigning to Sprint
- [ ] Copy story file to `sprints/sprint-N/`
- [ ] Update `active-sprint.md`
- [ ] Update `sprints/sprint-N/sprint-goal.md`

### When Story is Done
- [ ] Update `features-index.md` and Feature Canon
- [ ] Add to `features/story-ledger.md`
- [ ] Archive story (keep in backlog for reference, mark completed)
- [ ] Mark related test cases as Passed

### When Making Technical Decision
- [ ] Create in `decisions/` OR `adr/` (depending on scope)
- [ ] Link to related Features, Stories, ADRs
- [ ] Set status to Proposed, then Accepted after review

---

## Project.yml Configuration

Each project has a `project.yml` that defines metadata:

```yaml
# project.yml
name: Project Name
description: Project description
identifier: project-id
team: Team Name
owner: BA Name
phase: Active | Planned | Archived

# Feature Canon location (relative to project folder)
feature_canon: features/

# Story locations
story_locations:
  backlog: stories/backlog/
  ready_to_refine: stories/ready-to-refine/
  ready_for_development: stories/ready-for-development/

# Development artifacts
dev_plans: dev-plans/
sprints: sprints/
decisions: decisions/
adr: adr/
qa: qa/
```

---

## References

- **Feature Canon:** ALWAYS the source of truth for system behavior
- **Stories:** Describe deltas (changes), not full behavior
- **Feature Canon + Stories:** Together form the complete change history
- **Development Plans:** Bridge stories and implementation
- **Decisions + ADRs:** Explain WHY technical choices were made
