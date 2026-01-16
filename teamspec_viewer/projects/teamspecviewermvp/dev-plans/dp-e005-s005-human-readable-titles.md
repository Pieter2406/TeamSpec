---
# === LLM Retrieval Metadata ===
artifact_kind: devplan
spec_version: "4.0"
template_version: "4.0.1"
title: "Human-Readable Titles Impl"

# === Ownership ===
role_owner: DEV
artifact_type: Project Execution
canonicity: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "dp-e005-s005"
filename_pattern: "dp-e005-s005-human-readable-titles.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e005-005"
    optional: false

# === Search Optimization ===
keywords:
  - dev plan
  - title extraction
  - frontmatter
  - YAML parsing
aliases:
  - friendly titles implementation
anti_keywords:
  - story
  - feature
---

# Dev Plan: `dp-e005-s005-human-readable-titles`

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
| **Dev Plan ID** | dp-e005-s005 |
| **Story** | [s-e005-005](../stories/done/s-e005-005-human-readable-titles.md) |
| **Epic** | epic-TSV-005 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | AI-Generated |
| **Created** | 2026-01-16 |
| **Status** | Implemented |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e005-005](../stories/done/s-e005-005-human-readable-titles.md) | Human-Readable Artifact Titles | [fi-TSV-005](../feature-increments/fi-TSV-005-usecase-centric-dashboard.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Modify all `extractTitle()` functions in the backend to prioritize the `title` field from YAML frontmatter. The change is isolated to three backend files with no frontend modifications required since the frontend already displays `artifact.title`.

**Fallback Chain:**
1. `title` field from YAML frontmatter (new)
2. First `#` heading after frontmatter (existing)
3. Filename without extension (existing)

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `artifacts.ts` | Modified | Update `extractTitle()` to check frontmatter first |
| `relationshipService.ts` | Modified | Update `extractTitle()` to check frontmatter first |
| `searchService.ts` | Modified | Update `extractTitle()` to check frontmatter first |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `backend/src/routes/artifacts.ts` | Modify | Update `extractTitle()` function (lines 49-82) |
| `backend/src/services/relationshipService.ts` | Modify | Update `extractTitle()` function (lines 69-86) |
| `backend/src/services/searchService.ts` | Modify | Update `extractTitle()` function (lines 51-76) |

### 2.2 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| Node.js fs/promises | Existing | Approved |
| No new dependencies | — | — |

### 2.3 API Changes

No API changes required. Response shape remains identical; only the `title` field value source changes.

---

## 3. Code Changes

### 3.1 New `extractTitleFromFrontmatter()` Helper

Create a shared helper to extract `title` from YAML frontmatter:

```typescript
/**
 * Extract title from YAML frontmatter
 * Returns undefined if no title field found
 */
function extractTitleFromFrontmatter(content: string): string | undefined {
    const lines = content.split(/\r?\n/);
    
    // Check if file starts with frontmatter
    if (lines[0]?.trim() !== '---') return undefined;
    
    // Find frontmatter end and extract title
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '---') break;
        
        // Match title: "value" or title: value
        const titleMatch = lines[i].match(/^title:\s*["']?([^"'\n]+)["']?\s*$/);
        if (titleMatch) {
            return titleMatch[1].trim();
        }
    }
    
    return undefined;
}
```

### 3.2 Updated `extractTitle()` Pattern

Each file's `extractTitle()` will follow this pattern:

```typescript
async function extractTitle(filePath: string): Promise<string> {
    try {
        const content = await readFile(filePath, 'utf-8');
        
        // Priority 1: Try frontmatter title field
        const frontmatterTitle = extractTitleFromFrontmatter(content);
        if (frontmatterTitle) {
            return frontmatterTitle;
        }
        
        // Priority 2: Fall back to first # heading (existing logic)
        // ... existing heading extraction code ...
        
        // Priority 3: Fall back to filename
        return filePath.split(/[/\\]/).pop()?.replace('.md', '') || 'Untitled';
    } catch {
        return 'Untitled';
    }
}
```

---

## 4. Testing Strategy

### 4.1 Unit Tests

- [ ] `extractTitleFromFrontmatter()` returns title when present
- [ ] `extractTitleFromFrontmatter()` returns undefined when no title field
- [ ] `extractTitleFromFrontmatter()` handles quoted and unquoted values
- [ ] `extractTitle()` prefers frontmatter title over heading
- [ ] `extractTitle()` falls back to heading when no frontmatter title
- [ ] `extractTitle()` falls back to filename when no heading

### 4.2 Integration Tests

- [ ] `/api/products/:id/features` returns frontmatter titles
- [ ] `/api/search` returns frontmatter titles in results
- [ ] `/features/:id/relationships` returns frontmatter titles in tree

### 4.3 Manual Testing

- [ ] FA dashboard shows "Product Portfolio Overview" instead of "Feature: f-TSV-001-..."
- [ ] Artifact tree shows human-readable titles for all node types
- [ ] Search results display friendly titles
- [ ] BA dashboard shows friendly titles for BA documents

---

## 5. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Frontmatter parsing edge cases | Low | Low | Comprehensive regex handling; fallback chain ensures graceful degradation |
| Performance impact | Low | Low | Single regex match per file; no additional I/O |
| Missing title fields | Med | Low | Fallback to existing behavior maintains compatibility |

---

## 6. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | Feature card displays frontmatter title | `artifacts.ts` `extractTitle()` change |
| 2 | Tree nodes display frontmatter title | `relationshipService.ts` `extractTitle()` change |
| 3 | Search results display frontmatter title | `searchService.ts` `extractTitle()` change |
| 4 | Fallback to heading when no frontmatter | Fallback chain in all `extractTitle()` functions |
| 5 | BA dashboard uses frontmatter titles | Same change in `artifacts.ts` covers BA endpoints |

---

## 7. Implementation Tasks

| # | Task | Estimate | Status |
|---|------|----------|--------|
| 1 | Add `extractTitleFromFrontmatter()` helper to `artifacts.ts` | 15m | ☐ |
| 2 | Update `extractTitle()` in `artifacts.ts` to use helper | 10m | ☐ |
| 3 | Add `extractTitleFromFrontmatter()` helper to `relationshipService.ts` | 15m | ☐ |
| 4 | Update `extractTitle()` in `relationshipService.ts` | 10m | ☐ |
| 5 | Add `extractTitleFromFrontmatter()` helper to `searchService.ts` | 15m | ☐ |
| 6 | Update `extractTitle()` in `searchService.ts` | 10m | ☐ |
| 7 | Manual testing across all dashboards | 20m | ☐ |

**Total Estimate:** ~1.5 hours

---

## 8. Checklist

### Pre-Implementation

- [x] Story requirements understood
- [x] Feature-Increment AS-IS/TO-BE reviewed
- [x] Technical approach approved
- [x] Dependencies identified

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
| 2026-01-16 | AI-Generated | Initial plan |
