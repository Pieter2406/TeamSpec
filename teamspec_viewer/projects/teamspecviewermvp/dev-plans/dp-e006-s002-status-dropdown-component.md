---
# === LLM Retrieval Metadata ===
artifact_kind: devplan
spec_version: "4.0"
template_version: "4.0.1"
title: "Status Dropdown Component"

# === Ownership ===
role_owner: DEV
artifact_type: Project Execution
canonicity: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "dp-e006-s002"
filename_pattern: "dp-e006-s002-status-dropdown-component.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e006-002"
    optional: false

# === Search Optimization ===
keywords:
  - dev plan
  - status dropdown
  - MUI menu
  - component
aliases:
  - dropdown implementation
anti_keywords:
  - story
  - requirements
---

# Dev Plan: `dp-e006-s002-status-dropdown-component`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-16

---

**Document Owner:** DEV (Developer)  
**Artifact Type:** Execution (Implementation Plan)  
**Lifecycle:** Sprint-bound, archived after story completion

---

## Metadata

| Field | Value |
|-------|-------|
| **Dev Plan ID** | dp-e006-s002 |
| **Story** | [s-e006-002](../stories/backlog/s-e006-002-status-dropdown-component.md) |
| **Epic** | epic-TSV-006 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | DEV Agent |
| **Created** | 2026-01-16 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e006-002](../stories/backlog/s-e006-002-status-dropdown-component.md) | Status Dropdown Component | [fi-TSV-006](../feature-increments/fi-TSV-006-inline-status-editing-mvp.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Create a reusable `StatusDropdown` component that:
1. Renders as a clickable colored chip (matching current read-only chips)
2. Opens MUI Menu on click with valid status options
3. Highlights current status and calls callback on selection
4. Supports keyboard navigation (arrow keys, Enter, Escape)
5. Accepts `loading` prop for async states (prepared for s-e006-006)

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `StatusDropdown.tsx` | New | Reusable status dropdown component |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `frontend/src/components/StatusDropdown.tsx` | Create | Status dropdown component |

### 2.2 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| `@mui/material` (Chip, Menu, MenuItem) | Existing | Available |
| `@mui/icons-material` (Check) | Existing | Available |
| `statusOptions.ts` | New (s-e006-001) | Required dependency |

### 2.3 Component Props Interface

```typescript
interface StatusDropdownProps {
    /** The artifact type (determines valid status options) */
    artifactType: ArtifactType | string;
    
    /** Current status value */
    currentStatus: string;
    
    /** Callback when status is changed */
    onStatusChange: (newStatus: string) => void;
    
    /** Whether the dropdown is disabled */
    disabled?: boolean;
    
    /** Whether an async operation is in progress */
    loading?: boolean;
    
    /** Size variant */
    size?: 'small' | 'medium';
}
```

### 2.4 Implementation Details

```typescript
// frontend/src/components/StatusDropdown.tsx

import React, { useState, useCallback } from 'react';
import { Chip, Menu, MenuItem, CircularProgress, ListItemIcon } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { ArtifactType } from '../utils/artifactIcons';
import { getStatusOptions, getStatusColor, StatusConfig } from '../utils/statusOptions';

export interface StatusDropdownProps {
    artifactType: ArtifactType | string;
    currentStatus: string;
    onStatusChange: (newStatus: string) => void;
    disabled?: boolean;
    loading?: boolean;
    size?: 'small' | 'medium';
}

export const StatusDropdown: React.FC<StatusDropdownProps> = ({
    artifactType,
    currentStatus,
    onStatusChange,
    disabled = false,
    loading = false,
    size = 'small',
}) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);
    
    const statusOptions = getStatusOptions(artifactType);
    const currentColor = getStatusColor(artifactType, currentStatus);
    
    const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation(); // Prevent tree node expansion
        if (!disabled && !loading) {
            setAnchorEl(event.currentTarget);
        }
    }, [disabled, loading]);
    
    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);
    
    const handleSelect = useCallback((status: string) => {
        setAnchorEl(null);
        if (status !== currentStatus) {
            onStatusChange(status);
        }
    }, [currentStatus, onStatusChange]);
    
    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
        if (event.key === 'Escape') {
            handleClose();
        }
    }, [handleClose]);
    
    // If no valid options, render read-only chip
    if (statusOptions.length === 0) {
        return (
            <Chip
                label={currentStatus}
                size={size}
                sx={{ 
                    backgroundColor: currentColor,
                    color: '#fff',
                    fontWeight: 500,
                }}
            />
        );
    }
    
    return (
        <>
            <Chip
                label={loading ? '' : currentStatus}
                size={size}
                onClick={handleClick}
                icon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
                sx={{
                    backgroundColor: loading ? `${currentColor}80` : currentColor,
                    color: '#fff',
                    fontWeight: 500,
                    cursor: disabled || loading ? 'default' : 'pointer',
                    opacity: disabled ? 0.5 : 1,
                    minWidth: loading ? 80 : undefined,
                    '&:hover': {
                        backgroundColor: disabled || loading ? currentColor : `${currentColor}cc`,
                    },
                }}
            />
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onKeyDown={handleKeyDown}
                MenuListProps={{
                    'aria-labelledby': 'status-dropdown',
                    dense: true,
                }}
            >
                {statusOptions.map((option: StatusConfig) => (
                    <MenuItem
                        key={option.value}
                        selected={option.value === currentStatus}
                        onClick={() => handleSelect(option.value)}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 24 }}>
                            {option.value === currentStatus && (
                                <CheckIcon fontSize="small" sx={{ color: option.color }} />
                            )}
                        </ListItemIcon>
                        <Chip
                            label={option.label}
                            size="small"
                            sx={{
                                backgroundColor: option.color,
                                color: '#fff',
                                fontWeight: 500,
                            }}
                        />
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default StatusDropdown;
```

---

## 3. Testing Strategy

### 3.1 Unit Tests

- [ ] Renders chip with current status
- [ ] Opens menu on click
- [ ] Shows checkmark on current status
- [ ] Calls onStatusChange when different status selected
- [ ] Does NOT call onStatusChange when same status selected
- [ ] Closes on Escape key
- [ ] Closes on outside click
- [ ] Shows loading spinner when loading=true
- [ ] Disabled prop prevents opening

### 3.2 Integration Tests

- [ ] Works with all artifact types
- [ ] Keyboard navigation works (arrow keys, Enter)

### 3.3 Manual Testing

- [ ] Visual appearance matches existing chips
- [ ] Dropdown positioning is correct
- [ ] Click doesn't propagate to parent (tree node)

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Click propagation to tree node | Medium | High | Use `event.stopPropagation()` |
| Menu positioning issues | Low | Medium | Use MUI Menu's default positioning |
| Keyboard navigation complexity | Low | Low | Rely on MUI Menu's built-in keyboard handling |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | Opens dropdown with correct options | `getStatusOptions(artifactType)` |
| 2 | Current status highlighted | `selected` prop + CheckIcon |
| 3 | Select calls onStatusChange | `handleSelect` callback |
| 4 | Cancel closes without callback | `handleClose` on outside click/Escape |
| 5 | Keyboard navigation | MUI Menu built-in |

---

## 6. Checklist

### Pre-Implementation

- [x] Story requirements understood
- [x] Feature-Increment AS-IS/TO-BE reviewed
- [x] Technical approach approved
- [x] Dependencies identified (s-e006-001)

### Implementation

- [ ] Code implemented
- [ ] Unit tests written
- [ ] Code reviewed
- [ ] Tests passing

### Post-Implementation

- [ ] Integration tests passing
- [ ] Documentation updated (if needed)
- [ ] Ready for QA verification

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-16 | DEV Agent | Initial plan |
