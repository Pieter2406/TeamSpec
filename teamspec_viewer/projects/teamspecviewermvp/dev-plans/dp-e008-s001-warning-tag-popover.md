---
# === LLM Retrieval Metadata ===
artifact_kind: devplan
spec_version: "4.0"
template_version: "4.0.1"
title: "TBD warning tag and popover implementation"

# === Ownership ===
role_owner: DEV
artifact_type: Project Execution
canonicity: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "dp-e008-s001"
filename_pattern: "dp-e008-s001-warning-tag-popover.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e008-001"
    optional: false

---

# Dev Plan: `dp-e008-s001-warning-tag-popover`

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
| **Dev Plan ID** | dp-e008-s001 |
| **Story** | [s-e008-001](../stories/ready-to-refine/s-e008-001-warning-tag-popover.md) |
| **Epic** | epic-TSV-008 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | DEV |
| **Created** | 2026-01-17 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e008-001](../stories/ready-to-refine/s-e008-001-warning-tag-popover.md) | Treeview TBD warning tag + popover | [fi-TSV-008](../feature-increments/fi-TSV-008-treeview-tbd-warnings.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Add a visual TBD warning indicator to treeview nodes that:
1. Displays a small warning triangle icon + "TBD" tag when `hasTBD` is true
2. Shows an accessible popover/tooltip explaining the meaning on hover/focus
3. Integrates consistently across ArtifactTree (FIs, Epics, Stories) and BATree (BAIs)
4. Does not interfere with existing status dropdowns or node interactions

### 1.2 Dependencies

This story depends on **s-e008-002** (literal detection) which provides the `hasTBD` flag from the backend. The UI can be developed in parallel using mock data, then integrated once the backend flag is available.

### 1.3 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `TBDIndicator.tsx` | New | Reusable indicator with icon, tag, and tooltip |
| `ArtifactTree.tsx` | Modified | Add TBDIndicator to tree node labels |
| `BATree.tsx` | Modified | Add TBDIndicator to tree node labels |
| `NodeLabel` (shared) | Modified | Accept optional `hasTBD` prop |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `frontend/src/components/TBDIndicator.tsx` | Create | Reusable TBD warning component |
| `frontend/src/components/ArtifactTree.tsx` | Modify | Add TBDIndicator to NodeLabel |
| `frontend/src/components/BATree.tsx` | Modify | Add TBDIndicator to NodeLabel |

### 2.2 Code Implementation

#### 2.2.1 TBDIndicator Component

```typescript
// TBDIndicator.tsx
import { Box, Tooltip, Typography } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface TBDIndicatorProps {
    /** Show the indicator */
    show: boolean;
    /** Size variant */
    size?: 'small' | 'medium';
}

const TOOLTIP_TEXT = 'Contains literal {TBD} markers — this document needs review';
const ARIA_LABEL = 'Contains TBDs — needs review';

export function TBDIndicator({ show, size = 'small' }: TBDIndicatorProps) {
    if (!show) return null;

    const iconSize = size === 'small' ? 14 : 18;
    const fontSize = size === 'small' ? '0.65rem' : '0.75rem';

    return (
        <Tooltip
            title={TOOLTIP_TEXT}
            arrow
            placement="top"
            enterDelay={200}
            // Keyboard accessible
            tabIndex={0}
            aria-label={ARIA_LABEL}
        >
            <Box
                component="span"
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.25,
                    px: 0.5,
                    py: 0.125,
                    borderRadius: 0.5,
                    bgcolor: 'warning.light',
                    color: 'warning.dark',
                    cursor: 'default',
                    ml: 0.5,
                    // Ensure keyboard focusable
                    '&:focus': {
                        outline: '2px solid',
                        outlineColor: 'warning.main',
                        outlineOffset: 1,
                    },
                }}
                role="status"
                aria-label={ARIA_LABEL}
            >
                <WarningAmberIcon sx={{ fontSize: iconSize }} />
                <Typography
                    component="span"
                    sx={{
                        fontSize,
                        fontWeight: 600,
                        lineHeight: 1,
                    }}
                >
                    TBD
                </Typography>
            </Box>
        </Tooltip>
    );
}
```

#### 2.2.2 NodeLabel Props Extension

```typescript
// In both ArtifactTree.tsx and BATree.tsx
interface NodeLabelProps {
    icon: React.ReactNode;
    title: string;
    badge?: string;
    statusElement?: React.ReactNode;
    hasTBD?: boolean;  // NEW
}

function NodeLabel({ icon, title, badge, statusElement, hasTBD }: NodeLabelProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                py: 0.5,
            }}
        >
            <Box sx={{ color: '#64748b', display: 'flex', alignItems: 'center' }}>
                {icon}
            </Box>
            <Typography
                variant="body2"
                sx={{
                    fontWeight: 500,
                    color: '#1e293b',
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}
            >
                {title}
            </Typography>
            {/* TBD Indicator - NEW */}
            <TBDIndicator show={hasTBD ?? false} size="small" />
            {badge && (
                <Typography
                    variant="caption"
                    sx={{
                        px: 0.75,
                        py: 0.25,
                        borderRadius: 0.5,
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        bgcolor: '#f1f5f9',
                        color: '#64748b',
                    }}
                >
                    {badge}
                </Typography>
            )}
            {statusElement}
        </Box>
    );
}
```

#### 2.2.3 ArtifactTree Integration

```typescript
// ArtifactTree.tsx - Update render functions to pass hasTBD

// Render Story TreeItem
const renderStory = (story: StoryInfo, fiProject: string) => {
    // ... existing code ...
    return (
        <TreeItem
            key={`story-${story.id}`}
            itemId={`story-${story.id}`}
            label={
                <ClickableLabel nodeData={nodeData}>
                    <NodeLabel
                        icon={<IconComponent sx={{ fontSize: 16, color: iconConfig.color }} />}
                        title={story.title}
                        hasTBD={story.hasTBD}  // NEW - from API response
                        statusElement={/* existing */}
                    />
                </ClickableLabel>
            }
        />
    );
};

// Similar updates for renderEpic and renderFI
```

#### 2.2.4 Type Extensions

```typescript
// frontend/src/api/artifacts.ts - Extend response types

export interface StoryInfo {
    id: string;
    title: string;
    status?: string;
    path: string;
    hasTBD?: boolean;  // NEW
}

export interface EpicInfo {
    id: string;
    title: string;
    status?: string;
    path: string;
    stories: StoryInfo[];
    hasTBD?: boolean;  // NEW
}

export interface FIInfo {
    id: string;
    title: string;
    status?: string;
    project: string;
    path: string;
    epic?: EpicInfo;
    hasTBD?: boolean;  // NEW
}

export interface BAIInfo {
    id: string;
    title: string;
    status?: string;
    project: string;
    path: string;
    hasTBD?: boolean;  // NEW
}
```

### 2.3 Accessibility Requirements

| Requirement | Implementation |
|-------------|----------------|
| Keyboard accessible | `tabIndex={0}` on indicator wrapper |
| Focus visible | `:focus` outline style |
| Screen reader | `role="status"` and `aria-label` |
| Tooltip keyboard trigger | MUI Tooltip handles Enter/Space |

### 2.4 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| MUI Tooltip | Existing | Available |
| MUI WarningAmberIcon | Existing | Available |
| `hasTBD` backend flag | s-e008-002 | Pending (can mock) |

---

## 3. Testing Strategy

### 3.1 Unit Tests

| Test File | Coverage |
|-----------|----------|
| `__tests__/components/TBDIndicator.test.tsx` | Indicator rendering, accessibility |
| `__tests__/components/ArtifactTree.test.tsx` | TBD indicator in tree nodes |
| `__tests__/components/BATree.test.tsx` | TBD indicator in tree nodes |

### 3.2 Unit Test Cases

```typescript
// TBDIndicator.test.tsx
describe('TBDIndicator', () => {
    it('renders nothing when show is false', () => {
        render(<TBDIndicator show={false} />);
        expect(screen.queryByText('TBD')).not.toBeInTheDocument();
    });

    it('renders warning icon and TBD tag when show is true', () => {
        render(<TBDIndicator show={true} />);
        expect(screen.getByText('TBD')).toBeInTheDocument();
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('has correct aria-label', () => {
        render(<TBDIndicator show={true} />);
        expect(screen.getByRole('status')).toHaveAttribute(
            'aria-label',
            'Contains TBDs — needs review'
        );
    });

    it('shows tooltip on hover', async () => {
        render(<TBDIndicator show={true} />);
        const indicator = screen.getByRole('status');
        await userEvent.hover(indicator);
        await waitFor(() => {
            expect(screen.getByText(/Contains literal/)).toBeInTheDocument();
        });
    });

    it('shows tooltip on keyboard focus', async () => {
        render(<TBDIndicator show={true} />);
        const indicator = screen.getByRole('status');
        indicator.focus();
        await waitFor(() => {
            expect(screen.getByText(/Contains literal/)).toBeInTheDocument();
        });
    });
});
```

### 3.3 Integration Tests

- Test indicator appears in ArtifactTree when hasTBD is true
- Test indicator appears in BATree when hasTBD is true
- Test indicator does not appear when hasTBD is false/undefined
- Test keyboard navigation through tree with TBD indicators

---

## 4. Task Breakdown

| # | Task | Est. Hours | Dependencies |
|---|------|------------|--------------|
| 1 | Create TBDIndicator component | 1.5 | None |
| 2 | Write TBDIndicator unit tests | 1 | Task 1 |
| 3 | Create shared NodeLabel component (extract from both trees) | 1 | None |
| 4 | Add hasTBD to NodeLabelProps | 0.5 | Task 3 |
| 5 | Update type definitions in api/artifacts.ts | 0.5 | None |
| 6 | Integrate TBDIndicator into ArtifactTree | 1 | Tasks 1, 4 |
| 7 | Integrate TBDIndicator into BATree | 1 | Tasks 1, 4 |
| 8 | Write integration tests | 1.5 | Tasks 6, 7 |
| 9 | Accessibility testing (keyboard, screen reader) | 1 | Tasks 6, 7 |
| 10 | Visual QA and styling adjustments | 0.5 | All tasks |
| **Total** | | **9.5 hours** | |

---

## 5. Acceptance Criteria Verification

| AC (Scenario) | Implementation | Test |
|---------------|----------------|------|
| Indicator visible for artifacts with TBD | TBDIndicator with show={hasTBD} | Unit test |
| Popover explains indicator | MUI Tooltip with specified text | Unit test |
| Keyboard accessible | tabIndex, focus styles, ARIA | Accessibility test |
| No indicator when no TBD | TBDIndicator returns null when show=false | Unit test |

---

## 6. Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Backend `hasTBD` not ready | Medium | Use mock data for UI development; integrate when s-e008-002 complete |
| Indicator clutters tree UI | Low | Keep indicator compact; use subtle warning colors |
| Tooltip interferes with status dropdown | Low | Position tooltip above, dropdown below |
| Performance with many TBD indicators | Low | Indicator is lightweight component |

---

## 7. UX Copy Reference

| Element | Copy |
|---------|------|
| Tag text | TBD |
| Tooltip text | Contains literal `{TBD}` markers — this document needs review |
| ARIA label | Contains TBDs — needs review |

---

## Change Log

| Date | Author | Status | Notes |
|------|--------|--------|-------|
| 2026-01-17 | DEV | Draft | Initial dev plan for TBD warning indicator UI |
