---
# === LLM Retrieval Metadata ===
artifact_kind: bug
spec_version: "4.0"
template_version: "4.0.1"
title: "Status colors inconsistent across artifact types"

# === Ownership ===
role_owner: QA
artifact_type: Project Execution
canonicity: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "bug-teamspecviewermvp-004"
filename_pattern: "bug-teamspecviewermvp-004-status-color-inconsistency.md"

# === Required Relationships ===
links_required:
  - type: feature
    pattern: "f-TSV-008"
    optional: false

# === Search Optimization ===
keywords:
  - bug
  - UI
  - status colors
  - visual consistency
  - color scheme
  - statusOptions.ts
  - artifact types
aliases:
  - color inconsistency
  - status color mismatch
  - visual hierarchy
anti_keywords:
  - feature request
---

# Bug Report: `bug-teamspecviewermvp-004-status-color-inconsistency`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-17

---

**Document Owner:** QA (QA Engineer)  
**Artifact Type:** Bug Report (Project-scoped)  
**Lifecycle:** Open → Resolved → Closed

---

## Metadata

| Field | Value |
|-------|-------|
| **Bug ID** | bug-teamspecviewermvp-004 |
| **Project** | teamspecviewermvp |
| **Product** | teamspec-viewer (TSV) |
| **Severity** | High |
| **Priority** | P2 |
| **Environment** | Development |
| **Component** | Frontend - statusOptions.ts |
| **Reporter** | QA |
| **Date Reported** | 2026-01-17 |
| **Status** | Open |

---

## Description

Status color assignments are inconsistent across artifact types in the StatusOptions configuration. This creates visual confusion as similar states use different colors depending on artifact type, breaking the visual hierarchy and making it harder for users to quickly understand artifact state at a glance.

**Examples of Inconsistency:**

- **"Done" state colors vary:**
  - feature-increment: #4caf50 (green)
  - epic: #2196f3 (blue) 
  - ba-increment: #4caf50 (green)
  - sd-increment: #4caf50 (green)
  - ta-increment: #4caf50 (green)
  - **ISSUE:** Epic uses blue instead of green like all other increment types

- **"Active" state colors vary:**
  - feature: #4caf50 (green)
  - epic: #4caf50 (green)
  - business-analysis: #4caf50 (green)
  - solution-design: #4caf50 (green)
  - technical-architecture: #4caf50 (green)
  - test-case: #4caf50 (green)
  - regression-test: #4caf50 (green)
  - **ISSUE:** Feature "Active" should be #ff9800 (orange) to indicate work-in-progress state

- **"In-Progress" state colors correct but need verification:**
  - feature-increment: #ff9800 (orange) ✓
  - story: #ff9800 (orange) ✓
  - dev-plan: #ff9800 (orange) ✓

- **Missing state standardization:**
  - "Deprecated" and "Retired" states use #ff9800 and #f44336 inconsistently
  - No unified semantic meaning for terminal/archived states across all artifact types

---

## Steps to Reproduce

1. Open `frontend/src/utils/statusOptions.ts`
2. Review STATUS_OPTIONS object (lines 28-110)
3. Compare color assignments for same-named states across artifact types
4. Create status dropdowns in the dashboard for different artifact types
5. Observe color differences for semantically similar states

---

## Expected Result

**Feature Canon Reference:** [f-TSV-008 Inline Status Editing](../../products/teamspec-viewer/features/f-TSV-008-inline-status-editing.md)

All artifact types should follow a **unified color semantic scheme** where:

1. **Green (#4caf50)** = Terminal/Completed states
   - Used for: "Done", "Implemented", "Operational"
   
2. **Orange (#ff9800)** = Active/Work-in-Progress states
   - Used for: "Active", "In-Progress", "Refining", "Approved"
   
3. **Red (#f44336)** = Terminated/Error states
   - Used for: "Rejected", "Cancelled", "Blocked", "Deprecated", "Retired"
   
4. **Gray (#9e9e9e)** = Neutral/Planning states
   - Used for: "Planned", "Proposed", "Draft", "Backlog"
   
5. **Blue (#2196f3)** = Optional secondary state (for states needing distinction)
   - Used for: "Ready" (distinguished from "Refining"), "Approved" (awaiting completion)

---

## Actual Result

- Epic "Done" is blue (#2196f3) instead of green
- Feature "Active" is green (#4caf50) instead of orange  
- Deprecated/Retired states don't follow consistent terminal state color scheme
- Visual hierarchy is broken - users can't quickly determine artifact state from color alone

---

## Evidence

- File: `frontend/src/utils/statusOptions.ts` lines 28-110
- Configuration shows color assignments that don't follow semantic meaning

### Color Current State vs Expected

| Artifact Type | State | Current Color | Expected Color | Issue |
|---|---|---|---|---|
| feature | Active | #4caf50 (green) | #ff9800 (orange) | Should indicate work, not completion |
| epic | Done | #2196f3 (blue) | #4caf50 (green) | Should match other "Done" states |
| feature | Deprecated | #ff9800 (orange) | #f44336 (red) | Deprecated is terminal, should be red |
| feature | Retired | #f44336 (red) | {TBD} | State needs review/rename |

---

## Bug Classification

> ⚠️ Select **exactly ONE** classification. This determines who fixes what.

### [ ] Implementation Defect

**Definition:** Code doesn't match Feature Canon documentation.

### [x] Undocumented Behavior

**Definition:** Neither code nor Feature Canon covers this case.

- **Evidence:** Feature Canon [f-TSV-008](../../products/teamspec-viewer/features/f-TSV-008-inline-status-editing.md) does not specify color standardization rules across artifact types. The color scheme in `statusOptions.ts` was implemented ad-hoc without formal specification.
  
- **Fix:** FA/Design must define formal color semantics (what each color means across all artifact types), then DEV implements standardization in statusOptions.ts
  
- **Canon Update:** Required — formal color semantics should be documented in Feature Canon or Design Document

---

## Related Issues

- Potentially related: Feature state naming needs review (Feature "Retired" state definition)
- Potentially related: Epic state colors may need design review

---

## Suggested Resolution

1. **Establish color semantic contract:**
   - Document what each color means (terminal, active, error, planning, etc.)
   - Ensure all artifact types follow the same semantic rules
   
2. **Update statusOptions.ts:**
   - Standardize all "Done" states to #4caf50 (green)
   - Standardize all "Active"/"In-Progress" states to #ff9800 (orange)
   - Standardize all terminal/deprecated states to #f44336 (red)
   - Standardize all planning/draft states to #9e9e9e (gray)
   
3. **Design/BA Review:**
   - Review Feature state naming (Retired → Operational?)
   - Verify color choices align with UI design system
   - Test across all artifact types in dashboard
