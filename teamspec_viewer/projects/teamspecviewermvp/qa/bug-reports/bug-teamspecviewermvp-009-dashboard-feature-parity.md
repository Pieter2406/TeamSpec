---
# === LLM Retrieval Metadata ===
artifact_kind: bug
spec_version: "4.0"
template_version: "4.0.1"
title: "DEV/SA/QA dashboards missing features from FA/BA dashboards"

# === Ownership ===
role_owner: QA
artifact_type: Project Execution
canonicity: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "bug-teamspecviewermvp-009"
filename_pattern: "bug-teamspecviewermvp-009-dashboard-feature-parity.md"

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
  - dashboard consistency
  - feature parity
  - TBD indicator
  - badge styling
  - card styling
  - DEV dashboard
  - SA dashboard
  - QA dashboard
  - visual consistency
aliases:
  - dashboard inconsistency
  - missing features
  - UI parity issue
anti_keywords:
  - feature request
  - enhancement
---

# Bug Report: `bug-teamspecviewermvp-009-dashboard-feature-parity`

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
| **Bug ID** | bug-teamspecviewermvp-009 |
| **Project** | teamspecviewermvp |
| **Product** | teamspec-viewer (TSV) |
| **Severity** | Medium |
| **Priority** | P2 |
| **Environment** | Development |
| **Component** | Frontend - DEVDashboard, SADashboard, QADashboard |
| **Reporter** | QA |
| **Date Reported** | 2026-01-18 |
| **Status** | Open |

---

## Description

The recently-delivered DEV, SA, and QA role dashboards (epic-TSV-009) lack several visual and functional features that are present in the reference implementations (FA and BA dashboards). This creates inconsistent user experience across role-specific dashboards and reduces the usability of DEV/SA/QA views.

**Key Inconsistencies:**

1. **Missing TBD Indicators** - FA/BA dashboards show `{TBD}` warning badges on artifacts containing placeholders; DEV/SA/QA dashboards do not
2. **Status Badge Styling Differences** - Status badge appearance differs between dashboards (outlined Chip vs filled Typography)
3. **Card Visual Design** - Artifact cards in DEV/SA/QA use simpler Paper-based design vs enhanced Card with expand/collapse icons in FA/BA
4. **Missing Count Badges** - FA/BA show child artifact counts (FIs, BAIs) with icons; DEV/SA/QA show plain text counts
5. **Icon Presentation** - FA/BA use colored icon backgrounds; DEV/SA/QA lack this visual enhancement

These inconsistencies violate the principle of "consistent UX across all role dashboards" established in fi-TSV-009 Section 3.1.

---

## Steps to Reproduce

### Issue 1: Missing TBD Indicators

**FA Dashboard (Working Correctly):**
1. Navigate to FA dashboard
2. Click on a feature with TBD markers (e.g., feature with incomplete documentation)
3. Observe TBD indicators in:
   - Feature cards (if feature contains TBD)
   - Tree view nodes (FI, Epic, Story with TBD markers)
4. **OBSERVE:** Yellow warning badge with "⚠️ TBD" appears next to artifacts

**DEV Dashboard (Missing Feature):**
1. Navigate to DEV dashboard
2. Click on an epic with stories containing TBD markers
3. **OBSERVE:** No TBD indicators appear anywhere
4. **EXPECTED:** TBD badges should appear on cards and tree nodes like FA dashboard

**Affects:** DEV, SA, QA dashboards

---

### Issue 2: Status Badge Styling Inconsistent

**FA/BA Dashboard (Reference Style):**
1. View any Feature or BA document card
2. **OBSERVE:** Status displayed as MUI `Chip` component with:
   - Rounded corners (`borderRadius: 1`)
   - `height: 20px`
   - `fontSize: 0.7rem`
   - Color-coded background and text
   - Outlined appearance

**Code:**
```tsx
<Chip
    label={feature.status}
    size="small"
    sx={{
        height: 20,
        fontSize: '0.7rem',
        fontWeight: 600,
        bgcolor: statusColor.bg,
        color: statusColor.text,
        borderRadius: 1,
    }}
/>
```

**DEV/SA/QA Dashboard (Inconsistent Style):**
1. View any Epic, SD, or TA card
2. **OBSERVE:** Status displayed as `Typography` component with:
   - Different padding (`px: 1, py: 0.25` vs Chip's internal padding)
   - Filled appearance (no outline)
   - Hardcoded colors (only Done/In Progress/Other)
   - Different visual weight

**Code:**
```tsx
<Typography
    variant="caption"
    sx={{
        px: 1,
        py: 0.25,
        borderRadius: 1,
        fontWeight: 600,
        bgcolor: artifact.status === 'Done' ? '#dcfce7' : 
                 artifact.status === 'In Progress' ? '#dbeafe' : '#fef3c7',
        color: artifact.status === 'Done' ? '#166534' : 
               artifact.status === 'In Progress' ? '#1e40af' : '#92400e',
    }}
>
    {artifact.status}
</Typography>
```

**Issues:**
- Different component type (Chip vs Typography)
- Inconsistent color mapping (FA/BA use centralized `STATUS_COLORS`, DEV/SA/QA use inline ternaries)
- Only 3 status colors supported (Done, In Progress, Other) vs full status vocabulary
- Visual appearance differs (filled vs outlined style)

---

### Issue 3: Card Visual Design Inconsistency

**FA/BA Dashboard (Reference Design):**
- Uses MUI `Card` component with `CardActionArea`
- Includes expand/collapse chevron icon (ExpandMore / ChevronRight)
- Colored icon background box (e.g., feature icon in colored circle)
- Smooth scale transform on selection (`transform: scale(1.02)`)
- Shadow animation on selection
- Consistent padding and spacing

**Code Structure:**
```tsx
<Card sx={{ ... transitions, shadows, borders ... }}>
    <CardActionArea onClick={onClick}>
        <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', ... }}>
                {/* Expand/Collapse Icon */}
                <Box sx={{ color: '#64748b', mt: 0.25 }}>
                    {isExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                </Box>
                
                {/* Colored Icon Background */}
                <Box sx={{ 
                    width: 36, height: 36, 
                    bgcolor: `${iconConfig.color}15`,
                    borderRadius: 1.5 
                }}>
                    <Icon sx={{ color: iconConfig.color }} />
                </Box>
                
                {/* Content with Chip badges */}
                ...
            </Box>
        </CardContent>
    </CardActionArea>
</Card>
```

**DEV/SA/QA Dashboard (Simplified Design):**
- Uses MUI `Paper` component directly
- No expand/collapse visual indicator
- Icon displayed without background box
- Simpler border and shadow styling
- Less visual feedback on interaction

**Code Structure:**
```tsx
<Paper
    elevation={0}
    onClick={onClick}
    sx={{ ... simpler styling ... }}
>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {/* Icon without background */}
        <Icon sx={{ color: iconConfig.color, fontSize: 24 }} />
        
        {/* Content with Typography badges */}
        ...
    </Box>
</Paper>
```

**Missing Elements:**
- Expand/collapse chevron icon
- Colored icon background box
- `CardActionArea` ripple effect
- Scale transform animation
- Enhanced shadow on selection

---

### Issue 4: Missing Count Badges with Icons

**FA Dashboard (Reference Implementation):**
```tsx
{/* FI Count Badge */}
{fiCount !== undefined && fiCount > 0 && (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: fiIconConfig.color }}>
        <FIIcon sx={{ fontSize: 14 }} />
        <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
            {fiCount} FI{fiCount !== 1 ? 's' : ''}
        </Typography>
    </Box>
)}
```

**Features:**
- Icon + text combination
- Icon colored to match artifact type
- Proper pluralization
- Small, subtle presentation
- Part of card metadata row

**BA Dashboard:**
- Same pattern for BAI count with BA increment icon

**DEV Dashboard (Simplified):**
```tsx
badge={`${visibleStories.length} stories, ${totalDevPlans} dev plans`}
```

**Features:**
- Plain text only
- No icons
- Less visual hierarchy
- Harder to parse at a glance

**SA/QA Dashboards:**
- Similar plain text counts without icons

---

### Issue 5: Icon Background Styling

**FA/BA Cards:**
- Icon wrapped in colored background box:
  ```tsx
  <Box sx={{
      width: 36,
      height: 36,
      borderRadius: 1.5,
      bgcolor: `${iconConfig.color}15`, // Color with 15% opacity
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
  }}>
      <Icon sx={{ color: iconConfig.color, fontSize: 20 }} />
  </Box>
  ```
- Creates visual distinction and branding
- Icon color matches artifact type
- Consistent size (36x36px)

**DEV/SA/QA Cards:**
- Icon rendered directly without background:
  ```tsx
  <Icon sx={{ color: iconConfig.color, fontSize: 24 }} />
  ```
- Less visual weight
- Harder to distinguish artifact types at a glance
- Inconsistent with FA/BA pattern

---

## Expected Result

**All role dashboards should provide consistent visual design and functionality:**

1. **TBD Indicators:**
   - All dashboards display TBD warning badges on cards and tree nodes
   - Uses `TBDIndicator` component consistently
   - Shows tooltip "Contains literal {TBD} markers — this document needs review"

2. **Status Badges:**
   - All dashboards use MUI `Chip` component for status
   - Consistent styling (height, fontSize, borderRadius, colors)
   - Uses centralized `STATUS_COLORS` mapping from FeatureCard
   - Supports full status vocabulary (Active, Draft, Planned, Done, Deprecated, etc.)

3. **Card Design:**
   - All dashboards use `Card` + `CardActionArea` pattern
   - Include expand/collapse chevron icon
   - Colored icon backgrounds (matching artifact type color)
   - Scale transform animation on selection
   - Enhanced shadows and borders

4. **Count Badges:**
   - All dashboards show child counts with icon + text
   - Icon colored to match child artifact type
   - Proper pluralization
   - Consistent spacing and sizing

5. **Visual Consistency:**
   - DEV, SA, QA dashboards match FA, BA reference implementations
   - Same component choices (Card, Chip, etc.)
   - Same styling patterns (colors, spacing, typography)
   - Same interaction patterns (hover, selection, expansion)

---

## Actual Result

DEV, SA, and QA dashboards have:
- No TBD indicators anywhere
- Inconsistent status badge styling (Typography vs Chip)
- Simplified card design (Paper vs Card)
- Plain text counts without icons
- Icons without background styling
- Different visual weight and hierarchy

This creates fragmented UX where FA/BA dashboards feel polished and feature-complete, while DEV/SA/QA dashboards feel unfinished.

---

## Evidence

- [ ] Screenshots attached (user report indicates visual differences)
- [ ] Code comparison completed (documented in Steps to Reproduce)
- [ ] Component inspection performed

**Code Files Affected:**

**Reference Implementations (Working Correctly):**
- `frontend/src/components/FeatureCard.tsx` - FA card with full styling
- `frontend/src/components/BACard.tsx` - BA card with full styling
- `frontend/src/components/FADashboard.tsx` - FA dashboard layout
- `frontend/src/components/BADashboard.tsx` - BA dashboard layout

**Incomplete Implementations:**
- `frontend/src/components/DEVDashboard.tsx` - Lines 60-120 (ArtifactCard component)
- `frontend/src/components/SADashboard.tsx` - Similar card implementation
- `frontend/src/components/QADashboard.tsx` - Similar card implementation

**Shared Components (Available but Not Used):**
- `frontend/src/components/TBDIndicator.tsx` - TBD warning component (exists but not integrated in DEV/SA/QA)

---

## Bug Classification (MANDATORY)

### [X] Implementation Defect

**Definition:** Code doesn't match Feature Canon documentation.

**Evidence:**

**Feature Canon Reference:** [fi-TSV-009-dev-sa-qa-role-dashboards.md](../../feature-increments/fi-TSV-009-dev-sa-qa-role-dashboards.md)

**Section 3.1 - Design Principles:**
> "Consistent UX: Follow established patterns from FA/BA dashboards for consistency"

**Section 3.2.1 - DEV Dashboard states:**
> "Card List (left column): Clickable epic cards with status indicators **following FA dashboard pattern**"

**Section 3.2.2 - Pattern states:**
> "Tree view follows pattern from FA dashboard (feature → FI → epic → story hierarchy)"

**Analysis:**
- **Canon Specifies:** "Follow established patterns from FA/BA dashboards"
- **Implementation:**
  - ✅ Tree view structure matches FA pattern (hierarchy concept)
  - ❌ Card visual design does not match FA pattern (Paper vs Card, missing features)
  - ❌ Status badges do not match FA pattern (Typography vs Chip)
  - ❌ TBD indicators not implemented despite being part of FA pattern
  - ❌ Count badges do not match FA pattern (text-only vs icon+text)
  - ❌ Icon presentation does not match FA pattern (no background styling)

- **Root Cause:** Implementation took shortcuts during epic-009 development
- **Fix Required:** DEV must enhance DEV/SA/QA dashboards to match FA/BA feature set

**Canon Update:** Not required (Canon correctly specifies consistent UX patterns)

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
| **Implementation Defect** ✓ | **DEV** | **Enhance DEV/SA/QA dashboards to match FA/BA reference implementations** |
| Feature Canon Wrong | FA + DEV | Update Canon, then fix code |
| Undocumented Behavior | FA + BA + DEV | Clarify intent, update Canon, implement |

---

## Technical Analysis

### Root Cause

During implementation of epic-TSV-009 (DEV/SA/QA dashboards), the development team:

1. **Created new ArtifactCard component** instead of reusing/adapting existing FeatureCard/BACard patterns
2. **Simplified styling** to expedite delivery, omitting several visual enhancements
3. **Did not integrate TBDIndicator** component despite it being available and proven in FA/BA
4. **Used inline status colors** instead of centralizing via `STATUS_COLORS` constant
5. **Chose Typography over Chip** for status badges (different component choice)
6. **Omitted icon backgrounds** to simplify implementation

**Result:** Functional dashboards that work but don't match reference implementation quality.

---

### Detailed Fix Requirements

#### Fix 1: Add TBD Indicators

**Files to Modify:**
- `DEVDashboard.tsx` (ArtifactCard component)
- `SADashboard.tsx` (SD and TA card components)
- `QADashboard.tsx` (FI and Feature card components)

**Changes:**
1. Import `TBDIndicator` component
2. Add `hasTBD` property to artifact cards
3. Render `<TBDIndicator show={artifact.hasTBD} size="small" />` in card layout
4. Ensure backend returns `hasTBD` property in artifact responses

**Pattern from FeatureCard.tsx:**
```tsx
import { TBDIndicator } from './TBDIndicator';

// In card render:
<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
    <Typography variant="subtitle1" sx={{ ... }}>
        {artifact.title}
    </Typography>
    <TBDIndicator show={artifact.hasTBD ?? false} size="small" />
    {/* Status badge */}
</Box>
```

---

#### Fix 2: Standardize Status Badge Styling

**Files to Modify:**
- `DEVDashboard.tsx` (ArtifactCard component, lines 107-118)
- `SADashboard.tsx` (card components)
- `QADashboard.tsx` (card components)

**Changes:**
1. Extract `STATUS_COLORS` constant to shared utility (or duplicate from FeatureCard)
2. Replace `Typography` with `Chip` component
3. Use consistent sizing and styling

**Current (Incorrect):**
```tsx
{artifact.status && (
    <Typography
        variant="caption"
        sx={{
            px: 1, py: 0.25, borderRadius: 1, fontWeight: 600,
            bgcolor: artifact.status === 'Done' ? '#dcfce7' : 
                     artifact.status === 'In Progress' ? '#dbeafe' : '#fef3c7',
            color: artifact.status === 'Done' ? '#166534' : 
                   artifact.status === 'In Progress' ? '#1e40af' : '#92400e',
        }}
    >
        {artifact.status}
    </Typography>
)}
```

**Replace With (Correct):**
```tsx
{artifact.status && (
    <Chip
        label={artifact.status}
        size="small"
        sx={{
            height: 20,
            fontSize: '0.7rem',
            fontWeight: 600,
            bgcolor: getStatusColor(artifact.status).bg,
            color: getStatusColor(artifact.status).text,
            borderRadius: 1,
        }}
    />
)}
```

---

#### Fix 3: Enhance Card Design to Match FA/BA Pattern

**Files to Modify:**
- `DEVDashboard.tsx` (ArtifactCard component, lines 60-120)
- `SADashboard.tsx` (card components)
- `QADashboard.tsx` (card components)

**Required Changes:**

1. **Replace Paper with Card + CardActionArea:**
```tsx
// Current:
<Paper elevation={0} onClick={onClick} sx={{ ... }}>
    <Box sx={{ ... }}>...</Box>
</Paper>

// Replace with:
<Card sx={{ ... Card styling ... }}>
    <CardActionArea onClick={onClick}>
        <CardContent sx={{ p: 2 }}>
            <Box sx={{ ... }}>...</Box>
        </CardContent>
    </CardActionArea>
</Card>
```

2. **Add Expand/Collapse Chevron Icon:**
```tsx
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// In card layout:
<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
    {/* Expand/Collapse Icon */}
    <Box sx={{ color: '#64748b', mt: 0.25 }}>
        {isExpanded ? <ExpandMoreIcon sx={{ fontSize: 20 }} /> : <ChevronRightIcon sx={{ fontSize: 20 }} />}
    </Box>
    {/* Rest of card content */}
</Box>
```

3. **Add Colored Icon Background:**
```tsx
// Current:
<Icon sx={{ color: iconConfig.color, fontSize: 24 }} />

// Replace with:
<Box sx={{
    width: 36, height: 36, borderRadius: 1.5,
    bgcolor: `${iconConfig.color}15`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
}}>
    <Icon sx={{ color: iconConfig.color, fontSize: 20 }} />
</Box>
```

4. **Add Enhanced Card Styling:**
```tsx
<Card
    sx={{
        borderRadius: 2,
        border: isSelected ? `2px solid ${iconConfig.color}` : '1px solid #e2e8f0',
        boxShadow: isSelected
            ? `0 4px 12px ${iconConfig.color}40`
            : '0 1px 3px rgba(0, 0, 0, 0.1)',
        bgcolor: isSelected ? `${iconConfig.color}08` : 'white',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.2s ease',
        '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderColor: '#cbd5e1',
        },
    }}
>
```

---

#### Fix 4: Add Icon + Text Count Badges

**Files to Modify:**
- `DEVDashboard.tsx` (ArtifactCard component)
- `SADashboard.tsx` (card components)
- `QADashboard.tsx` (card components)

**Changes:**
1. Import child artifact icons
2. Replace plain text badge with icon + text layout

**Current (DEV Dashboard):**
```tsx
badge={`${visibleStories.length} stories, ${totalDevPlans} dev plans`}
// Rendered as Typography
```

**Replace With:**
```tsx
{/* Story Count Badge */}
{storyCount !== undefined && storyCount > 0 && (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: storyIconConfig.color }}>
        <StoryIcon sx={{ fontSize: 14 }} />
        <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
            {storyCount} stor{storyCount !== 1 ? 'ies' : 'y'}
        </Typography>
    </Box>
)}

{/* Dev Plan Count Badge */}
{devPlanCount !== undefined && devPlanCount > 0 && (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: devPlanIconConfig.color }}>
        <DevPlanIcon sx={{ fontSize: 14 }} />
        <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
            {devPlanCount} plan{devPlanCount !== 1 ? 's' : ''}
        </Typography>
    </Box>
)}
```

---

### Implementation Strategy

**Option 1: Refactor to Shared Card Component (Recommended)**

Create `RoleArtifactCard.tsx` that accepts:
- artifact
- iconConfig
- isSelected, isExpanded
- childCounts (array of {icon, color, count, label})
- onClick

Reuse across FA, BA, DEV, SA, QA dashboards.

**Pros:**
- Single source of truth
- Guaranteed consistency
- Easier maintenance

**Cons:**
- Requires refactoring FA and BA dashboards
- Higher initial effort

---

**Option 2: Copy Pattern to DEV/SA/QA (Pragmatic)**

Copy FeatureCard/BACard patterns directly into DEV/SA/QA dashboards:
- Copy Card structure
- Copy styling sx props
- Copy TBD indicator integration
- Copy Chip badge pattern
- Copy icon background pattern

**Pros:**
- Faster implementation
- No risk to existing FA/BA dashboards
- Isolated changes

**Cons:**
- Code duplication
- Risk of future divergence

---

**Recommendation:** Use **Option 2** for immediate fix, plan **Option 1** for future refactoring story.

---

## Impact Assessment

**User Experience Impact:**
- **Severity:** Medium - Dashboards work but UX is inconsistent
- **Frequency:** Always visible in DEV/SA/QA dashboards
- **User Confusion:** Medium - Users wonder why DEV/SA/QA look different from FA/BA
- **Accessibility:** Low - TBD indicators missing reduces document quality visibility

**Development Impact:**
- **Effort:** Medium - Requires updating 3 dashboard components + card implementations
- **Risk:** Low - Isolated to card rendering, no logic changes
- **Testing:** Visual regression testing required

**Business Impact:**
- Reduces perceived quality of DEV/SA/QA dashboard delivery
- Creates inconsistent brand presentation
- May reduce adoption if users prefer FA/BA for visual polish

---

## Related Issues

- **Reference Implementations:**
  - [FeatureCard.tsx](../../teamspec_viewer/frontend/src/components/FeatureCard.tsx) - FA card pattern
  - [BACard.tsx](../../teamspec_viewer/frontend/src/components/BACard.tsx) - BA card pattern
  
- **Related Stories:**
  - [s-e009-002](../../stories/done/s-e009-002-dev-dashboard-navigation.md) - DEV Dashboard (delivered but incomplete)
  - [s-e009-003](../../stories/backlog/s-e009-003-sa-dashboard-navigation.md) - SA Dashboard
  - [s-e009-004](../../stories/backlog/s-e009-004-qa-dashboard-navigation.md) - QA Dashboard
  
- **Related Epic:**
  - [epic-TSV-009](../../epics/epic-TSV-009-dev-sa-qa-dashboards.md) - DEV/SA/QA Dashboards

- **Related Bugs:**
  - [bug-teamspecviewermvp-008](bug-teamspecviewermvp-008-treeview-indentation-missing.md) - Tree indentation issue

---

## Acceptance Criteria for Fix

### AC-1: TBD Indicators Present
- [ ] DEV dashboard shows TBD badges on epic cards and tree nodes
- [ ] SA dashboard shows TBD badges on SD/TA cards and tree nodes
- [ ] QA dashboard shows TBD badges on FI/Feature cards and tree nodes
- [ ] TBD tooltip appears on hover with correct message

### AC-2: Status Badge Consistency
- [ ] All dashboards use MUI `Chip` component for status badges
- [ ] Status colors match centralized `STATUS_COLORS` mapping
- [ ] All status vocabulary supported (not just Done/In Progress/Other)
- [ ] Visual appearance identical across FA, BA, DEV, SA, QA

### AC-3: Card Design Enhanced
- [ ] All dashboards use `Card` + `CardActionArea` components
- [ ] Expand/collapse chevron icons present on all cards
- [ ] Icon backgrounds styled with colored backgrounds (matching artifact type)
- [ ] Scale transform animation on selection works
- [ ] Shadow and border styling matches FA/BA pattern

### AC-4: Count Badges with Icons
- [ ] DEV dashboard shows story and dev plan counts with icons
- [ ] SA dashboard shows increment counts with icons
- [ ] QA dashboard shows test artifact counts with icons
- [ ] Icons colored to match child artifact type
- [ ] Proper pluralization ("1 story" vs "2 stories")

### AC-5: Visual Consistency Verified
- [ ] Side-by-side comparison shows no visual differences between dashboard card styles
- [ ] Component inspector shows same component types (Card, Chip, etc.)
- [ ] CSS computed styles match across dashboards
- [ ] Interaction patterns identical (hover, click, expand)

### AC-6: No Regressions
- [ ] FA dashboard cards continue to work correctly
- [ ] BA dashboard cards continue to work correctly
- [ ] Existing functionality preserved (click, expand, status updates)
- [ ] Performance not degraded

---

## Testing Notes

### Visual Comparison Test

1. Open FA dashboard, take screenshot of feature card
2. Open BA dashboard, take screenshot of BA document card
3. Open DEV dashboard, take screenshot of epic card
4. Open SA dashboard, take screenshot of SD/TA card
5. Open QA dashboard, take screenshot of FI/Feature card
6. Compare all screenshots - should look identical except for:
   - Icon type (Feature vs BA vs Epic vs SD/TA vs FI)
   - Icon color (matching artifact type)
   - Count badges (FIs vs BAIs vs Stories vs Increments vs Tests)
   - All other styling should match exactly

### Component Inspector Test

1. Use browser DevTools to inspect cards in each dashboard
2. Verify component hierarchy:
   ```
   Card
   └─ CardActionArea
      └─ CardContent
         └─ Box (flex container)
            ├─ Box (chevron icon)
            ├─ Box (icon background with icon)
            └─ Box (content)
               ├─ Box (title row with Chip)
               └─ Box (metadata row with icon badges)
   ```
3. Component types should match across all dashboards

### Accessibility Test

1. Tab navigation works consistently across all dashboards
2. Screen reader announces card content identically
3. TBD indicators have proper ARIA labels
4. Keyboard interaction patterns match

---

## Notes

### Why This Matters

**Consistency is a core UX principle.** When users switch between role dashboards, they expect:
- Similar visual language
- Same component behaviors
- Consistent information architecture

Inconsistent dashboards create cognitive overhead as users must re-learn patterns for each role.

**Quality Perception:** Users judge software quality by visual polish. FA/BA dashboards appear "finished" while DEV/SA/QA appear "unfinished", even though the core functionality works.

**Maintenance Burden:** Inconsistent implementations create maintenance challenges:
- Multiple styling patterns to update
- Harder to train new developers
- Increased QA testing surface area

### Development Context

This bug likely resulted from:
- **Time pressure** during epic-009 sprint
- **Copy-paste divergence** when creating new dashboard components
- **Lack of shared component** for artifact cards (each dashboard implemented its own)
- **Incomplete reference** to FA/BA patterns during implementation

The fix should be straightforward since:
- ✅ All patterns exist in FA/BA dashboards (proven implementations)
- ✅ TBDIndicator component already exists and works
- ✅ No new logic required, only styling updates
- ✅ Backend API already returns `hasTBD` property

---

**Status:** Open → Awaiting DEV Investigation and Fix

_Created: 2026-01-18_  
_Reported By: QA Engineer_  
_Priority: P2 (Medium)_  
_Severity: Medium (Functional but Inconsistent UX)_
