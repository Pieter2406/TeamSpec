---
# === LLM Retrieval Metadata ===
artifact_kind: story
spec_version: "4.0"
template_version: "4.0.1"
title: "Implement smart state ordering logic"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "s-e007-002"
filename_pattern: "s-e007-002-state-ordering-logic.md"

# === Required Relationships ===
links_required:
  - type: epic
    pattern: "epic-TSV-007"
    optional: false
  - type: feature-increment
    pattern: "fi-TSV-007"
    optional: false

---

# Story: `s-e007-002-state-ordering-logic`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-17

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e007-002 |
| **Epic** | epic-TSV-007 |
| **Feature-Increment** | fi-TSV-007 |
| **Status** | Backlog |
| **Estimate** | 5 pts |
| **Author** | FA |
| **Sprint** | — |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Delta to Feature Canvas)  
**Lifecycle:** Sprint-bound, archived after completion

---

## User Story

**As a** TeamSpec user (FA, BA, Developer, PM),  
**I want** artifacts to be automatically ordered by state (active first, completed last),  
**So that** I can quickly scan the dashboard to find items requiring attention without wasting time finding relevant artifacts in an arbitrary order.

---

## Linked Epic

| Epic ID | Epic Name | Product |
|---------|-----------|---------|
| [epic-TSV-007](../epics/epic-TSV-007-dashboard-filtering-ordering.md) | Dashboard artifact filtering and smart state ordering | teamspec-viewer (TSV) |

---

## Linked Feature-Increment

| FI ID | Description |
|-------|-------------|
| [fi-TSV-007](../feature-increments/fi-TSV-007-dashboard-filtering-ordering.md) | Dashboard artifact filtering and smart state ordering (Section 3.1.2) |

---

## Feature Impact

### Impact Type

- [x] **Adds Behavior** — New capability not currently in the feature
- [ ] **Changes Behavior** — Modifies existing documented behavior
- [ ] **Fixes Defect** — Restores behavior to match documentation
- [ ] **Technical Only** — Refactor/performance with no user-observable change

### AS-IS (current behavior)

**Reference:** f-TSV-002, Section: Dashboard Display

Currently, artifacts in the Role-Specific Dashboard are displayed in an arbitrary order, likely based on file creation order or alphabetical sorting. Users see no visual grouping or priority indication based on artifact state (active, done, draft, etc.). All states are mixed together in a flat list.

### TO-BE (new behavior)

Artifacts are automatically ordered and grouped by state, with the following priority hierarchy:

**ACTIVE WORK (always visible at top):**
1. in-progress (highest priority)
2. active
3. ready
4. draft
5. proposed

**WAITING (visible below active work):**
6. pending
7. on-hold

**COMPLETED (visible below waiting, hidden when filter toggled off):**
8. deferred
9. out-of-scope
10. done
11. retired
12. archived (lowest priority)

Within each state group, artifacts are ordered alphabetically by title. Visual grouping makes state categories clear (e.g., section headers, color coding, or indentation).

---

## Acceptance Criteria

### Functional

- [ ] **Correct State Priority**: Artifacts ordered by state according to 12-level hierarchy (in-progress=1, active=2, ... archived=12)
- [ ] **Alphabetical Within State**: Artifacts with same state ordered alphabetically by title/name
- [ ] **Visual Grouping**: State categories are visually distinct (section headers and/or visual separation)
- [ ] **All Artifact Types**: Ordering applies to all artifact types in dashboard (Features, Epics, Stories, Feature-Increments, Business Analysis docs, etc.)
- [ ] **Works on Both Dashboards**: Ordering applies to both FA Dashboard and BA Dashboard consistently
- [ ] **Immediate Effect**: Ordering applied immediately on page load; no delay
- [ ] **Consistent Across Sessions**: Same ordering maintained across page reloads and browser sessions

### Visual & UX

- [ ] **Section Headers Visible**: If using section headers ("ACTIVE WORK", "WAITING", "COMPLETED"), they are clear and readable
- [ ] **No Confusion**: State grouping doesn't confuse users about which artifacts are important
- [ ] **Mobile Responsive**: Ordering and grouping work on mobile/tablet screen sizes
- [ ] **Accessibility**: State grouping conveyed through structure, not color alone; screen readers announce groups correctly
- [ ] **Visual Distinction**: Active vs. waiting vs. completed groups are visually distinct (color, font weight, indentation, or spacing)

### Technical

- [ ] **Performance**: Sorting/ordering logic executes in <100ms for 100+ artifacts
- [ ] **Extendable**: State ordering configured in a constant/config file for easy future updates
- [ ] **No Breaking Changes**: Existing dashboard functionality unaffected
- [ ] **Proper State Values**: All artifacts use consistent state values from YAML frontmatter (not hardcoded assumptions)

### Testing

- [ ] **Unit Tests**: Test state ordering logic with various combinations of states
- [ ] **Component Tests**: Test artifacts render in correct order
- [ ] **Integration Tests**: Test with real dashboard and artifact data
- [ ] **E2E Tests**: Verify artifacts appear in correct priority order on loaded dashboard

---

## Definition of Ready (DoR)

Before story enters in-progress:

- [ ] Story linked to epic via filename ✓
- [ ] Feature-Increment exists with state ordering specification (Section 5 of fi-TSV-007) ✓
- [ ] Acceptance Criteria are testable ✓
- [ ] State ordering hierarchy confirmed (12-level priority list) ✓
- [ ] Estimate assigned (5 pts) ✓
- [ ] Visual grouping approach decided (section headers, colors, styling, etc.)

---

## Definition of Done (DoD)

Before story moves to done:

- [ ] All acceptance criteria verified by QA
- [ ] Code reviewed and merged to main branch
- [ ] Tests passing (unit, component, integration, E2E)
- [ ] State ordering persists across all user sessions and page reloads
- [ ] Visual grouping clear and accessible
- [ ] No regression in dashboard performance
- [ ] Ready for deployment

---

## Technical Notes for DEV

### State Ordering Configuration

Create a shared constant file for state ordering (extensible for future states):

```typescript
// constants/stateOrdering.ts
export const STATE_PRIORITY = {
  'in-progress': 1,
  'active': 2,
  'ready': 3,
  'draft': 4,
  'proposed': 5,
  'pending': 6,
  'on-hold': 7,
  'deferred': 8,
  'out-of-scope': 9,
  'done': 10,
  'retired': 11,
  'archived': 12,
};

export const STATE_GROUPS = {
  'ACTIVE WORK': ['in-progress', 'active', 'ready', 'draft', 'proposed'],
  'WAITING': ['pending', 'on-hold'],
  'COMPLETED': ['deferred', 'out-of-scope', 'done', 'retired', 'archived'],
};
```

### Sorting Function

```typescript
// utils/artifactSorting.ts
import { STATE_PRIORITY } from '../constants/stateOrdering';

export const sortArtifacts = (artifacts) => {
  return [...artifacts].sort((a, b) => {
    // First sort by state priority
    const statePriorityDiff = (STATE_PRIORITY[a.status] || 99) - (STATE_PRIORITY[b.status] || 99);
    if (statePriorityDiff !== 0) return statePriorityDiff;
    
    // Then sort alphabetically by title within same state
    return a.title.localeCompare(b.title);
  });
};

// Optional: Group artifacts by state
export const groupArtifactsByState = (artifacts) => {
  const grouped = {};
  
  artifacts.forEach(artifact => {
    const priority = STATE_PRIORITY[artifact.status] || 99;
    if (!grouped[priority]) {
      grouped[priority] = [];
    }
    grouped[priority].push(artifact);
  });
  
  // Sort within each group alphabetically
  Object.values(grouped).forEach(group => {
    group.sort((a, b) => a.title.localeCompare(b.title));
  });
  
  return grouped;
};
```

### Component Integration

```tsx
// In FADashboard.tsx / BADashboard.tsx
import { sortArtifacts } from '../utils/artifactSorting';

export const FADashboard = () => {
  const artifacts = useFeatures(); // or useAllArtifacts()
  const sortedArtifacts = sortArtifacts(artifacts);
  
  return (
    <div>
      {/* Filter toggle (story s-e007-001) */}
      <ArtifactList artifacts={sortedArtifacts} />
    </div>
  );
};
```

### Visual Grouping Options

**Option A: Section Headers (Recommended)**
```
=== ACTIVE WORK ===
  • epic-TSV-006 (in-progress)
  • f-TSV-001 (active)
  • f-TSV-002 (active)

=== WAITING ===
  • f-TSV-005 (pending)

=== COMPLETED ===
  • ba-TSV-001 (done)
```

**Option B: Colored Badges**
```
• epic-TSV-006 [in-progress] (red badge)
• f-TSV-001 [active] (green badge)
• f-TSV-005 [pending] (yellow badge)
• ba-TSV-001 [done] (gray badge)
```

**Option C: Indentation & Styling**
```
In-Progress
  epic-TSV-006
Active
  f-TSV-001
  f-TSV-002
Pending
  f-TSV-005
Done
  ba-TSV-001
```

---

## Data Requirements

- Artifacts must have accessible `status` field from YAML frontmatter
- Artifact title field must be accessible for alphabetical sorting
- State values must be consistent across artifact types

---

## Change Log

| Date | Author | Status | Notes |
|------|--------|--------|-------|
| 2026-01-17 | FA | Backlog | Initial story slice from epic-TSV-007; ready for sprint planning; includes config structure for maintainability |
