# Business Analysis: `ba-{PRX}-{NNN}-{description}`

<!--
  ⚠️ THIS IS A PLANNING ARTIFACT, NOT SOURCE OF TRUTH

  This Business Analysis document captures analysis and decisions
  during the planning phase.

  SOURCE OF TRUTH:
  - For current system behavior → Feature Canon (f-{PRX}-{NNN}.md)
  - For business decisions → Decision Log (dec-{PRX}-{NNN}.md)

  This document becomes HISTORICAL after Feature Canon is created.

  NAMING PATTERN: ba-{PRX}-{NNN}-{description}.md
  EXAMPLE: ba-ACME-001-checkout-process.md
-->

> **Template Version**: 4.0
> **Last Updated**: 2026-01-11

---

**Document Owner:** BA (Business Analyst)
**Artifact Type:** Business Analysis (Product Canon)
**Lifecycle:** Permanent, updated via bai-* increments

| Metadata | Details |
| :--- | :--- |
| **Status** | Draft / In Review / Approved |
| **Owner** | [BA Name] |
| **Stakeholders** | [Names] |
| **Created** | YYYY-MM-DD |

---

## 1. Executive Summary

- **Problem Statement**: Who is the user? What is their pain?
- **Proposed Solution**: High-level description.
- **Value**: Why are we doing this? (Revenue, Compliance, UX).

---

## 2. Scope

### In Scope

- [Feature 1]
- [Feature 2]

### Out of Scope (Non-Goals)

- [Feature 3]
- [Migration of X]

---

## 3. Related Feature Canon

> ⚠️ Link to Feature Canon files created from this analysis.
> Once features are created, the Feature Canon is authoritative.
> This document is retained for historical context only.

| Feature ID | Feature Name | Status | Link |
|------------|--------------|--------|------|
| [f-{PRX}-{NNN}](../features/f-{PRX}-{NNN}-*.md) | [Feature Name] | Draft / Active | |

---

## 4. Business Process

### Current State (As-Is)

> Describe how users solve the problem today.

### Future State (To-Be)

> Describe the new workflow. This becomes the Feature Canon "Current Behavior" after implementation.

---

## 5. User Journeys / Personas

| Persona | Journey | Goal |
|---------|---------|------|
| [Persona 1] | [Action sequence] | [What they achieve] |
| [Persona 2] | [Action sequence] | [What they achieve] |

---

## 6. Business Rules & Logic

> These business rules will be documented in the Feature Canon as BR-XXX references.

| Rule ID | Description | Context |
|---------|-------------|---------|
| BR-001 | [Rule description] | [When it applies] |
| BR-002 | [Rule description] | [When it applies] |

---

## 7. Data & Reporting Requirements

- **Data Captured**: [Fields]
- **Reporting Needs**: [Reports needed]

---

## 8. Risks & Constraints

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk 1] | Low/Med/High | Low/Med/High | [Mitigation] |

### Constraints

- **Timeline**: [Deadlines]
- **Budget**: [Budget constraints]
- **Technical**: [Legacy systems, integrations]

---

## 9. Success Metrics (KPIs)

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| [Metric 1] | [Target value] | [How measured] |
| [Metric 2] | [Target value] | [How measured] |

---

## 10. Decisions Made

> Business decisions from this analysis should be logged in /decisions/

| Decision ID | Summary | Link |
|-------------|---------|------|
| [DEC-XXX](../decisions/DEC-XXX-*.md) | [Decision summary] | |

---

## Document Lifecycle

> ⚠️ **IMPORTANT**: This document is a **planning artifact**.
> 
> After Feature Canon is established and updated through story implementation:
> - This document becomes **historical reference** only
> - The **Feature Canon** is the source of truth for current behavior
> - Do NOT use this document to understand how the system works today
> 
> If you need to know what the system does now, read `/features/F-XXX-name.md`

### Status Transitions

| Status | Meaning |
|--------|---------|
| Draft | Analysis in progress |
| In Review | Stakeholder review |
| Approved | Ready for Feature Canon creation |
| **Superseded** | Feature Canon is now authoritative |

**Current Status:** Draft  
**Superseded By:** [F-XXX](../features/F-XXX-name.md) (when applicable)  
**Superseded Date:** ________________
