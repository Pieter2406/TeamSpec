---
# === LLM Retrieval Metadata ===
artifact_kind: devplan
spec_version: "4.0"
template_version: "4.0.1"
title: "ArtifactTree Status Integration"

# === Ownership ===
role_owner: DEV
artifact_type: Project Execution
canonicity: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "dp-e006-s004"
filename_pattern: "dp-e006-s004-artifacttree-status-integration.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e006-004"
    optional: false

# === Search Optimization ===
keywords:
  - dev plan
  - ArtifactTree
  - status integration
  - FA dashboard
aliases:
  - tree status editing
anti_keywords:
  - story
  - requirements
---

# Dev Plan: `dp-e006-s004-artifacttree-status-integration`

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
| **Dev Plan ID** | dp-e006-s004 |
| **Story** | [s-e006-004](../stories/backlog/s-e006-004-artifacttree-status-integration.md) |
| **Epic** | epic-TSV-006 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | DEV Agent |
| **Created** | 2026-01-16 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e006-004](../stories/backlog/s-e006-004-artifacttree-status-integration.md) | ArtifactTree Status Integration | [fi-TSV-006](../feature-increments/fi-TSV-006-inline-status-editing-mvp.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Integrate `StatusDropdown` into `ArtifactTree.tsx`:
1. Replace read-only status chips with `StatusDropdown` component
2. Add API client function `updateArtifactStatus`
3. Handle loading/error states with local component state
4. Ensure click doesn't propagate to tree node (expand/collapse)
5. Update local state optimistically, rollback on error

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `ArtifactTree.tsx` | Modified | Integrate StatusDropdown |
| `api/artifacts.ts` | New/Modified | Add updateArtifactStatus function |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `frontend/src/components/ArtifactTree.tsx` | Modify | Replace status chips with StatusDropdown |
| `frontend/src/api/artifacts.ts` | Create | API client for status updates |

### 2.2 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| `StatusDropdown` | New (s-e006-002) | Required |
| `statusOptions.ts` | New (s-e006-001) | Required |
| Backend API | New (s-e006-003) | Required |

### 2.3 API Client Function

```typescript
// frontend/src/api/artifacts.ts

export interface StatusUpdateResponse {
    success: boolean;
    previousStatus?: string;
    newStatus?: string;
    error?: string;
}

export async function updateArtifactStatus(
    path: string,
    status: string
): Promise<StatusUpdateResponse> {
    const response = await fetch('/api/artifacts/status', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path, status }),
    });
    
    return response.json();
}
```

### 2.4 ArtifactTree Integration

```typescript
// Changes to ArtifactTree.tsx

import { StatusDropdown } from './StatusDropdown';
import { updateArtifactStatus } from '../api/artifacts';

// Inside tree node render, replace status Chip with:

interface NodeStatusState {
    [path: string]: {
        status: string;
        loading: boolean;
    };
}

const [statusStates, setStatusStates] = useState<NodeStatusState>({});

const handleStatusChange = async (path: string, artifactType: string, newStatus: string) => {
    const currentStatus = statusStates[path]?.status || node.status;
    
    // Optimistic update
    setStatusStates(prev => ({
        ...prev,
        [path]: { status: newStatus, loading: true },
    }));
    
    try {
        const result = await updateArtifactStatus(path, newStatus);
        
        if (result.success) {
            setStatusStates(prev => ({
                ...prev,
                [path]: { status: newStatus, loading: false },
            }));
        } else {
            // Rollback on error
            setStatusStates(prev => ({
                ...prev,
                [path]: { status: currentStatus, loading: false },
            }));
            // Show error toast (from s-e006-006)
            showError(result.error || 'Failed to update status');
        }
    } catch (error) {
        // Rollback on network error
        setStatusStates(prev => ({
            ...prev,
            [path]: { status: currentStatus, loading: false },
        }));
        showError('Network error: Failed to update status');
    }
};

// In render:
<StatusDropdown
    artifactType={node.type}
    currentStatus={statusStates[node.path]?.status || node.status}
    onStatusChange={(newStatus) => handleStatusChange(node.path, node.type, newStatus)}
    loading={statusStates[node.path]?.loading || false}
    size="small"
/>
```

### 2.5 Node Types to Support

| Node Type | ArtifactType | Status Editable |
|-----------|--------------|-----------------|
| Feature | `feature` | Yes |
| Feature-Increment | `feature-increment` | Yes |
| Epic | `epic` | Yes |
| Story | `story` | Yes |
| Dev Plan | `dev-plan` | Yes |

---

## 3. Testing Strategy

### 3.1 Unit Tests

- [ ] StatusDropdown renders in tree nodes
- [ ] Click on dropdown doesn't expand/collapse tree
- [ ] Optimistic update shows new status immediately
- [ ] Rollback on API error
- [ ] Loading state shown during API call

### 3.2 Integration Tests

- [ ] End-to-end: Click dropdown → select → API call → file updated
- [ ] Error handling: API returns error → rollback + toast

### 3.3 Manual Testing

- [ ] Feature status edit in FA Dashboard
- [ ] Story status edit in FA Dashboard
- [ ] Collapsed node: click status doesn't expand
- [ ] Multiple rapid clicks handled correctly

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Click propagation to tree | High | High | `event.stopPropagation()` in StatusDropdown |
| State sync issues | Medium | Medium | Optimistic update with rollback |
| Performance with many nodes | Low | Medium | Status state only stored for changed nodes |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | Feature status dropdown opens | StatusDropdown with `artifactType='feature'` |
| 2 | Story status edit updates chip | Optimistic update + API call |
| 3 | Error shows toast + rollback | Try/catch with rollback in catch |
| 4 | No tree expansion on click | `event.stopPropagation()` |

---

## 6. Checklist

### Pre-Implementation

- [x] Story requirements understood
- [x] Feature-Increment AS-IS/TO-BE reviewed
- [x] Technical approach approved
- [x] Dependencies identified (s-e006-001, 002, 003)

### Implementation

- [ ] API client created
- [ ] ArtifactTree modified
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
