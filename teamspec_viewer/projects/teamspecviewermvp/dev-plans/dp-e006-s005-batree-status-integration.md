---
# === LLM Retrieval Metadata ===
artifact_kind: devplan
spec_version: "4.0"
template_version: "4.0.1"
title: "BATree Status Integration"

# === Ownership ===
role_owner: DEV
artifact_type: Project Execution
canonicity: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "dp-e006-s005"
filename_pattern: "dp-e006-s005-batree-status-integration.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e006-005"
    optional: false

# === Search Optimization ===
keywords:
  - dev plan
  - BATree
  - status integration
  - BA dashboard
aliases:
  - BA tree status editing
anti_keywords:
  - story
  - requirements
---

# Dev Plan: `dp-e006-s005-batree-status-integration`

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
| **Dev Plan ID** | dp-e006-s005 |
| **Story** | [s-e006-005](../stories/backlog/s-e006-005-batree-status-integration.md) |
| **Epic** | epic-TSV-006 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | DEV Agent |
| **Created** | 2026-01-16 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e006-005](../stories/backlog/s-e006-005-batree-status-integration.md) | BATree Status Integration | [fi-TSV-006](../feature-increments/fi-TSV-006-inline-status-editing-mvp.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Apply the same pattern from `ArtifactTree.tsx` (s-e006-004) to `BATree.tsx`:
1. Import `StatusDropdown` component
2. Replace read-only status chips with `StatusDropdown`
3. Reuse `updateArtifactStatus` API client from `api/artifacts.ts`
4. Handle loading/error states identically

This is largely a copy of the ArtifactTree integration with BA-specific artifact types.

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `BATree.tsx` | Modified | Integrate StatusDropdown for BA nodes |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `frontend/src/components/BATree.tsx` | Modify | Replace status chips with StatusDropdown |

### 2.2 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| `StatusDropdown` | New (s-e006-002) | Required |
| `statusOptions.ts` | New (s-e006-001) | Required |
| `api/artifacts.ts` | New (s-e006-004) | Required |
| Backend API | New (s-e006-003) | Required |

### 2.3 Node Types to Support

| Node Type | ArtifactType | Status Editable |
|-----------|--------------|-----------------|
| Business Analysis | `business-analysis` | Yes |
| BA Increment | `ba-increment` | Yes |

### 2.4 BATree Integration

```typescript
// Changes to BATree.tsx - same pattern as ArtifactTree

import { StatusDropdown } from './StatusDropdown';
import { updateArtifactStatus } from '../api/artifacts';

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
            showError(result.error || 'Failed to update status');
        }
    } catch (error) {
        setStatusStates(prev => ({
            ...prev,
            [path]: { status: currentStatus, loading: false },
        }));
        showError('Network error: Failed to update status');
    }
};

// In render (for BA document node):
<StatusDropdown
    artifactType="business-analysis"
    currentStatus={statusStates[ba.path]?.status || ba.status}
    onStatusChange={(newStatus) => handleStatusChange(ba.path, 'business-analysis', newStatus)}
    loading={statusStates[ba.path]?.loading || false}
    size="small"
/>

// In render (for BAI node):
<StatusDropdown
    artifactType="ba-increment"
    currentStatus={statusStates[bai.path]?.status || bai.status}
    onStatusChange={(newStatus) => handleStatusChange(bai.path, 'ba-increment', newStatus)}
    loading={statusStates[bai.path]?.loading || false}
    size="small"
/>
```

---

## 3. Testing Strategy

### 3.1 Unit Tests

- [ ] StatusDropdown renders for BA nodes
- [ ] StatusDropdown renders for BAI nodes
- [ ] Click on dropdown doesn't select/expand node
- [ ] Optimistic update works
- [ ] Rollback on error works

### 3.2 Integration Tests

- [ ] BA status update persists to file
- [ ] BAI status update persists to file

### 3.3 Manual Testing

- [ ] BA document status edit in BA Dashboard
- [ ] BA Increment status edit in BA Dashboard
- [ ] Error handling works correctly

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Code duplication with ArtifactTree | Medium | Low | Consider extracting shared hook in future |
| Different node structure in BATree | Low | Medium | Verify node.path and node.status exist |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | BA document dropdown opens | StatusDropdown with `artifactType='business-analysis'` |
| 2 | BAI status edit updates chip | Same pattern as ArtifactTree |
| 3 | Error shows toast + rollback | Reuse error handling from ArtifactTree |

---

## 6. Checklist

### Pre-Implementation

- [x] Story requirements understood
- [x] Feature-Increment AS-IS/TO-BE reviewed
- [x] Technical approach approved
- [x] Dependencies identified (s-e006-001, 002, 003, 004)

### Implementation

- [ ] BATree.tsx modified
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
