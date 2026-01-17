---
# === LLM Retrieval Metadata ===
artifact_kind: bug
spec_version: "4.0"
template_version: "4.0.1"
title: "Epic titles not displaying properly in tree view"

# === Ownership ===
role_owner: QA
artifact_type: Project Execution
canonicity: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "bug-teamspecviewermvp-001"
filename_pattern: "bug-teamspecviewermvp-001-epic-title-display.md"

# === Required Relationships ===
links_required:
  - type: epic
    pattern: "epic-TSV-006"
    optional: true

# === Search Optimization ===
keywords:
  - bug
  - epic
  - title
  - tree view
  - display
  - ArtifactTree
aliases:
  - epic display bug
  - missing epic title
anti_keywords:
  - feature request
---

# Bug Report: `bug-teamspecviewermvp-001-epic-title-display`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-17

---

**Document Owner:** QA (QA Engineer)  
**Artifact Type:** Bug Report (Project-scoped)  
**Lifecycle:** Open → Resolved → Closed

---

## Metadata

| Field | Value |
|-------|-------|
| **Bug ID** | bug-teamspecviewermvp-001 |
| **Project** | teamspecviewermvp |
| **Product** | teamspec-viewer (TSV) |
| **Severity** | High |
| **Priority** | P2 |
| **Environment** | Development |
| **Component** | Frontend - ArtifactTree, Backend - artifacts API |
| **Reporter** | QA |
| **Date Reported** | 2026-01-17 |
| **Status** | Open |

---

## Bug Classification

### Bug Type (REQUIRED - exactly one)

- [x] **Implementation Defect** — Code doesn't match Canon
- [ ] Canon Wrong — Canon doesn't match intent
- [ ] Undocumented Behavior — Not specified anywhere

### Classification Rationale

**Feature Canon:** [f-TSV-002 Role-Specific Dashboards](../../products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md) requires the FA Dashboard to display an "ArtifactTree" showing Features, Feature-Increments, Epics, and Stories with their titles as human-readable labels (see Section: "§ 3.3.1 Tree Node Display Behavior").

**Current State:** The ArtifactTree component calls the backend API to fetch epics, which includes a `title` field. The API's `extractTitle()` function is attempting to parse the epic markdown file and extract a human-readable title. However, the extracted titles appear to be empty, incorrect, or not displaying properly in the UI, leaving epic nodes with placeholder or missing labels.

**Classification Justification:** The implementation (extractTitle function and API response) is not correctly extracting and returning epic titles as specified in the Canon requirement. This is an implementation defect in the backend service, not a Canon or undocumented behavior issue.

---

## Description

### Expected Behavior

**Source:** Feature Canon [f-TSV-002](../../products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md), Section: "§ 3.3.1 Tree Node Display Behavior"

Each Epic node in the ArtifactTree should display:
- A human-readable title (e.g., "Inline Status Editing", "Dashboard Implementation")
- Extracted from the epic markdown file's frontmatter `title` field or from the first `#` heading in the document
- Title should be properly formatted without markdown backticks or syntax markers
- Fallback to filename if title cannot be extracted

Example: Epic "epic-TSV-006-inline-status-editing.md" should display as "Inline Status Editing" in the tree node label.

### Actual Behavior

When viewing the FA Dashboard and expanding the Epic section in the ArtifactTree:
- Epic titles are not displaying correctly (blank, malformed, or incomplete)
- Tree nodes show placeholder text or undefined values
- User cannot identify which epic is which without hovering or clicking to view full details

### Steps to Reproduce

1. Navigate to FA Dashboard (role: Functional Analyst)
2. Locate the ArtifactTree component on the left sidebar
3. Expand or view the "Epics" section
4. Observe epic node labels
5. **Expected:** See human-readable epic titles (e.g., "Inline Status Editing")
6. **Actual:** Titles are blank, malformed, or not displaying

### Evidence

**Affected Files:**
- Frontend: `frontend/src/components/ArtifactTree.tsx` (lines 318, 331) — Uses `epic.title` from API response
- Backend: `backend/src/routes/artifacts.ts` (lines 181-197) — Endpoint `/api/projects/:projectId/epics` returns epic list with title extraction
- Backend: `backend/src/routes/artifacts.ts` (lines 47-88) — `extractTitle()` function responsible for parsing markdown and extracting title

**API Response:**
The GET `/api/projects/:projectId/epics` endpoint returns:
```json
{
    "artifacts": [
        {
            "id": "epic-TSV-006",
            "path": "projects/teamspecviewermvp/epics/epic-TSV-006-inline-status-editing.md",
            "title": "{TBD or incorrect value}",
            "type": "epic",
            "status": "Active"
        }
    ]
}
```

**Frontmatter in epic-TSV-006:**
```yaml
---
artifact_kind: epic
spec_version: '4.0'
template_version: 4.0.1
title: Inline Status Editing
...
---
```

The `title` field in frontmatter exists and contains "Inline Status Editing", but the API is not correctly extracting or returning it.

---

## Root Cause Analysis

**Hypothesis:** The `extractTitle()` function in `artifacts.ts` (lines 47-88) appears to check for YAML frontmatter, but:

1. The regex pattern for matching `title:` may be too strict or not matching YAML syntax variations
2. The frontmatter parsing may be skipping the title due to whitespace or format differences
3. The function may be returning the fallback (filename) instead of the extracted title
4. The title extraction from frontmatter may be returning before the markdown heading fallback, but not correctly formatted

**Exact Issue Location:**
```typescript
// Line 58-60: YAML frontmatter title extraction
const titleMatch = lines[i].match(/^title:\s*["']?([^"'\n]+)["']?\s*$/);
if (titleMatch) {
    return titleMatch[1].trim();  // ← This should work, but may not be matching
}
```

The regex pattern may not be matching epic frontmatter due to YAML formatting variations (e.g., indentation, quotes, CRLF line endings).

---

## Impact

### User Impact

- FA/SM/PO cannot quickly identify epics in the tree view
- Reduces usability of the FA Dashboard
- Requires clicking/hovering on nodes to view full details instead of seeing them at a glance
- Impacts user workflow during sprint planning and refinement sessions

### Business Impact

- Reduced efficiency during sprint ceremonies (standups, refinement, planning)
- Increased friction in artifact navigation
- Degrades user experience introduced in the new usecase-centric dashboard feature ([f-TSV-002](../../products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md))

### Technical Impact

- Blocks proper verification of Feature Canon [f-TSV-002](../../products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md) Acceptance Criteria § 3
- May indicate similar issues with title extraction for other artifact types (Features, FIs, Stories)
- Suggests `extractTitle()` function needs regression testing across all artifact types

---

## Resolution Path

### Fix Type: Implementation Defect

**Responsible:** DEV (Developer)

**Fix Actions:**

1. **Debug `extractTitle()` function:**
   - Add logging to trace which code path is being taken (frontmatter extraction vs. fallback)
   - Check if YAML frontmatter regex is matching artifact markdown files
   - Verify title extraction against actual frontmatter format in epic files

2. **Update regex or parsing logic:**
   - May need to handle YAML quotes/unquoted values differently
   - May need to handle line-ending variations (CRLF vs. LF)
   - May need to handle indentation in YAML

3. **Test across artifact types:**
   - Verify title extraction works for: features, feature-increments, epics, stories, BA documents, dev-plans
   - Ensure fallback to filename works when frontmatter title is missing

4. **Verify API response:**
   - Confirm GET `/api/projects/:projectId/epics` returns correct titles
   - Test with multiple epic files (existing and newly created)

5. **Verify frontend rendering:**
   - Confirm ArtifactTree component properly displays the title from API
   - Check for any frontend formatting or truncation issues

### Testing Required

- [ ] Unit test: `extractTitle()` with various frontmatter formats
- [ ] Integration test: API endpoint returns correct titles for all epic files
- [ ] E2E test: FA Dashboard displays epic titles correctly in ArtifactTree
- [ ] Regression test: Title extraction works for all artifact types

---

## Related Issues

**Potential Regression:** This bug may also affect title extraction for:
- Features (f-TSV-*)
- Feature-Increments (fi-TSV-*)
- Stories (s-e*-*)
- Business Analysis documents (ba-*)
- Dev Plans (dp-e*-s*-)
- Solution Designs (sd-*)
- Technical Architectures (ta-*)

**Recommendation:** After fixing, run comprehensive regression test on `extractTitle()` function for all artifact types to ensure consistent behavior.

---

## Acceptance Criteria for Fix

- [ ] Epic titles display correctly in ArtifactTree (verified via FA Dashboard visual inspection)
- [ ] GET `/api/projects/:projectId/epics` returns correct non-empty titles for all epics
- [ ] Title extraction works for all artifact types with proper fallback
- [ ] No regression in title extraction for previously working artifacts
- [ ] Code is covered by unit tests for title extraction edge cases

---

## Notes for DEV

**Debugging Hints:**
1. Check `epic-TSV-006-inline-status-editing.md` frontmatter format vs. regex pattern
2. Log the output of `extractTitle()` when called with epic files
3. Verify the regex pattern with test cases from actual epic markdown files
4. Consider using a YAML parser library if regex approach is fragile

**Files to Investigate:**
- `backend/src/routes/artifacts.ts` — `extractTitle()` function (lines 47-88)
- `backend/src/routes/artifacts.ts` — `/api/projects/:projectId/epics` endpoint (lines 181-197)
- `frontend/src/components/ArtifactTree.tsx` — Epic node rendering (lines 318-331)

---

## Change Log

| Date | Author | Status | Notes |
|------|--------|--------|-------|
| 2026-01-17 | QA | Open | Initial bug report |
