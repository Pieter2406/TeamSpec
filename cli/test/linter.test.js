/**
 * TeamSpec Linter Tests
 * Test-driven implementation of all linter rules
 * 
 * Rules tested:
 * - TS-PROJ-001: Project folder must be registered
 * - TS-PROJ-002: project.yml required with minimum metadata
 * - TS-FEAT-001: Feature file required for any story link
 * - TS-FEAT-002: Feature must include canon sections
 * - TS-FEAT-003: Feature IDs must be unique within project
 * - TS-STORY-001: Story must link to feature
 * - TS-STORY-002: Story must describe delta-only behavior
 * - TS-STORY-003: Acceptance Criteria must be present and testable
 * - TS-STORY-004: Only SM can assign sprint
 * - TS-STORY-005: Ready for Development requires DoR checklist complete
 * - TS-ADR-001: Feature marked "Architecture Required" must have ADR
 * - TS-ADR-002: ADR must link to feature(s)
 * - TS-DEVPLAN-001: Story in sprint must have dev plan
 * - TS-DOD-001: Story cannot be Done if behavior changed and Canon not updated
 */

const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Import linter module
const { 
  Linter,
  rules,
  SEVERITY
} = require('../lib/linter');

// =============================================================================
// Test Fixtures & Helpers
// =============================================================================

/**
 * Create a temporary test project structure
 */
function createTestProject(baseDir, structure = {}) {
  const projectDir = path.join(baseDir, 'projects', 'test-project');
  
  // Create base directories
  const dirs = [
    'projects',
    'projects/test-project',
    'projects/test-project/features',
    'projects/test-project/stories/backlog',
    'projects/test-project/stories/ready-to-refine',
    'projects/test-project/stories/ready-for-development',
    'projects/test-project/adr',
    'projects/test-project/decisions',
    'projects/test-project/dev-plans',
    'projects/test-project/qa/test-cases',
    'projects/test-project/sprints',
  ];
  
  for (const dir of dirs) {
    fs.mkdirSync(path.join(baseDir, dir), { recursive: true });
  }
  
  // Create projects-index.md if not overridden
  if (!structure['projects/projects-index.md']) {
    fs.writeFileSync(
      path.join(baseDir, 'projects', 'projects-index.md'),
      `# Projects Index\n\n| ID | Name | Status |\n|-----|------|--------|\n| test-project | Test Project | active |\n`
    );
  }
  
  // Create files from structure
  for (const [filePath, content] of Object.entries(structure)) {
    const fullPath = path.join(baseDir, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
  }
  
  return projectDir;
}

/**
 * Valid feature content for testing
 */
const VALID_FEATURE = `# Feature: F-001 — User Authentication

## Purpose
Allow users to securely log into the system.

## Scope
Login, logout, session management.

## Actors
- End User
- System Administrator

## Main Flow
1. User enters credentials
2. System validates credentials
3. Session is created

## Business Rules
- Passwords must be at least 8 characters
- Sessions expire after 30 minutes

## Edge Cases
- Invalid credentials: Show error message
- Account locked: Show lockout message

## Non-Goals
- Social login (future feature)

## Change Log
| Date | Story | Change |
|------|-------|--------|
| 2026-01-01 | Initial | Created feature |
`;

/**
 * Valid story content for testing
 */
const VALID_STORY = `# Story: S-001 — Add Password Reset

## Linked Features
- [F-001 — User Authentication](../features/F-001-user-authentication.md)

## User Story
As a user
I want to reset my password
So that I can regain access to my account

## Behavior Delta

### Before (current behavior):
No password reset functionality exists.

### After (new behavior):
Users can request a password reset email and set a new password.

## Acceptance Criteria
- [ ] User can request password reset from login page
- [ ] Reset email is sent within 5 minutes
- [ ] Reset link expires after 24 hours

## Impact
- [x] Adds Behavior

## Notes
Implementation details go here.
`;

/**
 * Valid ADR content for testing
 */
const VALID_ADR = `# ADR-001: Use JWT for Authentication

## Status
Accepted

## Context
We need a stateless authentication mechanism.

## Decision
Use JWT tokens for authentication.

## Consequences
- Stateless authentication
- Token expiry management needed

## Related Features
- [F-001 — User Authentication](../features/F-001-user-authentication.md)
`;

// =============================================================================
// Test Suite: Project Rules (TS-PROJ)
// =============================================================================

describe('TS-PROJ: Project Rules', () => {
  let tempDir;
  let linter;
  
  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'teamspec-test-'));
    linter = new Linter(tempDir);
  });
  
  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });
  
  describe('TS-PROJ-001: Project folder must be registered', () => {
    test('passes when project is in projects-index.md', async () => {
      createTestProject(tempDir, {
        'projects/projects-index.md': `# Projects\n| ID | Name |\n|-----|------|\n| test-project | Test |\n`,
        'projects/test-project/project.yml': 'project_id: test-project\nname: Test\nstatus: active\nstakeholders: []\nroles: []',
      });
      
      const results = await linter.runRule('TS-PROJ-001');
      const errors = results.filter(r => r.severity === SEVERITY.ERROR);
      assert.strictEqual(errors.length, 0, 'Should have no errors');
    });
    
    test('fails when project is not in projects-index.md', async () => {
      createTestProject(tempDir, {
        'projects/projects-index.md': `# Projects\n| ID | Name |\n|-----|------|\n`,
        'projects/test-project/project.yml': 'project_id: test-project\nname: Test\nstatus: active\nstakeholders: []\nroles: []',
      });
      
      const results = await linter.runRule('TS-PROJ-001');
      const errors = results.filter(r => r.severity === SEVERITY.ERROR);
      assert.strictEqual(errors.length, 1, 'Should have 1 error');
      assert.match(errors[0].message, /not registered/i);
    });
  });
  
  describe('TS-PROJ-002: project.yml required with minimum metadata', () => {
    test('passes with all required fields', async () => {
      createTestProject(tempDir, {
        'projects/test-project/project.yml': `
project_id: test-project
name: Test Project
status: active
stakeholders:
  - name: John Doe
    role: Product Owner
roles:
  - BA
  - DEV
`,
      });
      
      const results = await linter.runRule('TS-PROJ-002');
      const errors = results.filter(r => r.severity === SEVERITY.ERROR);
      assert.strictEqual(errors.length, 0, 'Should have no errors');
    });
    
    test('fails when project.yml is missing', async () => {
      // Create test project structure without project.yml
      createTestProject(tempDir, {
        // No project.yml provided - should be missing
      });
      
      const results = await linter.runRule('TS-PROJ-002');
      const errors = results.filter(r => r.severity === SEVERITY.ERROR);
      assert.strictEqual(errors.length, 1, 'Should have 1 error');
      assert.match(errors[0].message, /project\.yml.*missing/i);
    });
    
    test('fails when required fields are missing', async () => {
      createTestProject(tempDir, {
        'projects/test-project/project.yml': `
project_id: test-project
name: Test Project
`,
      });
      
      const results = await linter.runRule('TS-PROJ-002');
      const errors = results.filter(r => r.severity === SEVERITY.ERROR);
      assert.ok(errors.length > 0, 'Should have errors for missing fields');
      assert.match(errors[0].message, /missing.*field/i);
    });
  });
});

// =============================================================================
// Test Suite: Feature Rules (TS-FEAT)
// =============================================================================

describe('TS-FEAT: Feature Rules', () => {
  let tempDir;
  let linter;
  
  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'teamspec-test-'));
    linter = new Linter(tempDir);
  });
  
  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });
  
  describe('TS-FEAT-001: Feature file required for story link', () => {
    test('passes when linked feature exists', async () => {
      createTestProject(tempDir, {
        'projects/test-project/features/F-001-user-auth.md': VALID_FEATURE,
        'projects/test-project/stories/backlog/S-001-add-reset.md': VALID_STORY,
      });
      
      const results = await linter.runRule('TS-FEAT-001');
      const errors = results.filter(r => r.severity === SEVERITY.ERROR);
      assert.strictEqual(errors.length, 0, 'Should have no errors');
    });
    
    test('fails when linked feature does not exist', async () => {
      createTestProject(tempDir, {
        'projects/test-project/stories/backlog/S-001-add-reset.md': `# Story: S-001\n\n## Linked Features\n- [F-999 — Missing Feature](../features/F-999-missing.md)\n\n## Behavior Delta\n\n### Before:\nNothing\n\n### After:\nSomething\n\n## Acceptance Criteria\n- [ ] Works`,
      });
      
      const results = await linter.runRule('TS-FEAT-001');
      const errors = results.filter(r => r.severity === SEVERITY.ERROR);
      assert.strictEqual(errors.length, 1, 'Should have 1 error');
      assert.match(errors[0].message, /F-999.*not found/i);
    });
  });
  
  describe('TS-FEAT-002: Feature must include canon sections', () => {
    test('passes with all required sections', async () => {
      createTestProject(tempDir, {
        'projects/test-project/features/F-001-user-auth.md': VALID_FEATURE,
      });
      
      const results = await linter.runRule('TS-FEAT-002');
      const errors = results.filter(r => r.severity === SEVERITY.ERROR);
      assert.strictEqual(errors.length, 0, 'Should have no errors');
    });
    
    test('fails when required sections are missing', async () => {
      createTestProject(tempDir, {
        'projects/test-project/features/F-001-incomplete.md': `# Feature: F-001 — Incomplete\n\n## Purpose\nSome purpose\n`,
      });
      
      const results = await linter.runRule('TS-FEAT-002');
      const errors = results.filter(r => r.severity === SEVERITY.ERROR);
      assert.ok(errors.length > 0, 'Should have errors for missing sections');
      assert.match(errors[0].message, /missing.*section/i);
    });
  });
  
  describe('TS-FEAT-003: Feature IDs must be unique', () => {
    test('passes with unique feature IDs', async () => {
      createTestProject(tempDir, {
        'projects/test-project/features/F-001-auth.md': VALID_FEATURE,
        'projects/test-project/features/F-002-profile.md': VALID_FEATURE.replace(/F-001/g, 'F-002').replace('User Authentication', 'User Profile'),
      });
      
      const results = await linter.runRule('TS-FEAT-003');
      const errors = results.filter(r => r.severity === SEVERITY.ERROR);
      assert.strictEqual(errors.length, 0, 'Should have no errors');
    });
    
    test('fails with duplicate feature IDs', async () => {
      createTestProject(tempDir, {
        'projects/test-project/features/F-001-auth.md': VALID_FEATURE,
        'projects/test-project/features/F-001-duplicate.md': VALID_FEATURE,
      });
      
      const results = await linter.runRule('TS-FEAT-003');
      const errors = results.filter(r => r.severity === SEVERITY.ERROR);
      assert.strictEqual(errors.length, 1, 'Should have 1 error');
      assert.match(errors[0].message, /duplicate.*F-001/i);
    });
  });
});

// =============================================================================
// Test Suite: Story Rules (TS-STORY)
// =============================================================================

describe('TS-STORY: Story Rules', () => {
  let tempDir;
  let linter;
  
  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'teamspec-test-'));
    linter = new Linter(tempDir);
  });
  
  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });
  
  describe('TS-STORY-001: Story must link to feature', () => {
    test('passes when story has feature link', async () => {
      createTestProject(tempDir, {
        'projects/test-project/features/F-001-auth.md': VALID_FEATURE,
        'projects/test-project/stories/backlog/S-001-story.md': VALID_STORY,
      });
      
      const results = await linter.runRule('TS-STORY-001');
      const errors = results.filter(r => r.severity === SEVERITY.ERROR);
      assert.strictEqual(errors.length, 0, 'Should have no errors');
    });
    
    test('fails when story has no feature link', async () => {
      createTestProject(tempDir, {
        'projects/test-project/stories/backlog/S-001-no-link.md': `# Story: S-001 — No Feature Link\n\n## User Story\nAs a user...\n\n## Behavior Delta\n\n### Before:\nNothing\n\n### After:\nSomething\n\n## Acceptance Criteria\n- [ ] Works`,
      });
      
      const results = await linter.runRule('TS-STORY-001');
      const errors = results.filter(r => r.severity === SEVERITY.ERROR);
      assert.strictEqual(errors.length, 1, 'Should have 1 error');
      assert.match(errors[0].message, /no.*feature.*link/i);
    });
  });
  
  describe('TS-STORY-002: Story must describe delta-only behavior', () => {
    test('passes with Before/After sections', async () => {
      createTestProject(tempDir, {
        'projects/test-project/stories/backlog/S-001-delta.md': VALID_STORY,
      });
      
      const results = await linter.runRule('TS-STORY-002');
      const errors = results.filter(r => r.severity === SEVERITY.ERROR);
      assert.strictEqual(errors.length, 0, 'Should have no errors');
    });
    
    test('fails without Before/After sections', async () => {
      createTestProject(tempDir, {
        'projects/test-project/stories/backlog/S-001-no-delta.md': `# Story: S-001\n\n## Linked Features\n- F-001\n\n## User Story\nAs a user...\n\n## Acceptance Criteria\n- [ ] Works`,
      });
      
      const results = await linter.runRule('TS-STORY-002');
      const errors = results.filter(r => r.severity === SEVERITY.ERROR);
      assert.strictEqual(errors.length, 1, 'Should have 1 error');
      assert.match(errors[0].message, /before.*after|delta/i);
    });
    
    test('fails with forbidden full-spec headings', async () => {
      createTestProject(tempDir, {
        'projects/test-project/stories/backlog/S-001-full-spec.md': `# Story: S-001\n\n## Linked Features\n- F-001\n\n## Full Specification\nThis is a full spec, not a delta.\n\n## Before:\nOld\n\n## After:\nNew\n\n## Acceptance Criteria\n- [ ] Works`,
      });
      
      const results = await linter.runRule('TS-STORY-002');
      const errors = results.filter(r => r.severity === SEVERITY.ERROR);
      assert.ok(errors.length > 0, 'Should have error for full spec');
      assert.match(errors[0].message, /full specification|forbidden/i);
    });
  });
  
  describe('TS-STORY-003: Acceptance Criteria must be present and testable', () => {
    test('passes with valid AC', async () => {
      createTestProject(tempDir, {
        'projects/test-project/stories/backlog/S-001-good-ac.md': VALID_STORY,
      });
      
      const results = await linter.runRule('TS-STORY-003');
      const errors = results.filter(r => r.severity === SEVERITY.ERROR);
      assert.strictEqual(errors.length, 0, 'Should have no errors');
    });
    
    test('fails without AC section', async () => {
      createTestProject(tempDir, {
        'projects/test-project/stories/backlog/S-001-no-ac.md': `# Story: S-001\n\n## Linked Features\n- F-001\n\n## Before:\nOld\n\n## After:\nNew`,
      });
      
      const results = await linter.runRule('TS-STORY-003');
      const errors = results.filter(r => r.severity === SEVERITY.ERROR);
      assert.strictEqual(errors.length, 1, 'Should have 1 error');
      assert.match(errors[0].message, /acceptance criteria.*missing/i);
    });
    
    test('fails with TBD placeholders', async () => {
      createTestProject(tempDir, {
        'projects/test-project/stories/backlog/S-001-tbd.md': `# Story: S-001\n\n## Linked Features\n- F-001\n\n## Before:\nOld\n\n## After:\nNew\n\n## Acceptance Criteria\n- [ ] TBD`,
      });
      
      const results = await linter.runRule('TS-STORY-003');
      const errors = results.filter(r => r.severity === SEVERITY.ERROR);
      assert.strictEqual(errors.length, 1, 'Should have 1 error');
      assert.match(errors[0].message, /placeholder|TBD/i);
    });
  });
  
  describe('TS-STORY-004: Only SM can assign sprint', () => {
    test('passes when sprint assigned by SM', async () => {
      createTestProject(tempDir, {
        'projects/test-project/stories/ready-for-development/S-001-sprint.md': `# Story: S-001\n\n**Sprint:** 5\n**Assigned By:** Role: SM\n\n## Linked Features\n- F-001\n\n## Before:\nOld\n\n## After:\nNew\n\n## Acceptance Criteria\n- [ ] Works`,
      });
      
      const results = await linter.runRule('TS-STORY-004');
      const errors = results.filter(r => r.severity === SEVERITY.ERROR);
      assert.strictEqual(errors.length, 0, 'Should have no errors');
    });
    
    test('fails when sprint assigned without SM role', async () => {
      createTestProject(tempDir, {
        'projects/test-project/stories/ready-for-development/S-001-bad-assign.md': `# Story: S-001\n\n**Sprint:** 5\n**Assigned By:** DEV (not SM)\n\n## Linked Features\n- F-001\n\n## Before:\nOld\n\n## After:\nNew\n\n## Acceptance Criteria\n- [ ] Works`,
      });
      
      const results = await linter.runRule('TS-STORY-004');
      const errors = results.filter(r => r.severity === SEVERITY.ERROR);
      assert.strictEqual(errors.length, 1, 'Should have 1 error');
      assert.match(errors[0].message, /SM.*assign|sprint.*SM/i);
    });
    
    test('skips stories without sprint assignment', async () => {
      createTestProject(tempDir, {
        'projects/test-project/stories/backlog/S-001-no-sprint.md': VALID_STORY,
      });
      
      const results = await linter.runRule('TS-STORY-004');
      const errors = results.filter(r => r.severity === SEVERITY.ERROR);
      assert.strictEqual(errors.length, 0, 'Should have no errors');
    });
  });
  
  describe('TS-STORY-005: DoR checklist complete for Ready for Development', () => {
    test('passes when DoR checklist is complete', async () => {
      createTestProject(tempDir, {
        'projects/test-project/stories/ready-for-development/S-001-ready.md': `# Story: S-001\n\n**Status:** Ready for Development\n\n## Linked Features\n- F-001\n\n## Before:\nOld\n\n## After:\nNew\n\n## Acceptance Criteria\n- [ ] Works\n\n## DoR Checklist\n- [x] Feature link exists\n- [x] AC are testable\n- [x] Story reviewed`,
      });
      
      const results = await linter.runRule('TS-STORY-005');
      const errors = results.filter(r => r.severity === SEVERITY.ERROR);
      assert.strictEqual(errors.length, 0, 'Should have no errors');
    });
    
    test('fails when DoR items are unchecked', async () => {
      createTestProject(tempDir, {
        // Story in ready-for-development folder should have complete DoR
        'projects/test-project/stories/ready-for-development/S-001-not-ready.md': `# Story: S-001\n\n## Linked Features\n- F-001\n\n## Before:\nOld\n\n## After:\nNew\n\n## Acceptance Criteria\n- [ ] Works\n\n## DoR Checklist\n- [x] Feature link exists\n- [ ] AC are testable\n- [x] Story reviewed`,
      });
      
      const results = await linter.runRule('TS-STORY-005');
      const errors = results.filter(r => r.severity === SEVERITY.ERROR);
      assert.strictEqual(errors.length, 1, 'Should have 1 error');
      assert.match(errors[0].message, /DoR.*incomplete|unchecked/i);
    });
  });
});

// =============================================================================
// Test Suite: ADR Rules (TS-ADR)
// =============================================================================

describe('TS-ADR: ADR Rules', () => {
  let tempDir;
  let linter;
  
  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'teamspec-test-'));
    linter = new Linter(tempDir);
  });
  
  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });
  
  describe('TS-ADR-001: ADR required when architecture marked', () => {
    test('passes when ADR exists for architecture-marked story', async () => {
      createTestProject(tempDir, {
        'projects/test-project/features/F-001-auth.md': VALID_FEATURE,
        'projects/test-project/adr/ADR-001-jwt.md': VALID_ADR,
        'projects/test-project/stories/backlog/S-001-arch.md': `# Story: S-001\n\n## Linked Features\n- F-001\n\n- [x] ADR Required\n\nRelated: ADR-001\n\n## Before:\nOld\n\n## After:\nNew\n\n## Acceptance Criteria\n- [ ] Works`,
      });
      
      const results = await linter.runRule('TS-ADR-001');
      const errors = results.filter(r => r.severity === SEVERITY.ERROR);
      assert.strictEqual(errors.length, 0, 'Should have no errors');
    });
    
    test('fails when ADR required but not linked', async () => {
      createTestProject(tempDir, {
        'projects/test-project/stories/backlog/S-001-missing-adr.md': `# Story: S-001\n\n## Linked Features\n- F-001\n\n- [x] ADR Required\n\n## Before:\nOld\n\n## After:\nNew\n\n## Acceptance Criteria\n- [ ] Works`,
      });
      
      const results = await linter.runRule('TS-ADR-001');
      const errors = results.filter(r => r.severity === SEVERITY.ERROR);
      assert.strictEqual(errors.length, 1, 'Should have 1 error');
      assert.match(errors[0].message, /ADR.*required|missing.*ADR/i);
    });
  });
  
  describe('TS-ADR-002: ADR must link to features', () => {
    test('passes when ADR links to feature', async () => {
      createTestProject(tempDir, {
        'projects/test-project/adr/ADR-001-jwt.md': VALID_ADR,
      });
      
      const results = await linter.runRule('TS-ADR-002');
      const errors = results.filter(r => r.severity === SEVERITY.ERROR);
      assert.strictEqual(errors.length, 0, 'Should have no errors');
    });
    
    test('fails when ADR has no feature link', async () => {
      createTestProject(tempDir, {
        'projects/test-project/adr/ADR-001-no-link.md': `# ADR-001: Some Decision\n\n## Status\nAccepted\n\n## Context\nSome context.\n\n## Decision\nSome decision.`,
      });
      
      const results = await linter.runRule('TS-ADR-002');
      const errors = results.filter(r => r.severity === SEVERITY.ERROR);
      assert.strictEqual(errors.length, 1, 'Should have 1 error');
      assert.match(errors[0].message, /ADR.*link.*feature|feature.*link/i);
    });
  });
});

// =============================================================================
// Test Suite: Dev Plan Rules (TS-DEVPLAN)
// =============================================================================

describe('TS-DEVPLAN: Dev Plan Rules', () => {
  let tempDir;
  let linter;
  
  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'teamspec-test-'));
    linter = new Linter(tempDir);
  });
  
  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });
  
  describe('TS-DEVPLAN-001: Story in sprint must have dev plan', () => {
    test('passes when dev plan exists for sprint story', async () => {
      createTestProject(tempDir, {
        'projects/test-project/stories/ready-for-development/S-001-sprint.md': `# Story: S-001\n\n**Status:** In Sprint\n\n## Linked Features\n- F-001\n\n## Before:\nOld\n\n## After:\nNew\n\n## Acceptance Criteria\n- [ ] Works`,
        'projects/test-project/dev-plans/story-001-tasks.md': `# Dev Plan: S-001\n\n## Tasks\n- [ ] Task 1`,
      });
      
      const results = await linter.runRule('TS-DEVPLAN-001');
      const errors = results.filter(r => r.severity === SEVERITY.ERROR);
      assert.strictEqual(errors.length, 0, 'Should have no errors');
    });
    
    test('fails when dev plan missing for sprint story', async () => {
      createTestProject(tempDir, {
        'projects/test-project/stories/ready-for-development/S-001-no-plan.md': `# Story: S-001\n\n**Status:** In Sprint\n\n## Linked Features\n- F-001\n\n## Before:\nOld\n\n## After:\nNew\n\n## Acceptance Criteria\n- [ ] Works`,
      });
      
      const results = await linter.runRule('TS-DEVPLAN-001');
      const errors = results.filter(r => r.severity === SEVERITY.ERROR);
      assert.strictEqual(errors.length, 1, 'Should have 1 error');
      assert.match(errors[0].message, /dev.*plan.*missing/i);
    });
  });
});

// =============================================================================
// Test Suite: DoD Rules (TS-DOD)
// =============================================================================

describe('TS-DOD: Definition of Done Rules', () => {
  let tempDir;
  let linter;
  
  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'teamspec-test-'));
    linter = new Linter(tempDir);
  });
  
  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });
  
  describe('TS-DOD-001: Canon must be updated when behavior changes', () => {
    test('passes when DoD checklist shows canon updated', async () => {
      createTestProject(tempDir, {
        'projects/test-project/features/F-001-auth.md': `${VALID_FEATURE}\n| 2026-01-07 | S-001 | Added password reset |`,
        'projects/test-project/stories/ready-for-development/S-001-done.md': `# Story: S-001\n\n**Status:** Done\n\n## Linked Features\n- F-001\n\n## Impact\n- [x] Adds Behavior\n\n## Before:\nOld\n\n## After:\nNew\n\n## Acceptance Criteria\n- [x] Works\n\n## DoD Checklist\n- [x] Code complete\n- [x] Tests pass\n- [x] Feature Canon updated`,
      });
      
      const results = await linter.runRule('TS-DOD-001');
      const errors = results.filter(r => r.severity === SEVERITY.ERROR || r.severity === SEVERITY.BLOCKER);
      assert.strictEqual(errors.length, 0, 'Should have no errors');
    });
    
    test('fails when behavior changed but canon not updated', async () => {
      createTestProject(tempDir, {
        'projects/test-project/stories/ready-for-development/S-001-not-synced.md': `# Story: S-001\n\n**Status:** Done\n\n## Linked Features\n- F-001\n\n## Impact\n- [x] Adds Behavior\n\n## Before:\nOld\n\n## After:\nNew\n\n## Acceptance Criteria\n- [x] Works\n\n## DoD Checklist\n- [x] Code complete\n- [x] Tests pass\n- [ ] Feature Canon updated`,
      });
      
      const results = await linter.runRule('TS-DOD-001');
      const blockers = results.filter(r => r.severity === SEVERITY.BLOCKER);
      assert.strictEqual(blockers.length, 1, 'Should have 1 blocker');
      assert.match(blockers[0].message, /canon.*not.*updated|feature.*sync/i);
    });
  });
});

// =============================================================================
// Test Suite: Full Linter Run
// =============================================================================

describe('Linter: Full Project Scan', () => {
  let tempDir;
  let linter;
  
  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'teamspec-test-'));
    linter = new Linter(tempDir);
  });
  
  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });
  
  test('runs all rules on valid project with no errors', async () => {
    createTestProject(tempDir, {
      'projects/projects-index.md': `# Projects\n| ID | Name |\n|-----|------|\n| test-project | Test |\n`,
      'projects/test-project/project.yml': 'project_id: test-project\nname: Test\nstatus: active\nstakeholders: []\nroles: [BA, DEV]',
      'projects/test-project/features/F-001-auth.md': VALID_FEATURE,
      'projects/test-project/stories/backlog/S-001-story.md': VALID_STORY,
    });
    
    const results = await linter.run();
    const errors = results.filter(r => r.severity === SEVERITY.ERROR || r.severity === SEVERITY.BLOCKER);
    assert.strictEqual(errors.length, 0, `Should have no errors, got: ${JSON.stringify(errors, null, 2)}`);
  });
  
  test('reports multiple errors for invalid project', async () => {
    createTestProject(tempDir, {
      'projects/projects-index.md': `# Projects\n| ID | Name |\n|-----|------|\n`,
      'projects/test-project/project.yml': 'project_id: test-project',
      'projects/test-project/stories/backlog/S-001-bad.md': `# Story: S-001\n\n## No features linked\n\n## No delta format\n\nTBD placeholder`,
    });
    
    const results = await linter.run();
    const errors = results.filter(r => r.severity === SEVERITY.ERROR || r.severity === SEVERITY.BLOCKER);
    assert.ok(errors.length >= 3, `Should have at least 3 errors, got ${errors.length}`);
  });
  
  test('returns results grouped by file', async () => {
    createTestProject(tempDir, {
      'projects/test-project/stories/backlog/S-001-bad.md': `# Story: S-001\n\nTBD`,
    });
    
    const results = await linter.run();
    const byFile = linter.groupByFile(results);
    
    assert.ok(Object.keys(byFile).length > 0, 'Should have grouped results');
  });
  
  test('supports filtering by project', async () => {
    // Create two projects
    fs.mkdirSync(path.join(tempDir, 'projects', 'project-a', 'stories', 'backlog'), { recursive: true });
    fs.mkdirSync(path.join(tempDir, 'projects', 'project-b', 'stories', 'backlog'), { recursive: true });
    
    fs.writeFileSync(
      path.join(tempDir, 'projects', 'project-a', 'stories', 'backlog', 'S-001.md'),
      '# Story\nTBD'
    );
    fs.writeFileSync(
      path.join(tempDir, 'projects', 'project-b', 'stories', 'backlog', 'S-002.md'),
      '# Story\nTBD'
    );
    
    const resultsA = await linter.run({ project: 'project-a' });
    const resultsB = await linter.run({ project: 'project-b' });
    
    // Results should be filtered to respective projects
    const filesA = [...new Set(resultsA.map(r => r.file))];
    const filesB = [...new Set(resultsB.map(r => r.file))];
    
    assert.ok(filesA.every(f => f.includes('project-a')), 'Project A results should only contain project-a files');
    assert.ok(filesB.every(f => f.includes('project-b')), 'Project B results should only contain project-b files');
  });
});

// =============================================================================
// Test Suite: Naming Convention Validation
// =============================================================================

describe('Naming Conventions (from PROJECT_STRUCTURE.yml)', () => {
  let tempDir;
  let linter;
  
  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'teamspec-test-'));
    linter = new Linter(tempDir);
  });
  
  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });
  
  test('validates feature naming pattern', async () => {
    createTestProject(tempDir, {
      'projects/test-project/features/bad-name.md': VALID_FEATURE,
    });
    
    const results = await linter.run();
    const warnings = results.filter(r => r.ruleId === 'TS-NAMING-FEATURE');
    assert.ok(warnings.length > 0, 'Should warn about invalid feature naming');
  });
  
  test('validates story naming pattern', async () => {
    createTestProject(tempDir, {
      'projects/test-project/stories/backlog/bad-story-name.md': VALID_STORY,
    });
    
    const results = await linter.run();
    const warnings = results.filter(r => r.ruleId === 'TS-NAMING-STORY');
    assert.ok(warnings.length > 0, 'Should warn about invalid story naming');
  });
  
  test('validates dev-plan naming pattern', async () => {
    createTestProject(tempDir, {
      'projects/test-project/dev-plans/bad-plan.md': '# Bad plan',
    });
    
    const results = await linter.run();
    const warnings = results.filter(r => r.ruleId === 'TS-NAMING-DEVPLAN');
    assert.ok(warnings.length > 0, 'Should warn about invalid dev-plan naming');
  });
  
  test('accepts valid naming patterns', async () => {
    createTestProject(tempDir, {
      'projects/test-project/features/F-001-user-auth.md': VALID_FEATURE,
      'projects/test-project/stories/backlog/S-001-add-reset.md': VALID_STORY,
      'projects/test-project/dev-plans/story-001-tasks.md': '# Dev Plan\n\n## Tasks\n- [ ] Task 1',
      'projects/test-project/adr/ADR-001-jwt.md': VALID_ADR,
    });
    
    const results = await linter.run();
    const namingWarnings = results.filter(r => r.ruleId?.startsWith('TS-NAMING'));
    assert.strictEqual(namingWarnings.length, 0, 'Should have no naming warnings');
  });
});

// =============================================================================
// Test Suite: CLI Integration
// =============================================================================

describe('CLI: teamspec lint command', () => {
  // Note: These tests verify the CLI interface exists and works
  // Full CLI tests would be integration tests
  
  test('Linter exports required functions', () => {
    assert.ok(typeof Linter === 'function', 'Linter should be a constructor');
    assert.ok(typeof rules === 'object', 'rules should be exported');
    assert.ok(typeof SEVERITY === 'object', 'SEVERITY should be exported');
  });
  
  test('Linter instance has required methods', () => {
    const linter = new Linter('/tmp');
    assert.ok(typeof linter.run === 'function', 'linter.run should exist');
    assert.ok(typeof linter.runRule === 'function', 'linter.runRule should exist');
    assert.ok(typeof linter.groupByFile === 'function', 'linter.groupByFile should exist');
  });
});
