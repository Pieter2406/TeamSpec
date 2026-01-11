# TeamSpec 4.0 Templates

> **Version:** 4.0  
> **Last Updated:** 2026-01-11  
> **Purpose:** Aligned templates for Product-Canon operating model

---

## Overview

These templates are designed for the TeamSpec 4.0 Product-Canon operating model. Each template:

1. **Identifies its owner** — Which role creates/maintains it
2. **States its artifact type** — Source of Truth, Execution, Planning, or Operational
3. **Enforces linter rules** — Which TS-* rules apply
4. **Links to Feature Canon** — How it relates to the canonical source of truth

---

## Template Index

### Source of Truth Templates

These templates create **canonical artifacts** — the authoritative source of truth.

| Template | Owner | Linter Rules | Purpose |
|----------|-------|--------------|---------|
| [feature-template.md](feature-template.md) | BA/FA | TS-FEAT-* | Feature Canon entries |
| [decision-log-template.md](decision-log-template.md) | BA | TS-DEC-* | Business decisions |
| [adr-template.md](adr-template.md) | SA | TS-ADR-* | Architecture decisions |

### Execution Templates

These templates create **execution artifacts** — deltas to the source of truth.

| Template | Owner | Linter Rules | Purpose |
|----------|-------|--------------|---------|
| [story-template.md](story-template.md) | FA | TS-STORY-* | User stories (deltas) |
| [testcases-template.md](testcases-template.md) | QA | TS-QA-* | Feature-level test cases |
| [bug-report-template.md](bug-report-template.md) | QA | TS-QA-002 | Bug reports with classification |
| [uat-pack-template.md](uat-pack-template.md) | QA | TS-UAT-* | User acceptance testing |

### Planning Templates

These templates create **planning artifacts** — become historical after Canon is established.

| Template | Owner | Lifecycle | Purpose |
|----------|-------|-----------|---------|
| [business-analysis-template.md](business-analysis-template.md) | BA | Historical | Business analysis |
| [functional-spec-template.md](functional-spec-template.md) | FA | Transitional | Functional elaboration |
| [storymap-template.md](storymap-template.md) | FA | Historical | Story mapping workshops |
| [refinement-notes-template.md](refinement-notes-template.md) | FA | Historical | Refinement session notes |

### Operational Templates

These templates create **operational artifacts** — sprint and process management.

| Template | Owner | Lifecycle | Purpose |
|----------|-------|-----------|---------|
| [sprint-template.md](sprint-template.md) | SM | Sprint-bound | Sprint management |
| [sprint-goal-template.md](sprint-goal-template.md) | SM | Sprint-bound | Sprint goal and commitment |
| [active-sprint-template.md](active-sprint-template.md) | SM | Living | Current sprint status |
| [sprints-index-template.md](sprints-index-template.md) | SM | Living | Sprint history index |

---

## Artifact Lifecycle

```
Planning Artifacts          Source of Truth          Execution Artifacts
─────────────────          ──────────────────        ────────────────────
BA Doc ─────────────────▶  Feature Canon  ◀─────────  Stories (deltas)
Functional Spec ────────▶  Decision Log   ◀─────────  Bug Reports
Story Map ──────────────▶  ADRs           ◀─────────  Test Cases

      (Historical)           (Canonical)             (Sprint-bound)
```

---

## Key Alignment Features

### 1. Delta Enforcement (Stories)

Stories use Before/After format and MUST link to features:

```markdown
### Before (current behavior)
Reference: F-XXX, Section: [section]

### After (new behavior)
[ONLY the delta - what changes]
```

### 2. FA Acceptance Gate (Stories)

Stories require FA approval before Ready for Development:

```markdown
## FA Acceptance Gate

| Check | Status | FA Initials |
|-------|--------|-------------|
| Story describes delta only | [ ] | |
| Feature link is correct | [ ] | |
```

### 3. Bug Classification (Bugs)

Bugs must be classified into exactly one category:

- **Implementation Defect** — Code doesn't match Canon
- **Feature Canon Wrong** — Canon doesn't match intent
- **Undocumented Behavior** — Neither covers the case

### 4. Feature-Level Testing (Test Cases)

Tests validate Feature Canon, not individual stories:

```markdown
**Feature:** [F-XXX](../../features/F-XXX-name.md)
**Test Level:** Feature (not Story)
```

### 5. Scope Freeze (Sprints)

After sprint commitment, scope changes require decision log:

```markdown
## Scope Freeze Notice

**Sprint Committed:** [ ] Yes / [ ] No
> ⚠️ After commitment, any scope change requires Decision Log entry.
```

### 6. Canon Sync Verification (Sprints)

Before sprint close, verify Canon is updated:

```markdown
## Canon Sync Verification

| Story | Impact Type | Canon Updated? | FA Verified |
|-------|-------------|----------------|-------------|
```

---

## Template Ownership by Role

| Role | Templates Owned |
|------|-----------------|
| **BA** | business-analysis, decision-log, feature (Purpose/Scope) |
| **FA** | story, functional-spec, storymap, refinement-notes, feature (Behavior) |
| **SA** | adr |
| **DEV** | — (uses dev-plans, not templated here) |
| **QA** | testcases, bug-report, uat-pack |
| **SM** | sprint, sprint-goal, active-sprint, sprints-index |

---

## Linter Rules Reference

| Rule | Applies To | Description |
|------|------------|-------------|
| TS-STORY-001 | Stories | Feature link required |
| TS-STORY-002 | Stories | Delta-only format |
| TS-STORY-003 | Stories | ACs testable |
| TS-STORY-004 | Stories | Sprint assignment by SM only |
| TS-STORY-005 | Stories | DoR complete |
| TS-FEAT-001 | Features | Feature must exist before stories |
| TS-FEAT-002 | Features | All sections required |
| TS-FEAT-003 | Features | Feature ID unique |
| TS-DEC-001 | Decisions | Must link to features |
| TS-ADR-001 | ADRs | Required for architecture changes |
| TS-ADR-002 | ADRs | Must link to features |
| TS-QA-001 | Tests | Must reference Feature Canon |
| TS-QA-002 | Bugs | Classification required |
| TS-DOD-001 | All | Canon sync before Done |
| TS-DOD-002 | Tests | Tests are feature-level |
| TS-DEVPLAN-001 | Sprints | Dev plan before implementation |

---

## Usage

### Creating New Artifacts

1. Copy the appropriate template
2. Fill in all required sections
3. Ensure links to Feature Canon are correct
4. Verify linter rules pass

### Template Customization

These templates can be customized per project, but:

- **DO NOT** remove linter rule sections
- **DO NOT** remove ownership markers
- **DO NOT** remove Feature Canon links
- **DO** add project-specific sections as needed

---

## Related Documentation

- [agents/README.md](../agents/README.md) — Agent prompts
- [roles/ROLES_AND_RESPONSIBILITIES.md](../roles/ROLES_AND_RESPONSIBILITIES.md) — Role definitions
- [roles/WORKFLOW.md](../roles/WORKFLOW.md) — Workflow phases
- [roles/LINTER_RULES_SPECIFICATION.md](../roles/LINTER_RULES_SPECIFICATION.md) — Linter rules
- [roles/TEMPLATE_ALIGNMENT_REQUIREMENTS.md](../roles/TEMPLATE_ALIGNMENT_REQUIREMENTS.md) — Alignment spec
