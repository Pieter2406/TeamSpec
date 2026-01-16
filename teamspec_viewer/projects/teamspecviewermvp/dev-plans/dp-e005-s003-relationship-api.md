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
id_pattern: "dp-e005-s003"
filename_pattern: "dp-e005-s003-relationship-api.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e005-003"
    optional: false

# === Search Optimization ===
keywords:
  - dev plan
  - relationship API
  - backend
  - feature relationships
aliases:
  - relationships endpoint plan
anti_keywords:
  - story
  - feature
---

# Dev Plan: `dp-e005-s003-relationship-api`

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
| **Dev Plan ID** | dp-e005-s003 |
| **Story** | [s-e005-003](../stories/backlog/s-e005-003-relationship-api.md) |
| **Epic** | epic-TSV-005 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | AI-Generated |
| **Created** | 2026-01-16 |
| **Status** | Implemented |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e005-003](../stories/backlog/s-e005-003-relationship-api.md) | Relationship API | [fi-TSV-005](../feature-increments/fi-TSV-005-usecase-centric-dashboard.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

1. **New Endpoint**: Add `GET /api/features/:featureId/relationships`
2. **Scan Projects**: Find all FIs targeting the Feature across projects
3. **Parse YAML Links**: Extract epic links from FI frontmatter
4. **Scan Stories**: Find stories by epic ID pattern (`s-eXXX-*`)
5. **Build Nested Response**: Construct hierarchical JSON response

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `backend/src/routes/artifacts.ts` | Modified | Add `/features/:featureId/relationships` endpoint |
| `backend/src/services/relationships.ts` | New | Service for relationship resolution |
| `frontend/src/api/artifacts.ts` | Modified | Add `getFeatureRelationships()` function |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `backend/src/routes/artifacts.ts` | Modify | Add relationships endpoint |
| `backend/src/services/relationships.ts` | Create | Relationship resolution logic |
| `frontend/src/api/artifacts.ts` | Modify | Add API client function |

### 2.2 API Specification

#### Endpoint

```
GET /api/features/:featureId/relationships
```

#### Query Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `productId` | string | No | Limit to product (default: derive from featureId) |

#### Response Schema

```typescript
interface FeatureRelationshipsResponse {
  feature: {
    id: string;
    title: string;
    status?: string;
  };
  featureIncrements: Array<{
    id: string;
    title: string;
    status?: string;
    project: string;
    epic?: {
      id: string;
      title: string;
      status?: string;
      stories: Array<{
        id: string;
        title: string;
        status?: string;
      }>;
    };
  }>;
}
```

#### Example Response

```json
{
  "feature": {
    "id": "f-TSV-002",
    "title": "Role-Specific Dashboards",
    "status": "Planned"
  },
  "featureIncrements": [
    {
      "id": "fi-TSV-001",
      "title": "BA/FA Role Dashboards",
      "status": "proposed",
      "project": "teamspecviewermvp",
      "epic": {
        "id": "epic-TSV-001",
        "title": "Dashboard Implementation",
        "status": "In Progress",
        "stories": [
          { "id": "s-e001-001", "title": "Technical Setup", "status": "Done" },
          { "id": "s-e001-002", "title": "Role Selection", "status": "Backlog" }
        ]
      }
    },
    {
      "id": "fi-TSV-005",
      "title": "Use-Case Centric Dashboard",
      "status": "proposed",
      "project": "teamspecviewermvp",
      "epic": {
        "id": "epic-TSV-005",
        "title": "Use-Case Centric Dashboard",
        "status": "Proposed",
        "stories": []
      }
    }
  ]
}
```

### 2.3 Backend Implementation

#### relationships.ts Service

```typescript
// backend/src/services/relationships.ts
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import * as yaml from 'yaml';

const WORKSPACE_ROOT = join(__dirname, '..', '..', '..', '..');

interface FeatureInfo {
  id: string;
  title: string;
  status?: string;
}

interface FIInfo {
  id: string;
  title: string;
  status?: string;
  project: string;
  epicId?: string;
}

interface EpicInfo {
  id: string;
  title: string;
  status?: string;
}

interface StoryInfo {
  id: string;
  title: string;
  status?: string;
}

export async function getFeatureRelationships(featureId: string) {
  // 1. Get Feature info
  const feature = await getFeatureInfo(featureId);
  if (!feature) throw new Error(`Feature ${featureId} not found`);
  
  // 2. Find all FIs targeting this feature
  const fiList = await findFIsForFeature(featureId);
  
  // 3. For each FI, get linked epic and stories
  const featureIncrements = await Promise.all(
    fiList.map(async (fi) => {
      let epic = undefined;
      if (fi.epicId) {
        const epicInfo = await getEpicInfo(fi.project, fi.epicId);
        if (epicInfo) {
          const stories = await getStoriesForEpic(fi.project, fi.epicId);
          epic = { ...epicInfo, stories };
        }
      }
      return {
        id: fi.id,
        title: fi.title,
        status: fi.status,
        project: fi.project,
        epic,
      };
    })
  );
  
  return { feature, featureIncrements };
}

async function getFeatureInfo(featureId: string): Promise<FeatureInfo | null> {
  // Extract product prefix from feature ID (e.g., f-TSV-002 -> TSV)
  const prefix = featureId.split('-')[1];
  const productsDir = join(WORKSPACE_ROOT, 'products');
  
  // Find product with matching prefix
  const products = await readdir(productsDir);
  for (const product of products) {
    const featuresDir = join(productsDir, product, 'features');
    try {
      const files = await readdir(featuresDir);
      const featureFile = files.find(f => f.startsWith(featureId));
      if (featureFile) {
        const content = await readFile(join(featuresDir, featureFile), 'utf-8');
        return {
          id: featureId,
          title: extractTitle(content),
          status: extractStatus(content),
        };
      }
    } catch { /* dir doesn't exist */ }
  }
  return null;
}

async function findFIsForFeature(featureId: string): Promise<FIInfo[]> {
  const fiList: FIInfo[] = [];
  const projectsDir = join(WORKSPACE_ROOT, 'projects');
  
  try {
    const projects = await readdir(projectsDir);
    for (const project of projects) {
      const fiDir = join(projectsDir, project, 'feature-increments');
      try {
        const files = await readdir(fiDir);
        for (const file of files) {
          if (!file.endsWith('.md') || file.startsWith('increments-index')) continue;
          
          const content = await readFile(join(fiDir, file), 'utf-8');
          
          // Check if this FI targets our feature
          if (targetsFeature(content, featureId)) {
            fiList.push({
              id: file.replace('.md', ''),
              title: extractTitle(content),
              status: extractStatus(content),
              project,
              epicId: extractEpicLink(content),
            });
          }
        }
      } catch { /* dir doesn't exist */ }
    }
  } catch { /* projects dir doesn't exist */ }
  
  return fiList;
}

function targetsFeature(content: string, featureId: string): boolean {
  // Check frontmatter for feature link
  const yamlMatch = content.match(/---\n([\s\S]*?)\n---/);
  if (yamlMatch) {
    const frontmatter = yamlMatch[1];
    if (frontmatter.includes(featureId)) return true;
  }
  // Check Target Feature line
  if (content.includes(`Target Feature:`) && content.includes(featureId)) {
    return true;
  }
  return false;
}

function extractEpicLink(content: string): string | undefined {
  // Look for Epic link in content
  const epicMatch = content.match(/\[epic-([A-Z]+-\d+)\]/);
  if (epicMatch) return `epic-${epicMatch[1]}`;
  
  // Look for Epic: line
  const epicLineMatch = content.match(/Epic:\s*\[?(epic-[A-Z]+-\d+)/);
  return epicLineMatch?.[1];
}

async function getStoriesForEpic(project: string, epicId: string): Promise<StoryInfo[]> {
  // Extract epic number (e.g., epic-TSV-005 -> 005)
  const epicNum = epicId.split('-').pop();
  const storiesPattern = new RegExp(`^s-e${epicNum}-\\d+`);
  
  const stories: StoryInfo[] = [];
  const storiesBase = join(WORKSPACE_ROOT, 'projects', project, 'stories');
  
  // Scan all story folders
  const folders = ['backlog', 'ready-to-refine', 'ready-to-develop', 'in-progress', 'done'];
  for (const folder of folders) {
    try {
      const files = await readdir(join(storiesBase, folder));
      for (const file of files) {
        if (storiesPattern.test(file)) {
          const content = await readFile(join(storiesBase, folder, file), 'utf-8');
          stories.push({
            id: file.replace('.md', ''),
            title: extractTitle(content),
            status: folder,
          });
        }
      }
    } catch { /* folder doesn't exist */ }
  }
  
  return stories;
}

function extractTitle(content: string): string {
  // Skip YAML frontmatter and find first # heading
  const lines = content.split(/\r?\n/);
  let inFrontmatter = false;
  
  for (const line of lines) {
    if (line.trim() === '---') {
      inFrontmatter = !inFrontmatter;
      continue;
    }
    if (inFrontmatter) continue;
    
    const match = line.match(/^#\s+(.+)$/);
    if (match) {
      return match[1].replace(/`/g, '').trim();
    }
  }
  return 'Untitled';
}

function extractStatus(content: string): string | undefined {
  const match = content.match(/\*\*Status\*\*\s*\|\s*(\w+)/i) ||
                content.match(/status:\s*(\w+)/i);
  return match?.[1];
}
```

#### Route Handler

```typescript
// Add to backend/src/routes/artifacts.ts

import { getFeatureRelationships } from '../services/relationships';

artifacts.get('/features/:featureId/relationships', async (c) => {
  const { featureId } = c.req.param();
  
  try {
    const relationships = await getFeatureRelationships(featureId);
    return c.json(relationships);
  } catch (error) {
    return c.json({ error: error.message }, 404);
  }
});
```

### 2.4 Frontend Client

```typescript
// Add to frontend/src/api/artifacts.ts

export interface FeatureRelationshipsResponse {
  feature: {
    id: string;
    title: string;
    status?: string;
  };
  featureIncrements: Array<{
    id: string;
    title: string;
    status?: string;
    project: string;
    epic?: {
      id: string;
      title: string;
      status?: string;
      stories: Array<{
        id: string;
        title: string;
        status?: string;
      }>;
    };
  }>;
}

export async function getFeatureRelationships(
  featureId: string
): Promise<FeatureRelationshipsResponse> {
  const response = await fetch(
    `${API_BASE}/features/${featureId}/relationships`
  );
  if (!response.ok) throw new Error('Failed to fetch feature relationships');
  return response.json();
}
```

### 2.5 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| Hono | Existing | ✓ |
| fs/promises | Existing | ✓ |
| yaml (optional) | New | For robust YAML parsing |

---

## 3. Testing Strategy

### 3.1 Unit Tests

- [ ] `getFeatureInfo` returns correct feature data
- [ ] `findFIsForFeature` finds FIs with target feature link
- [ ] `extractEpicLink` parses various epic link formats
- [ ] `getStoriesForEpic` finds stories by epic ID pattern
- [ ] Returns empty featureIncrements for feature with no FIs

### 3.2 Integration Tests

- [ ] Endpoint returns 200 with valid feature ID
- [ ] Endpoint returns 404 with invalid feature ID
- [ ] Response structure matches schema
- [ ] Nested epic/stories are included

### 3.3 Manual Testing

- [ ] `/api/features/f-TSV-002/relationships` returns correct data
- [ ] FIs from multiple projects are included
- [ ] Epics and stories are nested correctly

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Slow scan on large workspaces | Medium | Medium | Add caching layer; index on startup |
| YAML parsing edge cases | Low | Low | Use robust yaml library |
| Circular references | Low | Low | Track visited IDs |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | Returns Feature with linked FIs | `findFIsForFeature()` scans all projects |
| 2 | FI includes linked Epic | `extractEpicLink()` + `getEpicInfo()` |
| 3 | Epic includes linked Stories | `getStoriesForEpic()` by pattern |
| 4 | Feature with no FIs returns empty array | Return `{ featureIncrements: [] }` |
| 5 | Response matches schema | TypeScript interfaces enforce |
| 6 | Invalid ID returns 404 | Try-catch returns 404 |

---

## 6. Checklist

### Pre-Implementation

- [ ] Story requirements understood
- [ ] API schema defined
- [ ] File parsing strategy clear

### Implementation

- [ ] Service module created
- [ ] Route handler added
- [ ] Frontend client added
- [ ] Unit tests written
- [ ] Code reviewed
- [ ] Tests passing

### Post-Implementation

- [ ] Integration tests passing
- [ ] Manual testing complete
- [ ] Ready for QA verification

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-16 | AI-Generated | Initial plan |
