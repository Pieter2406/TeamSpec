---
# === LLM Retrieval Metadata ===
artifact_kind: story
spec_version: "4.0"
template_version: "4.0.1"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "s-e002-002"
filename_pattern: "s-e002-002-as-is-to-be-view.md"

# === Required Relationships ===
links_required:
  - type: epic
    pattern: "epic-TSV-002"
    optional: false
  - type: feature-increment
    pattern: "fi-TSV-002"
    optional: false

# === Search Optimization ===
keywords:
  - AS-IS
  - TO-BE
  - delta view
  - comparison
  - feature-increment
aliases:
  - delta comparison view
anti_keywords:
  - full behavior
  - production truth
---

# Story: `s-e002-002-as-is-to-be-view`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-15

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e002-002 |
| **Epic** | epic-TSV-002 |
| **Status** | Backlog |
| **Estimate** | 5 SP |
| **Author** | AI-Generated |
| **Sprint** | — |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Delta to Feature Canon)  
**Lifecycle:** Sprint-bound, archived after completion

---

## User Story

**As a** FA or BA,  
**I want** to see the AS-IS and TO-BE sections of a feature-increment side-by-side or in a tabbed view,  
**So that** I can clearly understand what change the increment proposes relative to current behavior.

---

## Linked Epic

| Epic ID | Epic Name | Product |
|---------|-----------|---------|
| [epic-TSV-002](../../epics/epic-TSV-002-fi-navigation.md) | Feature ↔ FI Navigation | Teamspec Viewer (TSV) |

---

## Linked Feature-Increment

| FI ID | Description |
|-------|-------------|
| [fi-TSV-002](../../feature-increments/fi-TSV-002-ba-fa-feature-increment-navigation.md) | BA/FA Feature-Increment Navigation |

---

## Feature Impact

### Impact Type

- [x] **Adds Behavior**
- [ ] **Changes Behavior**
- [ ] **Fixes Defect**
- [ ] **Technical Only** — Refactor/performance with no user-observable change

### AS-IS (current behavior)

**Reference:** f-TSV-003, Section: Current Behavior

- No deployed FI content presentation exists (greenfield product).
- Users view FI files as raw markdown without structured AS-IS/TO-BE separation.

### TO-BE (new behavior)

- When a feature-increment is selected, the system presents:
  - An **AS-IS** view sourced from the linked product feature's "Current Behavior".
  - A **TO-BE** view sourced from the feature-increment's "Proposed State".
- The presentation uses tabs or side-by-side layout (MVP: tabs).
- Each section is rendered as formatted markdown.

---

## Acceptance Criteria (AC)

### Scenario 1: AS-IS/TO-BE tabs

- **Given** the user has selected a feature-increment (e.g., `fi-TSV-002`)
- **When** the FI detail view loads
- **Then** the system displays tabs for "AS-IS" and "TO-BE" content

### Scenario 2: AS-IS content sourcing

- **Given** the "AS-IS" tab is selected
- **When** the system renders the content
- **Then** the content is sourced from the FI's AS-IS section (which references the linked feature)

### Scenario 3: TO-BE content sourcing

- **Given** the "TO-BE" tab is selected
- **When** the system renders the content
- **Then** the content displays the proposed behavior from the FI's TO-BE section

### Scenario 4: Markdown rendering

- **Given** AS-IS or TO-BE content contains markdown formatting
- **When** the content is displayed
- **Then** markdown is rendered correctly (headers, lists, tables, code blocks)

---

## Technical Notes

- Backend: Parse FI markdown to extract AS-IS (Section 2) and TO-BE (Section 3) content.
- Frontend: `FiDetailView` component with `Tabs` (MUI) for AS-IS/TO-BE switching.
- Consider: Section extraction via markdown heading detection (`## 2. AS-IS`, `## 3. TO-BE`).

---

## Out of Scope

- Automatic diff highlighting between AS-IS and TO-BE.
- Side-by-side split view (future enhancement).
- Inline editing of FI content.

---

## Definition of Done

- [ ] FI detail view shows AS-IS and TO-BE as separate tabs
- [ ] Content is correctly extracted from FI markdown sections
- [ ] Markdown renders correctly in both tabs
- [ ] Code reviewed and merged
- [ ] Unit and integration tests passing
