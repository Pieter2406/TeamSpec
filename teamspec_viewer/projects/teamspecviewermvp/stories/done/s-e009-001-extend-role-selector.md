---
artifact_kind: story
spec_version: '4.0'
template_version: 4.0.1
title: Extend RoleSelector Component
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound
id_pattern: s-e009-001
filename_pattern: s-e009-001-extend-role-selector.md
links_required:
  - type: epic
    pattern: epic-TSV-009
    optional: false
  - type: feature-increment
    pattern: fi-TSV-009
    optional: true
keywords:
  - role selector
  - DEV role
  - SA role
  - QA role
  - role selection
aliases:
  - role picker
anti_keywords:
  - implementation detail
status: Done
---

# Story: `s-e009-001-extend-role-selector`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-17

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e009-001 |
| **Epic** | epic-TSV-009 |
| **Status** | Done|
| **Estimate** | 2 SP |
| **Author** | FA |
| **Sprint** | — |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Delta to Feature Canon)  
**Lifecycle:** Sprint-bound, archived after completion

---

## User Story

**As a** Developer, Solution Architect, or QA Engineer,  
**I want** to select my role from the RoleSelector component,  
**So that** I can access a dashboard tailored to my role's artifact types.

---

## Linked Epic

| Epic ID | Epic Name | Product |
|---------|-----------|---------|
| [epic-TSV-009](../../epics/epic-TSV-009-dev-sa-qa-dashboards.md) | DEV/SA/QA Role Dashboards | TeamSpec Viewer (TSV) |

---

## Linked Feature-Increment

| FI ID | Description |
|-------|-------------|
| [fi-TSV-009](../../feature-increments/fi-TSV-009-dev-sa-qa-role-dashboards.md) | DEV/SA/QA role selection + dashboard navigation |

---

## Feature Impact

### Impact Type

- [ ] **Adds Behavior** — New capability not currently in the feature
- [x] **Changes Behavior** — Modifies existing documented behavior
- [ ] **Fixes Defect**
- [ ] **Technical Only**

### AS-IS (current behavior)

**Reference:** f-TSV-002, Section: Role Selection

- RoleSelector component displays BA and FA role options only
- User can select between BA and FA roles
- Selection is stored in RoleContext and persists for the session
- Role switching via header badge is supported

### TO-BE (new behavior)

- RoleSelector component displays **five** role options: BA, FA, DEV, SA, QA
- Each role is displayed with:
  - Role name (e.g., "Developer", "Solution Architect", "QA Engineer")
  - Role code (e.g., "DEV", "SA", "QA")
  - Brief description of artifact types managed by role
- User can select any of the five roles
- Selection triggers navigation to the corresponding dashboard component
- Role switching between all five roles is supported via header badge

---

## Acceptance Criteria (AC)

### Scenario 1: Display All Role Options

- **Given** the user opens the TeamSpec Viewer
- **When** the RoleSelector component is displayed
- **Then** five role options are visible: BA, FA, DEV, SA, QA

### Scenario 2: Select DEV Role

- **Given** the RoleSelector is displayed
- **When** the user clicks on "Developer (DEV)"
- **Then** the role context is updated to "DEV"
- **And** the user is navigated to the DEV dashboard

### Scenario 3: Select SA Role

- **Given** the RoleSelector is displayed
- **When** the user clicks on "Solution Architect (SA)"
- **Then** the role context is updated to "SA"
- **And** the user is navigated to the SA dashboard

### Scenario 4: Select QA Role

- **Given** the RoleSelector is displayed
- **When** the user clicks on "QA Engineer (QA)"
- **Then** the role context is updated to "QA"
- **And** the user is navigated to the QA dashboard

### Scenario 5: Role Switching via Header Badge

- **Given** the user has selected DEV role
- **When** the user clicks the role badge in the header
- **Then** the RoleSelector is displayed
- **And** the user can switch to any other role (BA, FA, SA, QA)

### Scenario 6: Role Descriptions Displayed

- **Given** the RoleSelector is displayed
- **When** viewing the DEV option
- **Then** it shows description: "Dev-plans, stories, technical docs"
- **When** viewing the SA option
- **Then** it shows description: "Solution designs, technical architectures"
- **When** viewing the QA option
- **Then** it shows description: "Test cases, regression tests, bug reports"

---

## Technical Notes

- **File**: `frontend/src/components/RoleSelector.tsx`
- **Context**: Update `RoleContext.tsx` to support 'DEV' | 'SA' | 'QA' role types
- **Types**: Extend `Role` type to include new roles
- **Icons**: Add appropriate icons for DEV (CodeIcon), SA (ArchitectureIcon), QA (BugReportIcon)

---

## UX & Copy

| Role | Display Name | Description |
|------|-------------|-------------|
| DEV | Developer | Dev-plans, stories, technical docs |
| SA | Solution Architect | Solution designs, technical architectures |
| QA | QA Engineer | Test cases, regression tests, bug reports |

---

## DoR Checklist (Feature Alignment)

- [x] Linked to Epic (via filename s-e009-001)
- [x] Linked Epic exists in epics folder
- [x] Linked Feature-Increment exists
- [x] Story describes DELTA only, not full behavior
- [x] Feature impact type is marked
- [x] ACs map to feature behavior / business rules

## DoR Checklist (Standard)

- [x] AC Defined (Gherkin or checklist)
- [x] UX Attached (or "No UI required") — UX copy provided
- [x] Dependencies Clear — None
- [x] Estimated — 2 SP
- [x] Small enough for one sprint

## DoD Checklist

- [ ] Code Complete
- [ ] Tests Passed
- [ ] Feature-Increment TO-BE complete (if behavior changed)
- [ ] FA Accepted
- [ ] Story marked Done in backlog
