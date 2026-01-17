---
# === LLM Retrieval Metadata ===
artifact_kind: bug
spec_version: "4.0"
template_version: "4.0.1"
title: "Feature state definitions need standardization"

# === Ownership ===
role_owner: QA
artifact_type: Project Execution
canonicity: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "bug-teamspecviewermvp-005"
filename_pattern: "bug-teamspecviewermvp-005-feature-state-definition.md"

# === Required Relationships ===
links_required:
  - type: feature
    pattern: "f-TSV-008"
    optional: false

# === Search Optimization ===
keywords:
  - bug
  - feature state
  - state definition
  - retired vs operational
  - state semantics
  - artifact lifecycle
aliases:
  - feature lifecycle
  - state naming
  - feature status
anti_keywords:
  - feature request
---

# Bug Report: `bug-teamspecviewermvp-005-feature-state-definition`

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
| **Bug ID** | bug-teamspecviewermvp-005 |
| **Project** | teamspecviewermvp |
| **Product** | teamspec-viewer (TSV) |
| **Severity** | Medium |
| **Priority** | P2 |
| **Environment** | Development |
| **Component** | Frontend - statusOptions.ts, Product Canon - Feature state definitions |
| **Reporter** | QA |
| **Date Reported** | 2026-01-17 |
| **Status** | Open |

---

## Description

Feature artifact state definitions are ambiguous and don't align with other artifact lifecycle patterns in TeamSpec. Specifically:

1. **"Retired" state is unclear:** 
   - Does "Retired" mean the feature was experimental and discarded?
   - Or does it mean the feature was actively used but is now EOL?
   - The term is vague and doesn't align with product lifecycle terminology

2. **"Active" state color misalignment:**
   - Feature "Active" is colored green (#4caf50) — suggesting completion/success
   - But "Active" semantically means "currently in operation/being worked on" — should be orange (#ff9800)
   - This breaks consistency with story "In-Progress" and feature-increment "In-Progress" which correctly use orange

3. **Missing state for "Operational/In-Use":**
   - Product lifecycle should have a state for "feature is live and operational"
   - Current states: Planned → Active → Deprecated → Retired
   - This sequence is unclear about which states represent "currently being used in production"

---

## Steps to Reproduce

1. Open Product Canon for any product (e.g., `products/teamspec-viewer/features/`)
2. Create or update a Feature artifact
3. Open status dropdown for Feature artifact type
4. Observe states: Planned, Active, Deprecated, Retired
5. Try to determine: What does "Retired" mean? What color means "in production"?
6. Compare to Feature-Increment states: Proposed, Approved, In-Progress, Done, Rejected
7. Observe the mismatch in lifecycle pattern

---

## Expected Result

**Feature Canon Reference:** [f-TSV-008 Inline Status Editing](../../products/teamspec-viewer/features/f-TSV-008-inline-status-editing.md)

Features should have clearly defined, semantically consistent states that:

1. **Align with product lifecycle:**
   - Planned → Active (development/approval) → Operational (live/production) → Deprecated → Retired
   - OR: Planned → In-Development → Operational → Sunset → Retired

2. **Use consistent color semantics:**
   - Active/In-Development: #ff9800 (orange) — indicates work in progress
   - Operational: #4caf50 (green) — indicates complete, in production
   - Deprecated: #ff9800 (orange) or #f44336 (red) — indicates EOL period
   - Retired: #f44336 (red) — indicates removed/no longer available

3. **Clarify each state's meaning:**
   - Planned: Not yet started, awaiting approval
   - Active: Under active development/review
   - Operational: Live in production, stable
   - Deprecated: Marked for removal, phaseout in progress
   - Retired: Removed from service, no longer available

---

## Actual Result

- Feature states are: Planned, Active, Deprecated, Retired
- "Active" uses green color (suggests completion, but means "in-progress")
- "Retired" term is ambiguous (retired from use? or retired as "old"?)
- Color scheme doesn't match semantic meaning of state
- Feature lifecycle pattern doesn't clearly indicate which states represent production deployment

---

## Evidence

- File: `frontend/src/utils/statusOptions.ts` lines 29-33
- Current definition:
  ```typescript
  'feature': [
      { value: 'Planned', label: 'Planned', color: '#9e9e9e' },
      { value: 'Active', label: 'Active', color: '#4caf50' },      // ← GREEN = Wrong for WIP
      { value: 'Deprecated', label: 'Deprecated', color: '#ff9800' },
      { value: 'Retired', label: 'Retired', color: '#f44336' },    // ← Meaning unclear
  ],
  ```

- Compare to Feature-Increment (more semantically clear):
  ```typescript
  'feature-increment': [
      { value: 'Proposed', label: 'Proposed', color: '#9e9e9e' },   // Planning
      { value: 'Approved', label: 'Approved', color: '#2196f3' },    // Ready to implement
      { value: 'In-Progress', label: 'In-Progress', color: '#ff9800' }, // ← ORANGE = WIP
      { value: 'Done', label: 'Done', color: '#4caf50' },           // ← GREEN = Complete
      { value: 'Rejected', label: 'Rejected', color: '#f44336' },
  ],
  ```

---

## Bug Classification

> ⚠️ Select **exactly ONE** classification. This determines who fixes what.

### [ ] Implementation Defect

**Definition:** Code doesn't match Feature Canon documentation.

### [x] Undocumented Behavior

**Definition:** Neither code nor Feature Canon covers this case.

- **Evidence:** Feature Canon does not formally define the semantic meaning of each Feature state or what each color represents. The state definitions in `statusOptions.ts` were implemented without formal specification of feature lifecycle stages.
  
- **Fix:** BA/FA must:
  1. Clarify feature lifecycle stages (Planned → ? → Operational → ? → Retired)
  2. Update Feature Canon with formal state definitions
  3. Clarify meaning of "Retired" (is it "EOL"? "Never shipped"? "Decommissioned"?)
  
- **Canon Update:** Required — Feature state definitions must be documented in Product Canon or Feature Canon

---

## Related Issues

- [bug-teamspecviewermvp-004](bug-teamspecviewermvp-004-status-color-inconsistency.md) — Status color inconsistency (related color fix required)

---

## Suggested Resolution

1. **Define Feature Lifecycle (BA/FA task):**
   - What does each state represent in the product lifecycle?
   - When does a Feature transition from Active → Operational?
   - When does a Feature become Deprecated vs Retired?
   - Update Product Canon with formal definitions

2. **Update statusOptions.ts (DEV task, after BA clarification):**
   - Change Feature states based on BA decision:
     - Option A: Planned → Active → Operational → Deprecated → Retired
     - Option B: Planned → In-Development → Operational → Sunset → Retired
   
3. **Fix Colors (DEV task):**
   - Active/In-Development: #ff9800 (orange)
   - Operational: #4caf50 (green)
   - Deprecated/Sunset: #ff9800 (orange) 
   - Retired: #f44336 (red)

4. **Design Review:**
   - Verify chosen lifecycle makes sense for product management
   - Confirm colors align with design system expectations
   - Test in UI across all artifact types
