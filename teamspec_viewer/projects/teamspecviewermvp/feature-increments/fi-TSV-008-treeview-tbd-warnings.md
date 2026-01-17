---
# === LLM Retrieval Metadata ===
artifact_kind: fi
spec_version: "4.0"
template_version: "4.0.1"
title: "Treeview TBD Warning Indicators"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "fi-TSV-008"
filename_pattern: "fi-TSV-008-treeview-tbd-warnings.md"

# === Required Relationships ===
links_required:
  - type: feature
    pattern: "f-TSV-002"
    optional: false
    note: "Targets Role-Specific Dashboards"
  - type: product
    pattern: "product.yml"
    optional: false

# === Search Optimization ===
keywords:
  - feature increment
  - TBD detection
  - treeview warning
  - dashboard
aliases:
  - artifact TBD indicator
  - missing documentation alert
anti_keywords:
  - code implementation
  - test case
---

# Feature Increment: `fi-TSV-008-treeview-tbd-warnings`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-17

---

> **ID:** fi-TSV-008  
> **Product:** `teamspec-viewer` (TSV)  
> **Target Feature:** `f-TSV-002-role-specific-dashboards`  
> **Epic:** `epic-TSV-008` _(link when assigned)_  
> **Status:** draft

---

## 1. Overview

Introduce a small warning indicator in the role dashboards' tree views to signal when an artifact contains `{TBD}` markers. This helps users quickly identify documents needing review without opening each one.

---

## 2. AS-IS (Current State)

### 2.1 Current Behavior

Copy from Product Feature Canon:

- In Scope bullet in [f-TSV-002](../../products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md):
  - "`{TBD}` markers in rendered artifacts are highlighted and can be navigated (e.g., next/previous `{TBD}`) so users can quickly identify missing documentation."

### 2.2 Current Limitations

- Dashboards do not expose a treeview-level indicator for `{TBD}` presence; users must open artifacts to discover missing documentation.

---

## 3. TO-BE (Proposed State)

### 3.1 New/Changed Behavior

- The dashboard treeview displays a small warning indicator for any artifact that contains one or more `{TBD}` markers.
- Indicator shows on list items consistently for BA and FA dashboards.
- Indicator includes accessible tooltip: "Contains TBDs — needs review".

### 3.2 Acceptance Criteria

- [ ] AC-1: Treeview nodes for artifacts with `{TBD}` display a warning icon/badge.
- [ ] AC-2: Tooltip is present and accessible (keyboard/ARIA) with text "Contains TBDs — needs review".
- [ ] AC-3: Indicator updates reactively when artifact content changes and `{TBD}`s are added/removed.
- [ ] AC-4: No indicator appears for artifacts without `{TBD}` markers.
- [ ] AC-5: Works for all artifact types shown in BA and FA dashboards.

### 3.3 Out of Scope

- Inline editing of `{TBD}` markers.
- Auto-resolving or workflow for `{TBD}`s; viewer remains read-only.

---

## 4. Impact Analysis

### 4.1 Affected Features

| Feature | Impact Type | Description |
|---------|-------------|-------------|
| f-TSV-002-role-specific-dashboards | Modified | Add treeview indicator signaling `{TBD}` presence |

### 4.2 Dependencies

- None beyond existing artifact content parsing.

### 4.3 Risks

- False positives/negatives if detection regex is incorrect; must reliably identify literal `{TBD}` markers.

---

## 5. Implementation Notes

### 5.1 Technical Considerations

- Backend: Extend relationship/content extraction service to compute `hasTBD` flag per artifact by scanning raw Markdown for `{TBD}`.
- Frontend: Update tree components (e.g., `ArtifactTree`, `BATree`) to render a small warning icon/badge when `hasTBD` is true; add tooltip.

### 5.2 Testing Strategy

- Unit tests for detection function with sample markdown containing `{TBD}` and without.
- UI tests to verify indicator rendering and tooltip accessibility.

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-17 | AI-Generated | Initial draft |
