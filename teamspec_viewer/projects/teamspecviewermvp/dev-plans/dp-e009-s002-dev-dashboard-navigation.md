---
# === LLM Retrieval Metadata ===
artifact_kind: devplan
spec_version: "4.0"
template_version: "4.0.1"
title: "DEV Dashboard Navigation"

# === Ownership ===
role_owner: DEV
artifact_type: Project Execution
canonicity: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "dp-e009-s002"
filename_pattern: "dp-e009-s002-dev-dashboard-navigation.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e009-002"
    optional: false

# === Search Optimization ===
keywords:
  - dev plan
  - DEV dashboard
  - developer dashboard
  - dev-plans navigation
aliases:
  - developer dashboard implementation
anti_keywords:
  - story
  - requirements
---

# Dev Plan: `dp-e009-s002-dev-dashboard-navigation`

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
| **Dev Plan ID** | dp-e009-s002 |
| **Story** | [s-e009-002](../stories/done/s-e009-002-dev-dashboard-navigation.md) |
| **Epic** | epic-TSV-009 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | DEV Agent |
| **Created** | 2026-01-17 |
| **Status** | Implemented |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e009-002](../stories/done/s-e009-002-dev-dashboard-navigation.md) | DEV Dashboard Navigation | [fi-TSV-009](../feature-increments/fi-TSV-009-dev-sa-qa-role-dashboards.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Create a new DEVDashboard component following the established pattern of FADashboard/BADashboard:
1. Create main DEVDashboard component with section layout
2. Create DevPlanTree component for dev-plan navigation (reuse ArtifactTree pattern)
3. Integrate with existing story listing
4. Add TA document listing (product-level)
5. Add TAI document listing (project-level)

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `DEVDashboard.tsx` | New | Main dashboard container with 4 sections |
| `DevPlanTree.tsx` | New | Tree navigation for dev-plans |
| `TATree.tsx` | New | Tree navigation for technical architectures |
| `App.tsx` | Modified | Route DEV role to DEVDashboard |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `frontend/src/components/DEVDashboard.tsx` | Create | Main DEV dashboard |
| `frontend/src/components/DevPlanTree.tsx` | Create | Dev-plan tree navigation |
| `frontend/src/components/TATree.tsx` | Create | TA/TAI tree navigation |
| `frontend/src/App.tsx` | Modify | Add DEV dashboard routing |

### 2.2 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| s-e009-001 (RoleSelector) | Story | Required |
| s-e009-005 (Backend APIs) | Story | Required |
| ArtifactTree pattern | Existing | Reuse |

### 2.3 API Calls

| Endpoint | Purpose |
|----------|---------|
| `GET /api/projects/:projectId/dev-plans` | Fetch dev-plans |
| `GET /api/projects/:projectId/stories` | Fetch stories (existing) |
| `GET /api/products/:productId/technical-architecture` | Fetch TA docs |
| `GET /api/projects/:projectId/tai` | Fetch TAI docs |

### 2.4 Component Structure

```tsx
// DEVDashboard.tsx

import { Box, Typography, Grid, Paper } from '@mui/material';
import { useProduct } from '../contexts/ProductContext';
import { DevPlanTree } from './DevPlanTree';
import { TATree } from './TATree';
import { StoryTree } from './StoryTree'; // reuse existing

export function DEVDashboard() {
    const { selectedProduct, selectedProject } = useProduct();

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Developer Dashboard
            </Typography>
            
            <Grid container spacing={3}>
                {/* Dev Plans Section */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6">Dev Plans</Typography>
                        <DevPlanTree projectId={selectedProject?.id} />
                    </Paper>
                </Grid>

                {/* Stories Section */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6">Stories</Typography>
                        <StoryTree projectId={selectedProject?.id} />
                    </Paper>
                </Grid>

                {/* Technical Architecture (Product) */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6">Technical Architecture</Typography>
                        <TATree 
                            productId={selectedProduct?.id}
                            projectId={selectedProject?.id}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
```

```tsx
// DevPlanTree.tsx

interface DevPlanTreeProps {
    projectId?: string;
}

export function DevPlanTree({ projectId }: DevPlanTreeProps) {
    const [devPlans, setDevPlans] = useState<Artifact[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!projectId) return;
        
        fetch(`/api/projects/${projectId}/dev-plans`)
            .then(res => res.json())
            .then(data => {
                setDevPlans(data.artifacts);
                setLoading(false);
            });
    }, [projectId]);

    if (loading) return <CircularProgress />;
    if (devPlans.length === 0) return <EmptyState message="No dev-plans found" />;

    return (
        <TreeView>
            {devPlans.map(dp => (
                <TreeItem 
                    key={dp.id}
                    nodeId={dp.id}
                    label={
                        <ArtifactLabel 
                            id={dp.id}
                            title={dp.title}
                            status={dp.status}
                        />
                    }
                    onClick={() => onArtifactSelect(dp.path)}
                />
            ))}
        </TreeView>
    );
}
```

---

## 3. Testing Strategy

### 3.1 Unit Tests

- [ ] DEVDashboard renders all 4 sections
- [ ] DevPlanTree fetches and displays dev-plans
- [ ] TATree fetches and displays TA/TAI documents
- [ ] Empty state displays when no artifacts

### 3.2 Integration Tests

- [ ] Full flow: Select DEV role → Dashboard loads → Click artifact → Reader shows content

### 3.3 Manual Testing

- [ ] Verify dev-plans load for teamspecviewermvp project
- [ ] Verify clicking dev-plan shows content in reader
- [ ] Verify TA documents show with "Product" scope badge

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| API not ready | Medium | High | Stub with mock data until s-e009-005 complete |
| Performance with many dev-plans | Low | Medium | Implement pagination if needed |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | Display Dev Plans | DevPlanTree component fetches from API |
| 2 | Display Stories | Reuse existing StoryTree component |
| 3 | Display TA (Product) | TATree fetches product TA docs |
| 4 | Display TAI (Project) | TATree fetches project TAI docs |
| 5 | Navigate to artifact | onClick → ArtifactReader |
| 6 | Empty state | Show "No dev-plans found" message |
| 7 | Navigate to linked story | Add child nodes for linked stories |

---

## 6. Checklist

### Pre-Implementation

- [x] Story requirements understood
- [x] Feature-Increment AS-IS/TO-BE reviewed
- [x] Technical approach approved
- [x] Dependencies identified

### Implementation

- [ ] DEVDashboard component created
- [ ] DevPlanTree component created
- [ ] TATree component created
- [ ] Routing updated
- [ ] Unit tests written
- [ ] Tests passing

### Post-Implementation

- [ ] Documentation updated
- [ ] Story marked complete

---

## Change Log

| Date | Author | Status | Summary |
|------|--------|--------|---------|
| 2026-01-17 | DEV Agent | Draft | Initial dev plan |
