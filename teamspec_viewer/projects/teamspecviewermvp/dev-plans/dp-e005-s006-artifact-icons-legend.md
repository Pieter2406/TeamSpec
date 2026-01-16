---
# === LLM Retrieval Metadata ===
artifact_kind: devplan
spec_version: "4.0"
template_version: "4.0.1"
title: "Artifact Type Icons and Legend"

# === Ownership ===
role_owner: DEV
artifact_type: Project Execution
canonicity: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "dp-e005-s006"
filename_pattern: "dp-e005-s006-artifact-icons-legend.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e005-006"
    optional: false

# === Search Optimization ===
keywords:
  - dev plan
  - icons
  - legend
  - artifact types
  - UI components
aliases:
  - icon implementation
  - legend component
anti_keywords:
  - story
  - requirements
---

# Dev Plan: `dp-e005-s006-artifact-icons-legend`

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
| **Dev Plan ID** | dp-e005-s006 |
| **Story** | [s-e005-006](../stories/done/s-e005-006-artifact-icons-legend.md) |
| **Epic** | epic-TSV-005 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | AI-Generated |
| **Created** | 2026-01-16 |
| **Status** | Implemented |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e005-006](../stories/done/s-e005-006-artifact-icons-legend.md) | Artifact Type Icons and Legend | [fi-TSV-005](../feature-increments/fi-TSV-005-usecase-centric-dashboard.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Create a centralized icon configuration system with:
1. **artifactIcons.ts** - Single source of truth for all artifact type icons, colors, and descriptions
2. **IconLegend.tsx** - Modal component showing the icon legend
3. **Update existing components** - Replace hardcoded icons with centralized config

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `artifactIcons.ts` | New | Centralized icon definitions with colors and descriptions |
| `IconLegend.tsx` | New | Modal/popover component showing icon legend |
| `ArtifactTree.tsx` | Modified | Use centralized icons |
| `FeatureCard.tsx` | Modified | Use centralized icons |
| `SearchResults.tsx` | Modified | Use centralized icons |
| `Header.tsx` | Modified | Add legend button trigger |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `src/utils/artifactIcons.ts` | Create | Centralized icon config |
| `src/components/IconLegend.tsx` | Create | Legend modal component |
| `src/components/ArtifactTree.tsx` | Modify | Import and use centralized icons |
| `src/components/FeatureCard.tsx` | Modify | Use centralized icons |
| `src/components/SearchResults.tsx` | Modify | Use centralized icons |
| `src/components/Header.tsx` | Modify | Add legend button |

### 2.2 Icon Configuration Schema

```typescript
// src/utils/artifactIcons.ts

import { SvgIconComponent } from '@mui/icons-material';

export type ArtifactType = 
    | 'product'
    | 'feature'
    | 'feature-increment'
    | 'epic'
    | 'story'
    | 'business-analysis'
    | 'ba-increment'
    | 'solution-design'
    | 'sd-increment'
    | 'technical-architecture'
    | 'ta-increment'
    | 'dev-plan'
    | 'test-case'
    | 'regression-test'
    | 'decision'
    | 'sprint';

export interface ArtifactIconConfig {
    icon: SvgIconComponent;
    color: string;
    label: string;
    description: string;
    category: 'product' | 'increment' | 'execution' | 'qa';
}

export const ARTIFACT_ICONS: Record<ArtifactType, ArtifactIconConfig> = {
    'product': {
        icon: Inventory2Icon,
        color: '#1976d2',  // Blue
        label: 'Product',
        description: 'A product in the TeamSpec portfolio',
        category: 'product',
    },
    'feature': {
        icon: StarIcon,
        color: '#2196f3',  // Blue
        label: 'Feature',
        description: 'A documented capability in the Product Canon',
        category: 'product',
    },
    'feature-increment': {
        icon: TrendingUpIcon,
        color: '#ff9800',  // Amber
        label: 'Feature Increment',
        description: 'A proposed change to a Feature',
        category: 'increment',
    },
    // ... etc
};

// Helper function to get icon for artifact type
export function getArtifactIcon(type: ArtifactType): ArtifactIconConfig {
    return ARTIFACT_ICONS[type] || ARTIFACT_ICONS['feature'];
}

// Category colors for grouping
export const CATEGORY_COLORS = {
    product: '#1976d2',    // Blue
    increment: '#ff9800',  // Amber/Orange
    execution: '#4caf50',  // Green
    qa: '#9c27b0',         // Purple
};
```

### 2.3 IconLegend Component Design

```typescript
// src/components/IconLegend.tsx

interface IconLegendProps {
    open: boolean;
    onClose: () => void;
    anchorEl?: HTMLElement | null;  // For popover mode
}

// Modal shows all icons grouped by category
// Each row: Icon | Label | Description
// Categories: Product & Features | Increments | Execution | QA
```

### 2.4 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| `@mui/icons-material` | Existing | Already installed |
| `@mui/material` (Dialog, Popover) | Existing | Already installed |

### 2.5 API Changes

None required - this is a frontend-only change.

---

## 3. Implementation Tasks

### Task 1: Create artifactIcons.ts utility (Est: 30 min)

```typescript
// Create src/utils/artifactIcons.ts with:
// - ArtifactType union type
// - ArtifactIconConfig interface
// - ARTIFACT_ICONS constant with all 16 artifact types
// - getArtifactIcon() helper function
// - CATEGORY_COLORS constant
```

**Icon Mapping (from story):**

| Artifact Type | MUI Icon | Color |
|---------------|----------|-------|
| product | `Inventory2` | #1976d2 (Blue) |
| feature | `Star` | #2196f3 (Blue) |
| feature-increment | `TrendingUp` | #ff9800 (Amber) |
| epic | `Flag` | #4caf50 (Green) |
| story | `Assignment` | #66bb6a (Green) |
| business-analysis | `Analytics` | #1976d2 (Blue) |
| ba-increment | `Insights` | #ff9800 (Amber) |
| solution-design | `Architecture` | #1976d2 (Blue) |
| sd-increment | `AutoAwesome` | #ff9800 (Amber) |
| technical-architecture | `Hub` | #1976d2 (Blue) |
| ta-increment | `DynamicFeed` | #ff9800 (Amber) |
| dev-plan | `Code` | #4caf50 (Green) |
| test-case | `CheckCircle` | #9c27b0 (Purple) |
| regression-test | `Security` | #9c27b0 (Purple) |
| decision | `Gavel` | #1976d2 (Blue) |
| sprint | `Speed` | #4caf50 (Green) |

### Task 2: Create IconLegend.tsx component (Est: 45 min)

```tsx
// Component structure:
// - Dialog with title "Artifact Type Icons"
// - Grouped sections by category
// - Each row: colored icon + label + description
// - Close button and click-outside-to-close
// - Keyboard support (Escape to close)
```

### Task 3: Update Header.tsx with legend button (Est: 15 min)

```tsx
// Add to Header component:
// - IconButton with HelpOutline icon
// - Tooltip "Artifact Types"
// - onClick opens IconLegend
// - State management for open/close
```

### Task 4: Update ArtifactTree.tsx (Est: 20 min)

```tsx
// Replace:
// - FolderIcon → getArtifactIcon('feature').icon
// - DescriptionIcon → getArtifactIcon('feature-increment').icon
// - AccountTreeIcon → getArtifactIcon('epic').icon
// - AssignmentIcon → getArtifactIcon('story').icon
// 
// Apply colors from config
```

### Task 5: Update FeatureCard.tsx (Est: 15 min)

```tsx
// Replace hardcoded icons with centralized config
```

### Task 6: Update SearchResults.tsx (Est: 20 min)

```tsx
// Use getArtifactIcon() for search result items
// Determine artifact type from result path/id pattern
```

### Task 7: Testing & Polish (Est: 30 min)

- Verify icons display correctly
- Test legend opens/closes
- Test keyboard navigation
- Verify color consistency

---

## 4. Testing Strategy

### 4.1 Unit Tests

- [ ] `artifactIcons.ts`: getArtifactIcon returns correct config for each type
- [ ] `artifactIcons.ts`: Unknown type returns fallback
- [ ] `IconLegend.tsx`: Renders all artifact types
- [ ] `IconLegend.tsx`: Close handlers work

### 4.2 Integration Tests

- [ ] Legend button in Header opens modal
- [ ] ArtifactTree displays correct icons for each node type
- [ ] Search results show appropriate icons

### 4.3 Manual Testing

- [ ] Visual inspection of all icons across components
- [ ] Verify color grouping is visually clear
- [ ] Test legend modal accessibility (keyboard nav, screen reader)
- [ ] Test on different screen sizes

---

## 5. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Some MUI icons may not exist | Low | Medium | Verify all icon names in MUI docs before implementation |
| Color contrast accessibility | Medium | Medium | Use WCAG-compliant color combinations |
| Regression in existing components | Low | High | Test all affected components after changes |

---

## 6. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | Icons displayed in artifact tree | Task 4: Update ArtifactTree.tsx |
| 2 | Legend accessible from UI | Tasks 2-3: IconLegend + Header button |
| 3 | Icons consistent across components | Tasks 4-6: Use centralized artifactIcons.ts |
| 4 | Icon colors convey meaning | Task 1: Color categories in config |
| 5 | Legend closes properly | Task 2: Dialog close handlers |

---

## 7. Estimated Effort

| Task | Estimate |
|------|----------|
| Task 1: artifactIcons.ts | 30 min |
| Task 2: IconLegend.tsx | 45 min |
| Task 3: Header.tsx update | 15 min |
| Task 4: ArtifactTree.tsx update | 20 min |
| Task 5: FeatureCard.tsx update | 15 min |
| Task 6: SearchResults.tsx update | 20 min |
| Task 7: Testing & Polish | 30 min |
| **Total** | **~3 hours** |

---

## 8. Checklist

### Pre-Implementation

- [x] Story requirements understood
- [x] Feature-Increment AS-IS/TO-BE reviewed
- [x] Technical approach documented
- [ ] Dependencies identified and available

### Implementation

- [ ] artifactIcons.ts created
- [ ] IconLegend.tsx created
- [ ] Header.tsx updated
- [ ] ArtifactTree.tsx updated
- [ ] FeatureCard.tsx updated
- [ ] SearchResults.tsx updated
- [ ] Unit tests written
- [ ] Code reviewed
- [ ] Tests passing

### Post-Implementation

- [ ] Manual testing complete
- [ ] Visual QA passed
- [ ] Ready for FA acceptance

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-16 | AI | Initial plan |

---

## Links

- [s-e005-006](../stories/backlog/s-e005-006-artifact-icons-legend.md)
- [ArtifactTree.tsx](../../../../frontend/src/components/ArtifactTree.tsx)
- [MUI Icons Documentation](https://mui.com/material-ui/material-icons/)
