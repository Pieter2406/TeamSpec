---
# === LLM Retrieval Metadata ===
artifact_kind: fi
spec_version: "4.0"
template_version: "4.0.1"
title: "BA and FA Role Dashboards"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "fi-TSV-001"
filename_pattern: "fi-TSV-001-ba-fa-role-dashboards.md"

# === Required Relationships ===
links_required:
  - type: feature
    pattern: "f-TSV-002"
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
  - role dashboard
  - BA
  - FA
  - MVP
aliases:
  - BA/FA dashboards increment
anti_keywords:
  - production truth
  - implementation details
---

# Feature Increment: `fi-TSV-001-ba-fa-role-dashboards`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-14

---

> **ID:** fi-TSV-001  
> **Product:** `teamspec-viewer` (TSV)  
> **Target Feature:** `f-TSV-002-role-specific-dashboards`  
> **Epic:** [epic-TSV-001](../epics/epic-TSV-001-dashboard-implementation.md)  
> **Status:** proposed

---

## 1. Overview

This increment defines the initial MVP behavior for **role-specific dashboards** by focusing the first delivery slice on **BA and FA** role views.

---

## 2. AS-IS (Current State)

> ⚠️ _Auto-populated from Product Feature. DO NOT EDIT unless correcting errors._

### 2.1 Current Behavior

(Exact copy from `f-TSV-002-role-specific-dashboards` → “Current Behavior”)

### Role Selection

No deployed behavior exists (greenfield product).

### Role Dashboard Content

No deployed behavior exists (greenfield product).

### User Flows

1. Not applicable (no prior system).

### Edge Cases & Error Handling

| Condition | System Response |
|-----------|-----------------||
| Not applicable | No prior system |

### 2.2 Current Limitations

- No deployed dashboard behavior exists; Feature Canon is establishing the first specification.

---

## 3. TO-BE (Proposed State)

### 3.1 New/Changed Behavior

After this increment is implemented and synced:

- The system provides a role dashboard experience specifically for:
  - **BA**: business analysis documents and BA increments for the selected product/project context.
  - **FA**: features, feature-increments, epics, and stories for the selected product/project context.
- The role dashboard provides navigation entry points into the relevant artifacts.
- The role dashboard does not enforce access control; it is a navigation/reading aid.

#### Role Selection (MVP)

- The system provides a role selection step that is required before showing a role dashboard.
- The available roles for this increment are limited to **BA** and **FA**.
- The selected role is clearly visible in the UI while browsing artifacts.
- Role switching within a session is supported.
  - Persisting the selected role across sessions is out of scope for MVP (browser session only).

#### Role Dashboard Content (MVP)

The role dashboard is a curated navigation view (not a file explorer) and provides entry points that support the BAI goal of “portfolio → product → project → artifact relationships”.

**BA dashboard provides entry points to:**

- Product Business Analysis documents for the selected product.
- Project Business Analysis Increments for the selected project.
- Clear traversal into related Feature Canon from BA artifacts when links exist (e.g., “Related Feature Canon” references).

**FA dashboard provides entry points to:**

- Feature Canon for the selected product (e.g., features index and individual features).
- Feature-Increments for the selected project (e.g., increments index and individual FIs).
- Epics and Stories for the selected project when they exist.

**Within each dashboard view:**

- Artifacts are grouped by artifact type (e.g., “Business Analysis”, “Features”, “Feature-Increments”) rather than by folder path.
- Each artifact entry shows:
  - Artifact ID and title
  - Artifact status when available (e.g., proposed/planned)
  - The owning scope (Product vs Project)
- The dashboard prioritizes “analysis-first” navigation:
  - From FA items, users can navigate to the associated Feature for an FI when the link exists.
  - From BA items, users can navigate to referenced features when the link exists.

### 3.2 Acceptance Criteria

- [ ] AC-1: A user can select the **BA** role and is presented with navigation to BA artifacts (BA documents, BA increments) for `teamspec-viewer` and `teamspecviewermvp`.
- [ ] AC-2: A user can select the **FA** role and is presented with navigation to FA artifacts (features, feature-increments, epics, stories) for `teamspec-viewer` and `teamspecviewermvp`.
- [ ] AC-3: The dashboard does not provide edit capabilities for any artifact (read-only navigation).
- [ ] AC-4: When viewing an artifact from the dashboard, `{TBD}` markers are highlighted and the user can navigate between `{TBD}` occurrences.

### 3.3 Out of Scope

- Dashboards for DEV, QA, SA, SM, DES in this increment.
- Any permissions/authentication behavior.

---

## 4. Impact Analysis

### 4.1 Affected Features

| Feature | Impact Type | Description |
|---------|-------------|-------------|
| f-TSV-002 | Modified | Defines MVP behavior focus for BA/FA dashboards |
| f-TSV-001 | Referenced | Portfolio/product context used for navigation |
| f-TSV-003 | Referenced | FI navigation linked from FA dashboard |
| f-TSV-004 | Referenced | Epic/story navigation linked from FA dashboard |
| f-TSV-007 | Referenced | Search may be used from dashboards |

### 4.2 Dependencies

- BA artifacts exist for `teamspec-viewer` (e.g., `ba-TSV-001`, `bai-TSV-001`).
- FA artifacts exist for `teamspec-viewer` (e.g., `f-TSV-001..007`).

### 4.3 Risks

- Risk: Role-to-artifact mapping is not yet finalized across all roles → Mitigation: scope this increment strictly to BA and FA.

---

## 5. Implementation Notes

### 5.1 Technical Considerations

Refer to [TA-001](../../products/teamspec-viewer/technical-architecture/ta-TSV-001-react-browser-frontend.md) for frontend component structure and [TA-002](../../products/teamspec-viewer/technical-architecture/ta-TSV-002-hono-backend-server.md) for backend API design. Role selection uses React Context; dashboard components fetch artifact lists via REST endpoints.

### 5.2 Testing Strategy

Unit tests for RoleContext state transitions; integration tests for artifact listing API endpoints; E2E tests for role selection → dashboard navigation → artifact viewing flow.

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-14 | AI-Generated | Initial draft |

---

## Sources Consulted

- teamspec_viewer/products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md → “Current Behavior” (AS-IS source)
- teamspec_viewer/projects/teamspecviewermvp/business-analysis-increments/bai-TSV-001-mvp-ba-fa-holistic-view.md → Section 4.1 (BA+FA MVP focus)

## Unresolved Items

- Technical and testing notes → Filled above (see sections 5.1, 5.2)
