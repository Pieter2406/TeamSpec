# Dev Plan: `dp-e010-s001-setup-folder-structure-aliases`

> **Template Version**: 4.0
> **Last Updated**: 2026-01-18

---

**Document Owner:** DEV (Developer)  
**Artifact Type:** Execution (Implementation Plan)  
**Lifecycle:** Sprint-bound, archived after story completion

---

## Metadata

| Field | Value |
|-------|-------|
| **Dev Plan ID** | dp-e010-s001 |
| **Story** | [s-e010-001](../stories/backlog/s-e010-001-setup-folder-structure-aliases.md) |
| **Epic** | epic-TSV-010 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | DEV |
| **Created** | 2026-01-18 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e010-001](../stories/backlog/s-e010-001-setup-folder-structure-aliases.md) | Setup folder structure and path aliases | [fi-TSV-009](../feature-increments/fi-TSV-009-dev-sa-qa-role-dashboards.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

This is a **foundation story** that establishes the folder structure and path aliases for the entire refactoring epic. No files are moved yet — only the scaffolding is created.

**Key insight:** Existing `@/*` alias already maps to `src/*`. We need to ADD specific aliases (`@/shared`, `@/features`, `@/api`) while preserving backward compatibility.

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `vite.config.js` | Modified | Add three new path aliases for `shared`, `features`, `api` |
| `tsconfig.json` | Modified | Add matching TypeScript `paths` for IDE support |
| `src/shared/` | New | Create folder structure with subfolders |
| `src/features/` | New | Create folder structure with subfolders |
| Config validation test | New | TDD test to verify alias configuration |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `frontend/vite.config.js` | Modify | Add `@/shared`, `@/features`, `@/api` aliases |
| `frontend/tsconfig.json` | Modify | Add matching `paths` entries |
| `frontend/src/shared/` | Create | Root folder for shared module |
| `frontend/src/shared/contexts/` | Create | Context providers folder |
| `frontend/src/shared/hooks/` | Create | Custom hooks folder |
| `frontend/src/shared/utils/` | Create | Utility functions folder |
| `frontend/src/shared/constants/` | Create | Constants folder |
| `frontend/src/shared/components/` | Create | Shared components folder |
| `frontend/src/features/` | Create | Root folder for features |
| `frontend/src/features/layout/` | Create | Layout feature folder |
| `frontend/src/features/search/` | Create | Search feature folder |
| `frontend/src/features/product-portfolio/` | Create | Product portfolio feature folder |
| `frontend/src/features/dashboards/` | Create | Dashboards feature folder |
| `frontend/src/__tests__/config/path-aliases.test.ts` | Create | TDD config validation test |

### 2.2 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| `path` (Node.js) | Existing | Already used in vite.config.js |
| `vitest` | Existing | Already configured for testing |

### 2.3 Vite Config Changes

**Current config:**
```javascript
resolve: {
    alias: {
        '@': path.resolve(__dirname, './src'),
    },
},
```

**Updated config:**
```javascript
resolve: {
    alias: {
        '@': path.resolve(__dirname, './src'),
        '@/shared': path.resolve(__dirname, './src/shared'),
        '@/features': path.resolve(__dirname, './src/features'),
        '@/api': path.resolve(__dirname, './src/api'),
    },
},
```

### 2.4 TSConfig Changes

**Add to `paths`:**
```json
{
  "@/*": ["src/*"],
  "@/shared/*": ["src/shared/*"],
  "@/features/*": ["src/features/*"],
  "@/api/*": ["src/api/*"]
}
```

---

## 3. Testing Strategy

### 3.1 Unit Tests (TDD - Write First)

- [ ] Test: Vite config contains `@/shared` alias with correct path
- [ ] Test: Vite config contains `@/features` alias with correct path
- [ ] Test: Vite config contains `@/api` alias with correct path
- [ ] Test: TSConfig paths match Vite aliases

### 3.2 Integration Tests

- [ ] `pnpm run dev` starts without alias resolution errors
- [ ] `npx tsc --noEmit` compiles without path errors

### 3.3 Manual Testing

- [ ] Run `pnpm run build` — must succeed
- [ ] Verify all folders exist in file system
- [ ] Verify existing functionality still works (role switching, artifact loading)

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Alias conflicts with existing `@/*` | Low | Medium | Specific aliases take precedence; test both |
| Vite dev server cache issues | Low | Low | Clear cache if needed: `rm -rf node_modules/.vite` |
| IDE not recognizing paths | Medium | Low | Restart TS server after tsconfig change |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | Folder structure exists | Create all folders with .gitkeep if needed |
| 2 | Vite aliases configured | Update vite.config.js resolve.alias |
| 3 | TSConfig paths configured | Update tsconfig.json compilerOptions.paths |
| 4 | TDD tests pass | Write path-aliases.test.ts FIRST |
| 5 | Regression: build works | Run existing build, no changes to existing files |

---

## 6. Task Breakdown

### Task 1: Create TDD config validation test (FIRST)

**Description:** Write tests that verify alias configuration before making changes.

**File:** `frontend/src/__tests__/config/path-aliases.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import viteConfig from '../../../vite.config';
import tsconfig from '../../../tsconfig.json';

describe('Path Aliases Configuration', () => {
  describe('Vite Config', () => {
    it('should have @/shared alias', () => {
      expect(viteConfig.resolve?.alias).toHaveProperty('@/shared');
    });
    
    it('should have @/features alias', () => {
      expect(viteConfig.resolve?.alias).toHaveProperty('@/features');
    });
    
    it('should have @/api alias', () => {
      expect(viteConfig.resolve?.alias).toHaveProperty('@/api');
    });
  });
  
  describe('TSConfig', () => {
    it('should have matching paths for all aliases', () => {
      const paths = tsconfig.compilerOptions.paths;
      expect(paths['@/shared/*']).toBeDefined();
      expect(paths['@/features/*']).toBeDefined();
      expect(paths['@/api/*']).toBeDefined();
    });
  });
});
```

**Acceptance:** Tests written, initially failing (TDD red phase)  
**Estimate:** 0.5h

### Task 2: Create folder structure

**Description:** Create all required folders under `src/`.

**Commands:**
```bash
mkdir -p src/shared/{contexts,hooks,utils,constants,components}
mkdir -p src/features/{layout,search,product-portfolio,dashboards}
```

**Acceptance:** All folders exist  
**Estimate:** 0.25h

### Task 3: Update vite.config.js

**Description:** Add path aliases for `@/shared`, `@/features`, `@/api`.

**Acceptance:** Vite dev server starts, aliases resolve  
**Estimate:** 0.25h

### Task 4: Update tsconfig.json

**Description:** Add matching `paths` entries for TypeScript.

**Acceptance:** `npx tsc --noEmit` passes, IDE recognizes paths  
**Estimate:** 0.25h

### Task 5: Run TDD tests (green phase)

**Description:** Verify all config tests now pass.

**Acceptance:** `pnpm test` passes for config tests  
**Estimate:** 0.25h

### Task 6: Regression verification

**Description:** Run full build and verify existing functionality.

**Acceptance:** `pnpm run build` succeeds, app runs correctly  
**Estimate:** 0.5h

---

## 7. Checklist

### Pre-Implementation

- [ ] Story requirements understood
- [ ] Feature-Increment AS-IS/TO-BE reviewed
- [ ] Technical approach approved
- [ ] Dependencies identified (none)

### Implementation

- [x] TDD tests written (Task 1)
- [ ] Folder structure created (Task 2)
- [ ] Vite config updated (Task 3)
- [ ] TSConfig updated (Task 4)
- [ ] Tests passing (Task 5)

### Post-Implementation

- [ ] Build succeeds (Task 6)
- [ ] All existing functionality works
- [ ] Ready for next story (s-e010-002)

---

## 8. Progress Tracking

| Task | Description | Estimated | Actual | Status |
|------|-------------|-----------|--------|--------|
| 1 | TDD config tests | 0.5h | | Not Started |
| 2 | Create folders | 0.25h | | Not Started |
| 3 | Update vite.config.js | 0.25h | | Not Started |
| 4 | Update tsconfig.json | 0.25h | | Not Started |
| 5 | Run tests (green) | 0.25h | | Not Started |
| 6 | Regression verification | 0.5h | | Not Started |
| **Total** | | **2h** | | |

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-18 | DEV | Initial plan |
