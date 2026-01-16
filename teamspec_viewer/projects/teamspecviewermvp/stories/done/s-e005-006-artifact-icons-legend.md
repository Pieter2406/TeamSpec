---
# === LLM Retrieval Metadata ===
artifact_kind: story
spec_version: "4.0"
template_version: "4.0.1"
title: "Artifact Type Icons and Legend"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "s-e005-006"
filename_pattern: "s-e005-006-artifact-icons-legend.md"

# === Required Relationships ===
links_required:
  - type: epic
    pattern: "epic-TSV-005"
    optional: false
  - type: feature-increment
    pattern: "fi-TSV-005"
    optional: true

# === Search Optimization ===
keywords:
  - icons
  - artifact type
  - legend
  - visual indicator
  - UX
  - identification
aliases:
  - artifact icons
  - type indicators
anti_keywords:
  - full behavior
  - production truth
---

# Story: `s-e005-006-artifact-icons-legend`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-16

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e005-006 |
| **Epic** | epic-TSV-005 |
| **Status** | Done |
| **Estimate** | 3 SP |
| **Author** | AI-Generated |
| **Sprint** | — |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Delta to Feature Canon)  
**Lifecycle:** Sprint-bound, archived after completion

---

## User Story

**As a** BA or FA using the TeamSpec Viewer,  
**I want** each artifact type to display a distinct, recognizable icon and have access to a legend explaining all icons,  
**So that** I can instantly identify artifact types without reading labels or parsing filenames.

---

## Linked Epic

| Epic ID | Epic Name | Product |
|---------|-----------|---------|
| [epic-TSV-005](../../epics/epic-TSV-005-usecase-centric-dashboard.md) | Use-Case Centric Dashboard | Teamspec Viewer (TSV) |

---

## Linked Feature-Increment

| FI ID | Description |
|-------|-------------|
| [fi-TSV-005](../feature-increments/fi-TSV-005-usecase-centric-dashboard.md) | Use-case centric dashboard improvements |

---

## Feature Impact

### Impact Type

- [x] **Adds Behavior** — New capability not currently in the feature
- [ ] **Changes Behavior** — Modifies existing documented behavior
- [ ] **Fixes Defect** — Restores behavior to match documentation
- [ ] **Technical Only** — Refactor/performance with no user-observable change

### AS-IS (current behavior)

**Reference:** f-TSV-005, ArtifactTree component

Currently, artifacts in the tree view use generic MUI icons:
- FolderIcon for Features
- DescriptionIcon for Feature-Increments
- AccountTreeIcon for Epics
- AssignmentIcon for Stories

These icons are not consistently applied across all UI components and there is no legend or help indicator explaining what each icon represents.

### TO-BE (new behavior)

1. **Standardized Icon Set**: Define a consistent icon for each artifact type:
   | Artifact Type | Icon | Rationale |
   |---------------|------|-----------|
   | Product | `Inventory2` | Container/collection concept |
   | Feature | `Star` | Core capability |
   | Feature-Increment | `TrendingUp` | Change/delta to feature |
   | Epic | `FlagCircle` | Grouping milestone |
   | Story | `Assignment` | Actionable work item |
   | Business Analysis | `Analytics` | Analysis artifact |
   | BA Increment | `Insights` | BA delta |
   | Solution Design | `Architecture` | Technical design |
   | SD Increment | `AutoAwesome` | Design delta |
   | Technical Architecture | `Hub` | System structure |
   | TA Increment | `DynamicFeed` | Architecture delta |
   | Dev Plan | `Code` | Implementation plan |
   | Test Case | `CheckCircle` | QA artifact |
   | Regression Test | `Security` | Regression coverage |
   | Decision | `Gavel` | Decision record |
   | Sprint | `Speed` | Sprint artifact |

2. **Icon Legend Component**: Add a help indicator (?) button in the UI header or sidebar that opens a legend modal/popover showing all artifact type icons with their names and descriptions.

3. **Consistent Application**: Use the standardized icons in:
   - ArtifactTree component
   - FeatureCard component
   - SearchResults component
   - Any artifact list displays

---

## Acceptance Criteria (AC)

### Scenario 1: Icons displayed in artifact tree

- **Given** a Feature with related Feature-Increments, Epics, and Stories
- **When** I view the artifact tree in the FA Dashboard
- **Then** each artifact type displays its designated icon from the standardized set
- **And** icons are visually distinct and recognizable

### Scenario 2: Legend accessible from UI

- **Given** I am viewing any dashboard in TeamSpec Viewer
- **When** I click the help/legend indicator (? icon)
- **Then** a modal or popover displays showing all artifact type icons
- **And** each icon is labeled with its artifact type name
- **And** a brief description explains what each artifact type represents

### Scenario 3: Icons consistent across components

- **Given** the same artifact (e.g., a Story)
- **When** it appears in the artifact tree, search results, or any list
- **Then** it displays the same icon consistently

### Scenario 4: Icon colors convey meaning

- **Given** artifacts of different types
- **When** displayed in the UI
- **Then** icons use a color scheme that groups related types:
  - Product/Feature artifacts: Blue tones
  - Increment artifacts (FI, BAI, SDI, TAI): Orange/amber tones
  - Execution artifacts (Epic, Story, Dev Plan): Green tones
  - QA artifacts (Test Case, Regression): Purple tones

### Scenario 5: Legend closes properly

- **Given** the icon legend modal/popover is open
- **When** I click outside the modal or press Escape
- **Then** the legend closes
- **And** focus returns to the previous element

---

## Technical Notes

- **Icons**: Use MUI Icons library (`@mui/icons-material`)
- **Legend Component**: Create `IconLegend.tsx` component
- **Icon Mapping**: Create `artifactIcons.ts` utility for centralized icon definitions
- **Accessibility**: Icons should have aria-labels for screen readers

---

## UX & Copy

**Legend Button Label:** "Artifact Types" (with ? icon)

**Legend Modal Title:** "Artifact Type Icons"

**Legend Description:**
> "TeamSpec uses these icons to identify different artifact types. Related artifacts share similar colors."

---

## DoR Checklist (Feature Alignment)

- [x] Linked to Epic (via filename s-e005-006)
- [x] Linked Epic exists in epics folder
- [x] Linked Feature-Increment exists (if applicable)
- [x] Story describes DELTA only, not full behavior
- [x] Feature impact type is marked
- [x] ACs map to feature behavior / business rules

## DoR Checklist (Standard)

- [x] AC Defined (Gherkin or checklist)
- [x] UX Attached (or "No UI required")
- [x] Dependencies Clear
- [x] Estimated
- [x] Small enough for one sprint

## DoD Checklist

- [ ] Code Complete
- [ ] Tests Passed
- [ ] Feature-Increment TO-BE complete (if behavior changed)
- [ ] FA Accepted
- [ ] Story marked Done in backlog

---

## Links

- [epic-TSV-005](../../epics/epic-TSV-005-usecase-centric-dashboard.md)
- [ArtifactTree.tsx](../../../../frontend/src/components/ArtifactTree.tsx)
- [MUI Icons](https://mui.com/material-ui/material-icons/)
