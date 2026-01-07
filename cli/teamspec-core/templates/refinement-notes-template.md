# Refinement Agenda: [Date]

<!-- 
  ⚠️ REFINEMENT RULES
  
  All refinement decisions affecting behavior must be synced to Feature Canon.
  
  RULES:
  1. Stories must link to features
  2. Impact type must be determined
  3. If behavior changes, Canon sync is scheduled
  4. No orphan stories allowed
-->

> **Template Version**: 2.0  
> **Last Updated**: 2026-01-07

---

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Meeting Notes  
**Lifecycle:** Historical after refinement

---

**Attendees**: [List]  
**Date**: YYYY-MM-DD  
**Facilitator**: [FA Name]

---

## Stories to Refine

| Story ID | Title | Feature(s) | Impact Type | Est | Ready? |
|:---------|:------|-----------|-------------|:---:|:------:|
| S-XXX | [Title] | F-XXX | Adds/Changes/Fixes/Tech | ? | [ ] |
| S-YYY | [Title] | F-YYY | Adds/Changes/Fixes/Tech | ? | [ ] |

**Column Definitions**:
- **Feature(s)**: Which Feature ID(s) from `/features/features-index.md`
- **Impact Type**: Adds Behavior / Changes Behavior / Fixes Defect / Technical Only
- **Est**: Estimate in points
- **Ready?**: Passes DoR checklist

---

## Discussion Notes

### S-XXX: [Story Title]

**Discussion**:
- [Key point 1]
- [Key point 2]

**Decisions**:
- [Decision made]

**Questions for BA/Stakeholders**:
- [ ] [Open question]

**Estimate**: {N} points

---

### S-YYY: [Story Title]

**Discussion**:
- [Key point 1]

**Decisions**:
- [Decision made]

**Estimate**: {N} points

---

## Decisions Made

| Decision | Feature Impact | Follow-up |
|----------|----------------|-----------|
| [Decision 1] | F-XXX: [What changes] | FA will sync to Feature Canon |
| [Decision 2] | F-YYY: [What changes] | FA will sync to Feature Canon |

---

## Feature Canon Sync Notes (MANDATORY)

> ⚠️ Any decision that **changes system behavior** MUST be synced to the Feature Canon.

For each story with impact "Adds Behavior" or "Changes Behavior":

| Story | Feature | Canon Current? | Sync Needed? | Assigned To |
|-------|---------|----------------|--------------|-------------|
| S-XXX | F-XXX | [ ] | [ ] | [FA Name] |
| S-YYY | F-YYY | [ ] | [ ] | [FA Name] |

---

## Action Items

- [ ] [Who] to check [What] by [Date]
- [ ] FA to run `ts:fa sync` after [Story] is complete
- [ ] Verify Feature Canon updated before sprint close

---

## Refinement Quality Gate

Before approving stories to "Ready":

- [ ] All stories linked to Feature ID(s)
- [ ] Feature files exist for all linked features
- [ ] Impact type marked (not "unknown")
- [ ] If behavior changes, Feature Canon update is scheduled
- [ ] No orphan stories (all have feature links)
- [ ] Estimates assigned
- [ ] Acceptance Criteria complete

---

## Stories Ready to Move

| Story | From | To | FA Approved |
|-------|------|----|-------------|
| S-XXX | backlog | ready-to-refine | [ ] |
| S-YYY | ready-to-refine | ready-for-development | [ ] |

---

## Next Refinement

**Date**: YYYY-MM-DD  
**Stories to prepare**: [List]
