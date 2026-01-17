---
# === LLM Retrieval Metadata ===
artifact_kind: bug
spec_version: "4.0"
template_version: "4.0.1"
title: "Sidebar card active state uses subtle caret instead of visual highlighting"

# === Ownership ===
role_owner: QA
artifact_type: Project Execution
canonicity: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "bug-teamspecviewermvp-002"
filename_pattern: "bug-teamspecviewermvp-002-card-active-state-visual.md"

# === Required Relationships ===
links_required:
  - type: feature
    pattern: "f-TSV-002"
    optional: false

# === Search Optimization ===
keywords:
  - bug
  - UI
  - sidebar
  - card
  - active state
  - visual feedback
  - FeatureCard
  - BACard
aliases:
  - card selection feedback
  - active card highlighting
anti_keywords:
  - feature request
---

# Bug Report: `bug-teamspecviewermvp-002-card-active-state-visual`

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
| **Bug ID** | bug-teamspecviewermvp-002 |
| **Project** | teamspecviewermvp |
| **Product** | teamspec-viewer (TSV) |
| **Severity** | Medium |
| **Priority** | P2 |
| **Environment** | Development |
| **Component** | Frontend - FeatureCard.tsx, BACard.tsx, Sidebar |
| **Reporter** | QA |
| **Date Reported** | 2026-01-17 |
| **Status** | Open |

---

## Bug Classification

### Bug Type (REQUIRED - exactly one)

- [ ] **Implementation Defect** — Code doesn't match Canon
- [x] **Undocumented Behavior** — Not specified anywhere
- [ ] Canon Wrong — Canon doesn't match intent

### Classification Rationale

**Feature Canon:** [f-TSV-002 Role-Specific Dashboards](../../products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md) specifies that dashboards should provide quick navigation with appropriate visual feedback to indicate which artifact is selected or active. The Canon discusses "quick navigation" and "role-specific dashboards" but does not explicitly specify the visual design for indicating active/selected cards.

**Current State:** FeatureCard and BACard components in the sidebar display an expand/collapse caret icon (ExpandMoreIcon/ChevronRightIcon) that rotates when the card is expanded. This provides minimal visual feedback — the caret change is subtle and easy to miss, especially when the card is collapsed.

**Classification Justification:** This is undocumented behavior requiring design clarification and implementation. The feature needs BA/Design input to define the desired visual feedback pattern (active color, shift/transform), then DEV can implement it.

---

## Description

### Expected Behavior

When a sidebar card (Feature, BA Document, Epic, etc.) is selected or its details are expanded, the card should provide **clear, obvious visual feedback** indicating active/selected state:

1. **Active Color**: The card should be highlighted with an active color (e.g., blue/primary color used elsewhere in the app)
2. **Visual Shift**: The card should have subtle movement or transform (e.g., slightly scaled up, shifted left/right, or elevated shadow change) to indicate interactivity
3. **Remove Subtle Caret**: The small expand/collapse caret icon provides insufficient visual feedback and should be replaced with more prominent styling

**Design Reference:** Common UI patterns for active/selected cards in dashboards:
- Filled background color on active state
- Left border or accent line when active
- Increased elevation/shadow when active
- Slight scale transform (e.g., 1.02x) on hover/active
- Color change in supporting text and icons

### Actual Behavior

**Current Implementation (FeatureCard.tsx lines 73-88):**
```tsx
<Card
    sx={{
        borderRadius: 2,
        border: isSelected ? '2px solid #3b82f6' : '1px solid #e2e8f0',
        boxShadow: isSelected
            ? '0 4px 12px rgba(59, 130, 246, 0.25)'
            : '0 1px 3px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease',
        '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderColor: '#cbd5e1',
        },
    }}
>
    <CardActionArea onClick={onClick}>
        <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                {/* Expand/Collapse Icon */}
                <Box sx={{ color: '#64748b', mt: 0.25 }}>
                    {isExpanded ? (
                        <ExpandMoreIcon sx={{ fontSize: 20 }} />
                    ) : (
                        <ChevronRightIcon sx={{ fontSize: 20 }} />
                    )}
                </Box>
```

**Issues:**
1. **Expand/collapse caret is the primary indicator** — Small icon, subtle rotation/direction change
2. **Border color change is subtle** — Only a 2px blue border added, easy to miss at a glance
3. **No positional feedback** — Card doesn't shift or transform; user must look carefully to spot active state
4. **Icon not removed** — Caret takes up space and distracts from content
5. **Inconsistent with modern UI patterns** — Modern dashboards use bolder, more obvious active states

**Visual Gap:** When user is quickly scanning the sidebar, they may not immediately recognize which card is the active one because the feedback is too subtle (just a border change + tiny icon rotation).

### Steps to Reproduce

1. Navigate to FA Dashboard (role: Functional Analyst)
2. Observe the Feature cards in the sidebar
3. Click on one Feature card to select/expand it
4. **Expected:** Prominent visual change indicating it's active (color, shift, elevation)
5. **Actual:** Subtle border color change + small caret icon rotation

### Evidence

**Affected Components:**
- `frontend/src/components/FeatureCard.tsx` (lines 73-88, 87)
- `frontend/src/components/BACard.tsx` (similar structure)

**Icon Used:**
- `ExpandMoreIcon` / `ChevronRightIcon` from `@mui/icons-material`
- Small 20px icons, color #64748b (slate), subtle visual weight

**Current Active State Indicators:**
- Border: `2px solid #3b82f6` (when isSelected=true)
- Shadow: `0 4px 12px rgba(59, 130, 246, 0.25)` (when isSelected=true)

**Desired State Indicators (from user feedback):**
- Remove caret icon entirely
- Apply active color (primary blue or matching active state color) to card
- Add subtle shift/transform to indicate selection (e.g., translateY, scale, or left border accent)

---

## Root Cause Analysis

**Hypothesis:** The design for active card feedback was either:

1. **Undocumented**: The feature spec doesn't define visual feedback pattern, so implementation chose a minimal approach
2. **Minimal MVP**: Implementation prioritized functional selection (border + shadow) over visual prominence
3. **Icon placeholder**: Caret was added as a placeholder for expand/collapse interaction, but wasn't properly designed for prominence

**Design Question:** What should be the visual language for active/selected states in TeamSpec Viewer dashboards?
- Should match existing active state styling elsewhere in the app (e.g., selected role badge, active navigation items)
- Should be obvious at a glance during quick scanning
- Should not distract from content when card is inactive

---

## Impact

### User Impact

- **Poor affordance**: Users may not immediately see which card is selected when scanning the sidebar
- **Reduced usability**: Requires careful visual inspection or additional interaction (hover) to confirm active state
- **Inconsistent UX**: Active state feedback doesn't match modern dashboard patterns
- **Slower task completion**: Users spend extra cognitive load determining which card is active

### Business Impact

- Reduces quality of the FA/BA dashboard experience
- Degrades the feature's usability during sprint ceremonies and daily work
- Creates friction in the "quick navigation" goal stated in [f-TSV-002](../../products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md)

### Technical Impact

- May indicate inconsistent design language throughout the app for active/selected states
- Suggests need for design system documentation on active state patterns

---

## Resolution Path

### Fix Type: Undocumented Behavior (Requires Design + Implementation)

**Step 1 - Design Decision (BA/Design):**
- Define visual feedback pattern for active/selected cards
- Document the design decision (color, transform, emphasis)
- Ensure consistency with other active state indicators in the app

**Step 2 - Implementation (DEV):**

**Option A: Color + Accent Bar**
```tsx
// Active state with left border accent + background
sx={{
    borderRadius: 2,
    border: '1px solid #e2e8f0',
    borderLeft: isSelected ? '4px solid #3b82f6' : '1px solid #e2e8f0',
    backgroundColor: isSelected ? '#f0f6ff' : 'transparent',
    boxShadow: isSelected
        ? '0 4px 12px rgba(59, 130, 246, 0.25)'
        : '0 1px 3px rgba(0, 0, 0, 0.1)',
    // Remove caret icon entirely
}}
```

**Option B: Color + Scale Transform**
```tsx
// Active state with subtle scale and color
sx={{
    borderRadius: 2,
    border: isSelected ? '2px solid #3b82f6' : '1px solid #e2e8f0',
    backgroundColor: isSelected ? '#f0f6ff' : 'transparent',
    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
    boxShadow: isSelected
        ? '0 4px 16px rgba(59, 130, 246, 0.3)'
        : '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease',
    // Remove caret icon, rely on transform for feedback
}}
```

**Option C: Shifted Position + Color**
```tsx
// Active state with left margin shift + color
sx={{
    borderRadius: 2,
    border: isSelected ? '2px solid #3b82f6' : '1px solid #e2e8f0',
    backgroundColor: isSelected ? '#f0f6ff' : 'transparent',
    marginLeft: isSelected ? '8px' : '0',
    boxShadow: isSelected
        ? '0 4px 12px rgba(59, 130, 246, 0.25)'
        : '0 1px 3px rgba(0, 0, 0, 0.1)',
    // Remove caret icon, use shift for feedback
}}
```

**Step 3 - Implementation Tasks:**

1. Remove `ExpandMoreIcon` and `ChevronRightIcon` imports and usage from FeatureCard.tsx and BACard.tsx
2. Update FeatureCard and BACard `sx` styling to include chosen active state pattern (color + shift/transform)
3. Remove the expand/collapse icon Box entirely (lines 76-82 in FeatureCard)
4. Adjust card layout after removing icon (may need to adjust `gap` or padding)
5. Test active state visual feedback is clear and obvious
6. Verify consistency across all card types (Feature, BADocument, Epic, Story if applicable)

---

## Testing Required

- [ ] Visual inspection: Active card is clearly visible when scanning sidebar
- [ ] Consistency: All card types (FeatureCard, BACard) use same active state styling
- [ ] Hover state: Hover feedback doesn't conflict with active state
- [ ] Responsive: Active state feedback visible on all screen sizes
- [ ] Accessibility: Active state indicated by color + another visual attribute (not color alone)

---

## Acceptance Criteria for Fix

- [ ] Caret icon removed from FeatureCard and BACard components
- [ ] Active/selected card is visually prominent with color + transform/shift
- [ ] Active state is obvious at a glance when scanning sidebar
- [ ] Design consistent across all card types in the application
- [ ] No regression in card expansion/collapse functionality
- [ ] Hover and active states both provide clear feedback
- [ ] All tests passing

---

## Design System Recommendations

For future consistency, document active/selected state patterns across the app:
- **Buttons**: Use filled/outlined states or color change
- **Cards**: Use border accent + background color + subtle transform
- **Navigation items**: Use color + underline or background
- **Badges**: Use filled state for active, outlined for inactive

---

## Notes for Designer & DEV

**Design Considerations:**
1. Choose one visual indicator (color, transform, or shift) or combine them
2. Ensure active state color aligns with app's primary/accent color (#3b82f6 for blue)
3. Consider contrast for accessibility (WCAG AA compliance)
4. Test with different content lengths to ensure feedback works for all card states

**Dev Implementation Notes:**
1. Consider extracting active card styles into a reusable variant or theme
2. If multiple card types need updating, consider a shared CardActive component or hook
3. Remember to update TypeScript if adding new props
4. Ensure smooth transitions between active/inactive states

---

## Related Issues

**Potential Similar Issues:**
- Navigation items may have similar weak active state feedback
- Other UI components may benefit from stronger active state patterns

**Recommendation:** After fixing, audit other components for consistency in active/selected state feedback.

---

## Change Log

| Date | Author | Status | Notes |
|------|--------|--------|-------|
| 2026-01-17 | QA | Open | Initial bug report - awaiting design decision |
