---
# === LLM Retrieval Metadata ===
artifact_kind: devplan
spec_version: "4.0"
template_version: "4.0.1"
title: "Documentation and release notes"

# === Ownership ===
role_owner: DEV
artifact_type: Project Execution
canonicity: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "dp-e007-s005"
filename_pattern: "dp-e007-s005-documentation-release-notes.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e007-005"
    optional: false

---

# Dev Plan: `dp-e007-s005-documentation-release-notes`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-17

---

**Document Owner:** DEV (Developer)  
**Artifact Type:** Execution (Implementation Plan)  
**Lifecycle:** Sprint-bound, archived after story completion

---

## Metadata

| Field | Value |
|-------|-------|
| **Dev Plan ID** | dp-e007-s005 |
| **Story** | [s-e007-005](../stories/backlog/s-e007-005-documentation-release-notes.md) |
| **Epic** | epic-TSV-007 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | DEV |
| **Created** | 2026-01-17 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e007-005](../stories/backlog/s-e007-005-documentation-release-notes.md) | Documentation and release notes | [fi-TSV-007](../feature-increments/fi-TSV-007-dashboard-filtering-ordering.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Create comprehensive documentation covering:
1. **In-app help**: Tooltips and contextual guidance
2. **User documentation**: Release notes explaining new features
3. **Developer documentation**: Architecture, code structure, and extension guide
4. **Feature Canon update**: Prepare f-TSV-002 update for PO sync

### 1.2 Documentation Deliverables

| Deliverable | Audience | Format |
|-------------|----------|--------|
| Filter tooltip text | End users | In-app (MUI Tooltip) |
| State legend | End users | In-app or help modal |
| Release notes | End users | Markdown (CHANGELOG.md) |
| Developer docs | Developers | Markdown (docs/) |
| Feature Canon update | PO/FA | fi-TSV-007 TO-BE finalized |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `frontend/src/components/FADashboard.tsx` | Modify | Add tooltip to filter toggle |
| `frontend/src/components/FilterToggle.tsx` | Create (optional) | Reusable filter toggle with built-in help |
| `CHANGELOG.md` | Modify | Add release notes entry |
| `docs/filtering-and-ordering.md` | Create | Developer documentation |
| `fi-TSV-007...md` | Modify | Finalize TO-BE section |

### 2.2 In-App Documentation

#### 2.2.1 Filter Toggle Tooltip

```tsx
// In FADashboard.tsx
import { Tooltip, FormControlLabel, Checkbox, IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
  <Tooltip
    title={
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
          Show Completed Artifacts
        </Typography>
        <Typography variant="body2">
          Toggle to show or hide artifacts with completed states:
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 2, mt: 0.5 }}>
          <li>Done — Completed and closed</li>
          <li>Retired — No longer in use</li>
          <li>Deferred — Moved to later release</li>
          <li>Out-of-Scope — Explicitly excluded</li>
          <li>Archived — Historical reference</li>
        </Box>
      </Box>
    }
    placement="right"
    arrow
  >
    <FormControlLabel
      control={
        <Checkbox
          checked={showCompleted}
          onChange={(e) => setShowCompleted(e.target.checked)}
        />
      }
      label="Show Completed Artifacts"
    />
  </Tooltip>
</Box>
```

#### 2.2.2 State Legend Component (Optional)

```tsx
// components/StateLegend.tsx
import { Box, Typography, Chip, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const STATE_INFO = [
  { group: 'Active Work', states: [
    { name: 'In-Progress', color: '#ef4444', description: 'Currently being worked on' },
    { name: 'Active', color: '#22c55e', description: 'Deployed to production' },
    { name: 'Ready', color: '#3b82f6', description: 'Approved for implementation' },
    { name: 'Draft', color: '#f59e0b', description: 'In development' },
    { name: 'Proposed', color: '#8b5cf6', description: 'Awaiting approval' },
  ]},
  { group: 'Waiting', states: [
    { name: 'Pending', color: '#f97316', description: 'Waiting for dependency' },
    { name: 'On-Hold', color: '#6b7280', description: 'Explicitly paused' },
  ]},
  { group: 'Completed', states: [
    { name: 'Done', color: '#10b981', description: 'Completed and closed' },
    { name: 'Retired', color: '#9ca3af', description: 'No longer in use' },
    { name: 'Deferred', color: '#d1d5db', description: 'Moved to later release' },
    { name: 'Out-of-Scope', color: '#e5e7eb', description: 'Explicitly excluded' },
    { name: 'Archived', color: '#f3f4f6', description: 'Historical reference' },
  ]},
];

export const StateLegend: React.FC = () => (
  <Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>State Legend</Typography>
    </AccordionSummary>
    <AccordionDetails>
      {STATE_INFO.map(group => (
        <Box key={group.group} sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {group.group}
          </Typography>
          {group.states.map(state => (
            <Box key={state.name} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Chip
                label={state.name}
                size="small"
                sx={{ bgcolor: state.color, color: 'white', minWidth: 100 }}
              />
              <Typography variant="body2" color="text.secondary">
                {state.description}
              </Typography>
            </Box>
          ))}
        </Box>
      ))}
    </AccordionDetails>
  </Accordion>
);
```

### 2.3 Release Notes

#### CHANGELOG.md Entry

```markdown
## [1.x.x] - 2026-01-XX

### Added

#### Dashboard Artifact Filtering and Smart State Ordering (Epic TSV-007)

**New Features:**

- **Artifact Visibility Filter**: Toggle to show/hide completed artifacts
  - New "Show Completed Artifacts" checkbox on FA and BA dashboards
  - Hides artifacts with states: done, retired, deferred, out-of-scope, archived
  - Preference saved to browser and persists across sessions

- **Smart State Ordering**: Artifacts automatically sorted by state priority
  - Active work items (in-progress, active, ready, draft, proposed) appear first
  - Waiting items (pending, on-hold) appear in the middle
  - Completed items appear last (and can be hidden via filter)
  - Within each state, items are sorted alphabetically by title

**User Experience:**
- Reduces visual clutter by hiding finished work
- Faster task discovery with active items at top
- Filter preference remembered between visits
- Fully keyboard accessible
- Works on both FA and BA dashboards

**Technical Notes:**
- Filter state stored in browser localStorage
- Client-side filtering and sorting (no API changes)
- WCAG 2.1 AA accessibility compliant

**Related:**
- Feature Increment: fi-TSV-007
- Epic: epic-TSV-007
- Stories: s-e007-001 through s-e007-005
```

### 2.4 Developer Documentation

#### docs/filtering-and-ordering.md

```markdown
# Dashboard Filtering and Ordering

## Overview

This document describes the architecture and implementation of the dashboard artifact filtering and smart state ordering feature (Epic TSV-007).

## Architecture

### Components

```
frontend/src/
├── constants/
│   └── stateOrdering.ts      # State priority and grouping config
├── utils/
│   └── artifactSorting.ts    # Filter and sort utility functions
├── hooks/
│   └── useArtifactFilter.ts  # Filter state hook with localStorage
└── components/
    ├── FADashboard.tsx       # FA dashboard with filtering
    └── BADashboard.tsx       # BA dashboard with filtering
```

### Data Flow

1. **API Response**: Backend returns artifacts (features, epics, etc.)
2. **Hook Initialization**: `useArtifactFilter` reads localStorage for saved preference
3. **Filter & Sort**: `filterAndSortArtifacts()` transforms the artifact list
4. **Render**: Dashboard displays processed artifacts
5. **User Interaction**: Toggle changes state, triggers re-filter/sort
6. **Persistence**: useEffect saves new state to localStorage

### State Priority

States are ordered by priority (lower = higher priority):

| Priority | State | Category |
|----------|-------|----------|
| 1 | in-progress | Active Work |
| 2 | active | Active Work |
| 3 | ready | Active Work |
| 4 | draft | Active Work |
| 5 | proposed | Active Work |
| 6 | pending | Waiting |
| 7 | on-hold | Waiting |
| 8 | deferred | Completed |
| 9 | out-of-scope | Completed |
| 10 | done | Completed |
| 11 | retired | Completed |
| 12 | archived | Completed |

### Adding New States

To add a new state:

1. Add to `STATE_PRIORITY` in `constants/stateOrdering.ts`:
   ```typescript
   export const STATE_PRIORITY = {
     // ... existing states
     'new-state': 2.5,  // Insert between active (2) and ready (3)
   };
   ```

2. Add to appropriate `STATE_GROUPS` category

3. If it's a terminal state, add to `TERMINAL_STATES`

4. Update this documentation

### localStorage Keys

- `tsv_showCompleted_FA` — FA Dashboard filter preference
- `tsv_showCompleted_BA` — BA Dashboard filter preference

Values: `"true"` or `"false"` (string)

### Error Handling

- **localStorage unavailable**: Falls back to in-memory state
- **Unknown states**: Sorted to end (priority 99)
- **Missing status field**: Treated as unknown state

## Testing

### Unit Tests
- `__tests__/constants/stateOrdering.test.ts`
- `__tests__/utils/artifactSorting.test.ts`
- `__tests__/hooks/useArtifactFilter.test.ts`

### E2E Tests
- `e2e/dashboard-filtering.spec.ts`

### Running Tests
```bash
pnpm test                 # Unit tests
pnpm test:e2e            # E2E tests
pnpm test:coverage       # Coverage report
```

## Performance

- Filter 100 artifacts: <50ms
- Sort 500 artifacts: <100ms
- localStorage operations: <10ms

## Accessibility

- Keyboard: Tab + Space/Enter
- Screen readers: ARIA attributes on checkbox
- Color contrast: WCAG AA compliant
```

---

## 3. Task Breakdown

| # | Task | Est. Hours | Dependencies |
|---|------|------------|--------------|
| 1 | Add tooltip to filter toggle (FA + BA) | 1 | s-e007-001 complete |
| 2 | Create StateLegend component (optional) | 2 | Task 1 |
| 3 | Write CHANGELOG.md entry | 1 | All features complete |
| 4 | Write developer documentation | 2 | All features complete |
| 5 | Finalize fi-TSV-007 TO-BE section | 1 | All features complete |
| 6 | Update f-TSV-002 draft (for PO sync) | 1 | Task 5 |
| 7 | Review all documentation for accuracy | 1 | Tasks 1-6 |
| 8 | Peer review documentation | 1 | Task 7 |
| **Total** | | **10 hours** | |

---

## 4. Documentation Checklist

### In-App Help
- [ ] Filter toggle has tooltip explaining completed states
- [ ] Tooltip lists all 5 terminal states
- [ ] Tooltip is accessible (keyboard, screen reader)
- [ ] Optional: State legend component available

### Release Notes
- [ ] CHANGELOG.md updated with feature summary
- [ ] All new capabilities listed
- [ ] User-friendly language (no jargon)
- [ ] Links to related artifacts

### Developer Documentation
- [ ] Architecture overview
- [ ] Component/file structure
- [ ] Data flow diagram
- [ ] State priority table
- [ ] Extension guide (adding new states)
- [ ] Testing instructions
- [ ] Performance characteristics

### Feature Canon
- [ ] fi-TSV-007 TO-BE section finalized
- [ ] TO-BE matches actual implementation
- [ ] Ready for PO to sync to Product Canon

---

## 5. Acceptance Criteria Verification

| AC | Implementation | Status |
|----|----------------|--------|
| Tooltip on Filter Toggle | MUI Tooltip with state list | ⏳ |
| Help Text | Terminal states explained | ⏳ |
| State Legend | Optional component created | ⏳ |
| Release Notes | CHANGELOG.md updated | ⏳ |
| Developer Docs | docs/filtering-and-ordering.md | ⏳ |
| Feature Canon Updated | fi-TSV-007 finalized | ⏳ |
| Documentation Reviewed | Peer review complete | ⏳ |

---

## 6. Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Documentation out of sync with code | Medium | Review docs after final code changes |
| Tooltip text too long | Low | Keep concise; use help modal for details |
| CHANGELOG format inconsistent | Low | Follow existing format in file |

---

## Change Log

| Date | Author | Status | Notes |
|------|--------|--------|-------|
| 2026-01-17 | DEV | Draft | Initial dev plan for documentation and release notes |
