---
# === LLM Retrieval Metadata ===
artifact_kind: feature
spec_version: "4.0"
template_version: "4.0.1"
title: "{Short feature title (20-40 chars)}"

# === Ownership ===
role_owner: FA
artifact_type: Product Canon
canonicality: canon
lifecycle: permanent

# === Naming ===
id_pattern: "f-{PRX}-{NNN}"
filename_pattern: "f-{PRX}-{NNN}-{description}.md"

# === Required Relationships ===
links_required:
  - type: product
    pattern: "product.yml"
    optional: false
  - type: decision
    pattern: "dec-{PRX}-{NNN}"
    optional: true

# === Search Optimization ===
keywords:
  - feature canon
  - product canon
  - system behavior
  - production truth
  - behavioral specification
  - functional requirements
aliases:
  - requirements document
  - functional specification
  - BRD
anti_keywords:
  - implementation details
  - technical design
  - architecture
  - story
  - delta
  - proposed change

# === Generation Contract ===
completion_rules:
  placeholders: "Fill {braces} only; leave {TBD} if unknown"
  id_generation: "Never invent IDs; use {TBD} until assigned"
  max_lengths:
    purpose: 150 words
    business_value: 300 words
  required_sections:
    - Purpose
    - Business Value
    - In Scope
    - Out of Scope
    - Current Behavior
    - Business Rules
    - Change Log
  optional_sections:
    - Non-Functional Notes
    - Open Questions
    - Implementation References
---

# Feature: `f-{PRX}-{NNN}-{description}`

<!--
  ⚠️ FEATURE CANON RULES

  This Feature file is the SOURCE OF TRUTH for system behavior.

  RULES:
  1. Implementation-agnostic (describe WHAT, not HOW)
  2. No technical implementation details
  3. Business rules use BR-{PRX}-NNN format
  4. Change Log is append-only
  5. Feature ID uses product prefix (PRX)

  NAMING PATTERN: f-{PRX}-{NNN}-{description}.md
  EXAMPLE: f-ACME-001-user-login.md

  TEAMSPEC RULES ENFORCED:
  - TS-FEAT-001: Feature must have unique ID
  - TS-FEAT-002: All required sections must be present
  - TS-FEAT-003: Feature ID must be unique
-->

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-12

---

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Feature (Product Canon)  
**Lifecycle:** Permanent, updated via Canon Sync after deployment

---

## Metadata

| Field | Value |
|-------|-------|
| **Feature ID** | f-{PRX}-{NNN} |
| **Product** | {product-id} ({PRX}) |
| **Status** | Planned / Active / Deprecated / Retired |
| **Owner** | FA (Functional Analyst) |
| **Created** | YYYY-MM-DD |
| **Last Updated** | YYYY-MM-DD |

**Section Ownership:**
- **BA provides:** Purpose, Business Value, Scope (In/Out) via Business Analysis
- **FA owns:** Current Behavior, Business Rules, Edge Cases, all updates

---

## Section Checklist

<!-- TEAMSPEC RULE: TS-FEAT-002 - All sections required -->

| Section | Status | Notes |
|---------|--------|-------|
| Purpose | [ ] | Why this feature exists |
| Business Value | [ ] | Impact and success metrics |
| Scope (In) | [ ] | What's included |
| Scope (Out) | [ ] | What's excluded |
| Actors/Personas | [ ] | Who uses it |
| Current Behavior | [ ] | Primary behavior (authoritative) |
| Business Rules | [ ] | BR-{PRX}-NNN format |
| Edge Cases | [ ] | Known exceptions |
| Non-Goals | [ ] | Explicitly excluded capabilities |
| Change Log | [ ] | Feature-Increment references |

> ⚠️ Feature cannot be referenced by Feature-Increments until all sections are complete.

---

## Governing Decisions

_Business decisions that shaped this feature's scope, behavior, or priority._

| Decision ID | Summary | Impact on This Feature |
|-------------|---------|------------------------|
| [dec-{PRX}-{NNN}](../decisions/dec-{PRX}-{NNN}-*.md) | [One-line decision summary] | [Scoped in / Scoped out / Behavior changed / Priority set] |

---

## Purpose

> **Owner:** BA (Business Analyst)
>
> **Contract:** One to three sentences describing what this feature enables users to do.  
> **Required precision:** User-centric language; focus on capability, not implementation.  
> **Not this:** Technical details, architecture decisions, or HOW it works.

[What capability does this provide? What user need does it address?]

---

## Business Value

> **Owner:** BA (Business Analyst)

_Why this feature matters to the business._

- **User Impact**: [How does this improve user experience?]
- **Business Impact**: [Revenue, efficiency, compliance, etc.]
- **Success Metrics**: [How do we measure success?]

---

## In Scope

> **Owner:** BA (Business Analyst)

_Explicit boundaries of what this feature includes._

- [ ] [Capability 1]
- [ ] [Capability 2]
- [ ] [Capability 3]

---

## Out of Scope

> **Owner:** BA (Business Analyst)

_Explicit boundaries of what this feature does NOT include. Prevents scope creep._

- [ ] [Excluded capability 1]
- [ ] [Excluded capability 2]

---

## Actors / Personas

> **Owner:** BA (Business Analyst)

_Who uses this feature and what are their goals._

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| [Persona 1] | [Brief description] | [What they want to achieve] |
| [Persona 2] | [Brief description] | [What they want to achieve] |

---

## Current Behavior

> **Owner:** FA (Functional Analyst)
>
> **Contract:** Authoritative description of production behavior. Updated ONLY via `ts:po sync` after deployment.  
> **Required precision:** Testable statements in present tense. Reference BR-{PRX}-NNN rules.  
> **Not this:** Proposed changes, future plans, implementation details, or story-level deltas.
>
> ⚠️ **AUTHORITATIVE SECTION**: This describes what the system does TODAY.

### [Behavior Area 1]

[Describe current system behavior in precise, testable terms.]

### [Behavior Area 2]

[Describe current system behavior.]

### User Flows

1. User does X
2. System responds with Y
3. User sees Z

### Edge Cases & Error Handling

| Condition | System Response |
|-----------|-----------------|
| [Edge case 1] | [Response] |
| [Error condition] | [Error handling] |

---

## Business Rules

> **Owner:** FA (Functional Analyst)
>
> **Contract:** Explicit logic governing feature behavior. Each rule has unique BR-{PRX}-NNN ID.  
> **Required precision:** Unambiguous, testable conditions and outcomes.  
> **Not this:** Implementation logic, code patterns, or technical constraints (those go in TA).

| Rule ID | Rule Description | Applies When |
|---------|------------------|--------------|
| BR-{PRX}-001 | [Rule description] | [Context] |
| BR-{PRX}-002 | [Rule description] | [Context] |

---

## Roles & Permissions

_Who can do what within this feature._

| Role | Permissions |
|------|-------------|
| [Role 1] | [Can do X, Y, Z] |
| [Role 2] | [Can do A, B] |
| [Role 3] | [View only] |

---

## Non-Functional Notes

_Performance, security, accessibility, and other quality requirements._

- **Performance**: [Response time expectations, throughput]
- **Security**: [Authentication, authorization, data protection]
- **Accessibility**: [WCAG level, specific requirements]
- **Availability**: [Uptime requirements]

---

## Non-Goals

> **Owner:** BA (Business Analyst)

_Capabilities explicitly NOT included in this feature. Different from Out of Scope—these are things that might seem related but are deliberately excluded._

- [Non-goal 1]: [Why excluded]
- [Non-goal 2]: [Why excluded]

---

## Open Questions

_Unresolved questions that need stakeholder input. Track at feature level, not story level._

| ID | Question | Owner | Status | Resolution |
|----|----------|-------|--------|------------|
| Q-001 | [Question] | [Name] | Open / Resolved | [Answer if resolved] |

---

## Related Features

_Features that interact with or depend on this one._

| Feature ID | Relationship |
|------------|--------------|
| [f-{PRX}-{NNN}](../features/f-{PRX}-{NNN}-*.md) | [Depends on / Extends / Conflicts with] |

---

## Change Log

> **Contract:** Append-only audit trail of all changes synced to this feature.  
> **Required precision:** Date, FI reference, one-line summary, author.  
> **Not this:** Planning notes, proposed changes, or draft entries.
>
> ⚠️ **APPEND-ONLY**: Never delete entries. This is the audit trail.

| Date | Source | Change Summary | Author |
|------|--------|----------------|--------|
| YYYY-MM-DD | — | Initial feature creation | [FA Name] |
| YYYY-MM-DD | fi-{PRX}-{NNN} | [Description of change synced from FI] | [FA Name] |

---

## Feature-Increment Ledger

> All Feature-Increments that have modified this feature (via Canon Sync):

| FI ID | Project | Sync Date | Summary |
|-------|---------|-----------|---------|
| [fi-{PRX}-{NNN}](../../projects/{project-id}/feature-increments/fi-{PRX}-{NNN}-*.md) | {project-id} | YYYY-MM-DD | [Change summary] |

**Last FI:** fi-{PRX}-{NNN}
**Last Sync:** YYYY-MM-DD

---

## Implementation References

_Links to code, APIs, or technical documentation. Maintained by DEV._

- **Primary Service**: [Link or path]
- **API Documentation**: [Link]
- **Database Schema**: [Link or reference]

---

## Linter Rules Enforced

| Rule | Description |
|------|-------------|
| TS-FEAT-001 | Feature file must exist before Feature-Increments can reference it |
| TS-FEAT-002 | All required sections must be present |
| TS-FEAT-003 | Feature ID must be unique within product |
| TS-NAMING-FEAT | Feature naming must follow f-{PRX}-{NNN}-{description}.md pattern |
