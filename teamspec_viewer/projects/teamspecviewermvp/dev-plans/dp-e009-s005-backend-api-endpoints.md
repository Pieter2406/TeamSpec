---
# === LLM Retrieval Metadata ===
artifact_kind: devplan
spec_version: "4.0"
template_version: "4.0.1"
title: "Backend API Endpoints for Role Dashboards"

# === Ownership ===
role_owner: DEV
artifact_type: Project Execution
canonicity: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "dp-e009-s005"
filename_pattern: "dp-e009-s005-backend-api-endpoints.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e009-005"
    optional: false

# === Search Optimization ===
keywords:
  - dev plan
  - backend API
  - REST endpoints
  - Hono.js
  - dev-plans API
  - test-cases API
aliases:
  - backend API implementation
anti_keywords:
  - story
  - requirements
---

# Dev Plan: `dp-e009-s005-backend-api-endpoints`

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
| **Dev Plan ID** | dp-e009-s005 |
| **Story** | [s-e009-005](../stories/done/s-e009-005-backend-api-endpoints.md) |
| **Epic** | epic-TSV-009 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | DEV Agent |
| **Created** | 2026-01-17 |
| **Status** | Implemented |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e009-005](../stories/done/s-e009-005-backend-api-endpoints.md) | Backend API Endpoints | [fi-TSV-009](../feature-increments/fi-TSV-009-dev-sa-qa-role-dashboards.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Implement 8 new REST API endpoints following the existing Hono.js patterns:
1. Follow existing route structure from `backend/src/index.ts`
2. Reuse ArtifactLoader pattern for file discovery
3. Parse YAML frontmatter for metadata extraction
4. Return consistent JSON response shape

### 1.2 API Endpoints Summary

| Endpoint | Scope | Description |
|----------|-------|-------------|
| `GET /api/projects/:projectId/dev-plans` | Project | List dev-plan artifacts |
| `GET /api/products/:productId/technical-architecture` | Product | List TA documents |
| `GET /api/projects/:projectId/tai` | Project | List TA increments |
| `GET /api/products/:productId/solution-designs` | Product | List SD documents |
| `GET /api/projects/:projectId/sdi` | Project | List SD increments |
| `GET /api/projects/:projectId/test-cases` | Project | List test cases |
| `GET /api/products/:productId/regression-tests` | Product | List regression tests |
| `GET /api/projects/:projectId/bug-reports` | Project | List bug reports |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `backend/src/routes/dev-plans.ts` | Create | Dev-plan endpoints |
| `backend/src/routes/architecture.ts` | Create | TA/TAI endpoints |
| `backend/src/routes/solution-designs.ts` | Create | SD/SDI endpoints |
| `backend/src/routes/qa.ts` | Create | Test/Regression/Bug endpoints |
| `backend/src/index.ts` | Modify | Mount new route modules |
| `backend/src/loaders/artifact-loader.ts` | Modify | Add new artifact patterns |

### 2.2 Response Shape

All endpoints return consistent JSON:

```typescript
interface ArtifactListResponse {
    artifacts: Artifact[];
    count: number;
    scope: 'product' | 'project';
}

interface Artifact {
    id: string;
    title: string;
    path: string;
    status?: string;
    metadata: Record<string, unknown>;
}
```

### 2.3 Implementation Details

```typescript
// backend/src/routes/dev-plans.ts

import { Hono } from 'hono';
import { loadArtifacts } from '../loaders/artifact-loader';

const devPlans = new Hono();

devPlans.get('/projects/:projectId/dev-plans', async (c) => {
    const { projectId } = c.req.param();
    
    const artifacts = await loadArtifacts({
        basePath: `projects/${projectId}/dev-plans`,
        pattern: 'dp-*.md',
        extractMetadata: true
    });
    
    return c.json({
        artifacts,
        count: artifacts.length,
        scope: 'project'
    });
});

export default devPlans;
```

```typescript
// backend/src/routes/architecture.ts

import { Hono } from 'hono';
import { loadArtifacts } from '../loaders/artifact-loader';

const architecture = new Hono();

// Product-level Technical Architecture
architecture.get('/products/:productId/technical-architecture', async (c) => {
    const { productId } = c.req.param();
    
    const artifacts = await loadArtifacts({
        basePath: `products/${productId}/technical-architecture`,
        pattern: 'ta-*.md',
        extractMetadata: true
    });
    
    return c.json({
        artifacts,
        count: artifacts.length,
        scope: 'product'
    });
});

// Project-level TA Increments
architecture.get('/projects/:projectId/tai', async (c) => {
    const { projectId } = c.req.param();
    
    const artifacts = await loadArtifacts({
        basePath: `projects/${projectId}/tai`,
        pattern: 'tai-*.md',
        extractMetadata: true
    });
    
    return c.json({
        artifacts,
        count: artifacts.length,
        scope: 'project'
    });
});

export default architecture;
```

```typescript
// backend/src/routes/solution-designs.ts

import { Hono } from 'hono';
import { loadArtifacts } from '../loaders/artifact-loader';

const solutionDesigns = new Hono();

// Product-level Solution Designs
solutionDesigns.get('/products/:productId/solution-designs', async (c) => {
    const { productId } = c.req.param();
    
    const artifacts = await loadArtifacts({
        basePath: `products/${productId}/solution-designs`,
        pattern: 'sd-*.md',
        extractMetadata: true
    });
    
    return c.json({
        artifacts,
        count: artifacts.length,
        scope: 'product'
    });
});

// Project-level SD Increments
solutionDesigns.get('/projects/:projectId/sdi', async (c) => {
    const { projectId } = c.req.param();
    
    const artifacts = await loadArtifacts({
        basePath: `projects/${projectId}/sdi`,
        pattern: 'sdi-*.md',
        extractMetadata: true
    });
    
    return c.json({
        artifacts,
        count: artifacts.length,
        scope: 'project'
    });
});

export default solutionDesigns;
```

```typescript
// backend/src/routes/qa.ts

import { Hono } from 'hono';
import { loadArtifacts } from '../loaders/artifact-loader';

const qa = new Hono();

// Project-level Test Cases
qa.get('/projects/:projectId/test-cases', async (c) => {
    const { projectId } = c.req.param();
    
    const artifacts = await loadArtifacts({
        basePath: `projects/${projectId}/qa/test-cases`,
        pattern: 'tc-*.md',
        extractMetadata: true
    });
    
    return c.json({
        artifacts,
        count: artifacts.length,
        scope: 'project'
    });
});

// Product-level Regression Tests
qa.get('/products/:productId/regression-tests', async (c) => {
    const { productId } = c.req.param();
    
    const artifacts = await loadArtifacts({
        basePath: `products/${productId}/qa/regression-tests`,
        pattern: 'rt-*.md',
        extractMetadata: true
    });
    
    return c.json({
        artifacts,
        count: artifacts.length,
        scope: 'product'
    });
});

// Project-level Bug Reports
qa.get('/projects/:projectId/bug-reports', async (c) => {
    const { projectId } = c.req.param();
    
    const artifacts = await loadArtifacts({
        basePath: `projects/${projectId}/qa/bug-reports`,
        pattern: 'bug-*.md',
        extractMetadata: true
    });
    
    return c.json({
        artifacts,
        count: artifacts.length,
        scope: 'project'
    });
});

export default qa;
```

```typescript
// backend/src/index.ts (additions)

import devPlans from './routes/dev-plans';
import architecture from './routes/architecture';
import solutionDesigns from './routes/solution-designs';
import qa from './routes/qa';

// Mount routes
app.route('/api', devPlans);
app.route('/api', architecture);
app.route('/api', solutionDesigns);
app.route('/api', qa);
```

### 2.4 File Patterns

| Artifact Type | File Pattern | Location |
|---------------|--------------|----------|
| Dev Plans | `dp-*.md` | `projects/{id}/dev-plans/` |
| Technical Architecture | `ta-*.md` | `products/{id}/technical-architecture/` |
| TA Increments | `tai-*.md` | `projects/{id}/tai/` |
| Solution Designs | `sd-*.md` | `products/{id}/solution-designs/` |
| SD Increments | `sdi-*.md` | `projects/{id}/sdi/` |
| Test Cases | `tc-*.md` | `projects/{id}/qa/test-cases/` |
| Regression Tests | `rt-*.md` | `products/{id}/qa/regression-tests/` |
| Bug Reports | `bug-*.md` | `projects/{id}/qa/bug-reports/` |

---

## 3. Testing Strategy

### 3.1 Unit Tests

For each endpoint:
- [ ] Returns 200 with valid productId/projectId
- [ ] Returns empty array when no artifacts exist
- [ ] Correctly parses YAML frontmatter
- [ ] Returns correct scope (product/project)

```typescript
// backend/src/routes/__tests__/dev-plans.test.ts

import { describe, it, expect } from 'vitest';
import { app } from '../../index';

describe('dev-plans API', () => {
    it('should list dev-plans for project', async () => {
        const res = await app.request(
            '/api/projects/teamspecviewermvp/dev-plans'
        );
        
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.scope).toBe('project');
        expect(Array.isArray(data.artifacts)).toBe(true);
    });
    
    it('should return empty array for non-existent project', async () => {
        const res = await app.request(
            '/api/projects/nonexistent/dev-plans'
        );
        
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.artifacts).toEqual([]);
        expect(data.count).toBe(0);
    });
});
```

### 3.2 Integration Tests

- [ ] Test with actual TeamSpec project data
- [ ] Verify artifact paths are correct
- [ ] Verify metadata extraction works

### 3.3 Manual Testing

- [ ] Call each endpoint via curl/Postman
- [ ] Verify response shape matches spec

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Large directory scans | Medium | Medium | Add caching layer if needed |
| YAML parse errors | Low | Medium | Graceful error handling |
| File permission issues | Low | High | Proper error messages |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | GET /api/projects/:projectId/dev-plans | dev-plans.ts route |
| 2 | GET /api/products/:productId/technical-architecture | architecture.ts route |
| 3 | GET /api/projects/:projectId/tai | architecture.ts route |
| 4 | GET /api/products/:productId/solution-designs | solution-designs.ts route |
| 5 | GET /api/projects/:projectId/sdi | solution-designs.ts route |
| 6 | GET /api/projects/:projectId/test-cases | qa.ts route |
| 7 | GET /api/products/:productId/regression-tests | qa.ts route |
| 8 | GET /api/projects/:projectId/bug-reports | qa.ts route |
| 9 | Consistent response shape | ArtifactListResponse interface |
| 10 | Metadata extraction | extractMetadata flag |

---

## 6. Checklist

### Pre-Implementation

- [x] Story requirements understood
- [x] Feature-Increment AS-IS/TO-BE reviewed
- [x] Technical approach approved
- [x] Dependencies identified

### Implementation

- [ ] dev-plans.ts route created
- [ ] architecture.ts route created
- [ ] solution-designs.ts route created
- [ ] qa.ts route created
- [ ] index.ts updated with route mounting
- [ ] artifact-loader.ts patterns added
- [ ] Unit tests written
- [ ] Tests passing

### Post-Implementation

- [ ] API documentation updated
- [ ] Story marked complete

---

## Change Log

| Date | Author | Status | Summary |
|------|--------|--------|---------|
| 2026-01-17 | DEV Agent | Draft | Initial dev plan |
