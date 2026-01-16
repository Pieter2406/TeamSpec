---
# === LLM Retrieval Metadata ===
artifact_kind: devplan
spec_version: "4.0"
template_version: "4.0.1"

# === Ownership ===
role_owner: DEV
artifact_type: Project Execution
canonicity: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "dp-e005-s001"
filename_pattern: "dp-e005-s001-feature-card-layout.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e005-001"
    optional: false

# === Search Optimization ===
keywords:
  - dev plan
  - feature cards
  - FA dashboard
  - card layout
aliases:
  - feature card plan
anti_keywords:
  - story
  - feature
---

# Dev Plan: `dp-e005-s001-feature-card-layout`

> **Template Version**: 4.0  
> **Last Updated**: 2026-01-16

---

**Document Owner:** DEV (Developer)  
**Artifact Type:** Execution (Implementation Plan)  
**Lifecycle:** Sprint-bound, archived after story completion

---

## Metadata

| Field | Value |
|-------|-------|
| **Dev Plan ID** | dp-e005-s001 |
| **Story** | [s-e005-001](../stories/backlog/s-e005-001-feature-card-layout.md) |
| **Epic** | epic-TSV-005 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | AI-Generated |
| **Created** | 2026-01-16 |
| **Status** | Implemented |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e005-001](../stories/backlog/s-e005-001-feature-card-layout.md) | Feature Card Layout | [fi-TSV-005](../feature-increments/fi-TSV-005-usecase-centric-dashboard.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

1. **Replace Grid Layout**: Remove the 2x2 `<Grid>` with four `<ArtifactList>` components
2. **Create FeatureCard Component**: New component displaying Feature as primary focal card
3. **Add FI Count**: Enhance backend or compute client-side count of FIs per Feature
4. **Refactor FADashboard**: Use new `<FeatureCardList>` as primary layout

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `FeatureCard.tsx` | New | Individual Feature card with expand toggle, badge counts |
| `FeatureCardList.tsx` | New | Container for Feature cards with loading/empty states |
| `FADashboard.tsx` | Modified | Replace Grid layout with FeatureCardList |
| Backend `/features` | Modified | Add `fiCount` to response (optional optimization) |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `frontend/src/components/FeatureCard.tsx` | Create | Feature card component |
| `frontend/src/components/FeatureCardList.tsx` | Create | List of Feature cards |
| `frontend/src/components/FADashboard.tsx` | Modify | Replace grid with FeatureCardList |
| `frontend/src/api/artifacts.ts` | Modify | Add `getFeatureWithCounts()` if needed |

### 2.2 Component Design

#### FeatureCard Props

```typescript
interface FeatureCardProps {
  feature: Artifact;
  fiCount: number;
  expanded: boolean;
  onToggleExpand: () => void;
  onSelect: (feature: Artifact) => void;
  children?: React.ReactNode; // For nested tree content
}
```

#### FeatureCard Structure

```tsx
<Card sx={{ mb: 2 }}>
  <CardHeader
    avatar={<FolderIcon />}
    action={
      <IconButton onClick={onToggleExpand}>
        {expanded ? <ExpandLess /> : <ExpandMore />}
      </IconButton>
    }
    title={feature.title}
    subheader={`${feature.id} · ${fiCount} FIs`}
  />
  <Collapse in={expanded}>
    <CardContent>
      {children} {/* Tree component will go here */}
    </CardContent>
  </Collapse>
</Card>
```

### 2.3 FADashboard Refactor

```tsx
// Before: 4-list grid
<Grid container spacing={3}>
  <Grid item xs={6}><ArtifactList title="Features" ... /></Grid>
  <Grid item xs={6}><ArtifactList title="Feature Increments" ... /></Grid>
  <Grid item xs={6}><ArtifactList title="Epics" ... /></Grid>
  <Grid item xs={6}><ArtifactList title="Stories" ... /></Grid>
</Grid>

// After: Feature-centric cards
<FeatureCardList 
  features={features}
  fiCountMap={fiCountMap}
  expandedIds={expandedIds}
  onToggleExpand={handleToggle}
/>
```

### 2.4 FI Count Computation

**Option A: Client-side (simpler, MVP)**
```typescript
// Compute from existing data
const fiCountMap = useMemo(() => {
  const map: Record<string, number> = {};
  features.forEach(f => {
    map[f.id] = featureIncrements.filter(fi => 
      fi.path.includes(f.id.replace('f-', 'fi-').split('-').slice(0, 2).join('-'))
    ).length;
  });
  return map;
}, [features, featureIncrements]);
```

**Option B: Backend enhancement (deferred)**
- Modify `/api/products/:productId/features` to include `fiCount`

### 2.5 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| MUI Card, Collapse | Existing | ✓ |
| MUI Icons (ExpandMore, ExpandLess) | Existing | ✓ |
| Existing `getFeatures()` API | Existing | ✓ |

---

## 3. Testing Strategy

### 3.1 Unit Tests

- [ ] FeatureCard renders with correct title and badge
- [ ] FeatureCard expand/collapse toggles content visibility
- [ ] FeatureCardList renders multiple cards
- [ ] FI count computation returns correct values

### 3.2 Integration Tests

- [ ] FADashboard loads Features as cards
- [ ] Clicking expand toggle shows content area
- [ ] Badge shows correct FI count

### 3.3 Manual Testing

- [ ] FA Dashboard shows Feature cards (not 4-list grid)
- [ ] Each card shows Feature ID, title, "X FIs" badge
- [ ] Expand toggle works (content area appears)
- [ ] Feature with 0 FIs shows "0 FIs" badge

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| FI count computation incorrect | Medium | Low | Parse FI YAML for explicit feature link |
| UI regression from layout change | Low | Medium | Keep old layout behind feature flag initially |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | Features displayed as prominent cards | `FeatureCard` with MUI Card styling |
| 2 | Card shows Feature ID, title, status | CardHeader subheader |
| 3 | Card shows badge with FI count | Chip badge in CardHeader |
| 4 | Card has expand/collapse toggle | IconButton with Collapse |
| 5 | Previous 2x2 grid removed | Delete Grid layout in FADashboard |

---

## 6. Checklist

### Pre-Implementation

- [ ] Story requirements understood
- [ ] Feature-Increment AS-IS/TO-BE reviewed
- [ ] Technical approach approved
- [ ] Dependencies identified

### Implementation

- [ ] FeatureCard component created
- [ ] FeatureCardList component created
- [ ] FADashboard refactored
- [ ] Unit tests written
- [ ] Code reviewed
- [ ] Tests passing

### Post-Implementation

- [ ] Integration tests passing
- [ ] Ready for QA verification

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-16 | AI-Generated | Initial plan |
