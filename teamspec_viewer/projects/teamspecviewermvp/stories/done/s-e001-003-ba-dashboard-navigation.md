---
# === LLM Retrieval Metadata ===
artifact_kind: story
spec_version: "4.0"
template_version: "4.0.1"
title: "BA Dashboard Navigation Flow"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "s-e001-003"
filename_pattern: "s-e001-003-ba-dashboard-navigation.md"

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
  - BA
  - dashboard
  - business analysis
  - increments
aliases:
  - BA navigation
anti_keywords:
  - implementation detail
---

# Story: `s-e001-003-ba-dashboard-navigation`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-14

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e001-003 |
| **Epic** | epic-TSV-001 |
| **Status** | Done |
| **Estimate** | 3 SP |
| **Author** | AI-Generated |
| **Sprint** | — |

---

## User Story

**As a** BA,  
**I want** a dashboard that lists BA artifacts for the selected product/project context,  
**So that** I can quickly open BA documents and BA increments without navigating folders.

---

## Linked Epic

| Epic ID | Epic Name | Product |
|---------|-----------|---------|
| [epic-TSV-001](../../epics/epic-TSV-001-dashboard-implementation.md) | Dashboard implementation (BA/FA) | Teamspec Viewer (TSV) |

---

## Linked Feature-Increment

| FI ID | Description |
|-------|-------------|
| [fi-TSV-001](../../feature-increments/fi-TSV-001-ba-fa-role-dashboards.md) | BA/FA dashboards increment |

---

## Feature Impact

### Impact Type

- [x] **Adds Behavior**
- [ ] **Changes Behavior**
- [ ] **Fixes Defect**
- [ ] **Technical Only**

### AS-IS (current behavior)

**Reference:** f-TSV-002, Section: Current Behavior → Role Dashboard Content

- No deployed BA dashboard content exists in production (greenfield product).

### TO-BE (new behavior)

- When the user selects the **BA** role, the dashboard lists:
  - Product Business Analysis documents for `teamspec-viewer`
  - Project Business Analysis Increments for `teamspecviewermvp`
- Selecting an item opens the artifact for reading.

---

## Acceptance Criteria (AC)

### Scenario 1: BA dashboard lists BA artifacts

- **Given** the user selected the BA role
- **When** the BA dashboard is displayed
- **Then** the dashboard includes entry points to product BA documents
- **And** the dashboard includes entry points to project BA increments

### Scenario 2: Open a BA artifact

- **Given** the BA dashboard lists a BA artifact
- **When** the user selects an artifact
- **Then** the artifact content is displayed for reading

---

## Technical Notes

- **API**: GET /products/{productId}/business-analysis, GET /projects/{projectId}/business-analysis-increments
- **DB**: None (file-system based via Hono server)
- **TAI**: Aligns with TA-002 (Hono file serving for BA artifacts)

---

## UX & Copy

- Group label: “Business Analysis”

---

## Sources Consulted

- teamspec_viewer/projects/teamspecviewermvp/feature-increments/fi-TSV-001-ba-fa-role-dashboards.md → Section 3.1 “Role Dashboard Content (MVP)” (BA dashboard)

## Unresolved Items

- Exact product/project selection mechanism used to determine "selected context" → MVP hardcodes `teamspec-viewer` product and `teamspecviewermvp` project
