# F-XXX: [Feature Name]

<!-- 
  ⚠️ FEATURE CANON RULES
  
  This Feature file is the SOURCE OF TRUTH for system behavior.
  
  RULES:
  1. Implementation-agnostic (describe WHAT, not HOW)
  2. No technical implementation details
  3. Business rules use BR-XXX format
  4. Change Log is append-only
  
  TEAMSPEC RULES ENFORCED:
  - TS-FEAT-001: Feature must have unique ID
  - TS-FEAT-002: All required sections must be present
  - TS-FEAT-003: Feature ID must be unique
-->

> **Template Version**: 2.0  
> **Last Updated**: 2026-01-07

---

## Metadata

| Field | Value |
|-------|-------|
| **Feature ID** | F-XXX |
| **Status** | Planned / Active / Deprecated / Retired |
| **Owner** | [BA creates, FA maintains behavior] |
| **Created** | YYYY-MM-DD |
| **Last Updated** | YYYY-MM-DD |

**Document Ownership:**
- **BA owns:** Purpose, Business Value, Scope (In/Out)
- **FA owns:** Current Behavior, Business Rules, Edge Cases

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
| Business Rules | [ ] | BR-XXX format |
| Edge Cases | [ ] | Known exceptions |
| Non-Goals | [ ] | Explicitly excluded capabilities |
| Change Log | [ ] | Story references |

> ⚠️ Feature cannot be referenced by stories until all sections are complete.

---

## Governing Decisions

_Business decisions that shaped this feature's scope, behavior, or priority._

| Decision ID | Summary | Impact on This Feature |
|-------------|---------|------------------------|
| [DEC-XXX](../decisions/DEC-XXX-*.md) | [One-line decision summary] | [Scoped in / Scoped out / Behavior changed / Priority set] |

---

## Purpose

> **Owner:** BA (Business Analyst)

_One to three sentences describing what this feature enables users to do._

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
> ⚠️ **AUTHORITATIVE SECTION**: This describes what the system does TODAY.  
> Update this section whenever a story changes observable behavior.

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

_Logic that governs this feature's behavior._

| Rule ID | Rule Description | Applies When |
|---------|------------------|--------------|
| BR-XXX-001 | [Rule description] | [Context] |
| BR-XXX-002 | [Rule description] | [Context] |

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
| [F-XXX] | [Depends on / Extends / Conflicts with] |

---

## Change Log

<!-- TEAMSPEC RULE: TS-DOD-001 - Stories must be referenced here -->

> ⚠️ **APPEND-ONLY**: Never delete entries. This is the audit trail.  
> Every completed story that adds/changes behavior MUST be logged here.

| Date | Story ID | Change Summary | Author |
|------|----------|----------------|--------|
| YYYY-MM-DD | — | Initial feature creation | [BA Name] |
| YYYY-MM-DD | S-XXX | [Description of change] | [FA Name] |

---

## Story Ledger Reference

> All stories that have modified this feature:

See [story-ledger.md](./story-ledger.md) for the complete history.

**Last Story:** S-XXX  
**Last Update:** YYYY-MM-DD

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
| TS-FEAT-001 | Feature file must exist before stories can reference it |
| TS-FEAT-002 | All required sections must be present |
| TS-FEAT-003 | Feature ID must be unique |
| TS-DOD-001 | Change Log must be updated when stories complete |
