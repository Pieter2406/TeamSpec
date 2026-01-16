---
# === LLM Retrieval Metadata ===
artifact_kind: devplan
spec_version: "4.0"
template_version: "4.0.1"
title: "Backend Status Update API"

# === Ownership ===
role_owner: DEV
artifact_type: Project Execution
canonicity: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "dp-e006-s003"
filename_pattern: "dp-e006-s003-backend-status-api.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e006-003"
    optional: false

# === Search Optimization ===
keywords:
  - dev plan
  - backend API
  - PATCH endpoint
  - status update
  - frontmatter
aliases:
  - status API implementation
anti_keywords:
  - story
  - requirements
---

# Dev Plan: `dp-e006-s003-backend-status-api`

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
| **Dev Plan ID** | dp-e006-s003 |
| **Story** | [s-e006-003](../stories/backlog/s-e006-003-backend-status-api.md) |
| **Epic** | epic-TSV-006 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | DEV Agent |
| **Created** | 2026-01-16 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e006-003](../stories/backlog/s-e006-003-backend-status-api.md) | Backend Status Update API | [fi-TSV-006](../feature-increments/fi-TSV-006-inline-status-editing-mvp.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Implement a PATCH endpoint for updating artifact status:
1. Create `statusService.ts` with validation and file update logic
2. Add `PATCH /api/artifacts/status` route to `artifacts.ts`
3. Use `gray-matter` for frontmatter parsing/serialization
4. Implement atomic write (write to .tmp, then rename)
5. Handle both YAML frontmatter and metadata table formats

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `statusService.ts` | New | Service for status validation and file updates |
| `artifacts.ts` | Modified | Add PATCH endpoint |
| `statusOptions.ts` (backend copy) | New | Backend status validation (or shared) |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `backend/src/services/statusService.ts` | Create | Status update service |
| `backend/src/routes/artifacts.ts` | Modify | Add PATCH handler |
| `backend/src/utils/statusOptions.ts` | Create | Backend status validation (copy from frontend) |

### 2.2 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| `gray-matter` | New | Need to install |
| `hono` | Existing | Available |
| `fs/promises` | Built-in | Available |

### 2.3 API Contract

**Endpoint:** `PATCH /api/artifacts/status`

**Request Body:**
```json
{
    "path": "relative/path/to/file.md",
    "status": "NewStatus"
}
```

**Response (Success):**
```json
{
    "success": true,
    "path": "relative/path/to/file.md",
    "previousStatus": "OldStatus",
    "newStatus": "NewStatus"
}
```

**Response (Error):**
```json
{
    "success": false,
    "error": "Invalid status 'Unknown' for artifact type 'feature'. Valid options: Planned, Active, Deprecated, Retired"
}
```

### 2.4 Service Implementation

```typescript
// backend/src/services/statusService.ts

import { readFile, writeFile, rename, unlink } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';

interface StatusUpdateResult {
    success: boolean;
    previousStatus?: string;
    newStatus?: string;
    error?: string;
}

// Status options (duplicated for backend, or could share via package)
const STATUS_OPTIONS: Record<string, string[]> = {
    'feature': ['Planned', 'Active', 'Deprecated', 'Retired'],
    'feature-increment': ['Proposed', 'Approved', 'In-Progress', 'Done', 'Rejected'],
    'epic': ['Planned', 'Active', 'Done', 'Cancelled'],
    'story': ['Backlog', 'Refining', 'Ready', 'In-Progress', 'Done', 'Deferred', 'Out-of-Scope'],
    'business-analysis': ['Draft', 'Active', 'Deprecated'],
    'ba-increment': ['Proposed', 'Approved', 'Done', 'Rejected'],
    'devplan': ['Draft', 'In-Progress', 'Implemented', 'Blocked'],
    'solution-design': ['Draft', 'Active', 'Deprecated'],
    'sd-increment': ['Proposed', 'Approved', 'Done', 'Rejected'],
    'technical-architecture': ['Draft', 'Active', 'Deprecated'],
    'ta-increment': ['Proposed', 'Approved', 'Done', 'Rejected'],
    'test-case': ['Draft', 'Active', 'Deprecated'],
    'regression-test': ['Draft', 'Active', 'Deprecated'],
};

function getArtifactType(frontmatter: any, filename: string): string | null {
    // First check frontmatter artifact_kind
    if (frontmatter.artifact_kind) {
        return frontmatter.artifact_kind;
    }
    
    // Fallback to filename pattern detection
    const patterns: [RegExp, string][] = [
        [/^f-[A-Z]+-\d+-/, 'feature'],
        [/^fi-[A-Z]+-\d+-/, 'feature-increment'],
        [/^epic-[A-Z]+-\d+-/, 'epic'],
        [/^s-e\d+-\d+-/, 'story'],
        [/^ba-[A-Z]+-\d+-/, 'business-analysis'],
        [/^bai-[A-Z]+-\d+-/, 'ba-increment'],
        [/^dp-e\d+-s\d+-/, 'devplan'],
        [/^sd-[A-Z]+-\d+-/, 'solution-design'],
        [/^sdi-[A-Z]+-\d+-/, 'sd-increment'],
        [/^ta-[A-Z]+-\d+-/, 'technical-architecture'],
        [/^tai-[A-Z]+-\d+-/, 'ta-increment'],
        [/^tc-/, 'test-case'],
        [/^rt-/, 'regression-test'],
    ];
    
    for (const [pattern, type] of patterns) {
        if (pattern.test(filename)) {
            return type;
        }
    }
    
    return null;
}

function isValidStatus(artifactType: string, status: string): boolean {
    const validStatuses = STATUS_OPTIONS[artifactType];
    return validStatuses ? validStatuses.includes(status) : false;
}

function getValidStatuses(artifactType: string): string[] {
    return STATUS_OPTIONS[artifactType] || [];
}

export async function updateArtifactStatus(
    workspaceRoot: string,
    relativePath: string,
    newStatus: string
): Promise<StatusUpdateResult> {
    const fullPath = join(workspaceRoot, relativePath);
    const filename = relativePath.split(/[/\\]/).pop() || '';
    
    try {
        // Read file
        const content = await readFile(fullPath, 'utf-8');
        
        // Parse frontmatter
        const parsed = matter(content);
        const artifactType = getArtifactType(parsed.data, filename);
        
        if (!artifactType) {
            return {
                success: false,
                error: `Could not determine artifact type for file: ${relativePath}`,
            };
        }
        
        // Validate status
        if (!isValidStatus(artifactType, newStatus)) {
            const validStatuses = getValidStatuses(artifactType);
            return {
                success: false,
                error: `Invalid status '${newStatus}' for artifact type '${artifactType}'. Valid options: ${validStatuses.join(', ')}`,
            };
        }
        
        // Get previous status
        const previousStatus = parsed.data.status || extractStatusFromTable(parsed.content);
        
        // Update frontmatter
        parsed.data.status = newStatus;
        
        // Update metadata table if present
        let updatedContent = parsed.content;
        const tableMatch = updatedContent.match(/(\|\s*\*\*Status\*\*\s*\|\s*)([^|]+)(\s*\|)/i);
        if (tableMatch) {
            updatedContent = updatedContent.replace(
                tableMatch[0],
                `${tableMatch[1]}${newStatus}${tableMatch[3]}`
            );
        }
        
        // Serialize back
        const newContent = matter.stringify(updatedContent, parsed.data);
        
        // Atomic write: write to temp file, then rename
        const tempPath = `${fullPath}.tmp`;
        await writeFile(tempPath, newContent, 'utf-8');
        await rename(tempPath, fullPath);
        
        return {
            success: true,
            previousStatus: previousStatus || 'unknown',
            newStatus,
        };
        
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            return {
                success: false,
                error: `File not found: ${relativePath}`,
            };
        }
        return {
            success: false,
            error: `Failed to update status: ${error.message}`,
        };
    }
}

function extractStatusFromTable(content: string): string | undefined {
    const match = content.match(/\|\s*\*\*Status\*\*\s*\|\s*(\w+)\s*\|/i);
    return match?.[1];
}
```

### 2.5 Route Handler

```typescript
// Add to backend/src/routes/artifacts.ts

import { updateArtifactStatus } from '../services/statusService.js';

// PATCH /api/artifacts/status
artifacts.patch('/status', async (c) => {
    try {
        const body = await c.req.json();
        const { path, status } = body;
        
        if (!path || !status) {
            return c.json({
                success: false,
                error: 'Missing required fields: path and status',
            }, 400);
        }
        
        const result = await updateArtifactStatus(WORKSPACE_ROOT, path, status);
        
        if (result.success) {
            return c.json(result);
        } else {
            return c.json(result, 400);
        }
        
    } catch (error: any) {
        return c.json({
            success: false,
            error: `Server error: ${error.message}`,
        }, 500);
    }
});
```

---

## 3. Testing Strategy

### 3.1 Unit Tests

- [ ] `getArtifactType` correctly identifies from frontmatter
- [ ] `getArtifactType` correctly identifies from filename
- [ ] `isValidStatus` returns true for valid status
- [ ] `isValidStatus` returns false for invalid status
- [ ] Atomic write works (temp file deleted on failure)

### 3.2 Integration Tests

- [ ] PATCH with valid status returns success
- [ ] PATCH with invalid status returns error with valid options
- [ ] PATCH with nonexistent file returns 400
- [ ] File content is preserved except status
- [ ] Metadata table is updated if present

### 3.3 Manual Testing

- [ ] Update feature status via API
- [ ] Update story status via API
- [ ] Verify file changes persist

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| File corruption on write | Low | High | Atomic write pattern (temp + rename) |
| Concurrent writes | Medium | Medium | Single-threaded Node.js helps; consider file locking for future |
| Frontmatter parsing errors | Low | Medium | Use well-tested gray-matter library |
| Path traversal attack | Medium | High | Validate path is within workspace |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | Successful status update | `updateArtifactStatus` returns success |
| 2 | Invalid status rejected | `isValidStatus` check before write |
| 3 | File not found | `ENOENT` error handling |
| 4 | Preserve file content | gray-matter preserves content |
| 5 | Handle metadata table | Regex replace for table format |

---

## 6. Checklist

### Pre-Implementation

- [x] Story requirements understood
- [x] Feature-Increment AS-IS/TO-BE reviewed
- [x] Technical approach approved
- [x] Dependencies identified (gray-matter)

### Implementation

- [ ] Install gray-matter dependency
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
| 2026-01-16 | DEV Agent | Initial plan |
