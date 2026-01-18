---
# === LLM Retrieval Metadata ===
artifact_kind: bug
spec_version: "4.0"
template_version: "4.0.1"
title: "Tree view missing indentation in DEV/SA/QA dashboards"

# === Ownership ===
role_owner: QA
artifact_type: Project Execution
canonicity: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "bug-teamspecviewermvp-008"
filename_pattern: "bug-teamspecviewermvp-008-treeview-indentation-missing.md"

# === Required Relationships ===
links_required:
  - type: project
    pattern: "project.yml"
    optional: false
  - type: feature-increment
    pattern: "fi-TSV-009"
    optional: false

# === Search Optimization ===
keywords:
  - bug
  - tree view
  - indentation
  - visual hierarchy
  - DEV dashboard
  - SA dashboard
  - QA dashboard
  - SimpleTreeView
  - TreeItem
aliases:
  - tree indentation bug
  - hierarchy not visible
  - nested items flat
anti_keywords:
  - feature request
  - enhancement
---

# Bug Report: `bug-teamspecviewermvp-008-treeview-indentation-missing`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-18

---

**Document Owner:** QA (QA Engineer)  
**Artifact Type:** Bug Report (Project-scoped)  
**Lifecycle:** Open → Resolved → Closed

---

## Metadata

| Field | Value |
|-------|-------|
| **Bug ID** | bug-teamspecviewermvp-008 |
| **Project** | teamspecviewermvp |
| **Product** | teamspec-viewer (TSV) |
| **Severity** | Medium |
| **Priority** | P2 |
| **Environment** | Development |
| **Component** | Frontend - DEVTree, SATree, QATree components |
| **Reporter** | QA |
| **Date Reported** | 2026-01-18 |
| **Status** | Open |

---

## Description

The tree view components in DEV, SA, and QA dashboards do not display proper indentation for nested/child artifacts, making the hierarchical structure difficult to perceive. In contrast, the FA and BA dashboards correctly show indentation for nested items (Feature → FI → Epic → Story hierarchy).

**Visual Impact:**
- Child artifacts appear at the same indentation level as their parents
- Hierarchical relationships are unclear
- Users cannot visually distinguish parent-child relationships
- Reduces usability and scanability of the tree view

**Affected Components:**
- `DEVTree.tsx` - Epic → Stories → Dev Plans hierarchy
- `SATree.tsx` - SD → SDI and TA → TAI hierarchies
- `QATree.tsx` - FI → Test Cases and Feature → Regression Tests hierarchies

**Working Correctly:**
- `ArtifactTree.tsx` (FA Dashboard) - Feature → FI → Epic → Story hierarchy shows proper indentation
- `BATree.tsx` (BA Dashboard) - BA → BAI hierarchy shows proper indentation

---

## Steps to Reproduce

### Issue Observed in DEV Dashboard

1. Navigate to TeamSpec Viewer application
2. Select **Developer (DEV)** role
3. Click on an epic in the left sidebar (e.g., "epic-TSV-006-inline-status-editing")
4. Observe the tree view on the right side showing:
   - Epic → Stories → Dev Plans hierarchy
5. **OBSERVE:** Stories and Dev Plans appear at the same indentation level as the Epic
6. **EXPECTED:** Stories should be indented under Epic, Dev Plans should be further indented under Stories

### Issue Observed in SA Dashboard

1. Select **Solution Architect (SA)** role
2. Click on a Solution Design or Technical Architecture artifact
3. Observe the tree view showing SD → SDI or TA → TAI relationships
4. **OBSERVE:** Child increments (SDI/TAI) not indented under parent (SD/TA)
5. **EXPECTED:** Child artifacts should be indented to show hierarchy

### Issue Observed in QA Dashboard

1. Select **QA Engineer (QA)** role
2. Click on a Feature-Increment or Feature
3. Observe the tree view showing FI → Test Cases or Feature → Regression Tests
4. **OBSERVE:** Test artifacts not properly indented under parent
5. **EXPECTED:** Test artifacts should be indented to show hierarchy

### Correct Behavior in FA Dashboard (For Comparison)

1. Select **Functional Analyst (FA)** role
2. Click on a Feature (e.g., "f-TSV-002-role-specific-dashboards")
3. Observe the tree view showing Feature → FI → Epic → Story hierarchy
4. **OBSERVE:** Clear visual indentation at each level:
   - Feature-Increments indented under Feature
   - Epics indented under Feature-Increments
   - Stories indented under Epics
5. This is the **correct behavior** that should be replicated in DEV/SA/QA dashboards

---

## Expected Result

**Visual Hierarchy Should Be Clear:**

All tree view components should display nested artifacts with progressive indentation to indicate parent-child relationships, consistent with the FA and BA dashboard implementations.

**DEV Dashboard Expected Hierarchy:**
```
📋 Epic
  ├─ 📄 Story 1
  │   ├─ 🔧 Dev Plan 1
  │   └─ 🔧 Dev Plan 2
  ├─ 📄 Story 2
  │   └─ 🔧 Dev Plan 3
  └─ 📄 Story 3
```

**SA Dashboard Expected Hierarchy:**
```
📐 Solution Design
  ├─ 📐 SD Increment 1
  ├─ 📐 SD Increment 2
  └─ 📐 SD Increment 3

🏗️ Technical Architecture
  ├─ 🏗️ TA Increment 1
  └─ 🏗️ TA Increment 2
```

**QA Dashboard Expected Hierarchy:**
```
📦 Feature-Increment
  ├─ ✓ Test Case 1
  ├─ ✓ Test Case 2
  └─ ✓ Test Case 3

⭐ Feature
  ├─ 🔄 Regression Test 1
  └─ 🔄 Regression Test 2
```

Each nested level should have visible indentation (typically 16-24px per level) as provided by MUI TreeView default behavior.

---

## Actual Result

All nested artifacts in DEV, SA, and QA tree views appear at the same visual indentation level, with no progressive left margin to indicate hierarchy depth. The tree structure exists logically (expand/collapse works), but the visual presentation does not communicate the parent-child relationships.

**Current State (Incorrect):**
```
📋 Epic
📄 Story 1
🔧 Dev Plan 1
🔧 Dev Plan 2
📄 Story 2
🔧 Dev Plan 3
```

All items appear flat with no visual hierarchy indication.

---

## Evidence

- [x] Screenshot attached (provided by user showing flat tree in DEV dashboard)
- [ ] Console logs attached
- [ ] Network trace attached

**Screenshot Analysis:**
The provided screenshot shows:
- DEV Dashboard with Epic "Inline Status Editing" selected
- Tree view displays "Epic → Stories → Dev Plans" label
- 6 stories listed with dev plans
- All items appear at the same indentation level
- Status badges ("Active", "Done") are visible
- No visual indentation differentiates Epic from Stories from Dev Plans

---

## Bug Classification (MANDATORY)

### [X] Implementation Defect

**Definition:** Code doesn't match Feature Canon documentation.

**Evidence:**
- **Feature Canon Reference:** [fi-TSV-009-dev-sa-qa-role-dashboards.md](../../feature-increments/fi-TSV-009-dev-sa-qa-role-dashboards.md)
- **Feature Canon Section 3.2.1 - DEV Dashboard states:**
  > "Tree View (right column): Hierarchical tree view showing Epic → Stories → Dev Plans relationships"
- **Feature Canon Section 3.2.2 states:**
  > "Tree view follows pattern from FA dashboard (feature → FI → epic → story hierarchy)"

- **FA Dashboard (Reference Implementation):**
  - File: `frontend/src/components/ArtifactTree.tsx`
  - Uses `SimpleTreeView` with nested `TreeItem` components
  - Shows proper indentation for Feature → FI → Epic → Story hierarchy
  - MUI TreeView automatically applies indentation via CSS

- **DEV/SA/QA Dashboards (Defective):**
  - Files: `DEVTree.tsx`, `SATree.tsx`, `QATree.tsx`
  - Also use `SimpleTreeView` with nested `TreeItem` components
  - Same MUI component structure as ArtifactTree
  - **However:** No visible indentation in rendered output
  - Hierarchy exists logically but not visually

**Fix Required:** DEV fixes rendering/styling to match FA dashboard's visual hierarchy presentation

**Canon Update:** Not required (Canon correctly specifies hierarchical tree view)

---

## Classification Decision Tree

```
Is the behavior documented in Feature Canon?
├── YES → Does code match Canon?
│   ├── YES → Not a bug
│   └── NO → "Implementation Defect" ✓ (This case)
└── NO → "Undocumented Behavior"
```

---

## Resolution Actions by Classification

| Classification | Who Fixes | Action |
|----------------|-----------|--------|
| **Implementation Defect** ✓ | **DEV** | **Fix DEVTree, SATree, QATree to display proper indentation matching ArtifactTree pattern** |
| Feature Canon Wrong | FA + DEV | Update Canon, then fix code |
| Undocumented Behavior | FA + BA + DEV | Clarify intent, update Canon, implement |

---

## Technical Analysis

### Root Cause Investigation

**Component Structure Comparison:**

Both ArtifactTree (working) and DEVTree (broken) use identical MUI TreeView structure:
```tsx
<SimpleTreeView
    expandedItems={expandedItems}
    onExpandedItemsChange={(_, items) => setExpandedItems(items)}
    sx={{
        '& .MuiTreeItem-content': {
            py: 0.5, // or borderRadius: 1
            px: 1,
            borderRadius: 1,
            '&:hover': { bgcolor: '#f1f5f9' },
        },
        '& .MuiTreeItem-label': {
            fontSize: '0.875rem',
        },
    }}
>
    <TreeItem itemId="parent">
        <TreeItem itemId="child">
            <TreeItem itemId="grandchild" />
        </TreeItem>
    </TreeItem>
</SimpleTreeView>
```

**Hypothesis 1: CSS Override Disabling Indentation**

MUI TreeView applies indentation via CSS pseudo-classes and padding. Possible causes:
1. Custom `sx` prop in DEVTree/SATree/QATree overriding MUI default indentation
2. Global CSS in the app affecting TreeItem padding/margin
3. Missing MUI TreeView CSS imports
4. Z-index or positioning issue hiding indentation guides

**Hypothesis 2: MUI Version or Import Difference**

Check if:
- ArtifactTree and DEVTree import from same MUI package version
- Both use `@mui/x-tree-view` correctly
- No version mismatch between working and broken components

**Hypothesis 3: Parent Container Styling**

Check if DEVDashboard/SADashboard/QADashboard container styling affects tree rendering:
- Different padding/margin on tree container
- Flexbox or Grid layout affecting width calculation
- Overflow or clipping hiding indentation

### Investigation Steps for DEV

1. **Compare Rendered DOM:**
   - Inspect FA dashboard tree in browser DevTools
   - Inspect DEV dashboard tree in browser DevTools
   - Compare computed styles on `.MuiTreeItem-content` and `.MuiTreeItem-group`
   - Look for differences in padding, margin, or transform properties

2. **Check MUI TreeView CSS:**
   - Verify `.MuiTreeItem-group` has `paddingLeft` (default 16px or 1rem)
   - Check if custom `sx` props override default indentation
   - Look for `!important` rules in global CSS

3. **Test Minimal Reproduction:**
   - Copy ArtifactTree component and rename to TestTree
   - Replace in DEV dashboard
   - If TestTree shows indentation → issue is in DEVTree implementation
   - If TestTree has same problem → issue is in dashboard container or global CSS

4. **Review Git History:**
   - Check when DEV/SA/QA trees were created
   - Compare with ArtifactTree creation/modification
   - Look for differences in initial implementation

### Recommended Fix

**Option 1: Ensure MUI Default Styles Applied**

Remove or adjust any `sx` prop on `SimpleTreeView` or `TreeItem` that might override indentation:

```tsx
<SimpleTreeView
    expandedItems={expandedItems}
    onExpandedItemsChange={(_, items) => setExpandedItems(items)}
    sx={{
        // DO NOT override .MuiTreeItem-group padding
        '& .MuiTreeItem-content': {
            borderRadius: 1,
            '&:hover': { bgcolor: '#f1f5f9' },
        },
        '& .MuiTreeItem-label': {
            fontSize: '0.875rem',
        },
        // Ensure indentation is visible
        '& .MuiTreeItem-group': {
            marginLeft: 0,
            paddingLeft: '24px', // Explicit indentation
        },
    }}
>
```

**Option 2: Copy Working Pattern from ArtifactTree**

Audit the exact `sx` prop configuration from ArtifactTree.tsx and replicate in DEVTree/SATree/QATree:
1. Compare line-by-line the `<SimpleTreeView sx={{...}}>` prop
2. Ensure identical styling rules applied
3. Test each dashboard individually after changes

**Option 3: Use MUI TreeView Slot Props**

If indentation is controlled via slot props, ensure they're configured:
```tsx
<SimpleTreeView
    slots={{ groupTransition: Collapse }}
    slotProps={{
        item: {
            sx: {
                '& .MuiTreeItem-group': {
                    marginLeft: 2, // 16px indentation
                },
            },
        },
    }}
>
```

---

## Impact Assessment

**User Experience Impact:**
- **Severity:** Medium - Functionality works (tree expands/collapses) but UX is degraded
- **Frequency:** Always occurs in DEV/SA/QA dashboards
- **User Confusion:** High - Users cannot visually parse hierarchy without indentation
- **Workaround:** None - users must rely on expand/collapse to understand structure

**Development Impact:**
- **Effort:** Low - CSS/styling fix, no logic changes required
- **Risk:** Low - Isolated to tree component styling
- **Testing:** Visual regression testing in DEV/SA/QA dashboards

**Business Impact:**
- Reduces usability of recently-delivered DEV/SA/QA dashboard features
- Creates inconsistent UX across different role dashboards
- May cause user frustration and reduce adoption of role-specific views

---

## Related Issues

- **Reference Implementation:** ArtifactTree.tsx (FA Dashboard) - working correctly
- **Reference Implementation:** BATree.tsx (BA Dashboard) - working correctly
- **Related Story:** [s-e009-002](../../stories/done/s-e009-002-dev-dashboard-navigation.md) - DEV Dashboard Navigation
- **Related Story:** [s-e009-003](../../stories/backlog/s-e009-003-sa-dashboard-navigation.md) - SA Dashboard Navigation
- **Related Story:** [s-e009-004](../../stories/backlog/s-e009-004-qa-dashboard-navigation.md) - QA Dashboard Navigation
- **Related Epic:** [epic-TSV-009](../../epics/epic-TSV-009-dev-sa-qa-dashboards.md) - DEV/SA/QA Dashboards

---

## Acceptance Criteria for Fix

- [ ] **AC-1:** DEV dashboard tree view shows progressive indentation for Epic → Stories → Dev Plans
- [ ] **AC-2:** SA dashboard tree view shows progressive indentation for SD/TA → Increments
- [ ] **AC-3:** QA dashboard tree view shows progressive indentation for FI/Feature → Test artifacts
- [ ] **AC-4:** Indentation matches FA dashboard visual pattern (approximately 24px per level)
- [ ] **AC-5:** No regression in FA or BA dashboard tree indentation
- [ ] **AC-6:** Tree expand/collapse functionality continues to work correctly
- [ ] **AC-7:** Indentation visible in all supported browsers (Chrome, Firefox, Edge, Safari)

---

## Testing Notes

### Manual Test Cases

**Test Case 1: DEV Dashboard Hierarchy**
1. Select DEV role
2. Click epic with multiple stories and dev plans
3. Verify visual indentation shows:
   - Stories indented ~24px from Epic
   - Dev Plans indented ~24px from their Story (total ~48px from Epic)
4. Compare side-by-side with FA dashboard - indentation should match

**Test Case 2: SA Dashboard Hierarchy**
1. Select SA role
2. View Solution Design tab, click SD with multiple increments
3. Verify SDI items indented under SD parent
4. Switch to Technical Architecture tab, click TA with multiple increments
5. Verify TAI items indented under TA parent

**Test Case 3: QA Dashboard Hierarchy**
1. Select QA role
2. View FI → Test Cases tab, click FI with test cases
3. Verify test cases indented under FI parent
4. Switch to Feature → Regression tab, click Feature with regression tests
5. Verify regression tests indented under Feature parent

**Test Case 4: Cross-Browser Compatibility**
1. Repeat Test Cases 1-3 in Chrome, Firefox, Edge
2. Verify indentation renders consistently
3. Check responsive behavior at different viewport widths

### Visual Regression Test

Compare screenshots before/after fix:
- DEV dashboard with epic expanded
- SA dashboard with SD and TA expanded
- QA dashboard with FI and Feature expanded
- Verify indentation depth matches FA dashboard pattern

---

## Notes

### Why This Matters

Tree views are a standard UI pattern for representing hierarchical data. Without proper indentation:
- **Cognitive Load:** Users must mentally track parent-child relationships using only expand/collapse state
- **Scannability:** Cannot quickly identify which items are at which hierarchy level
- **Consistency:** Creates inconsistent UX when FA/BA dashboards work correctly but DEV/SA/QA don't
- **Accessibility:** Screen reader users may navigate correctly, but sighted users are disadvantaged

### Comparison to Industry Standards

All major tree view implementations provide visual indentation:
- VS Code file explorer: ~16px per level
- Windows File Explorer: ~20px per level
- macOS Finder: ~20px per level
- MUI TreeView default: ~24px per level
- React Tree View libraries: typically 16-32px per level

The lack of indentation in DEV/SA/QA dashboards is inconsistent with both internal (FA/BA) and external (industry) patterns.

---

**Status:** Open → Awaiting DEV Investigation

_Created: 2026-01-18_  
_Reported By: QA Engineer_  
_Priority: P2 (Medium)_  
_Severity: Medium (Functional but Poor UX)_
