---
# === LLM Retrieval Metadata ===
artifact_kind: devplan
spec_version: "4.0"
template_version: "4.0.1"
title: "Status Options Utility"

# === Ownership ===
role_owner: DEV
artifact_type: Project Execution
canonicity: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "dp-e006-s001"
filename_pattern: "dp-e006-s001-status-options-utility.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e006-001"
    optional: false

# === Search Optimization ===
keywords:
  - dev plan
  - status options
  - status validation
  - utility function
aliases:
  - status utility implementation
anti_keywords:
  - story
  - requirements
---

# Dev Plan: `dp-e006-s001-status-options-utility`

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
| **Dev Plan ID** | dp-e006-s001 |
| **Story** | [s-e006-001](../stories/backlog/s-e006-001-status-options-utility.md) |
| **Epic** | epic-TSV-006 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | DEV Agent |
| **Created** | 2026-01-16 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e006-001](../stories/backlog/s-e006-001-status-options-utility.md) | Status Options Utility | [fi-TSV-006](../feature-increments/fi-TSV-006-inline-status-editing-mvp.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Create a centralized status options utility that:
1. Defines valid status values for each artifact type
2. Provides lookup functions for frontend dropdown population
3. Provides validation functions for both frontend and backend

This utility mirrors the pattern of `artifactIcons.ts` — a single source of truth.

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `statusOptions.ts` | New | Centralized status definitions per artifact type |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `frontend/src/utils/statusOptions.ts` | Create | Status options utility |

### 2.2 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| `artifactIcons.ts` (ArtifactType) | Existing | Use existing type |

### 2.3 Implementation Details

```typescript
// frontend/src/utils/statusOptions.ts

import { ArtifactType } from './artifactIcons';

/**
 * Status Options Configuration
 * 
 * Centralized status definitions for all TeamSpec artifact types.
 * Provides consistent status values for dropdown population and validation.
 * 
 * Story: s-e006-001 (Status Options Utility)
 * Feature: f-TSV-008 (Inline Status Editing)
 */

// ============================================================================
// Types
// ============================================================================

export type StatusValue = string;

export interface StatusConfig {
    value: StatusValue;
    label: string;
    color: string;  // For chip coloring
}

// ============================================================================
// Status Options by Artifact Type
// ============================================================================

export const STATUS_OPTIONS: Partial<Record<ArtifactType, StatusConfig[]>> = {
    'feature': [
        { value: 'Planned', label: 'Planned', color: '#9e9e9e' },
        { value: 'Active', label: 'Active', color: '#4caf50' },
        { value: 'Deprecated', label: 'Deprecated', color: '#ff9800' },
        { value: 'Retired', label: 'Retired', color: '#f44336' },
    ],
    'feature-increment': [
        { value: 'Proposed', label: 'Proposed', color: '#9e9e9e' },
        { value: 'Approved', label: 'Approved', color: '#2196f3' },
        { value: 'In-Progress', label: 'In-Progress', color: '#ff9800' },
        { value: 'Done', label: 'Done', color: '#4caf50' },
        { value: 'Rejected', label: 'Rejected', color: '#f44336' },
    ],
    'epic': [
        { value: 'Planned', label: 'Planned', color: '#9e9e9e' },
        { value: 'Active', label: 'Active', color: '#4caf50' },
        { value: 'Done', label: 'Done', color: '#2196f3' },
        { value: 'Cancelled', label: 'Cancelled', color: '#f44336' },
    ],
    'story': [
        { value: 'Backlog', label: 'Backlog', color: '#9e9e9e' },
        { value: 'Refining', label: 'Refining', color: '#ce93d8' },
        { value: 'Ready', label: 'Ready', color: '#2196f3' },
        { value: 'In-Progress', label: 'In-Progress', color: '#ff9800' },
        { value: 'Done', label: 'Done', color: '#4caf50' },
        { value: 'Deferred', label: 'Deferred', color: '#795548' },
        { value: 'Out-of-Scope', label: 'Out-of-Scope', color: '#607d8b' },
    ],
    'business-analysis': [
        { value: 'Draft', label: 'Draft', color: '#9e9e9e' },
        { value: 'Active', label: 'Active', color: '#4caf50' },
        { value: 'Deprecated', label: 'Deprecated', color: '#ff9800' },
    ],
    'ba-increment': [
        { value: 'Proposed', label: 'Proposed', color: '#9e9e9e' },
        { value: 'Approved', label: 'Approved', color: '#2196f3' },
        { value: 'Done', label: 'Done', color: '#4caf50' },
        { value: 'Rejected', label: 'Rejected', color: '#f44336' },
    ],
    'dev-plan': [
        { value: 'Draft', label: 'Draft', color: '#9e9e9e' },
        { value: 'In-Progress', label: 'In-Progress', color: '#ff9800' },
        { value: 'Implemented', label: 'Implemented', color: '#4caf50' },
        { value: 'Blocked', label: 'Blocked', color: '#f44336' },
    ],
    'solution-design': [
        { value: 'Draft', label: 'Draft', color: '#9e9e9e' },
        { value: 'Active', label: 'Active', color: '#4caf50' },
        { value: 'Deprecated', label: 'Deprecated', color: '#ff9800' },
    ],
    'sd-increment': [
        { value: 'Proposed', label: 'Proposed', color: '#9e9e9e' },
        { value: 'Approved', label: 'Approved', color: '#2196f3' },
        { value: 'Done', label: 'Done', color: '#4caf50' },
        { value: 'Rejected', label: 'Rejected', color: '#f44336' },
    ],
    'technical-architecture': [
        { value: 'Draft', label: 'Draft', color: '#9e9e9e' },
        { value: 'Active', label: 'Active', color: '#4caf50' },
        { value: 'Deprecated', label: 'Deprecated', color: '#ff9800' },
    ],
    'ta-increment': [
        { value: 'Proposed', label: 'Proposed', color: '#9e9e9e' },
        { value: 'Approved', label: 'Approved', color: '#2196f3' },
        { value: 'Done', label: 'Done', color: '#4caf50' },
        { value: 'Rejected', label: 'Rejected', color: '#f44336' },
    ],
    'test-case': [
        { value: 'Draft', label: 'Draft', color: '#9e9e9e' },
        { value: 'Active', label: 'Active', color: '#4caf50' },
        { value: 'Deprecated', label: 'Deprecated', color: '#ff9800' },
    ],
    'regression-test': [
        { value: 'Draft', label: 'Draft', color: '#9e9e9e' },
        { value: 'Active', label: 'Active', color: '#4caf50' },
        { value: 'Deprecated', label: 'Deprecated', color: '#ff9800' },
    ],
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get valid status options for an artifact type.
 * Returns empty array for unknown types.
 */
export function getStatusOptions(artifactType: ArtifactType | string): StatusConfig[] {
    return STATUS_OPTIONS[artifactType as ArtifactType] || [];
}

/**
 * Get just the status values (strings) for an artifact type.
 */
export function getStatusValues(artifactType: ArtifactType | string): string[] {
    return getStatusOptions(artifactType).map(s => s.value);
}

/**
 * Validate if a status is valid for an artifact type.
 */
export function isValidStatus(artifactType: ArtifactType | string, status: string): boolean {
    const validStatuses = getStatusValues(artifactType);
    return validStatuses.includes(status);
}

/**
 * Get the color for a specific status of an artifact type.
 * Returns default gray if not found.
 */
export function getStatusColor(artifactType: ArtifactType | string, status: string): string {
    const options = getStatusOptions(artifactType);
    const found = options.find(s => s.value === status);
    return found?.color || '#9e9e9e';
}

/**
 * Get all valid statuses as a formatted string (for error messages).
 */
export function getValidStatusesString(artifactType: ArtifactType | string): string {
    return getStatusValues(artifactType).join(', ');
}
```

---

## 3. Testing Strategy

### 3.1 Unit Tests

- [ ] `getStatusOptions('story')` returns 7 options
- [ ] `getStatusOptions('feature')` returns 4 options
- [ ] `getStatusOptions('unknown')` returns empty array
- [ ] `isValidStatus('feature', 'Active')` returns true
- [ ] `isValidStatus('feature', 'Unknown')` returns false
- [ ] `getStatusColor('story', 'Done')` returns green
- [ ] `getStatusColor('story', 'Invalid')` returns default gray

### 3.2 Integration Tests

- [ ] Import works from components

### 3.3 Manual Testing

- [ ] TypeScript compiles without errors
- [ ] Types are correctly inferred

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Status values drift from spec | Low | Medium | Document in f-TSV-008 as source of truth |
| Colors inconsistent with existing UI | Low | Low | Use colors from existing UI patterns |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | `getStatusOptions('story')` returns correct array | Direct implementation |
| 2 | `isValidStatus('feature', 'Active')` returns true | Uses array.includes() |
| 3 | `isValidStatus('feature', 'Unknown')` returns false | Uses array.includes() |
| 4 | Unknown artifact type returns empty array | Fallback in getStatusOptions |

---

## 6. Checklist

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
| 2026-01-16 | DEV Agent | Initial plan |
