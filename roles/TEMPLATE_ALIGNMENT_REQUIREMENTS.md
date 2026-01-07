# Template Alignment Requirements

> **Version:** 1.0  
> **Last Updated:** 2026-01-07  
> **Status:** Planning Document

This document specifies the required changes to existing TeamSpec templates to align with the Feature Canon operating model and role boundaries.

---

## Alignment Philosophy

### Core Principles to Enforce in Templates

1. **Feature Canon is Source of Truth** — Templates must reference Feature Canon, not restate behavior
2. **Stories are Deltas** — Story templates must enforce Before/After format
3. **Role Boundaries** — Templates must include ownership markers
4. **Linter Integration** — Templates must include signals for linter rules
5. **No Undocumented Behavior** — Templates must trace all behavior to Feature Canon

---

## Template Review Summary

| Template | Current State | Alignment Score | Priority |
|----------|---------------|-----------------|----------|
| Story Template | Delta-based, needs enforcement | 90% | P1 |
| Business Analysis | Planning artifact, needs warning | 85% | P2 |
| Functional Spec | Transitional, needs retirement note | 80% | P2 |
| Feature Template | Core, needs section enforcement | 95% | P1 |
| Sprint Template | Operational, needs scope note | 85% | P2 |
| QA Templates | Excellent, no changes needed | 95% | P3 |
| ADR Template | Good, minor link enforcement | 90% | P2 |
| Bug Report | Good, classification needed | 90% | P2 |
| Decision Log | Good, feature link needed | 85% | P2 |

---

## 1. Story Template Updates

**File:** `story-template.md`

### Current State

The story template is already delta-based with Before/After sections. It needs enforcement and warnings.

### Required Changes

#### 1.1 Add Delta Enforcement Warning

**Add after frontmatter:**

```markdown
<!-- TEAMSPEC RULE: TS-STORY-002 -->
<!-- 
  ⚠️ STORIES ARE DELTAS, NOT DOCUMENTATION
  
  This story describes a CHANGE to the Feature Canon.
  
  DO NOT:
  - Restate full feature behavior
  - Include complete specifications
  - Document end-to-end flows
  
  DO:
  - Reference Feature Canon (F-XXX) for current behavior
  - Describe only what changes (Before → After)
  - Link to Feature Canon rules (BR-XXX)
-->
```

#### 1.2 Add FA Acceptance Gate

**Add before DoR section:**

```markdown
## FA Acceptance Gate

> This story must be reviewed by FA before moving to Ready for Development.

| Check | Status | FA Initials |
|-------|--------|-------------|
| Story describes delta only | [ ] | |
| Feature link is correct | [ ] | |
| AC reference Feature Canon | [ ] | |
| No full behavior restatement | [ ] | |

**FA Approved:** [ ] Yes  
**FA Name:** ________________  
**Date:** ________________
```

#### 1.3 Enforce Before/After Format

**Update Delta section:**

```markdown
## Feature Impact

<!-- TEAMSPEC RULE: TS-STORY-002 requires Before/After -->

### Before (current behavior)
<!-- 
  Describe the CURRENT behavior as documented in Feature Canon.
  Reference: F-XXX, Section: [section name]
  
  Example: "Currently, users must log in with email/password (F-001, Main Flow Step 1)"
-->

### After (new behavior)
<!-- 
  Describe ONLY what changes.
  This becomes the new behavior in Feature Canon after completion.
  
  Example: "Users can also log in with Google OAuth"
-->
```

#### 1.4 Add Linter Rule References

**Add at bottom:**

```markdown
---
## Linter Rules Enforced

| Rule | Description | Status |
|------|-------------|--------|
| TS-STORY-001 | Feature link required | Checked on save |
| TS-STORY-002 | Delta-only format | Checked on save |
| TS-STORY-003 | AC testable | Checked on Ready |
| TS-STORY-005 | DoR complete | Checked on Ready |
| TS-DOD-001 | Canon sync | Checked on Done |
```

#### 1.5 Add Sprint Assignment Block

**Add after Status section:**

```markdown
## Sprint Assignment

<!-- TEAMSPEC RULE: TS-STORY-004 - Only SM can assign sprint -->

**Sprint:** -  
**Assigned By:** ________________  
**Role:** SM  
**Date:** ________________

> ⚠️ Only the Scrum Master (SM) can assign this story to a sprint.
```

---

## 2. Business Analysis Template Updates

**File:** `business-analysis-template.md`

### Current State

Correctly marked as planning artifact. Needs stronger warning about source of truth.

### Required Changes

#### 2.1 Add Source of Truth Warning

**Add at top:**

```markdown
<!-- 
  ⚠️ THIS IS A PLANNING ARTIFACT, NOT SOURCE OF TRUTH
  
  This Business Analysis document captures analysis and decisions
  during the planning phase.
  
  SOURCE OF TRUTH:
  - For current system behavior → Feature Canon (/features/F-XXX.md)
  - For business decisions → Decision Log (/decisions/DEC-XXX.md)
  
  This document becomes HISTORICAL after Feature Canon is created.
-->
```

#### 2.2 Add Feature Canon Link Section

**Add section:**

```markdown
## Related Feature Canon

> Link to Feature Canon files created from this analysis.

| Feature ID | Feature Name | Status |
|------------|--------------|--------|
| F-XXX | [Feature Name](../features/F-XXX-name.md) | Draft / Active |

> ⚠️ Once features are created, the Feature Canon is authoritative.
> This document is retained for historical context only.
```

#### 2.3 Add Role Ownership Marker

**Add after title:**

```markdown
**Document Owner:** BA (Business Analyst)  
**Artifact Type:** Planning (Not Source of Truth)  
**Lifecycle:** Historical after Feature Canon creation
```

---

## 3. Functional Spec Template Updates

**File:** `functional-spec-template.md`

### Current State

Excellent transitional document. Needs retirement encouragement.

### Required Changes

#### 3.1 Add Transitional Document Warning

**Add at top:**

```markdown
<!-- 
  ℹ️ THIS IS A TRANSITIONAL DOCUMENT
  
  This Functional Specification bridges Business Analysis and Feature Canon.
  
  LIFECYCLE:
  1. Created during functional elaboration
  2. Used to refine Feature Canon
  3. RETIRED after Feature Canon stabilizes
  
  Once the Feature Canon (F-XXX.md) is complete and stable,
  this document should be archived and marked as superseded.
-->
```

#### 3.2 Add Retirement Checklist

**Add section:**

```markdown
## Document Retirement

> This document should be retired when:

- [ ] Feature Canon (F-XXX) is complete
- [ ] All business rules transferred to Feature Canon
- [ ] All edge cases documented in Feature Canon
- [ ] Stakeholder validation complete
- [ ] Feature Canon is source of truth

**Retirement Status:** [ ] Active / [ ] Superseded  
**Superseded By:** [F-XXX](../features/F-XXX-name.md)  
**Retirement Date:** ________________
```

#### 3.3 Add Feature Canon Link

**Add section:**

```markdown
## Target Feature Canon

> This spec elaborates behavior for:

| Feature ID | Feature Name | Link |
|------------|--------------|------|
| F-XXX | [Feature Name](../features/F-XXX-name.md) | |

> ⚠️ The Feature Canon is the authoritative source.
> This spec is a working document during elaboration only.
```

---

## 4. Feature Template Updates

**File:** `feature-template.md`

### Current State

Core template, already strong. Needs section enforcement and implementation-agnostic warning.

### Required Changes

#### 4.1 Add Implementation-Agnostic Warning

**Add at top:**

```markdown
<!-- 
  ⚠️ FEATURE CANON RULES
  
  This Feature file is the SOURCE OF TRUTH for system behavior.
  
  RULES:
  1. Implementation-agnostic (describe WHAT, not HOW)
  2. No technical implementation details
  3. Business rules use BR-XXX format
  4. Change Log is append-only
  
  TEAMSPEC RULES ENFORCED:
  - TS-FEAT-002: All required sections must be present
  - TS-FEAT-003: Feature ID must be unique
-->
```

#### 4.2 Enforce Mandatory Sections

**Add section checklist:**

```markdown
## Section Checklist

<!-- TEAMSPEC RULE: TS-FEAT-002 - All sections required -->

| Section | Status | Notes |
|---------|--------|-------|
| Purpose | [ ] | Why this feature exists |
| Scope | [ ] | What's in and out |
| Actors/Personas | [ ] | Who uses it |
| Main Flow | [ ] | Primary behavior |
| Business Rules | [ ] | BR-XXX format |
| Edge Cases | [ ] | Known exceptions |
| Non-Goals | [ ] | Explicitly excluded |
| Change Log | [ ] | Story references |

> ⚠️ Feature cannot be used until all sections are complete.
```

#### 4.3 Add Change Log Format

**Update Change Log section:**

```markdown
## Change Log

<!-- TEAMSPEC RULE: TS-DOD-001 - Stories must be referenced here -->

| Date | Story ID | Change Description | Changed By |
|------|----------|-------------------|------------|
| YYYY-MM-DD | S-XXX | Initial creation | FA Name |
| YYYY-MM-DD | S-XXX | [Description of change] | FA Name |

> ⚠️ Every completed story that adds/changes behavior MUST be logged here.
> This is enforced by TS-DOD-001.
```

#### 4.4 Add Story Ledger Reference

**Add at bottom:**

```markdown
## Story Ledger Reference

> All stories that have modified this feature:

See [story-ledger.md](./story-ledger.md) for the complete history.

**Last Story:** S-XXX  
**Last Update:** YYYY-MM-DD
```

---

## 5. Sprint Template Updates

**File:** `sprint-template.md`

### Current State

Operational template, good structure. Needs scope definition warning.

### Required Changes

#### 5.1 Add Scope Definition Warning

**Add at top:**

```markdown
<!-- 
  ⚠️ SPRINT ≠ SCOPE DEFINITION
  
  This sprint is a TIME-BOXED execution snapshot.
  
  RULES:
  1. Sprint does not define scope (Features do)
  2. Sprint does not change priority (BA does)
  3. Only SM can modify sprint contents
  4. Scope changes require explicit Decision Log entry
  
  After sprint commitment, scope changes must be logged in /decisions/
-->
```

#### 5.2 Add Scope Freeze Notice

**Add section:**

```markdown
## Scope Freeze Notice

**Sprint Committed:** [ ] Yes / [ ] No  
**Commitment Date:** ________________

> ⚠️ After commitment, any scope change requires:
> 1. SM to facilitate discussion
> 2. BA to approve scope change
> 3. Decision logged in /decisions/DEC-XXX.md
> 4. Story removed/added with explicit note

**Scope Changes This Sprint:**

| Date | Story | Change | Decision | Approved By |
|------|-------|--------|----------|-------------|
| | | | | |
```

#### 5.3 Add Dev Plan Column to Committed Stories

**Update committed stories table:**

```markdown
## Committed Stories

<!-- TEAMSPEC RULE: TS-DEVPLAN-001 - Dev plan required -->

| Story ID | Title | Points | Dev Plan | Status |
|----------|-------|--------|----------|--------|
| S-XXX | [Title](../stories/ready-for-development/S-XXX.md) | X | [Plan](../dev-plans/story-XXX-tasks.md) | Not Started |

> ⚠️ All committed stories must have a Dev Plan before implementation starts.
```

---

## 6. QA Templates

**Files:** `test-case-template.md`, `bug-report-template.md`, `uat-template.md`

### Current State

Already excellent and aligned with Feature Canon model.

### Required Changes

#### 6.1 Bug Report Classification

**Ensure bug classification section includes:**

```markdown
## Bug Classification

<!-- TEAMSPEC RULE: TS-QA-002 - Exactly one must be checked -->

**Select exactly ONE:**

- [ ] **Implementation defect** — Code doesn't match Feature Canon
- [ ] **Feature Canon wrong** — Feature Canon doesn't match business intent
- [ ] **Undocumented behavior** — Neither code nor Feature Canon covers this

> Based on classification:
> - Implementation defect → DEV fixes code
> - Feature Canon wrong → FA updates Feature Canon
> - Undocumented behavior → FA clarifies with BA, updates Feature Canon
```

#### 6.2 Test Case Feature Link

**Ensure feature link is prominent:**

```markdown
## Test Case Reference

**Feature:** [F-XXX — Feature Name](../../features/F-XXX-name.md)  
**Test Level:** Feature (not Story)

<!-- TEAMSPEC RULE: TS-DOD-002 - Tests are feature-level -->

> ⚠️ Test cases are canonical and feature-level.
> Do not create story-specific test cases.
> Test against Feature Canon, not individual stories.
```

---

## 7. ADR Template Updates

**File:** `adr-template.md`

### Current State

Good structure, needs explicit feature linking.

### Required Changes

#### 7.1 Add Feature Link Section

**Add section:**

```markdown
## Related Features

<!-- TEAMSPEC RULE: TS-ADR-002 - ADR must link to features -->

| Feature ID | Feature Name | Impact |
|------------|--------------|--------|
| F-XXX | [Feature Name](../features/F-XXX-name.md) | High/Medium/Low |

> This ADR applies to the features listed above.
> Any changes to this ADR require review of impacted features.
```

#### 7.2 Add Decision Link Section

**Add section:**

```markdown
## Related Decisions

| Decision ID | Decision Title | Link |
|-------------|----------------|------|
| DEC-XXX | [Decision Title](../decisions/DEC-XXX-name.md) | |

> If this ADR was triggered by a business decision, link it here.
```

---

## 8. Decision Log Template Updates

**File:** `decision-template.md`

### Current State

Good structure, needs explicit feature linking.

### Required Changes

#### 8.1 Add Feature Link Section

**Add section:**

```markdown
## Impacted Features

<!-- TEAMSPEC RULE: TS-DEC-001 - Decision must link to features -->

| Feature ID | Feature Name | Impact Description |
|------------|--------------|-------------------|
| F-XXX | [Feature Name](../features/F-XXX-name.md) | How this decision affects the feature |

> ⚠️ At least one feature must be linked.
> If this decision doesn't impact any feature, it may not need to be logged.
```

---

## Implementation Plan

### Phase 1: Critical Templates (Week 1)

| Template | Changes | Owner |
|----------|---------|-------|
| Story Template | Delta enforcement, FA gate, linter refs | FA |
| Feature Template | Section enforcement, change log format | BA/FA |

### Phase 2: Supporting Templates (Week 2)

| Template | Changes | Owner |
|----------|---------|-------|
| Business Analysis | Source of truth warning, feature link | BA |
| Functional Spec | Retirement note, superseded link | FA |
| Sprint Template | Scope freeze, dev plan column | SM |

### Phase 3: QA & Decision Templates (Week 3)

| Template | Changes | Owner |
|----------|---------|-------|
| Bug Report | Classification enforcement | QA |
| Test Case | Feature-level emphasis | QA |
| ADR | Feature/decision links | SA |
| Decision Log | Feature link requirement | BA |

---

## Validation Checklist

### Per-Template Validation

For each updated template, verify:

- [ ] Role ownership marker present
- [ ] Source of truth warning (if not Feature Canon)
- [ ] Linter rules referenced
- [ ] Required sections enforced
- [ ] Feature Canon links present
- [ ] Delta format enforced (for stories)
- [ ] Classification options present (for bugs)

### System Validation

After all templates updated:

- [ ] Create test story using new template → verify linter catches violations
- [ ] Create test feature → verify all sections required
- [ ] Create test bug → verify classification enforced
- [ ] Test sprint workflow → verify dev plan column used

---

## References

- [ROLES_AND_RESPONSIBILITIES.md](./ROLES_AND_RESPONSIBILITIES.md)
- [WORKFLOW.md](./WORKFLOW.md)
- [LINTER_RULES_SPECIFICATION.md](./LINTER_RULES_SPECIFICATION.md)
- [PROJECT_STRUCTURE.yml](../context/PROJECT_STRUCTURE.yml)
