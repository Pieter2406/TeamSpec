---
# === LLM Retrieval Metadata ===
artifact_kind: devplan
spec_version: "4.0"
template_version: "4.0.1"
title: "TBD literal detection implementation"

# === Ownership ===
role_owner: DEV
artifact_type: Project Execution
canonicity: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "dp-e008-s002"
filename_pattern: "dp-e008-s002-literal-detection.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e008-002"
    optional: false

---

# Dev Plan: `dp-e008-s002-literal-detection`

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
| **Dev Plan ID** | dp-e008-s002 |
| **Story** | [s-e008-002](../stories/ready-to-refine/s-e008-002-literal-detection.md) |
| **Epic** | epic-TSV-008 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | DEV |
| **Created** | 2026-01-17 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e008-002](../stories/ready-to-refine/s-e008-002-literal-detection.md) | Detect literal `{TBD}` and expose `hasTBD` | [fi-TSV-008](../feature-increments/fi-TSV-008-treeview-tbd-warnings.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Add TBD detection to the backend relationship service:
1. Create a utility function to detect the **exact literal** `{TBD}` token (case-sensitive, with curly braces)
2. Integrate detection into existing content extraction functions
3. Add `hasTBD` field to all artifact info types in API responses
4. Ensure efficient scanning for large files

### 1.2 Detection Rules

| Match | Not Match | Reason |
|-------|-----------|--------|
| `{TBD}` | `TBD` | Missing braces |
| `{TBD}` | `{tbd}` | Case-sensitive (must be uppercase) |
| `{TBD}` | `\{TBD\}` | Escaped braces in code |
| `{TBD}` | `"TBD"` | Different characters |

### 1.3 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `tbdDetection.ts` | New | Utility for TBD literal detection |
| `relationshipService.ts` | Modified | Add hasTBD to all artifact info responses |
| API response types | Modified | Add hasTBD field |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `backend/src/utils/tbdDetection.ts` | Create | TBD detection utility function |
| `backend/src/services/relationshipService.ts` | Modify | Add hasTBD to artifact extraction |

### 2.2 Code Implementation

#### 2.2.1 TBD Detection Utility

```typescript
// backend/src/utils/tbdDetection.ts

/**
 * TBD Detection Utility
 *
 * Detects the literal {TBD} marker in markdown content.
 * Uses strict matching: uppercase T-B-D with curly braces.
 *
 * Story: s-e008-002
 * Epic: TSV-008
 */

/**
 * Regex pattern for literal {TBD} marker.
 * Case-sensitive, matches exact sequence.
 * Does not match escaped braces or lowercase variants.
 */
const TBD_PATTERN = /\{TBD\}/;

/**
 * Check if content contains the literal {TBD} marker.
 *
 * @param content - Raw markdown content to scan
 * @returns true if content contains at least one {TBD} marker
 *
 * @example
 * hasTBD('Status: {TBD}') // true
 * hasTBD('Status: TBD')   // false - missing braces
 * hasTBD('Status: {tbd}') // false - lowercase
 */
export function hasTBD(content: string): boolean {
    if (!content) return false;
    return TBD_PATTERN.test(content);
}

/**
 * Count occurrences of {TBD} markers in content.
 * Useful for future features (e.g., "3 TBDs remaining").
 *
 * @param content - Raw markdown content to scan
 * @returns Number of {TBD} markers found
 */
export function countTBDs(content: string): number {
    if (!content) return 0;
    const matches = content.match(/\{TBD\}/g);
    return matches?.length ?? 0;
}
```

#### 2.2.2 Updated Type Definitions

```typescript
// backend/src/services/relationshipService.ts - Update types

export interface FeatureInfo {
    id: string;
    title: string;
    status?: string;
    path: string;
    hasTBD?: boolean;  // NEW
}

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

export interface BAInfo {
    id: string;
    title: string;
    status?: string;
    path: string;
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

#### 2.2.3 Integration into Feature Info Extraction

```typescript
// relationshipService.ts - Update getFeatureInfo

import { hasTBD } from '../utils/tbdDetection';

async function getFeatureInfo(featureId: string): Promise<FeatureInfo | null> {
    // ... existing file discovery code ...

    if (featureFile) {
        const filePath = join(featuresDir, featureFile);
        const content = await readFile(filePath, 'utf-8');

        return {
            id: featureId,
            title: extractTitle(content),
            status: extractStatus(content),
            path: relative(WORKSPACE_ROOT, filePath).replace(/\\/g, '/'),
            hasTBD: hasTBD(content),  // NEW
        };
    }

    return null;
}
```

#### 2.2.4 Integration into FI Extraction

```typescript
// relationshipService.ts - Update findFIsForFeature

async function findFIsForFeature(featureId: string): Promise<Array<{
    id: string;
    title: string;
    status?: string;
    project: string;
    path: string;
    epicId?: string;
    hasTBD?: boolean;  // NEW
}>> {
    // ... existing code ...

    for (const file of files) {
        if (!file.endsWith('.md') || file.startsWith('increments-index')) continue;

        const filePath = join(fiDir, file);
        const content = await readFile(filePath, 'utf-8');

        if (targetsFeature(content, featureId)) {
            fiList.push({
                id: file.replace('.md', ''),
                title: extractTitle(content),
                status: extractStatus(content),
                project,
                path: relative(WORKSPACE_ROOT, filePath).replace(/\\/g, '/'),
                epicId: extractEpicLink(content),
                hasTBD: hasTBD(content),  // NEW
            });
        }
    }

    return fiList;
}
```

#### 2.2.5 Integration into Epic Extraction

```typescript
// relationshipService.ts - Update getEpicInfo

async function getEpicInfo(project: string, epicId: string): Promise<Omit<EpicInfo, 'stories'> | null> {
    // ... existing code ...

    if (epicFile) {
        const filePath = join(epicsDir, epicFile);
        const content = await readFile(filePath, 'utf-8');

        return {
            id: epicId,
            title: extractTitle(content),
            status: extractStatus(content),
            path: relative(WORKSPACE_ROOT, filePath).replace(/\\/g, '/'),
            hasTBD: hasTBD(content),  // NEW
        };
    }

    return null;
}
```

#### 2.2.6 Integration into Story Extraction

```typescript
// relationshipService.ts - Update getStoriesForEpic

async function getStoriesForEpic(project: string, epicId: string): Promise<StoryInfo[]> {
    // ... existing code ...

    for (const folder of folders) {
        for (const file of files) {
            if (storiesPattern.test(file)) {
                const filePath = join(folderPath, file);
                const content = await readFile(filePath, 'utf-8');

                const storyId = file.replace('.md', '');
                const existing = storiesMap.get(storyId);

                if (!existing || /* priority check */) {
                    storiesMap.set(storyId, {
                        id: storyId,
                        title: extractTitle(content),
                        status: folderStatus,
                        path: relative(WORKSPACE_ROOT, filePath).replace(/\\/g, '/'),
                        hasTBD: hasTBD(content),  // NEW
                    });
                }
            }
        }
    }

    return stories;
}
```

#### 2.2.7 Integration into BA/BAI Extraction

```typescript
// relationshipService.ts - Update BA functions

async function getBAInfo(baId: string): Promise<BAInfo | null> {
    // ... existing code ...
    return {
        id: baId,
        title: extractTitle(content),
        status: extractStatus(content),
        path: relative(WORKSPACE_ROOT, filePath).replace(/\\/g, '/'),
        hasTBD: hasTBD(content),  // NEW
    };
}

async function findBAIsForBA(baId: string): Promise<Array</* type with hasTBD */>> {
    // ... existing code ...
    baiList.push({
        id: file.replace('.md', ''),
        title: extractTitle(content),
        status: extractStatus(content),
        project,
        path: relative(WORKSPACE_ROOT, filePath).replace(/\\/g, '/'),
        hasTBD: hasTBD(content),  // NEW
    });
    // ...
}
```

### 2.3 Performance Considerations

| Concern | Mitigation |
|---------|------------|
| Large files | Regex.test() stops at first match (O(n) worst case) |
| Many files | Detection happens during existing file read (no extra I/O) |
| Memory | No additional content storage; process during existing extraction |

### 2.4 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| fs/promises | Node.js | Available |
| relationshipService.ts | Existing | Will be modified |

---

## 3. Testing Strategy

### 3.1 Unit Tests

| Test File | Coverage |
|-----------|----------|
| `__tests__/utils/tbdDetection.test.ts` | Detection function |
| `__tests__/services/relationshipService.test.ts` | hasTBD in responses |

### 3.2 Unit Test Cases

```typescript
// tbdDetection.test.ts
import { hasTBD, countTBDs } from '../utils/tbdDetection';

describe('hasTBD', () => {
    // Positive cases
    it('returns true for exact {TBD} marker', () => {
        expect(hasTBD('Status: {TBD}')).toBe(true);
    });

    it('returns true for {TBD} in middle of content', () => {
        expect(hasTBD('The status is {TBD} for now.')).toBe(true);
    });

    it('returns true for multiple {TBD} markers', () => {
        expect(hasTBD('{TBD} and {TBD}')).toBe(true);
    });

    it('returns true for {TBD} in markdown table', () => {
        expect(hasTBD('| Estimate | {TBD} |')).toBe(true);
    });

    // Negative cases
    it('returns false for TBD without braces', () => {
        expect(hasTBD('Status: TBD')).toBe(false);
    });

    it('returns false for lowercase {tbd}', () => {
        expect(hasTBD('Status: {tbd}')).toBe(false);
    });

    it('returns false for mixed case {Tbd}', () => {
        expect(hasTBD('Status: {Tbd}')).toBe(false);
    });

    it('returns false for empty string', () => {
        expect(hasTBD('')).toBe(false);
    });

    it('returns false for null/undefined', () => {
        expect(hasTBD(null as any)).toBe(false);
        expect(hasTBD(undefined as any)).toBe(false);
    });

    it('returns false for code block with TBD in braces context', () => {
        // This is intentionally tricky - code blocks with literal {TBD} SHOULD match
        // Only escaped braces should NOT match
        expect(hasTBD('`{TBD}`')).toBe(true); // Code inline still matches
    });
});

describe('countTBDs', () => {
    it('returns 0 for no markers', () => {
        expect(countTBDs('No markers here')).toBe(0);
    });

    it('returns 1 for single marker', () => {
        expect(countTBDs('Status: {TBD}')).toBe(1);
    });

    it('returns correct count for multiple markers', () => {
        expect(countTBDs('{TBD} {TBD} {TBD}')).toBe(3);
    });

    it('returns 0 for empty string', () => {
        expect(countTBDs('')).toBe(0);
    });
});
```

### 3.3 Integration Tests

```typescript
// relationshipService.test.ts
describe('relationshipService hasTBD integration', () => {
    it('includes hasTBD: true for feature with {TBD}', async () => {
        // Create test fixture with {TBD} marker
        const result = await getFeatureRelationships('f-test-001');
        expect(result.feature.hasTBD).toBe(true);
    });

    it('includes hasTBD: false for feature without {TBD}', async () => {
        const result = await getFeatureRelationships('f-test-002');
        expect(result.feature.hasTBD).toBe(false);
    });

    it('propagates hasTBD through FI → Epic → Story hierarchy', async () => {
        const result = await getFeatureRelationships('f-test-001');
        // Check FI level
        expect(result.featureIncrements[0].hasTBD).toBeDefined();
        // Check Epic level
        expect(result.featureIncrements[0].epic?.hasTBD).toBeDefined();
        // Check Story level
        expect(result.featureIncrements[0].epic?.stories[0].hasTBD).toBeDefined();
    });
});
```

---

## 4. Task Breakdown

| # | Task | Est. Hours | Dependencies |
|---|------|------------|--------------|
| 1 | Create tbdDetection.ts utility | 1 | None |
| 2 | Write unit tests for hasTBD() | 1 | Task 1 |
| 3 | Update type definitions in relationshipService | 0.5 | None |
| 4 | Integrate hasTBD into getFeatureInfo | 0.5 | Tasks 1, 3 |
| 5 | Integrate hasTBD into findFIsForFeature | 0.5 | Tasks 1, 3 |
| 6 | Integrate hasTBD into getEpicInfo | 0.5 | Tasks 1, 3 |
| 7 | Integrate hasTBD into getStoriesForEpic | 0.5 | Tasks 1, 3 |
| 8 | Integrate hasTBD into getBAInfo | 0.5 | Tasks 1, 3 |
| 9 | Integrate hasTBD into findBAIsForBA | 0.5 | Tasks 1, 3 |
| 10 | Write integration tests for relationship API | 1.5 | Tasks 4-9 |
| 11 | Performance testing with large files | 0.5 | Tasks 4-9 |
| 12 | Update frontend API types to match | 0.5 | Tasks 3-9 |
| **Total** | | **8 hours** | |

---

## 5. Acceptance Criteria Verification

| AC (Scenario) | Implementation | Test |
|---------------|----------------|------|
| Literal match only | Regex `/\{TBD\}/` (case-sensitive) | Unit test |
| Non-matches rejected | Regex does not match TBD, {tbd}, etc. | Unit test |
| API flag exposed | hasTBD field in all *Info types | Integration test |
| Efficient for large files | Regex.test() early-exit | Performance test |

---

## 6. Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| False positives from code examples | Low | Acceptable - code with literal {TBD} should trigger review |
| Performance regression | Low | Detection uses existing content read; no extra I/O |
| Breaking API contract | Medium | Add hasTBD as optional field; frontend handles undefined |

---

## Change Log

| Date | Author | Status | Notes |
|------|--------|--------|-------|
| 2026-01-17 | DEV | Draft | Initial dev plan for TBD literal detection |
