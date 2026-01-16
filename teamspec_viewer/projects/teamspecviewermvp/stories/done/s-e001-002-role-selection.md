---
# === LLM Retrieval Metadata ===
artifact_kind: story
spec_version: "4.0"
template_version: "4.0.1"
title: "User Role Selection Screen"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "s-e001-002"
filename_pattern: "s-e001-002-role-selection.md"

# === Required Relationships ===
links_required:
  - type: epic
    pattern: "epic-TSV-001"
    optional: false
  - type: feature-increment
    pattern: "fi-TSV-001"
    optional: true

# === Search Optimization ===
keywords:
  - role selection
  - BA
  - FA
  - dashboard
aliases:
  - select role
anti_keywords:
  - full behavior
  - implementation detail
---

# Story: `s-e001-002-role-selection`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-14

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e001-002 |
| **Epic** | epic-TSV-001 |
| **Status** | Done |
| **Estimate** | 2 SP |
| **Author** | AI-Generated |
| **Sprint** | — |

---

## User Story

**As a** BA or FA,  
**I want** to select my role before viewing a dashboard (and switch roles within a session),  
**So that** I can access the dashboard content relevant to my role.

---

## Linked Epic

| Epic ID | Epic Name | Product |
|---------|-----------|---------|
| [epic-TSV-001](../../epics/epic-TSV-001-dashboard-implementation.md) | Dashboard implementation (BA/FA) | Teamspec Viewer (TSV) |

---

## Linked Feature-Increment

| FI ID | Description |
|-------|-------------|
| [fi-TSV-001](../../feature-increments/fi-TSV-001-ba-fa-role-dashboards.md) | BA/FA role selection + dashboards |

---

## Feature Impact

### Impact Type

- [x] **Adds Behavior**
- [ ] **Changes Behavior**
- [ ] **Fixes Defect**
- [ ] **Technical Only**

### AS-IS (current behavior)

**Reference:** f-TSV-002, Section: Current Behavior → Role Selection

- No deployed role selection behavior exists in production (greenfield product).

### TO-BE (new behavior)

- The user can select either **BA** or **FA** as their role.
- The currently selected role is always visible while navigating artifacts.
- The user can switch roles within the same session.

---

## Acceptance Criteria (AC)

### Scenario 1: Select BA role

- **Given** the user is not yet in a role dashboard
- **When** the user selects the **BA** role
- **Then** the BA dashboard is shown
- **And** the UI indicates the current role is **BA**

### Scenario 2: Select FA role

- **Given** the user is not yet in a role dashboard
- **When** the user selects the **FA** role
- **Then** the FA dashboard is shown
- **And** the UI indicates the current role is **FA**

### Scenario 3: Switch roles within a session

- **Given** the user is currently viewing the BA dashboard
- **When** the user switches to the FA role
- **Then** the FA dashboard is shown

---

## Technical Notes

- **API**: None (role state is frontend-only in MVP)
- **DB**: None (no persistence for role selection in MVP)
- **TAI**: Aligns with TA-001 (React Context for state management)

---

## UX & Copy

- Role labels: “BA”, “FA”

---

## Sources Consulted

- teamspec_viewer/projects/teamspecviewermvp/feature-increments/fi-TSV-001-ba-fa-role-dashboards.md → Section 3.1 “Role Selection (MVP)”
- teamspec_viewer/projects/teamspecviewermvp/epics/epic-TSV-001-dashboard-implementation.md → Target state (role selection)

## Unresolved Items

- Persist role across sessions → Out of scope for MVP (browser session only, per fi-TSV-001)
