---
# === LLM Retrieval Metadata ===
artifact_kind: epic
spec_version: "4.0"
template_version: "4.0.1"
title: "{Short epic title (20-40 chars)}"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "epic-{PRX}-{NNN}"
filename_pattern: "epic-{PRX}-{NNN}-{description}.md"

# === Required Relationships ===
links_required:
  - type: product
    pattern: "product.yml"
    optional: false
  - type: feature-increment
    pattern: "fi-{PRX}-{NNN}"
    optional: false
    note: "At least one FI required"

# === Search Optimization ===
keywords:
  - epic
  - story container
  - business outcome
  - delivery grouping
  - feature delivery
aliases:
  - initiative
  - theme
  - capability group
anti_keywords:
  - individual task
  - implementation detail
  - code
  - test case

# === Generation Contract ===
completion_rules:
  placeholders: "Fill {braces} only; leave {TBD} if unknown"
  id_generation: "Use product PRX; NNN is sequential within project"
  story_naming: "Stories use s-eXXX-YYY pattern where XXX matches epic NNN"
  required_sections:
    - Epic Summary
    - Linked Product
    - Feature-Increments
    - TO-BE / Business Value
  optional_sections:
    - Dependencies
    - Risks & Assumptions
    - Technical Considerations
---

# Epic: `epic-{PRX}-{NNN}-{description}`

<!-- 
  ⚠️ TEAMSPEC 4.0 EPIC TEMPLATE
  
  This Epic groups related Feature-Increments for delivery.
  
  RULES:
  - Must link to at least one Feature-Increment (fi-PRX-XXX)
  - Must define TO-BE/Business Value section
  - Stories belong to Epics via filename (s-eXXX-YYY)
  
  TEAMSPEC RULES ENFORCED:
  - TS-EPIC-001: Epic must link to Feature-Increments
  - TS-EPIC-002: Epic must define TO-BE state
  - TS-EPIC-003: Epic ID must be unique
-->

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-12

---

## Metadata

| Field | Value |
|-------|-------|
| **Epic ID** | epic-{PRX}-{NNN} |
| **Status** | Draft / Proposed / Approved / In Progress / Done |
| **Product** | {product-id} ({PRX}) |
| **Owner** | FA (Functional Analyst) |
| **Created** | YYYY-MM-DD |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Groups Feature-Increments)  
**Lifecycle:** Project-bound, archived after completion

---

## Epic Summary

> **Contract:** High-level description of what this epic delivers (1-3 sentences + user story format).  
> **Required precision:** Business outcome focus, not implementation details.  
> **Not this:** Technical approach, individual story details, or full feature specs.

**As a** [Persona/Stakeholder],  
**I want** [High-level capability],  
**So that** [Business value/outcome].

---

## Linked Product

> ⚠️ **MANDATORY**: Link to the target product.

| Product ID | PRX | Product Name |
|------------|-----|--------------|
| [product-id](../../products/product-id/product.yml) | PRX | [Product Name] |

---

## Feature-Increments

> **Contract:** Links to all Feature-Increments this epic delivers. At least one required.  
> **Required precision:** FI ID, description, status for each.  
> **Not this:** Story-level details or implementation tasks.
>
> ⚠️ **MANDATORY**: At least one Feature-Increment must be linked.  
> **TEAMSPEC RULE:** TS-EPIC-001 - Feature-Increment link required

| FI ID | Description | Status |
|-------|-------------|--------|
| [fi-PRX-001](../feature-increments/fi-PRX-001-description.md) | [Brief description] | Draft |
| [fi-PRX-002](../feature-increments/fi-PRX-002-description.md) | [Brief description] | Draft |

---

## TO-BE / Business Value

> **Contract:** Defines the target state and measurable business value this epic delivers.  
> **Required precision:** Specific metrics, user/business impact statements.  
> **Not this:** Vague goals, implementation details, or technical outcomes.
>
> ⚠️ **MANDATORY**: Define the target state or business value.  
> **TEAMSPEC RULE:** TS-EPIC-002 - TO-BE section required

### Value Proposition

_What value does completing this Epic deliver?_

- **User Impact**: [How does this improve user experience?]
- **Business Impact**: [Revenue, efficiency, compliance, etc.]
- **Success Metrics**: [How do we measure success?]

### Target State

_Describe the expected state after this Epic is completed._

---

## Scope

### In Scope

- [ ] [Capability/Change 1]
- [ ] [Capability/Change 2]
- [ ] [Capability/Change 3]

### Out of Scope

- [ ] [Excluded capability 1]
- [ ] [Excluded capability 2]

---

## Stories

_Stories belonging to this Epic follow the naming pattern `s-eXXX-YYY-description.md`._

| Story ID | Description | Status | Sprint |
|----------|-------------|--------|--------|
| [s-eXXX-001](../stories/backlog/s-eXXX-001-description.md) | [Brief description] | Backlog | — |
| [s-eXXX-002](../stories/backlog/s-eXXX-002-description.md) | [Brief description] | Backlog | — |

**Total Stories:** X  
**Completed:** X  
**Remaining:** X

---

## Dependencies

### Depends On

_Other Epics or Features this Epic depends on._

| Dependency | Type | Status | Impact |
|------------|------|--------|--------|
| [epic-PRX-XXX](../epics/epic-PRX-XXX-description.md) | Blocks | Done | Must complete first |
| [f-PRX-XXX](../../products/product-id/features/f-PRX-XXX-description.md) | Requires | Active | Feature must exist |

### Blocked By

_External blockers or waiting items._

- [ ] [Blocker 1]
- [ ] [Blocker 2]

---

## Risks & Assumptions

### Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| [Risk 1] | High/Medium/Low | High/Medium/Low | [Mitigation plan] |

### Assumptions

- [Assumption 1]
- [Assumption 2]

---

## Technical Considerations

_High-level technical approach (SA input)._

- **Architecture Impact**: [Description]
- **Related TAI**: [tai-PRX-XXX if applicable]
- **Performance Considerations**: [Description]

---

## Acceptance Criteria

_Epic-level acceptance criteria (rolled up from stories)._

- [ ] All linked stories marked as Done
- [ ] Feature Canon updated via `ts:po sync`
- [ ] UAT completed and signed off

---

## Timeline

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| Epic Approved | YYYY-MM-DD | [ ] |
| All Stories Refined | YYYY-MM-DD | [ ] |
| Development Start | YYYY-MM-DD | [ ] |
| Development Complete | YYYY-MM-DD | [ ] |
| UAT Sign-off | YYYY-MM-DD | [ ] |
| Canon Synced | YYYY-MM-DD | [ ] |

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| YYYY-MM-DD | @author | Initial draft |

---

## Linter Rules Enforced

| Rule | Description | Status |
|------|-------------|--------|
| TS-EPIC-001 | Feature-Increment link required | Checked on save |
| TS-EPIC-002 | TO-BE section required | Checked on save |
| TS-EPIC-003 | Epic ID must be unique | Checked on save |
| TS-NAMING-EPIC | Naming convention check | Checked on save |
