# TeamSpec 4.0 Specification Consistency Update Plan

**Date:** 2026-01-11
**Version:** 4.0
**Status:** Action Required

---

## Executive Summary

Based on comprehensive audits (Claude Code, Gemini), the `spec/4.0/registry.yml` is consistent with generated spec files but **significant inconsistencies exist** in:

1. **README.md** - References removed commands, ADR terminology, incorrect command names
2. **workflows.md** - Embeds commands (should be handoffs-only per your decision)
3. **glossary.md** - Contains ADR terminology (should be killed)
4. **roles.md** - Contains ADR reference in DEV reviews
5. **templates/** - Missing templates for several registry artifacts
6. **agents/** - Reference commands not in registry

---

## Part 1: Critical Fixes Required

### 1.1 Kill ADR Terminology (Option A - Your Decision)

**Files to update:**

| File | Line | Current | Fix |
|------|------|---------|-----|
| `spec/4.0/glossary.md` | 90 | "SA owns Solution Designs, Technical Architecture, and ADRs" | "SA owns Solution Designs and Technical Architecture" |
| `spec/4.0/roles.md` | 173 | "Reviews: ADRs" under DEV | "Reviews: Technical Architecture (when requested)" |
| `registry.yml` | 163 | "Reviews: ADRs" under DEV | "Reviews: Technical Architecture (when requested)" |
| `README.md` | 217 | "SA owns... ADRs" | "SA owns Solution Design, Technical Architecture" |
| `README.md` | 289-298 | Entire SA section mentions ADRs | Replace "ADR" with "Technical Architecture (TA)" |
| `templates/adr-template.md` | entire | ADR template | Rename to `ta-template.md` or delete |

### 1.2 Remove Invalid Commands from README.md

**Commands to remove/fix:**

| Line | Current | Action |
|------|---------|--------|
| 98 | `ts:status` | Change to `ts:po status` |
| 539 | `ts:status` | Change to `ts:po status` |
| 540 | `ts:agent fix` | Change to `ts:fix` |
| 586-587 | `teamspec migrate` | Remove (not in registry) |
| 603 | `ts:fa slice` | Remove (not in registry) |
| 609 | `ts:qa bug` | Remove (not in registry) |
| 610-611 | `ts:sm sprint create`, `ts:sm planning` | Change to `ts:sm sprint` |
| 612 | `ts:status` | Change to `ts:po status` |
| 613 | `ts:agent fix` | Change to `ts:fix` |
| 656 | `ts:deploy` | Change to `ts:po sync` |
| 217 | `ts:sa design`, `ts:sa adr` | Change to `ts:sa sd`, `ts:sa ta` |

### 1.3 Remove Commands from workflows.md (Your Decision: Handoffs Only)

**Current state:** workflows.md contains 30+ command references in mermaid diagrams and text.

**Fix:** Replace command tokens with action descriptions.

| Location | Current | Replace With |
|----------|---------|--------------|
| Line 10 | "All commands referenced here exist in commands.md" | Remove this line entirely |
| Line 21 | `ts:po product` | "Create product" |
| Line 49 | `ts:po project` | "Create project" |
| Line 82 | `ts:ba analysis` | "Create business analysis" |
| Line 83-91 | All `ts:*` references | Action descriptions |
| Line 100 | `ts:fa story` in state diagram | "FA creates" (already correct label) |
| Line 142 | `ts:sm deploy-checklist` | "Run deployment checklist" |
| Line 144 | `ts:qa verify` | "Verify deployment" |
| Line 180 | `ts:po sync` | "Sync to Canon" |
| Line 218 | `ts:sm sprint` | "Create sprint" |
| Line 237 | `ts:sm deploy-checklist` | "Run deployment checklist" |
| Line 240 | `ts:po sync` | "Sync Canon" |

### 1.4 Fix Deployment Gate Language

**Issue:** Some surfaces still say "before production deployment" vs "Deployment Verification Gate" (post-deploy).

**Files to check/fix:**

| File | Issue | Fix |
|------|-------|-----|
| `README.md` line 652-657 | "Deployment Gate... `ts:deploy` executed" | "Deployment Verification Gate... After deploy, PO runs `ts:po sync`" |
| `glossary.md` | Deployment Verification Gate definition OK | No change needed |
| `gates.md` | Deployment Verification Gate definition OK | No change needed |

---

## Part 2: Template Inconsistencies

### 2.1 Missing Templates (per registry.yml artifacts)

| Registry Artifact | Expected Template | Current Status | Action |
|-------------------|-------------------|----------------|--------|
| `solution-design` | `sd-template.md` | Missing (found `functional-spec-template.md`) | Create `sd-template.md` |
| `technical-architecture` | `ta-template.md` | Missing (found `adr-template.md`) | Rename `adr-template.md` to `ta-template.md` |
| `sd-increment` | `sdi-template.md` | Missing | Create `sdi-template.md` |
| `ta-increment` | `tai-template.md` | Missing | Create `tai-template.md` |
| `ba-increment` | `bai-template.md` | Missing | Create `bai-template.md` |
| `regression-impact` | `ri-template.md` | Missing | Create `ri-template.md` |
| `project-test-case` | `tc-template.md` | Ambiguous (`testcases-template.md`) | Rename to `tc-template.md` |

### 2.2 Template Naming Alignment

| Current Template | Registry Artifact | Recommended Name |
|------------------|-------------------|------------------|
| `adr-template.md` | `technical-architecture` | `ta-template.md` |
| `functional-spec-template.md` | `solution-design`? | `sd-template.md` or remove |
| `testcases-template.md` | `project-test-case` | `tc-template.md` |

---

## Part 3: Agent Command Inconsistencies

### 3.1 Commands in Agents NOT in Registry

Based on Gemini review, these agent commands need removal or addition to registry:

| Agent | Command Used | Registry Status | Action |
|-------|--------------|-----------------|--------|
| AGENT_QA.md | `ts:qa uat` | Missing | Remove from agent |
| AGENT_QA.md | `ts:qa bug` | Missing | Remove from agent |
| AGENT_FA.md | `ts:fa slice` | Missing | Remove from agent |
| AGENT_SM.md | `ts:sm planning` | Missing | Remove from agent |
| AGENT_SM.md | `ts:sm standup` | Missing | Remove from agent |
| AGENT_SM.md | `ts:sm retro` | Missing | Remove from agent |
| AGENT_SM.md | `ts:sm sync` | Missing | Remove from agent |
| AGENT_SM.md | `ts:sm sprint create` | Should be `ts:sm sprint` | Fix command |

**Note:** Registry is source of truth. If command not in registry, remove from agents.

---

## Part 4: Static Validation Scripts

### 4.1 Command Consistency Check

Create `scripts/validate-commands.sh`:

```bash
#!/bin/bash
# Validate commands referenced across spec match registry.yml

set -e

echo "=== Command Consistency Check ==="

# Extract valid commands from registry.yml
echo "Extracting valid commands from registry.yml..."
grep -E "invocation:" spec/4.0/registry.yml | \
  sed 's/.*invocation: "\(.*\)"/\1/' | \
  grep -v "REMOVED" | \
  sort -u > /tmp/valid_commands.txt

echo "Valid commands:"
cat /tmp/valid_commands.txt

# Find all ts: command references in spec docs (except registry and commands.md)
echo ""
echo "Scanning for command references in spec/4.0/..."
grep -rhoE "ts:[a-z]{2,}(\s+[a-z0-9<>\-]+)?" spec/4.0/*.md \
  --include="*.md" \
  | grep -v "^ts:lint" \
  | grep -v "^ts:fix" \
  | grep -v "^ts:agent" \
  | sort -u > /tmp/referenced_commands.txt

echo "Commands referenced in spec:"
cat /tmp/referenced_commands.txt

# Check for invalid commands
echo ""
echo "Checking for invalid commands..."
INVALID=0
while read cmd; do
  if ! grep -qF "$cmd" /tmp/valid_commands.txt; then
    echo "ERROR: Invalid command '$cmd' referenced but not in registry"
    INVALID=1
  fi
done < /tmp/referenced_commands.txt

# Check README.md
echo ""
echo "Scanning README.md for commands..."
grep -oE "ts:[a-z]{2,}(\s+[a-z0-9<>\-]+)?" README.md 2>/dev/null | sort -u > /tmp/readme_commands.txt || true
while read cmd; do
  if ! grep -qF "$cmd" /tmp/valid_commands.txt; then
    echo "WARNING: README.md references invalid command '$cmd'"
    INVALID=1
  fi
done < /tmp/readme_commands.txt

if [ $INVALID -eq 0 ]; then
  echo "OK: All commands are valid"
  exit 0
else
  echo ""
  echo "FAILED: Found invalid command references"
  exit 1
fi
```

### 4.2 Lint Rule Completeness Check

Create `scripts/validate-lint-rules.sh`:

```bash
#!/bin/bash
# Validate all referenced lint rule IDs exist in lint-rules.md

set -e

echo "=== Lint Rule Completeness Check ==="

# Extract defined lint rules from lint-rules.md
echo "Extracting defined lint rules..."
grep -oE "TS-[A-Z]+-[0-9]{3}" spec/4.0/lint-rules.md | sort -u > /tmp/defined_rules.txt

echo "Defined rules:"
cat /tmp/defined_rules.txt

# Extract referenced lint rules from all spec docs
echo ""
echo "Extracting referenced lint rules..."
grep -rhoE "TS-[A-Z]+-[0-9]{3}" spec/4.0/*.md \
  --include="*.md" \
  | sort -u > /tmp/referenced_rules.txt

echo "Referenced rules:"
cat /tmp/referenced_rules.txt

# Find missing rules
echo ""
echo "Checking for missing rules..."
MISSING=$(comm -23 /tmp/referenced_rules.txt /tmp/defined_rules.txt)

if [ -z "$MISSING" ]; then
  echo "OK: All referenced lint rules are defined"
  exit 0
else
  echo "FAILED: Missing lint rule definitions:"
  echo "$MISSING"
  exit 1
fi
```

### 4.3 ADR Term Detection (Post-Fix Validation)

Create `scripts/validate-no-adr.sh`:

```bash
#!/bin/bash
# Ensure ADR terminology has been removed (per your decision)

set -e

echo "=== ADR Terminology Check ==="

# Search for ADR in spec files (case-insensitive)
FOUND=$(grep -riln "\bADR\b" spec/4.0/*.md 2>/dev/null || true)

if [ -z "$FOUND" ]; then
  echo "OK: No ADR terminology found in spec/4.0/"
else
  echo "WARNING: ADR terminology still found in:"
  echo "$FOUND"
  echo ""
  echo "Occurrences:"
  grep -rn "\bADR\b" spec/4.0/*.md 2>/dev/null || true
  exit 1
fi

# Check README
FOUND_README=$(grep -n "\bADR\b" README.md 2>/dev/null || true)
if [ -n "$FOUND_README" ]; then
  echo "WARNING: ADR terminology found in README.md:"
  echo "$FOUND_README"
  exit 1
fi

echo "OK: ADR terminology successfully removed"
```

### 4.4 Removed Commands Detection

Create `scripts/validate-no-removed-commands.sh`:

```bash
#!/bin/bash
# Ensure removed commands are not referenced (except in Removed Commands sections)

set -e

echo "=== Removed Commands Check ==="

# List of removed commands (from registry.yml)
REMOVED_COMMANDS=(
  "ts:deploy"
  "ts:ba epic"
  "ts:ba feature"
  "ts:sa design"
  "ts:sa adr"
)

ERRORS=0

for cmd in "${REMOVED_COMMANDS[@]}"; do
  echo "Checking for '$cmd'..."

  # Search in spec files (excluding commands.md Removed section and glossary Removed section)
  FOUND=$(grep -rn "$cmd" spec/4.0/*.md README.md 2>/dev/null | \
    grep -v "Removed Commands" | \
    grep -v "Replacement" | \
    grep -v "status: \"REMOVED\"" || true)

  if [ -n "$FOUND" ]; then
    echo "ERROR: Removed command '$cmd' still referenced:"
    echo "$FOUND"
    ERRORS=1
  fi
done

if [ $ERRORS -eq 0 ]; then
  echo "OK: No removed commands found in active documentation"
  exit 0
else
  echo ""
  echo "FAILED: Found references to removed commands"
  exit 1
fi
```

### 4.5 Workflows Command-Free Check

Create `scripts/validate-workflows-no-commands.sh`:

```bash
#!/bin/bash
# Ensure workflows.md contains no command tokens (handoffs only)

set -e

echo "=== Workflows Command-Free Check ==="

# Search for ts: commands in workflows.md
FOUND=$(grep -oE "ts:[a-z]{2,}" spec/4.0/workflows.md 2>/dev/null || true)

if [ -z "$FOUND" ]; then
  echo "OK: workflows.md is command-free (handoffs only)"
  exit 0
else
  echo "FAILED: workflows.md still contains commands:"
  grep -n "ts:[a-z]" spec/4.0/workflows.md 2>/dev/null || true
  exit 1
fi
```

### 4.6 Template Coverage Check

Create `scripts/validate-templates.sh`:

```bash
#!/bin/bash
# Validate templates exist for all registry artifacts

set -e

echo "=== Template Coverage Check ==="

# Expected templates based on registry artifacts
declare -A EXPECTED_TEMPLATES
EXPECTED_TEMPLATES=(
  ["feature"]="feature-template.md"
  ["story"]="story-template.md"
  ["epic"]="epic-template.md"
  ["feature-increment"]="feature-increment-template.md"
  ["business-analysis"]="business-analysis-template.md"
  ["solution-design"]="sd-template.md"
  ["technical-architecture"]="ta-template.md"
  ["ba-increment"]="bai-template.md"
  ["sd-increment"]="sdi-template.md"
  ["ta-increment"]="tai-template.md"
  ["project-test-case"]="tc-template.md"
  ["regression-impact"]="ri-template.md"
  ["bug-report"]="bug-report-template.md"
  ["sprint"]="sprint-template.md"
)

MISSING=0

for artifact in "${!EXPECTED_TEMPLATES[@]}"; do
  template="${EXPECTED_TEMPLATES[$artifact]}"
  if [ -f "templates/$template" ]; then
    echo "OK: $artifact -> templates/$template"
  else
    echo "MISSING: $artifact -> templates/$template"
    MISSING=1
  fi
done

if [ $MISSING -eq 0 ]; then
  echo ""
  echo "OK: All required templates exist"
  exit 0
else
  echo ""
  echo "FAILED: Some templates are missing"
  exit 1
fi
```

### 4.7 Master Validation Script

Create `scripts/validate-spec-consistency.sh`:

```bash
#!/bin/bash
# Master validation script for TeamSpec 4.0 spec consistency

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "========================================"
echo "TeamSpec 4.0 Spec Consistency Validation"
echo "========================================"
echo ""

FAILED=0

run_check() {
  local script=$1
  local name=$2

  echo "--- $name ---"
  if bash "$SCRIPT_DIR/$script"; then
    echo ""
  else
    FAILED=1
    echo ""
  fi
}

run_check "validate-commands.sh" "Command Consistency"
run_check "validate-lint-rules.sh" "Lint Rule Completeness"
run_check "validate-no-adr.sh" "ADR Terminology Removal"
run_check "validate-no-removed-commands.sh" "Removed Commands"
run_check "validate-workflows-no-commands.sh" "Workflows Command-Free"
run_check "validate-templates.sh" "Template Coverage"

echo "========================================"
if [ $FAILED -eq 0 ]; then
  echo "ALL CHECKS PASSED"
  exit 0
else
  echo "SOME CHECKS FAILED - Review above output"
  exit 1
fi
```

---

## Part 5: Implementation Checklist

### Phase 1: Kill ADR Terminology
- [ ] Update `spec/4.0/glossary.md` line 90
- [ ] Update `spec/4.0/roles.md` line 173 (DEV reviews)
- [ ] Update `spec/4.0/registry.yml` line 163 (DEV reviews)
- [ ] Update `README.md` lines 217, 289-298
- [ ] Rename `templates/adr-template.md` to `templates/ta-template.md`

### Phase 2: Fix README Commands
- [ ] Replace `ts:status` with `ts:po status` (lines 98, 539, 612)
- [ ] Replace `ts:agent fix` with `ts:fix` (lines 540, 613)
- [ ] Remove `teamspec migrate` (lines 586-587)
- [ ] Remove `ts:fa slice` (line 603)
- [ ] Remove `ts:qa bug` (line 609)
- [ ] Replace `ts:sm sprint create`, `ts:sm planning` with `ts:sm sprint` (lines 610-611)
- [ ] Replace `ts:sa design`, `ts:sa adr` with `ts:sa sd`, `ts:sa ta` (line 217)
- [ ] Replace `ts:deploy` with `ts:po sync` (line 656)
- [ ] Fix Deployment Gate section (lines 652-657)

### Phase 3: Strip Commands from workflows.md
- [ ] Remove line 10 ("All commands referenced here...")
- [ ] Replace all `ts:*` in mermaid diagrams with action descriptions
- [ ] Replace all `ts:*` in prose with action descriptions
- [ ] Update Role Handoffs table (remove command triggers)

### Phase 4: Create Missing Templates
- [ ] Create `templates/sd-template.md`
- [ ] Create `templates/ta-template.md` (rename from adr-template.md)
- [ ] Create `templates/sdi-template.md`
- [ ] Create `templates/tai-template.md`
- [ ] Create `templates/bai-template.md`
- [ ] Create `templates/ri-template.md`
- [ ] Rename `templates/testcases-template.md` to `templates/tc-template.md`

### Phase 5: Fix Agents
- [ ] Audit AGENT_QA.md - remove `ts:qa uat`, `ts:qa bug`
- [ ] Audit AGENT_FA.md - remove `ts:fa slice`
- [ ] Audit AGENT_SM.md - remove `ts:sm planning`, `ts:sm standup`, `ts:sm retro`, `ts:sm sync`; fix `ts:sm sprint create` to `ts:sm sprint`

### Phase 6: Add Validation Scripts
- [ ] Create `scripts/` directory
- [ ] Add `validate-commands.sh`
- [ ] Add `validate-lint-rules.sh`
- [ ] Add `validate-no-adr.sh`
- [ ] Add `validate-no-removed-commands.sh`
- [ ] Add `validate-workflows-no-commands.sh`
- [ ] Add `validate-templates.sh`
- [ ] Add `validate-spec-consistency.sh` (master script)
- [ ] Make all scripts executable
- [ ] Add to CI pipeline (GitHub Actions)

### Phase 7: Regenerate Generated Files
- [ ] Regenerate `spec/4.0/commands.md` from registry
- [ ] Regenerate `spec/4.0/roles.md` from registry
- [ ] Run validation suite
- [ ] Verify all checks pass

---

## Part 6: CI Integration

### GitHub Actions Workflow

Create `.github/workflows/spec-consistency.yml`:

```yaml
name: Spec Consistency Check

on:
  push:
    paths:
      - 'spec/**'
      - 'README.md'
      - 'agents/**'
      - 'templates/**'
  pull_request:
    paths:
      - 'spec/**'
      - 'README.md'
      - 'agents/**'
      - 'templates/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Spec Consistency Checks
        run: |
          chmod +x scripts/*.sh
          ./scripts/validate-spec-consistency.sh
```

---

## Summary

### Total Changes Required

| Category | Count |
|----------|-------|
| ADR terminology removal | 6 locations |
| README command fixes | 12 locations |
| workflows.md command removal | ~30 locations |
| Missing templates | 7 files |
| Agent command fixes | ~8 commands |
| New validation scripts | 7 files |

### Priority Order

1. **Highest:** Fix README.md (user-facing, causes confusion)
2. **High:** Kill ADR terminology (consistency)
3. **High:** Strip commands from workflows.md (per your decision)
4. **Medium:** Create missing templates (completeness)
5. **Medium:** Fix agent commands (agent accuracy)
6. **Lower:** Add validation scripts (prevent future drift)

### Success Criteria

After implementing this plan, running `./scripts/validate-spec-consistency.sh` should:
- Exit with code 0
- Report "ALL CHECKS PASSED"
- Show no warnings or errors

---

## Appendix: File Quick Reference

### Files to Modify

| File | Changes |
|------|---------|
| `spec/4.0/registry.yml` | Line 163 (DEV reviews) |
| `spec/4.0/glossary.md` | Line 90 (SA owns) |
| `spec/4.0/roles.md` | Line 173 (DEV reviews) |
| `spec/4.0/workflows.md` | ~30 command removals |
| `README.md` | ~15 command fixes |

### Files to Create

| File | Purpose |
|------|---------|
| `templates/sd-template.md` | Solution Design template |
| `templates/ta-template.md` | Technical Architecture template |
| `templates/sdi-template.md` | SD Increment template |
| `templates/tai-template.md` | TA Increment template |
| `templates/bai-template.md` | BA Increment template |
| `templates/ri-template.md` | Regression Impact template |
| `scripts/validate-*.sh` | 7 validation scripts |
| `.github/workflows/spec-consistency.yml` | CI workflow |

### Files to Rename

| Current | New |
|---------|-----|
| `templates/adr-template.md` | `templates/ta-template.md` |
| `templates/testcases-template.md` | `templates/tc-template.md` |
