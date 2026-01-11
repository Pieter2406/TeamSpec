# Epic: `epic-PRX-XXX-description`

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

> **Template Version**: 4.0  
> **Last Updated**: 2026-01-10

---

## Metadata

| Field | Value |
|-------|-------|
| **Epic ID** | epic-PRX-XXX |
| **Status** | Draft / Proposed / Approved / In Progress / Done |
| **Product** | [product-id] (PRX) |
| **Owner** | [BA/PO Name] |
| **Created** | YYYY-MM-DD |

**Document Owner:** BA (Business Analyst) / PO (Product Owner)  
**Artifact Type:** Execution (Groups Feature-Increments)  
**Lifecycle:** Project-bound, archived after completion

---

## Epic Summary

_One to three sentences describing the epic's purpose and value._

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

> ⚠️ **MANDATORY**: At least one Feature-Increment must be linked.  
> **TEAMSPEC RULE:** TS-EPIC-001 - Feature-Increment link required

| FI ID | Description | Status |
|-------|-------------|--------|
| [fi-PRX-001](../feature-increments/fi-PRX-001-description.md) | [Brief description] | Draft |
| [fi-PRX-002](../feature-increments/fi-PRX-002-description.md) | [Brief description] | Draft |

---

## TO-BE / Business Value

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
