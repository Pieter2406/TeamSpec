---
# === LLM Retrieval Metadata ===
artifact_kind: fi
spec_version: "4.0"
template_version: "4.0.1"
title: "Inline Status Editing MVP"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "fi-TSV-006"
filename_pattern: "fi-TSV-006-inline-status-editing-mvp.md"

# === Required Relationships ===
links_required:
  - type: feature
    pattern: "f-TSV-008"
    optional: false
    note: "Target feature that this FI modifies"
  - type: epic
    pattern: "epic-TSV-*"
    optional: true
  - type: product
    pattern: "product.yml"
    optional: false

# === Search Optimization ===
keywords:
  - feature increment
  - inline status editing
  - dropdown
  - status update
  - artifact state
  - frontmatter editing
aliases:
  - status editor
  - state dropdown
anti_keywords:
  - production truth
  - implementation details
---

# Feature Increment: `fi-TSV-006-inline-status-editing-mvp`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-16

---

> **ID:** fi-TSV-006  
> **Product:** `teamspec-viewer` (TSV)  
> **Target Feature:** `f-TSV-008-inline-status-editing`  
> **Epic:** [epic-TSV-006](../epics/epic-TSV-006-inline-status-editing.md)  
> **Status:** Proposed

---

## 1. Overview

This increment implements the MVP for inline status editing, allowing users to click on status chips/badges in the artifact tree view and select a new status from a dropdown. The selected status is persisted to the markdown file's YAML frontmatter via a new backend API endpoint.

---

## 2. AS-IS (Current State)

> ⚠️ _Auto-populated from Product Feature. DO NOT EDIT unless correcting errors._

### 2.1 Current Behavior

(From `f-TSV-008-inline-status-editing` → "Current Behavior")

#### Status Display

Status labels are displayed as read-only chips/badges in:
- Tree view nodes (ArtifactTree, BATree)
- Feature cards (FeatureCard)
- BA cards (BACard)
- Search results (SearchResults)

#### Status Values by Artifact Type

Each artifact type has a strict set of valid status values. Currently there is no UI mechanism to edit these values—users must manually edit markdown files.

| Artifact Type | Valid Status Values |
|---------------|---------------------|
| Feature | Planned, Active, Deprecated, Retired |
| Feature-Increment | Proposed, Approved, In-Progress, Done, Rejected |
| Epic | Planned, Active, Done, Cancelled |
| Story | Backlog, Refining, Ready, In-Progress, Done, Deferred, Out-of-Scope |
| Business Analysis | Draft, Active, Deprecated |
| BA Increment | Proposed, Approved, Done, Rejected |
| Dev Plan | Draft, In-Progress, Implemented, Blocked |

### 2.2 Current Limitations

- Status chips are **read-only**—users cannot change status from the UI
- Changing artifact status requires **opening the markdown file** and editing YAML frontmatter
- No backend API exists for **updating artifact status**
- No centralized definition of **valid status values per artifact type** in the frontend
- Status changes require **context switching** between viewer and file editor

---

## 3. TO-BE (Proposed State)

### 3.1 New/Changed Behavior

#### Status Dropdown Component

- **Clickable Status Chips**: All status chips in tree views become clickable
- **Dropdown Menu**: Clicking a status chip opens a dropdown showing valid status options for that artifact type
- **Current Selection**: The current status is visually highlighted in the dropdown
- **Keyboard Navigation**: Arrow keys to navigate, Enter to select, Escape to cancel

#### Status Options Configuration

A centralized `statusOptions.ts` utility defines valid status values for each artifact type:

```typescript
const STATUS_OPTIONS: Record<ArtifactType, string[]> = {
  'feature': ['Planned', 'Active', 'Deprecated', 'Retired'],
  'feature-increment': ['Proposed', 'Approved', 'In-Progress', 'Done', 'Rejected'],
  'epic': ['Planned', 'Active', 'Done', 'Cancelled'],
  'story': ['Backlog', 'Refining', 'Ready', 'In-Progress', 'Done', 'Deferred', 'Out-of-Scope'],
  'business-analysis': ['Draft', 'Active', 'Deprecated'],
  'ba-increment': ['Proposed', 'Approved', 'Done', 'Rejected'],
  'devplan': ['Draft', 'In-Progress', 'Implemented', 'Blocked'],
};
```

#### Backend API

New endpoint: `PATCH /api/artifacts/status`

**Request:**
```json
{
  "path": "products/teamspec-viewer/features/f-TSV-001-product-portfolio-view.md",
  "status": "Active"
}
```

**Response (success):**
```json
{
  "success": true,
  "path": "products/teamspec-viewer/features/f-TSV-001-product-portfolio-view.md",
  "previousStatus": "Planned",
  "newStatus": "Active"
}
```

**Response (error):**
```json
{
  "success": false,
  "error": "Invalid status 'Unknown' for artifact type 'feature'. Valid options: Planned, Active, Deprecated, Retired"
}
```

#### Markdown File Update

Backend reads the markdown file, parses YAML frontmatter, updates the `status` field (or metadata table), and writes the file back. The implementation must:
- Preserve all other frontmatter fields
- Preserve markdown content below frontmatter
- Handle files with status in metadata table format

#### UI Feedback

- **Loading State**: Dropdown shows spinner while saving
- **Success**: Chip updates to new status, brief success indicator
- **Error**: Toast notification with error message, chip reverts to previous status

#### User Flow (Updated)

1. User views artifact tree with status labels displayed as colored chips
2. User clicks on a status chip → dropdown appears with valid options
3. User selects new status from dropdown
4. UI shows loading indicator on the chip
5. Backend API updates markdown file frontmatter
6. UI confirms success → chip displays new status with new color
7. On failure → chip reverts to previous status, error toast shown

### 3.2 Acceptance Criteria

- [ ] AC-1: Clicking a status chip in ArtifactTree opens a dropdown with valid status options for that artifact type
- [ ] AC-2: Selecting a status from dropdown calls backend API and updates the chip on success
- [ ] AC-3: Backend `PATCH /api/artifacts/status` endpoint validates status against artifact type and updates markdown frontmatter
- [ ] AC-4: Invalid status values are rejected by the backend with descriptive error message
- [ ] AC-5: UI reverts to previous status and shows error toast on backend failure
- [ ] AC-6: Dropdown is keyboard navigable (arrow keys, Enter, Escape)
- [ ] AC-7: Status options are defined in centralized `statusOptions.ts` matching feature spec patterns

### 3.3 Out of Scope

- Inline editing in FeatureCard, BACard, SearchResults (tree view only in MVP)
- Bulk status editing
- Status transition validation/enforcement
- Undo functionality beyond immediate rollback
- Optimistic locking for concurrent edits

---

## 4. Impact Analysis

### 4.1 Affected Features

| Feature | Impact Type | Description |
|---------|-------------|-------------|
| f-TSV-008 | Implemented | This FI implements the MVP of inline status editing |
| f-TSV-003 | Extended | Feature-Increment navigation tree gains status editing |
| f-TSV-004 | Extended | Epic/Story navigation tree gains status editing |

### 4.2 Dependencies

- Existing ArtifactTree component with status chip rendering
- Existing BATree component with status chip rendering
- Backend file system access to workspace markdown files
- YAML parsing library (js-yaml or gray-matter)

### 4.3 Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| File corruption during write | Low | High | Write to temp file first, then atomic rename |
| Concurrent edit conflicts | Medium | Medium | MVP accepts last-write-wins; future: optimistic locking |
| Status in different frontmatter locations | Medium | Low | Support both `status:` field and metadata table format |

---

## 5. Implementation Notes

### 5.1 Technical Considerations

**Frontend:**
- Create `StatusDropdown` component using MUI Select or Menu
- Create `statusOptions.ts` utility with status values per artifact type
- Add `onStatusChange` callback prop to tree item renderers
- Handle loading/error states in dropdown component

**Backend:**
- New route: `PATCH /api/artifacts/status`
- Use `gray-matter` for frontmatter parsing/serialization
- Validate artifact type from file path pattern or frontmatter `artifact_kind`
- Preserve file content integrity during updates

### 5.2 Testing Strategy

**Unit Tests:**
- StatusDropdown renders correct options per artifact type
- Status validation logic rejects invalid values
- Frontmatter parsing handles various formats

**Integration Tests:**
- API endpoint updates file and returns correct response
- UI reflects status change after successful API call
- UI reverts on API failure

**Manual Testing:**
- Test all artifact types in tree view
- Test keyboard navigation
- Test error scenarios (file not found, invalid status)

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-16 | FA | Initial draft |
