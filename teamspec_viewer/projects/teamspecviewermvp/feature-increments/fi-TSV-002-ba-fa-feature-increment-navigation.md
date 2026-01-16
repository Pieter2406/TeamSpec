---
# === LLM Retrieval Metadata ===
artifact_kind: fi
spec_version: "4.0"
template_version: "4.0.1"
title: "Feature-Increment Navigation"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "fi-TSV-002"
filename_pattern: "fi-TSV-002-ba-fa-feature-increment-navigation.md"

# === Required Relationships ===
links_required:
  - type: feature
    pattern: "f-TSV-003"
    optional: false
    note: "Target feature that this FI modifies"
  - type: epic
    pattern: "epic-TSV-*"
    optional: true
  - type: product
    pattern: "product.yml"
    optional: false

# === Search Optimization ===
keywords:
  - feature increment
  - AS-IS TO-BE
  - BA
  - FA
  - navigation
aliases:
  - BA/FA FI navigation increment
anti_keywords:
  - production truth
  - implementation details
---

# Feature Increment: `fi-TSV-002-ba-fa-feature-increment-navigation`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-14

---

> **ID:** fi-TSV-002  
> **Product:** `teamspec-viewer` (TSV)  
> **Target Feature:** `f-TSV-003-feature-increment-navigation`  
> **Epic:** epic-TSV-002 (FI Navigation - planned)  
> **Status:** proposed

---

## 1. Overview

This increment defines MVP behavior for navigating **Feature ↔ Feature-Increment** relationships and presenting **AS-IS vs TO-BE** content in a BA/FA-friendly reading flow.

---

## 2. AS-IS (Current State)

> ⚠️ _Auto-populated from Product Feature. DO NOT EDIT unless correcting errors._

### 2.1 Current Behavior

(Exact copy from `f-TSV-003-feature-increment-navigation` → “Current Behavior”)

### Feature ↔ Feature-Increment Linking

No deployed behavior exists (greenfield product).

### AS-IS / TO-BE Presentation

No deployed behavior exists (greenfield product).

### User Flows

1. Not applicable (no prior system).

### Edge Cases & Error Handling

| Condition | System Response |
|-----------|-----------------||
| Not applicable | No prior system |

### 2.2 Current Limitations

- No deployed FI navigation behavior exists; Feature Canon is establishing the first specification.

---

## 3. TO-BE (Proposed State)

### 3.1 New/Changed Behavior

After this increment is implemented and synced:

- The system allows users to browse features and discover their associated feature-increments for the selected project context.
- When a feature-increment is selected, the system presents:
  - An **AS-IS** view sourced from the linked product feature.
  - A **TO-BE** view sourced from the selected feature-increment.
- The system provides navigation from a feature-increment to its linked stories when those stories exist.

### 3.2 Acceptance Criteria

- [ ] AC-1: From an FA-oriented view, a user can select a feature and see the list of related `fi-TSV-*` increments in `teamspecviewermvp`.
- [ ] AC-2: Selecting a feature-increment shows both AS-IS and TO-BE content for that increment.
- [ ] AC-3: If the feature-increment references stories, the UI provides navigation to those stories.

### 3.3 Out of Scope

- Automatic “diff” generation between AS-IS and TO-BE.
- Editing FI content from within the viewer.

---

## 4. Impact Analysis

### 4.1 Affected Features

| Feature | Impact Type | Description |
|---------|-------------|-------------|
| f-TSV-003 | Modified | Defines MVP behavior for feature ↔ FI browsing and AS-IS/TO-BE presentation |
| f-TSV-002 | Referenced | Entry point from FA dashboard |
| f-TSV-007 | Referenced | Search may be used to find features/FIs |

### 4.2 Dependencies

- Feature files exist for the target product (`f-TSV-*`).
- Feature-increment files exist in the target project (`fi-TSV-*`).

### 4.3 Risks

- Risk: AS-IS may be `{TBD}` until the feature canon’s “Current Behavior” is specified → Mitigation: define behavior in `f-TSV-003` via subsequent refinement.

---

## 5. Implementation Notes

### 5.1 Technical Considerations

Refer to TA-001 for React component design. AS-IS/TO-BE layout requires side-by-side or tabbed rendering. Markdown diff highlighting is optional for MVP.

### 5.2 Testing Strategy

Integration tests for FI → Feature linking; E2E tests for AS-IS/TO-BE section visibility.

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-14 | AI-Generated | Initial draft |

---

## Sources Consulted

- teamspec_viewer/products/teamspec-viewer/features/f-TSV-003-feature-increment-navigation.md → “Current Behavior” (AS-IS source)
- teamspec_viewer/products/teamspec-viewer/business-analysis/ba-TSV-001-viewer-platform.md → Section 3 (Scope), item 3

## Unresolved Items

- Epic assignment for this FI → epic-TSV-002 (planned for second epic)
- Exact AS-IS/TO-BE layout expectations → Side-by-side or tabbed (DES to confirm)
- Technical and testing notes → Filled above (see sections 5.1, 5.2)
