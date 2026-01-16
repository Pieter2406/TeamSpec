---
# === LLM Retrieval Metadata ===
artifact_kind: fi
spec_version: "4.0"
template_version: "4.0.1"
title: "Use-Case Centric Dashboard"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "fi-TSV-005"
filename_pattern: "fi-TSV-005-usecase-centric-dashboard.md"

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
  - use-case centric
  - visual artifact linking
  - graph view
  - relationship visualization
  - FA dashboard
  - artifact navigation
aliases:
  - visual dashboard
  - artifact graph
anti_keywords:
  - production truth
  - implementation details
---

# Feature Increment: `fi-TSV-005-usecase-centric-dashboard`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-16

---

> **ID:** fi-TSV-005  
> **Product:** `teamspec-viewer` (TSV)  
> **Target Feature:** `f-TSV-002-role-specific-dashboards`  
> **Epic:** [epic-TSV-005](../epics/epic-TSV-005-usecase-centric-dashboard.md)  
> **Status:** proposed

---

## 1. Overview

This increment transforms the role dashboard from a flat list-based artifact browser to a **use-case centric view** with visual representation of artifact relationships. For the Functional Analyst role, Features become the primary focal artifact, with visual navigation showing how Features connect to Feature-Increments (across projects), Epics, and Stories.

---

## 2. AS-IS (Current State)

> ⚠️ _Auto-populated from Product Feature. DO NOT EDIT unless correcting errors._

### 2.1 Current Behavior

(From `f-TSV-002-role-specific-dashboards` → "Current Behavior")

#### Role Dashboard Content

- **BA Dashboard**: Lists business-analysis documents and BA increments for the active product/project
- **FA Dashboard**: Lists features, feature-increments, epics, and stories for the active product/project

#### User Flows

1. User opens viewer → sees role selection screen
2. User selects BA or FA → sees role-specific dashboard
3. User clicks artifact → artifact content is displayed in reader
4. User can switch roles via header badge

### 2.2 Current Limitations

- Dashboard presents artifacts as **four separate flat lists** (Features, Feature-Increments, Epics, Stories)
- No visual representation of **relationships between artifacts**
- Users must mentally map which Feature-Increments relate to which Features
- No way to see at a glance which Epics and Stories contribute to a Feature-Increment
- Navigation is file-browser-like rather than **workflow/use-case centric**
- Difficult to understand the "change landscape" across projects for a given Feature

---

## 3. TO-BE (Proposed State)

### 3.1 New/Changed Behavior

After this increment is implemented and synced:

#### 3.1.1 FA Dashboard: Feature-Centric Hub

The FA Dashboard becomes a **Feature-centric navigation hub** where:

1. **Features are the primary focal point** displayed as interactive cards in a prominent position
2. Each Feature card shows:
   - Feature ID and title
   - Feature status
   - **Count of linked Feature-Increments** (across all projects)
   - **Quick-action to expand/drill-down** into the Feature's increment tree

#### 3.1.2 Artifact Relationship Visualization

When a user selects a Feature, the dashboard displays a **visual relationship view**:

```
┌─────────────────────────────────────────────────────────────────┐
│                    f-TSV-002 Role Dashboards                     │
│                         (Feature Canon)                          │
└─────────────────────┬───────────────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
┌───────────────────┐     ┌───────────────────┐
│ fi-TSV-001        │     │ fi-TSV-005        │
│ BA/FA Dashboards  │     │ Use-Case Centric  │
│ (Project: MVP)    │     │ (Project: MVP)    │
└────────┬──────────┘     └────────┬──────────┘
         │                         │
         ▼                         ▼
┌───────────────────┐     ┌───────────────────┐
│ epic-TSV-001      │     │ epic-TSV-XXX      │
│ Dashboard Impl    │     │ Visual Nav        │
└────────┬──────────┘     └───────────────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌───────┐
│s-e001-│ │s-e001-│
│001    │ │002    │
└───────┘ └───────┘
```

**Visualization Options (Suggested Approaches):**

| Approach | Description | Pros | Cons |
|----------|-------------|------|------|
| **Tree View (Recommended for MVP)** | Collapsible hierarchical tree with Feature at root → FIs → Epics → Stories | Familiar UX pattern, clear hierarchy, works well in sidebar | Limited cross-project visibility |
| **Graph/Network View** | Interactive node-graph showing all relationships | Shows complex relationships, cross-project links visible | Can become cluttered, requires more screen real estate |
| **Swimlane View** | Horizontal lanes per project with connected cards | Good for multi-project comparison | Complex layout, horizontal scrolling |
| **Nested Cards** | Expandable card-in-card design | Clean, progressive disclosure | Deep nesting can be overwhelming |

**MVP Recommendation: Hybrid Tree + Card Approach**

```
┌─────────────────────────────────────────────────────────────────────────┐
│  FA Dashboard                                                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─ FEATURES (Product Canon) ─────────────────────────────────────────┐ │
│  │                                                                     │ │
│  │  [▼] f-TSV-002 Role-Specific Dashboards          2 FIs · 1 Epic    │ │
│  │      │                                                              │ │
│  │      ├── fi-TSV-001 BA/FA Role Dashboards (MVP)                    │ │
│  │      │       └── epic-TSV-001 Dashboard Implementation             │ │
│  │      │               ├── s-e001-001 Create role selector           │ │
│  │      │               ├── s-e001-002 Implement BA dashboard         │ │
│  │      │               └── s-e001-003 Implement FA dashboard         │ │
│  │      │                                                              │ │
│  │      └── fi-TSV-005 Use-Case Centric Dashboard ← YOU ARE HERE      │ │
│  │              └── (epic pending)                                     │ │
│  │                                                                     │ │
│  │  [►] f-TSV-003 Feature-Increment Navigation      1 FI · 0 Epics    │ │
│  │  [►] f-TSV-007 Artifact Search                   1 FI · 0 Epics    │ │
│  │                                                                     │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 3.1.3 Visual Relationship Indicators

The dashboard provides visual cues for artifact relationships:

| Indicator | Meaning |
|-----------|---------|
| Solid line (──) | Direct parent-child relationship |
| Badge count (2 FIs) | Number of linked children |
| Status dot (●/○) | Artifact status (implemented/proposed/draft) |
| Project tag | Which project owns the FI/Epic/Story |
| Expand/collapse (▼/►) | Toggle to show/hide children |

#### 3.1.4 Navigation Interactions

| User Action | System Response |
|-------------|-----------------|
| Click Feature card | Expand tree to show linked FIs |
| Click FI node | Show FI detail panel (existing) + highlight linked epic |
| Click Epic node | Show linked stories inline |
| Click Story node | Open story in artifact reader |
| Double-click any node | Open full artifact in reader |
| Hover on node | Show tooltip with artifact summary |

#### 3.1.5 Cross-Project Visibility

When a Feature has Feature-Increments across multiple projects:

- FIs are grouped by project within the tree
- Project context is clearly labeled
- User can filter to show only current project or all projects

### 3.2 Acceptance Criteria

- [ ] AC-1: FA Dashboard displays Features as primary focal artifacts (not a flat list among equals)
- [ ] AC-2: Selecting a Feature reveals a visual tree of linked Feature-Increments, Epics, and Stories
- [ ] AC-3: Tree/hierarchy view shows artifact relationships with expand/collapse functionality
- [ ] AC-4: Each node displays: artifact ID, title, status, and project context (for FIs)
- [ ] AC-5: Clicking a node provides quick-view details without losing tree context
- [ ] AC-6: Double-clicking a node opens the full artifact in the reader
- [ ] AC-7: Badge counts show number of linked children (e.g., "2 FIs", "3 Stories")
- [ ] AC-8: User can collapse all / expand all for quick overview vs detailed view

### 3.3 Out of Scope

- Graph/network visualization (future enhancement)
- Cross-project filtering beyond current product
- Editing artifact relationships
- Automated relationship discovery (relies on explicit links in artifacts)
- BA dashboard transformation (separate increment if needed)

---

## 4. Impact Analysis

### 4.1 Affected Features

| Feature | Impact Type | Description |
|---------|-------------|-------------|
| f-TSV-002 | Modified | Role dashboard UX significantly changed for FA role |
| f-TSV-003 | Referenced | FI navigation patterns may need alignment |
| f-TSV-004 | Referenced | Epic/Story navigation integrated into tree view |

### 4.2 Dependencies

| Dependency | Type | Description |
|------------|------|-------------|
| fi-TSV-001 | Must be complete | Basic dashboard infrastructure required |
| Backend API | May need enhancement | Need API to retrieve linked artifacts for a Feature |

### 4.3 Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Performance with large artifact trees | Medium | High | Implement lazy loading for deep nodes |
| Complex relationship parsing | Medium | Medium | Start with explicit links only; ignore implicit |
| UI clutter with many FIs | Low | Medium | Pagination/virtualization for large lists |

---

## 5. Implementation Notes

### 5.1 Technical Considerations

**Frontend:**
- Tree component: MUI TreeView or custom collapsible tree
- State management for expanded nodes
- Artifact relationship data structure

**Backend API Enhancement (suggested):**
```
GET /api/features/:featureId/relationships
Response: {
  feature: {...},
  featureIncrements: [
    {
      fi: {...},
      project: "teamspecviewermvp",
      epic: {...},
      stories: [...]
    }
  ]
}
```

### 5.2 Testing Strategy

- Unit tests for tree rendering with various depth levels
- Integration tests for expand/collapse behavior
- Visual regression tests for tree layout
- Performance tests with 20+ Features, 50+ FIs

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-16 | AI-Generated (FA) | Initial draft with visual hierarchy proposal |

---

## Sources Consulted

- [f-TSV-002-role-specific-dashboards.md](../../products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md) → Current Behavior section
- [fi-TSV-001-ba-fa-role-dashboards.md](fi-TSV-001-ba-fa-role-dashboards.md) → TO-BE section for current dashboard spec
- [FADashboard.tsx](../../frontend/src/components/FADashboard.tsx) → Current implementation (four ArtifactList components)

## Unresolved Items

- ~~Epic assignment~~ → **RESOLVED**: Linked to [epic-TSV-005](../epics/epic-TSV-005-usecase-centric-dashboard.md)
- ~~Backend API changes required~~ → **RESOLVED**: New endpoint `GET /api/features/:featureId/relationships` with file-based scanning (see dp-e005-s003)
- ~~Exact tree component library selection~~ → **RESOLVED**: MUI `@mui/x-tree-view` (SimpleTreeView) — installed via `pnpm add @mui/x-tree-view`
