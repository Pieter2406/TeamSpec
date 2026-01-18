---
# === LLM Retrieval Metadata ===
artifact_kind: tai
spec_version: "4.0"
template_version: "4.0.1"
title: "Frontend Folder Architecture Restructure"

# === Ownership ===
role_owner: SA
artifact_type: Project Execution
canonicity: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "tai-TSV-002"
filename_pattern: "tai-TSV-002-frontend-folder-architecture.md"

# === Required Relationships ===
links_required:
  - type: technical-architecture
    pattern: "ta-TSV-001"
    optional: false
  - type: feature-increment
    pattern: "fi-TSV-009"
    optional: true

# === Search Optimization ===
keywords:
  - technical architecture increment
  - TAI
  - folder structure
  - frontend architecture
  - React organization
  - feature folders
  - module boundaries
  - index files
  - barrel exports
aliases:
  - frontend restructure
  - codebase organization
anti_keywords:
  - business requirements
  - story
  - feature behavior

# === Generation Contract ===
completion_rules:
  placeholders: "Fill {braces} only"
  required_sections:
    - Overview
    - AS-IS
    - TO-BE
  optional_sections:
    - Risks
---

# Technical Architecture Increment: `tai-TSV-002-frontend-folder-architecture`

> **ID:** tai-TSV-002  
> **Product:** `teamspec-viewer` (TSV)  
> **Project:** `teamspecviewermvp`  
> **Target TA:** `ta-TSV-001-react-browser-frontend`  
> **Target Feature:** All features (structural change)  
> **Status:** Proposed

---

**Document Owner:** SA (Solution Architect)  
**Artifact Type:** Technical Architecture Increment (Project)  
**Lifecycle:** Project-scoped, merged to Product TA after approval

---

## Metadata

| Field | Value |
|-------|-------|
| **TAI ID** | tai-TSV-002 |
| **Status** | Proposed |
| **Date** | 2026-01-18 |
| **Author** | SA |
| **Target TA** | [ta-TSV-001-react-browser-frontend](../../products/teamspec-viewer/technical-architecture/ta-TSV-001-react-browser-frontend.md) |
| **Feature Increment** | Cross-cutting (all features) |

---

## 1. Overview

This TAI proposes a comprehensive folder restructuring of the TeamSpec Viewer frontend codebase. The current structure places all 30+ components in a single flat `components/` folder with no logical grouping, making navigation, maintenance, and onboarding difficult.

**Goals:**
1. Establish an enterprise-grade React folder architecture
2. Create logical groupings based on feature domains and shared concerns
3. Implement barrel exports (index.ts files) for clean imports
4. Enable AI agents to efficiently navigate and modify the codebase
5. Prepare for scale as more features and roles are added

**Scope:**
- Frontend folder organization only
- No changes to component implementations
- No changes to APIs or backend
- No functional changes to user-facing behavior

---

## 2. AS-IS (Current Frontend Structure)

> _Current state of the frontend folder organization_

### 2.1 Current Folder Tree

```
frontend/src/
├── api/
│   └── artifacts.ts              # All API functions (500+ lines)
├── components/                   # FLAT: 31 components, no organization
│   ├── ArtifactList.tsx
│   ├── ArtifactReader.tsx
│   ├── ArtifactTree.tsx
│   ├── BACard.tsx
│   ├── BADashboard.tsx
│   ├── BATree.tsx
│   ├── DEVDashboard.tsx
│   ├── DEVTree.tsx
│   ├── FADashboard.tsx
│   ├── FeatureCard.tsx
│   ├── FeatureFIPanel.tsx
│   ├── FIDetailView.tsx
│   ├── Header.tsx
│   ├── IconLegend.tsx
│   ├── LinkedStoriesPanel.tsx
│   ├── ProductCard.tsx
│   ├── ProductDetail.tsx
│   ├── ProductPortfolio.tsx
│   ├── ProjectsList.tsx
│   ├── QADashboard.tsx
│   ├── QATree.tsx
│   ├── QuickViewPanel.tsx
│   ├── RoleBadge.tsx
│   ├── RoleSelector.tsx
│   ├── SADashboard.tsx
│   ├── SATree.tsx
│   ├── SearchBar.tsx
│   ├── SearchFilters.tsx
│   ├── SearchResults.tsx
│   ├── StatusDropdown.tsx
│   ├── TbdHighlighter.tsx
│   └── TBDIndicator.tsx
├── constants/
│   └── stateOrdering.ts
├── contexts/
│   ├── RoleContext.tsx
│   └── ToastContext.tsx
├── hooks/
│   └── useArtifactFilter.ts
├── utils/
│   ├── artifactIcons.ts
│   ├── artifactSorting.ts
│   └── statusOptions.ts
├── App.tsx
├── main.tsx
├── index.css
└── vite-env.d.ts
```

### 2.2 Current Problems

| Problem | Impact | Severity |
|---------|--------|----------|
| **Flat components folder** | Hard to locate components by domain | High |
| **No barrel exports** | Verbose import paths, no clear public API | Medium |
| **Role dashboards mixed** | FA, BA, DEV, SA, QA components interleaved | High |
| **Shared vs feature-specific unclear** | No distinction between reusable and domain-specific | Medium |
| **Large API file** | Single 500+ line file for all endpoints | Medium |
| **No index files** | No module boundaries, no discoverability hints for agents | High |

### 2.3 Current Import Pattern (Problematic)

```typescript
// Current: Long relative paths, no barrel exports
import { FADashboard } from './components/FADashboard';
import { BADashboard } from './components/BADashboard';
import { DEVDashboard } from './components/DEVDashboard';
import { SADashboard } from './components/SADashboard';
import { QADashboard } from './components/QADashboard';
import { ArtifactTree } from './components/ArtifactTree';
import { StatusDropdown } from './components/StatusDropdown';
import { TBDIndicator } from './components/TBDIndicator';
```

---

## 3. TO-BE (Proposed Frontend Structure)

### 3.1 Design Principles

| Principle | Description |
|-----------|-------------|
| **Feature-first organization** | Group by feature domain, not technical type |
| **Shared module** | Common components, hooks, utils in dedicated `shared/` |
| **Barrel exports** | Each folder has `index.ts` exporting public API |
| **Module boundaries** | Clear separation between features |
| **Agent discoverability** | Index files document what each module provides |
| **Colocation** | Keep related files together (component + hook + util) |
| **Scalability** | Structure supports adding new roles/features |

### 3.2 Proposed Folder Tree

```
frontend/src/
│
├── main.tsx                          # Application entry point
├── App.tsx                           # Root component with routing
├── index.css                         # Global styles
├── vite-env.d.ts                     # Vite type declarations
│
├── api/                              # API Layer
│   ├── index.ts                      # Barrel: exports all API functions
│   ├── artifacts.ts                  # Artifact CRUD operations
│   ├── features.ts                   # Feature-specific endpoints (split from artifacts)
│   ├── search.ts                     # Search endpoints
│   └── types.ts                      # Shared API types (Artifact, Response, etc.)
│
├── shared/                           # Shared/Common Module
│   ├── index.ts                      # Barrel: exports all shared components, hooks, utils
│   │
│   ├── components/                   # Reusable UI components
│   │   ├── index.ts                  # Barrel: StatusDropdown, TBDIndicator, etc.
│   │   ├── StatusDropdown/
│   │   │   ├── index.ts
│   │   │   ├── StatusDropdown.tsx
│   │   │   └── StatusDropdown.test.tsx
│   │   ├── TBDIndicator/
│   │   │   ├── index.ts
│   │   │   ├── TBDIndicator.tsx
│   │   │   └── TbdHighlighter.tsx    # Related highlighting utility
│   │   ├── ArtifactCard/             # Base card component (extracted pattern)
│   │   │   ├── index.ts
│   │   │   └── ArtifactCard.tsx
│   │   ├── ArtifactTree/             # Base tree component
│   │   │   ├── index.ts
│   │   │   ├── ArtifactTree.tsx
│   │   │   └── TreeNodeLabel.tsx     # Extracted label component
│   │   ├── ArtifactReader/
│   │   │   ├── index.ts
│   │   │   └── ArtifactReader.tsx
│   │   └── IconLegend/
│   │       ├── index.ts
│   │       └── IconLegend.tsx
│   │
│   ├── hooks/                        # Shared hooks
│   │   ├── index.ts                  # Barrel: useArtifactFilter, etc.
│   │   └── useArtifactFilter.ts
│   │
│   ├── contexts/                     # Global contexts
│   │   ├── index.ts                  # Barrel: RoleContext, ToastContext
│   │   ├── RoleContext.tsx
│   │   └── ToastContext.tsx
│   │
│   ├── utils/                        # Utility functions
│   │   ├── index.ts                  # Barrel: all utils
│   │   ├── artifactIcons.ts
│   │   ├── artifactSorting.ts
│   │   └── statusOptions.ts
│   │
│   └── constants/                    # Shared constants
│       ├── index.ts                  # Barrel: stateOrdering, routes, etc.
│       └── stateOrdering.ts
│
├── features/                         # Feature Modules
│   ├── index.ts                      # Barrel: exports all feature entry points
│   │
│   ├── layout/                       # App Layout Feature
│   │   ├── index.ts                  # Barrel: Header, AppShell
│   │   ├── Header/
│   │   │   ├── index.ts
│   │   │   ├── Header.tsx
│   │   │   └── RoleBadge.tsx
│   │   └── AppShell.tsx              # Main layout wrapper (future)
│   │
│   ├── role-selection/               # Role Selection Feature
│   │   ├── index.ts                  # Barrel: RoleSelector
│   │   └── RoleSelector/
│   │       ├── index.ts
│   │       └── RoleSelector.tsx
│   │
│   ├── search/                       # Search Feature
│   │   ├── index.ts                  # Barrel: SearchBar, SearchResults, SearchFilters
│   │   ├── SearchBar/
│   │   │   ├── index.ts
│   │   │   └── SearchBar.tsx
│   │   ├── SearchResults/
│   │   │   ├── index.ts
│   │   │   └── SearchResults.tsx
│   │   └── SearchFilters/
│   │       ├── index.ts
│   │       └── SearchFilters.tsx
│   │
│   ├── product-portfolio/            # Product Portfolio Feature
│   │   ├── index.ts                  # Barrel: ProductPortfolio, ProductCard, ProductDetail
│   │   ├── ProductPortfolio/
│   │   │   ├── index.ts
│   │   │   └── ProductPortfolio.tsx
│   │   ├── ProductCard/
│   │   │   ├── index.ts
│   │   │   └── ProductCard.tsx
│   │   ├── ProductDetail/
│   │   │   ├── index.ts
│   │   │   └── ProductDetail.tsx
│   │   └── ProjectsList/
│   │       ├── index.ts
│   │       └── ProjectsList.tsx
│   │
│   └── dashboards/                   # Role Dashboards Feature (Main)
│       ├── index.ts                  # Barrel: exports all dashboard components
│       │
│       ├── shared/                   # Dashboard-shared components
│       │   ├── index.ts              # Barrel: QuickViewPanel, LinkedStoriesPanel, etc.
│       │   ├── QuickViewPanel/
│       │   │   ├── index.ts
│       │   │   └── QuickViewPanel.tsx
│       │   ├── LinkedStoriesPanel/
│       │   │   ├── index.ts
│       │   │   └── LinkedStoriesPanel.tsx
│       │   ├── FIDetailView/
│       │   │   ├── index.ts
│       │   │   └── FIDetailView.tsx
│       │   ├── FeatureFIPanel/
│       │   │   ├── index.ts
│       │   │   └── FeatureFIPanel.tsx
│       │   └── ArtifactList/
│       │       ├── index.ts
│       │       └── ArtifactList.tsx
│       │
│       ├── fa/                       # FA (Functional Analyst) Dashboard
│       │   ├── index.ts              # Barrel: FADashboard, FeatureCard
│       │   ├── FADashboard.tsx       # Main dashboard component
│       │   ├── FeatureCard/
│       │   │   ├── index.ts
│       │   │   └── FeatureCard.tsx
│       │   └── FATree.tsx            # FA-specific tree (alias to shared ArtifactTree)
│       │
│       ├── ba/                       # BA (Business Analyst) Dashboard
│       │   ├── index.ts              # Barrel: BADashboard, BACard, BATree
│       │   ├── BADashboard.tsx       # Main dashboard component
│       │   ├── BACard/
│       │   │   ├── index.ts
│       │   │   └── BACard.tsx
│       │   └── BATree/
│       │       ├── index.ts
│       │       └── BATree.tsx
│       │
│       ├── dev/                      # DEV (Developer) Dashboard
│       │   ├── index.ts              # Barrel: DEVDashboard, DEVTree
│       │   ├── DEVDashboard.tsx      # Main dashboard component
│       │   └── DEVTree/
│       │       ├── index.ts
│       │       └── DEVTree.tsx
│       │
│       ├── sa/                       # SA (Solution Architect) Dashboard
│       │   ├── index.ts              # Barrel: SADashboard, SATree
│       │   ├── SADashboard.tsx       # Main dashboard component
│       │   └── SATree/
│       │       ├── index.ts
│       │       └── SATree.tsx
│       │
│       └── qa/                       # QA (QA Engineer) Dashboard
│           ├── index.ts              # Barrel: QADashboard, QATree
│           ├── QADashboard.tsx       # Main dashboard component
│           └── QATree/
│               ├── index.ts
│               └── QATree.tsx
│
└── types/                            # Global TypeScript types
    ├── index.ts                      # Barrel: all types
    ├── artifacts.ts                  # Artifact-related types
    ├── roles.ts                      # Role-related types
    └── api.ts                        # API response types
```

### 3.3 Index File Conventions

Each `index.ts` serves as both:
1. **Barrel export** - Clean public API for the module
2. **Agent navigation hint** - Documents what the module provides

#### Example: `features/dashboards/fa/index.ts`

```typescript
/**
 * FA (Functional Analyst) Dashboard Module
 *
 * Provides the dashboard view for Functional Analysts, including:
 * - FADashboard: Main dashboard layout with feature cards and tree view
 * - FeatureCard: Card component displaying feature artifacts
 *
 * Dependencies:
 * - shared/components/ArtifactTree - Base tree component
 * - shared/components/StatusDropdown - Status editing
 * - shared/hooks/useArtifactFilter - Filter state management
 *
 * Related Features:
 * - f-TSV-002: Role-specific dashboards
 * - fi-TSV-001: BA/FA dashboards implementation
 *
 * @module features/dashboards/fa
 */

export { FADashboard } from './FADashboard';
export { FeatureCard, FeatureCardList } from './FeatureCard';
```

#### Example: `shared/components/index.ts`

```typescript
/**
 * Shared UI Components Module
 *
 * Reusable components used across multiple features:
 * - StatusDropdown: Inline status editing dropdown
 * - TBDIndicator: Warning badge for {TBD} markers
 * - ArtifactCard: Base card component for artifact display
 * - ArtifactTree: Hierarchical tree view for artifact relationships
 * - ArtifactReader: Markdown rendering for artifact content
 * - IconLegend: Visual icon reference
 *
 * Usage:
 *   import { StatusDropdown, TBDIndicator } from '@/shared/components';
 *
 * @module shared/components
 */

export { StatusDropdown } from './StatusDropdown';
export { TBDIndicator, TbdHighlighter } from './TBDIndicator';
export { ArtifactCard, type ArtifactCardProps } from './ArtifactCard';
export { ArtifactTree, type TreeNodeData } from './ArtifactTree';
export { ArtifactReader } from './ArtifactReader';
export { IconLegend } from './IconLegend';
```

#### Example: `features/dashboards/index.ts`

```typescript
/**
 * Role Dashboards Feature Module
 *
 * Entry points for all role-specific dashboards:
 * - FA (Functional Analyst) - Feature Canon navigation
 * - BA (Business Analyst) - Business Analysis navigation
 * - DEV (Developer) - Epic → Story → Dev Plan navigation
 * - SA (Solution Architect) - TA/SD navigation
 * - QA (QA Engineer) - Test artifact navigation
 *
 * Each dashboard follows a consistent pattern:
 * - Left column: Artifact card list with filtering
 * - Right column: Hierarchical tree view
 * - Status editing via StatusDropdown
 * - TBD indicators for incomplete documents
 *
 * Related Features:
 * - f-TSV-002: Role-specific dashboards
 * - fi-TSV-009: DEV/SA/QA dashboards
 *
 * @module features/dashboards
 */

// Role dashboards
export { FADashboard } from './fa';
export { BADashboard } from './ba';
export { DEVDashboard } from './dev';
export { SADashboard } from './sa';
export { QADashboard } from './qa';

// Shared dashboard components
export {
    QuickViewPanel,
    LinkedStoriesPanel,
    FIDetailView,
    FeatureFIPanel,
    ArtifactList,
} from './shared';
```

### 3.4 Import Path Aliases

Configure TypeScript and Vite path aliases for clean imports:

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/api": ["src/api"],
      "@/shared": ["src/shared"],
      "@/shared/*": ["src/shared/*"],
      "@/features": ["src/features"],
      "@/features/*": ["src/features/*"],
      "@/types": ["src/types"]
    }
  }
}
```

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 3.5 Improved Import Pattern (TO-BE)

```typescript
// TO-BE: Clean imports via barrel exports and aliases
import { FADashboard, BADashboard, DEVDashboard, SADashboard, QADashboard } from '@/features/dashboards';
import { StatusDropdown, TBDIndicator, ArtifactTree } from '@/shared/components';
import { useArtifactFilter } from '@/shared/hooks';
import { RoleProvider, ToastProvider } from '@/shared/contexts';
import { getFeatures, getEpics } from '@/api';
```

### 3.6 Out of Scope

This TAI explicitly does NOT include:

| Exclusion | Rationale |
|-----------|-----------|
| Component implementation changes | Restructure only, no functional changes |
| New components | Focus on organizing existing code |
| Backend changes | Frontend-only scope |
| Test restructuring | Tests follow component structure automatically |
| CI/CD changes | No build pipeline modifications |
| State management library | Not introducing Redux/Zustand/etc. |

---

## 4. Impact Analysis

### 4.1 Feature Implications

| Feature | Impact Type | Description |
|---------|-------------|-------------|
| f-TSV-002 (Role Dashboards) | Reorganized | Dashboard components moved to `features/dashboards/{role}/` |
| f-TSV-007 (Search) | Reorganized | Search components moved to `features/search/` |
| f-TSV-008 (Status Editing) | Reorganized | StatusDropdown moved to `shared/components/` |
| All Features | Improved | Cleaner imports, better discoverability |

### 4.2 Infrastructure Dependencies

| Dependency | Impact | Action Required |
|------------|--------|-----------------|
| Vite | Path alias configuration | Update vite.config.ts |
| TypeScript | Path alias configuration | Update tsconfig.json |
| IDE | IntelliSense updates | Auto-updates with tsconfig |

### 4.3 Implementation Constraints

| Constraint | Description |
|------------|-------------|
| **No breaking changes** | All existing functionality must work post-restructure |
| **Incremental migration** | Can be done folder-by-folder if needed |
| **Import path updates** | All imports must be updated to new paths |
| **Test path updates** | Test imports follow component paths |

---

## 5. Behavior Impact Assessment

> ⚠️ Does this TAI affect user-observable behavior?

- [x] **No** — This is a codebase organization change only
- [ ] **Yes** — Behavior implications described below

### 5.1 Changes to Feature Behavior

None. This TAI restructures the codebase without changing any component implementations, APIs, or user-facing behavior.

### 5.2 Feature Canon Updates

None required. This is a technical refactoring that doesn't affect Feature Canon.

---

## 6. Integration Notes

### 6.1 Product TA Alignment

This TAI extends [ta-TSV-001-react-browser-frontend](../../products/teamspec-viewer/technical-architecture/ta-TSV-001-react-browser-frontend.md) by:

1. **Adding folder structure conventions** - Not specified in original TA
2. **Defining module boundaries** - Clear separation of concerns
3. **Establishing import patterns** - Barrel exports and path aliases

### 6.2 Merge Strategy

After implementation and validation:

1. Update ta-TSV-001 to include:
   - Section on folder structure conventions
   - Import pattern guidelines
   - Module boundary rules
   
2. Add new canonical documentation:
   - `ARCHITECTURE.md` in frontend root describing structure
   - Per-module README.md files for complex modules

---

## 7. Implementation Notes

### 7.1 Development Guidelines

#### Migration Order (Recommended)

1. **Phase 1: Setup**
   - Create folder structure (empty folders)
   - Configure path aliases in tsconfig.json and vite.config.ts
   - Verify build works

2. **Phase 2: Shared Module**
   - Move `contexts/` → `shared/contexts/`
   - Move `hooks/` → `shared/hooks/`
   - Move `utils/` → `shared/utils/`
   - Move `constants/` → `shared/constants/`
   - Create barrel exports

3. **Phase 3: Shared Components**
   - Move StatusDropdown → `shared/components/StatusDropdown/`
   - Move TBDIndicator → `shared/components/TBDIndicator/`
   - Move ArtifactTree → `shared/components/ArtifactTree/`
   - Move ArtifactReader → `shared/components/ArtifactReader/`

4. **Phase 4: Feature Modules**
   - Move layout components → `features/layout/`
   - Move search components → `features/search/`
   - Move portfolio components → `features/product-portfolio/`

5. **Phase 5: Dashboard Features**
   - Create `features/dashboards/shared/`
   - Create `features/dashboards/fa/`, move FADashboard, FeatureCard
   - Create `features/dashboards/ba/`, move BADashboard, BACard, BATree
   - Create `features/dashboards/dev/`, move DEVDashboard, DEVTree
   - Create `features/dashboards/sa/`, move SADashboard, SATree
   - Create `features/dashboards/qa/`, move QADashboard, QATree

6. **Phase 6: API Split**
   - Split artifacts.ts → artifacts.ts, features.ts, search.ts
   - Move types to `types/` folder
   - Create barrel exports

7. **Phase 7: Cleanup**
   - Update all imports in App.tsx and remaining files
   - Verify no broken imports
   - Run full test suite
   - Remove old empty directories

#### Key Rules

| Rule | Description |
|------|-------------|
| **One component per file** | Exception: closely related components (e.g., Card + CardList) |
| **Index exports public API only** | Internal components not exported from index |
| **Colocation over separation** | Keep tests, styles, types with components |
| **Explicit dependencies** | No circular imports between feature modules |

### 7.2 Testing and Validation

| Validation | Method |
|------------|--------|
| TypeScript compilation | `npx tsc --noEmit` |
| Build verification | `pnpm build` |
| Import resolution | IDE IntelliSense check |
| Runtime verification | `pnpm dev` and manual testing |
| Functional regression | Verify all dashboards work |

---

## 8. Agent Navigation Guide

This section helps AI agents understand and navigate the restructured codebase.

### 8.1 Finding Components by Intent

| Intent | Look In | Example |
|--------|---------|---------|
| "Edit FA dashboard" | `features/dashboards/fa/` | `FADashboard.tsx` |
| "Fix status dropdown" | `shared/components/StatusDropdown/` | `StatusDropdown.tsx` |
| "Add new hook" | `shared/hooks/` | Create new file + update index |
| "Modify API call" | `api/` | `artifacts.ts` or specific endpoint file |
| "Change DEV tree behavior" | `features/dashboards/dev/DEVTree/` | `DEVTree.tsx` |
| "Update role context" | `shared/contexts/` | `RoleContext.tsx` |

### 8.2 Module Boundaries

```
┌─────────────────────────────────────────────────────────────────┐
│                          App.tsx                                 │
│  (imports from features/ and shared/)                           │
└───────────────────────┬─────────────────────────────────────────┘
                        │
         ┌──────────────┼──────────────┐
         │              │              │
         ▼              ▼              ▼
┌────────────────┐ ┌─────────┐ ┌──────────────┐
│   features/    │ │ shared/ │ │    api/      │
│                │ │         │ │              │
│ ┌────────────┐ │ │ Context │ │ artifacts.ts │
│ │ dashboards │ │ │ Hooks   │ │ features.ts  │
│ │ ├── fa/    │◄┼─┤ Utils   │ │ search.ts    │
│ │ ├── ba/    │ │ │ Comps   │ └──────────────┘
│ │ ├── dev/   │ │ └─────────┘
│ │ ├── sa/    │ │
│ │ └── qa/    │ │
│ └────────────┘ │
│ ┌────────────┐ │
│ │   search   │ │
│ └────────────┘ │
│ ┌────────────┐ │
│ │  layout    │ │
│ └────────────┘ │
└────────────────┘

Dependency Direction:
features/ → shared/ (allowed)
features/ → api/ (allowed)
shared/ → api/ (allowed)
features/X → features/Y (NOT allowed, use shared/)
```

### 8.3 Index File Reading Order

When exploring the codebase, agents should read index files in this order:

1. `src/features/index.ts` → Overview of all feature modules
2. `src/shared/index.ts` → Overview of all shared modules
3. `src/features/dashboards/index.ts` → All dashboard entry points
4. Specific feature index (e.g., `src/features/dashboards/fa/index.ts`)
5. Component files as needed

---

## 9. Review & Approval

| Role | Name | Status | Date |
|------|------|--------|------|
| SA (Author) | SA | ✅ | 2026-01-18 |
| Tech Lead | TBD | ⏳ | |
| FA (if behavior affected) | N/A | — | |

---

## 10. Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-18 | SA | Initial draft |

---

## Sources Consulted

- `frontend/src/` → Current folder structure (AS-IS analysis)
- `templates/tai-template.md` → Template structure
- `products/teamspec-viewer/technical-architecture/ta-TSV-001-react-browser-frontend.md` → Target TA

## Unresolved Items

- Exact test file organization pattern → Recommend colocating tests with components
- CSS/styling organization → Currently using index.css globally; consider module CSS
- Story file organization (Storybook) → Not currently using Storybook; future consideration
