/**
 * TeamSpec Linter Tests
 * Test-driven validation of TeamSpec 4.0 lint rules
 * 
 * Tests:
 * - TS-PROD-001: Product folder must be registered
 * - TS-PROD-002: product.yml required with PRX
 * - TS-PROJ-001: Project folder must be registered
 * - TS-PROJ-002: project.yml required with minimum metadata
 * - TS-FI-001: Feature-Increment must have AS-IS and TO-BE sections
 * - TS-FI-002: Feature-Increment must link to target Feature
 * - TS-EPIC-001: Epic file naming convention
 * - TS-STORY-001: Story must link to Epic via filename
 * - TS-STORY-002: Story describes delta, not full behavior
 * - TS-NAMING-*: Artifact naming conventions
 * - TS-DOD-001: Story must have all AC verified
 * - TS-DOD-003: Product sync after deployment
 * - TS-QA-001: Deployed Feature-Increment must have test coverage
 * - TS-QA-003: Regression impact must be recorded for each FI
 */

const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Import linter module
const {
    lint,
    runLint,
    formatResults,
    LintResult,
    SEVERITY,
    getNamingPatterns,
    resetNamingPatterns,
    checkProductRegistered,
    checkProductYml,
    checkProjectRegistered,
    checkProjectYml,
    checkFIContent,
    checkFIFeatureLink,
    checkEpicNaming,
    checkStoryEpicLink,
    checkStoryDelta,
    checkDoneStoryAC,
    checkCanonSync,
    checkFITestCoverage,
    checkRegressionImpact,
    checkArtifactNaming
} = require('../lib/linter');

// =============================================================================
// Test Fixtures & Helpers
// =============================================================================

const FIXTURES_DIR = path.join(__dirname, 'fixtures');
const VALID_FIXTURE = path.join(FIXTURES_DIR, 'valid-4.0');
const BROKEN_FIXTURE = path.join(FIXTURES_DIR, 'broken-4.0');

/**
 * Create a temporary test directory with custom structure
 */
function createTempDir() {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'teamspec-linter-test-'));
    return tempDir;
}

/**
 * Clean up temporary directory
 */
function cleanupTempDir(tempDir) {
    if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
}

/**
 * Create a minimal valid product structure
 */
function createValidProduct(targetDir, productId, prefix) {
    const productDir = path.join(targetDir, 'products', productId);
    fs.mkdirSync(path.join(productDir, 'features'), { recursive: true });
    fs.mkdirSync(path.join(productDir, 'qa', 'regression-tests'), { recursive: true });

    // product.yml
    fs.writeFileSync(
        path.join(productDir, 'product.yml'),
        `product:
  id: "${productId}"
  name: "Test Product"
  prefix: "${prefix}"
  status: active
`,
        'utf-8'
    );

    // products-index.md
    const productsIndexPath = path.join(targetDir, 'products', 'products-index.md');
    if (!fs.existsSync(productsIndexPath)) {
        fs.writeFileSync(productsIndexPath, `# Products Index\n\n| Prefix | ID | Name |\n|--------|-----|------|\n| ${prefix} | ${productId} | Test Product |\n`, 'utf-8');
    }

    return productDir;
}

/**
 * Create a minimal valid project structure
 */
function createValidProject(targetDir, projectId, targetProducts = []) {
    const projectDir = path.join(targetDir, 'projects', projectId);
    fs.mkdirSync(path.join(projectDir, 'feature-increments'), { recursive: true });
    fs.mkdirSync(path.join(projectDir, 'epics'), { recursive: true });
    fs.mkdirSync(path.join(projectDir, 'stories', 'backlog'), { recursive: true });
    fs.mkdirSync(path.join(projectDir, 'qa', 'test-cases'), { recursive: true });
    fs.mkdirSync(path.join(projectDir, 'qa', 'regression-impact'), { recursive: true });

    // project.yml
    const targetProductsYaml = targetProducts.length > 0
        ? `\n  target_products:\n    - ${targetProducts.join('\n    - ')}`
        : '';

    fs.writeFileSync(
        path.join(projectDir, 'project.yml'),
        `project:
  id: "${projectId}"
  name: "Test Project"
  status: active${targetProductsYaml}
`,
        'utf-8'
    );

    return projectDir;
}

// =============================================================================
// LintResult Class Tests
// =============================================================================

describe('LintResult Class', () => {
    test('should initialize with empty arrays', () => {
        const result = new LintResult();
        assert.deepStrictEqual(result.errors, []);
        assert.deepStrictEqual(result.warnings, []);
        assert.deepStrictEqual(result.info, []);
    });

    test('should add errors correctly', () => {
        const result = new LintResult();
        result.add('TS-TEST', 'Test error', '/test/file.md', SEVERITY.ERROR);

        assert.strictEqual(result.errors.length, 1);
        assert.strictEqual(result.errors[0].rule, 'TS-TEST');
        assert.strictEqual(result.errors[0].message, 'Test error');
    });

    test('should add warnings correctly', () => {
        const result = new LintResult();
        result.add('TS-TEST', 'Test warning', '/test/file.md', SEVERITY.WARNING);

        assert.strictEqual(result.warnings.length, 1);
    });

    test('hasErrors should return true when errors exist', () => {
        const result = new LintResult();
        result.add('TS-TEST', 'Error', '/test.md', SEVERITY.ERROR);

        assert.strictEqual(result.hasErrors(), true);
    });

    test('hasBlockers should return true when blockers exist', () => {
        const result = new LintResult();
        result.add('TS-TEST', 'Blocker', '/test.md', SEVERITY.BLOCKER);

        assert.strictEqual(result.hasBlockers(), true);
    });

    test('getSummary should return correct counts', () => {
        const result = new LintResult();
        result.add('TS-1', 'Error', '/a.md', SEVERITY.ERROR);
        result.add('TS-2', 'Warning', '/b.md', SEVERITY.WARNING);
        result.add('TS-3', 'Info', '/c.md', SEVERITY.INFO);

        const summary = result.getSummary();
        assert.strictEqual(summary.errors, 1);
        assert.strictEqual(summary.warnings, 1);
        assert.strictEqual(summary.info, 1);
        assert.strictEqual(summary.total, 3);
    });
});

// =============================================================================
// Naming Patterns Tests
// =============================================================================

describe('Naming Patterns', () => {
    // Get naming patterns (will use fallback since no workspace)
    const NAMING_PATTERNS = getNamingPatterns(null);

    test('feature pattern should match valid filenames', () => {
        assert.ok(NAMING_PATTERNS.feature.test('f-ACME-001-user-login.md'));
        assert.ok(NAMING_PATTERNS.feature.test('f-TST-123-some-feature.md'));
        assert.ok(!NAMING_PATTERNS.feature.test('F-ACME-001-user-login.md')); // Uppercase F
        assert.ok(!NAMING_PATTERNS.feature.test('f-acme-001-test.md')); // lowercase prefix
    });

    test('feature-increment pattern should match valid filenames', () => {
        assert.ok(NAMING_PATTERNS['feature-increment'].test('fi-ACME-001-oauth.md'));
        assert.ok(!NAMING_PATTERNS['feature-increment'].test('FI-ACME-001-oauth.md'));
    });

    test('epic pattern should match valid filenames', () => {
        assert.ok(NAMING_PATTERNS.epic.test('epic-ACME-001-auth.md'));
        assert.ok(!NAMING_PATTERNS.epic.test('EPIC-001-auth.md'));
        assert.ok(!NAMING_PATTERNS.epic.test('epic-001-auth.md')); // Missing PRX
    });

    test('story pattern should match valid filenames', () => {
        assert.ok(NAMING_PATTERNS.story.test('s-e001-001-add-button.md'));
        assert.ok(NAMING_PATTERNS.story.test('s-e123-456-test.md'));
        assert.ok(!NAMING_PATTERNS.story.test('S-001-test.md')); // Missing epic link
        assert.ok(!NAMING_PATTERNS.story.test('s-001-test.md')); // Missing epic number
    });

    test('dev-plan pattern should match valid filenames', () => {
        assert.ok(NAMING_PATTERNS['dev-plan'].test('dp-e001-s001-implementation.md'));
        assert.ok(!NAMING_PATTERNS['dev-plan'].test('dp-001-implementation.md'));
    });

    test('project-test-case pattern should match valid filenames', () => {
        assert.ok(NAMING_PATTERNS['project-test-case'].test('tc-fi-ACME-001-oauth-tests.md'));
        assert.ok(!NAMING_PATTERNS['project-test-case'].test('tc-ACME-001-tests.md'));
    });

    test('regression-impact pattern should match valid filenames', () => {
        assert.ok(NAMING_PATTERNS['regression-impact'].test('ri-fi-ACME-001.md'));
        assert.ok(!NAMING_PATTERNS['regression-impact'].test('ri-fi-ACME-001-extra.md')); // Should be exact
    });
});

// =============================================================================
// Product Rules Tests (TS-PROD-*)
// =============================================================================

describe('TS-PROD-001: Product folder must be registered', () => {
    let tempDir;

    beforeEach(() => {
        tempDir = createTempDir();
    });

    afterEach(() => {
        cleanupTempDir(tempDir);
    });

    test('should pass when product is registered', () => {
        createValidProduct(tempDir, 'test-product', 'TST');
        const result = new LintResult();
        checkProductRegistered(tempDir, 'test-product', result);

        assert.strictEqual(result.errors.length, 0);
    });

    test('should fail when products-index.md missing', () => {
        const productDir = path.join(tempDir, 'products', 'test-product');
        fs.mkdirSync(productDir, { recursive: true });

        const result = new LintResult();
        checkProductRegistered(tempDir, 'test-product', result);

        // Warning for missing index (not error)
        assert.ok(result.warnings.some(w => w.rule === 'TS-PROD-001'));
    });
});

describe('TS-PROD-002: product.yml required with PRX', () => {
    let tempDir;

    beforeEach(() => {
        tempDir = createTempDir();
    });

    afterEach(() => {
        cleanupTempDir(tempDir);
    });

    test('should pass with valid product.yml', () => {
        const productDir = createValidProduct(tempDir, 'test-product', 'TST');
        const result = new LintResult();
        const config = checkProductYml(productDir, 'test-product', result);

        assert.strictEqual(result.errors.length, 0);
        assert.ok(config);
    });

    test('should fail when product.yml is missing', () => {
        const productDir = path.join(tempDir, 'products', 'test-product');
        fs.mkdirSync(productDir, { recursive: true });

        const result = new LintResult();
        checkProductYml(productDir, 'test-product', result);

        assert.ok(result.errors.some(e => e.message.includes('missing')));
    });

    test('should fail when prefix is missing', () => {
        const productDir = path.join(tempDir, 'products', 'test-product');
        fs.mkdirSync(productDir, { recursive: true });
        fs.writeFileSync(
            path.join(productDir, 'product.yml'),
            `product:
  id: "test-product"
  name: "Test"
  status: active
`,
            'utf-8'
        );

        const result = new LintResult();
        checkProductYml(productDir, 'test-product', result);

        assert.ok(result.errors.some(e => e.message.includes('prefix')));
    });

    test('should fail when PRX format is invalid', () => {
        const productDir = path.join(tempDir, 'products', 'test-product');
        fs.mkdirSync(productDir, { recursive: true });
        fs.writeFileSync(
            path.join(productDir, 'product.yml'),
            `product:
  id: "test-product"
  name: "Test"
  prefix: "lowercase"
  status: active
`,
            'utf-8'
        );

        const result = new LintResult();
        checkProductYml(productDir, 'test-product', result);

        assert.ok(result.errors.some(e => e.message.includes('does not match pattern')));
    });
});

// =============================================================================
// Project Rules Tests (TS-PROJ-*)
// =============================================================================

describe('TS-PROJ-002: project.yml required with minimum metadata', () => {
    let tempDir;

    beforeEach(() => {
        tempDir = createTempDir();
    });

    afterEach(() => {
        cleanupTempDir(tempDir);
    });

    test('should pass with valid project.yml', () => {
        const projectDir = createValidProject(tempDir, 'test-project', ['test-product']);
        const result = new LintResult();
        const config = checkProjectYml(projectDir, 'test-project', result);

        assert.strictEqual(result.errors.length, 0);
        assert.ok(config);
    });

    test('should fail when project.yml is missing', () => {
        const projectDir = path.join(tempDir, 'projects', 'test-project');
        fs.mkdirSync(projectDir, { recursive: true });

        const result = new LintResult();
        checkProjectYml(projectDir, 'test-project', result);

        assert.ok(result.errors.some(e => e.message.includes('missing')));
    });

    test('should fail when status is missing', () => {
        const projectDir = path.join(tempDir, 'projects', 'test-project');
        fs.mkdirSync(projectDir, { recursive: true });
        fs.writeFileSync(
            path.join(projectDir, 'project.yml'),
            `project:
  id: "test-project"
  name: "Test"
`,
            'utf-8'
        );

        const result = new LintResult();
        checkProjectYml(projectDir, 'test-project', result);

        assert.ok(result.errors.some(e => e.message.includes('status')));
    });
});

// =============================================================================
// Feature-Increment Rules Tests (TS-FI-*)
// =============================================================================

describe('TS-FI-001: Feature-Increment must have AS-IS and TO-BE sections', () => {
    let tempDir;

    beforeEach(() => {
        tempDir = createTempDir();
    });

    afterEach(() => {
        cleanupTempDir(tempDir);
    });

    test('should pass with valid FI content', () => {
        const fiDir = path.join(tempDir, 'feature-increments');
        fs.mkdirSync(fiDir, { recursive: true });

        const fiPath = path.join(fiDir, 'fi-TST-001-test.md');
        fs.writeFileSync(fiPath, `# Feature Increment

## AS-IS
Current behavior.

## TO-BE
New behavior.
`, 'utf-8');

        const result = new LintResult();
        checkFIContent(fiPath, result);

        assert.strictEqual(result.errors.length, 0);
    });

    test('should pass with numbered sections', () => {
        const fiDir = path.join(tempDir, 'feature-increments');
        fs.mkdirSync(fiDir, { recursive: true });

        const fiPath = path.join(fiDir, 'fi-TST-001-test.md');
        fs.writeFileSync(fiPath, `# Feature Increment

## 2. AS-IS (Current State)
Current behavior.

## 3. TO-BE (Proposed State)
New behavior.
`, 'utf-8');

        const result = new LintResult();
        checkFIContent(fiPath, result);

        assert.strictEqual(result.errors.length, 0);
    });

    test('should fail when AS-IS is missing', () => {
        const fiDir = path.join(tempDir, 'feature-increments');
        fs.mkdirSync(fiDir, { recursive: true });

        const fiPath = path.join(fiDir, 'fi-TST-001-test.md');
        fs.writeFileSync(fiPath, `# Feature Increment

## TO-BE
New behavior.
`, 'utf-8');

        const result = new LintResult();
        checkFIContent(fiPath, result);

        assert.ok(result.errors.some(e => e.message.includes('AS-IS')));
    });

    test('should fail when TO-BE is missing', () => {
        const fiDir = path.join(tempDir, 'feature-increments');
        fs.mkdirSync(fiDir, { recursive: true });

        const fiPath = path.join(fiDir, 'fi-TST-001-test.md');
        fs.writeFileSync(fiPath, `# Feature Increment

## AS-IS
Current behavior.
`, 'utf-8');

        const result = new LintResult();
        checkFIContent(fiPath, result);

        assert.ok(result.errors.some(e => e.message.includes('TO-BE')));
    });
});

describe('TS-FI-002: Feature-Increment must link to target Feature', () => {
    let tempDir;

    beforeEach(() => {
        tempDir = createTempDir();
    });

    afterEach(() => {
        cleanupTempDir(tempDir);
    });

    test('should pass when FI references existing feature', () => {
        // Create product with feature
        createValidProduct(tempDir, 'test-product', 'TST');
        const featuresDir = path.join(tempDir, 'products', 'test-product', 'features');
        fs.writeFileSync(path.join(featuresDir, 'f-TST-001-test-feature.md'), '# Feature\n', 'utf-8');

        // Create FI
        const fiDir = path.join(tempDir, 'feature-increments');
        fs.mkdirSync(fiDir, { recursive: true });
        const fiPath = path.join(fiDir, 'fi-TST-001-test.md');
        fs.writeFileSync(fiPath, `# Feature Increment

Target Feature: f-TST-001

## AS-IS
Current behavior.

## TO-BE
New behavior.
`, 'utf-8');

        const result = new LintResult();
        checkFIFeatureLink(fiPath, tempDir, result);

        assert.strictEqual(result.errors.length, 0);
    });

    test('should fail when FI has no feature reference', () => {
        const fiDir = path.join(tempDir, 'feature-increments');
        fs.mkdirSync(fiDir, { recursive: true });
        const fiPath = path.join(fiDir, 'fi-TST-001-test.md');
        fs.writeFileSync(fiPath, `# Feature Increment

No feature reference here.

## AS-IS
Current behavior.

## TO-BE
New behavior.
`, 'utf-8');

        const result = new LintResult();
        checkFIFeatureLink(fiPath, tempDir, result);

        assert.ok(result.errors.some(e => e.message.includes('does not reference')));
    });
});

// =============================================================================
// Epic Rules Tests (TS-EPIC-*)
// =============================================================================

describe('TS-EPIC-001: Epic file naming convention', () => {
    let tempDir;

    beforeEach(() => {
        tempDir = createTempDir();
    });

    afterEach(() => {
        cleanupTempDir(tempDir);
    });

    test('should pass with valid epic naming', () => {
        const epicDir = path.join(tempDir, 'epics');
        fs.mkdirSync(epicDir, { recursive: true });
        const epicPath = path.join(epicDir, 'epic-TST-001-test.md');
        fs.writeFileSync(epicPath, '# Epic\n', 'utf-8');

        const result = new LintResult();
        checkEpicNaming(epicPath, result);

        assert.strictEqual(result.errors.length, 0);
    });

    test('should fail with uppercase EPIC', () => {
        const epicDir = path.join(tempDir, 'epics');
        fs.mkdirSync(epicDir, { recursive: true });
        const epicPath = path.join(epicDir, 'EPIC-001-test.md');
        fs.writeFileSync(epicPath, '# Epic\n', 'utf-8');

        const result = new LintResult();
        checkEpicNaming(epicPath, result);

        assert.ok(result.errors.some(e => e.rule === 'TS-EPIC-001'));
    });

    test('should fail without PRX in name', () => {
        const epicDir = path.join(tempDir, 'epics');
        fs.mkdirSync(epicDir, { recursive: true });
        const epicPath = path.join(epicDir, 'epic-001-test.md');
        fs.writeFileSync(epicPath, '# Epic\n', 'utf-8');

        const result = new LintResult();
        checkEpicNaming(epicPath, result);

        assert.ok(result.errors.some(e => e.rule === 'TS-EPIC-001'));
    });
});

// =============================================================================
// Story Rules Tests (TS-STORY-*)
// =============================================================================

describe('TS-STORY-001: Story must link to Epic via filename', () => {
    let tempDir;

    beforeEach(() => {
        tempDir = createTempDir();
    });

    afterEach(() => {
        cleanupTempDir(tempDir);
    });

    test('should pass with valid story naming linking to existing epic', () => {
        const projectDir = createValidProject(tempDir, 'test-project');

        // Create epic
        fs.writeFileSync(
            path.join(projectDir, 'epics', 'epic-TST-001-test.md'),
            '# Epic\n',
            'utf-8'
        );

        // Create story
        const storyPath = path.join(projectDir, 'stories', 'backlog', 's-e001-001-test.md');
        fs.writeFileSync(storyPath, '# Story\n', 'utf-8');

        const result = new LintResult();
        checkStoryEpicLink(storyPath, projectDir, result);

        assert.strictEqual(result.errors.length, 0);
    });

    test('should fail with invalid story naming', () => {
        const projectDir = createValidProject(tempDir, 'test-project');

        const storyPath = path.join(projectDir, 'stories', 'backlog', 'S-001-test.md');
        fs.writeFileSync(storyPath, '# Story\n', 'utf-8');

        const result = new LintResult();
        checkStoryEpicLink(storyPath, projectDir, result);

        assert.ok(result.errors.some(e => e.rule === 'TS-STORY-001'));
    });

    test('should fail when epic does not exist', () => {
        const projectDir = createValidProject(tempDir, 'test-project');

        const storyPath = path.join(projectDir, 'stories', 'backlog', 's-e999-001-test.md');
        fs.writeFileSync(storyPath, '# Story\n', 'utf-8');

        const result = new LintResult();
        checkStoryEpicLink(storyPath, projectDir, result);

        assert.ok(result.errors.some(e => e.message.includes('non-existent epic')));
    });
});

describe('TS-STORY-002: Story describes delta, not full behavior', () => {
    let tempDir;

    beforeEach(() => {
        tempDir = createTempDir();
    });

    afterEach(() => {
        cleanupTempDir(tempDir);
    });

    test('should pass with delta language', () => {
        const storyDir = path.join(tempDir, 'stories');
        fs.mkdirSync(storyDir, { recursive: true });
        const storyPath = path.join(storyDir, 's-e001-001-test.md');
        fs.writeFileSync(storyPath, `# Story

This story adds OAuth login capability.
`, 'utf-8');

        const result = new LintResult();
        checkStoryDelta(storyPath, result);

        assert.strictEqual(result.warnings.length, 0);
    });

    test('should pass with FI reference', () => {
        const storyDir = path.join(tempDir, 'stories');
        fs.mkdirSync(storyDir, { recursive: true });
        const storyPath = path.join(storyDir, 's-e001-001-test.md');
        fs.writeFileSync(storyPath, `# Story

Implements fi-TST-001-oauth-login.
`, 'utf-8');

        const result = new LintResult();
        checkStoryDelta(storyPath, result);

        assert.strictEqual(result.warnings.length, 0);
    });

    test('should warn without delta language or FI reference', () => {
        const storyDir = path.join(tempDir, 'stories');
        fs.mkdirSync(storyDir, { recursive: true });
        const storyPath = path.join(storyDir, 's-e001-001-test.md');
        fs.writeFileSync(storyPath, `# Story

The system should display a login page.
`, 'utf-8');

        const result = new LintResult();
        checkStoryDelta(storyPath, result);

        assert.ok(result.warnings.some(w => w.rule === 'TS-STORY-002'));
    });
});

// =============================================================================
// DoD Rules Tests (TS-DOD-*)
// =============================================================================

describe('TS-DOD-001: Story must have all AC verified', () => {
    let tempDir;

    beforeEach(() => {
        tempDir = createTempDir();
    });

    afterEach(() => {
        cleanupTempDir(tempDir);
    });

    test('should pass when all AC are verified', () => {
        const storyPath = path.join(tempDir, 's-e001-001-test.md');
        fs.writeFileSync(storyPath, `# Story

## Acceptance Criteria
- [x] AC-1: Login button displayed
- [x] AC-2: OAuth redirect works
`, 'utf-8');

        const result = new LintResult();
        checkDoneStoryAC(storyPath, result);

        assert.strictEqual(result.errors.length, 0);
    });

    test('should fail when AC are not verified', () => {
        const storyPath = path.join(tempDir, 's-e001-001-test.md');
        fs.writeFileSync(storyPath, `# Story

## Acceptance Criteria
- [x] AC-1: Login button displayed
- [ ] AC-2: OAuth redirect works
`, 'utf-8');

        const result = new LintResult();
        checkDoneStoryAC(storyPath, result);

        assert.ok(result.errors.some(e => e.rule === 'TS-DOD-001'));
    });
});

describe('TS-DOD-003: Product sync after deployment', () => {
    let tempDir;

    beforeEach(() => {
        tempDir = createTempDir();
    });

    afterEach(() => {
        cleanupTempDir(tempDir);
    });

    test('should pass when not deployed', () => {
        const projectDir = path.join(tempDir, 'projects', 'test');
        fs.mkdirSync(projectDir, { recursive: true });

        const result = new LintResult();
        checkCanonSync({ status: 'active' }, projectDir, result);

        assert.strictEqual(result.errors.length, 0);
    });

    test('should fail when deployed but not synced', () => {
        const projectDir = path.join(tempDir, 'projects', 'test');
        fs.mkdirSync(projectDir, { recursive: true });

        const result = new LintResult();
        checkCanonSync({ deployed_date: '2024-01-01' }, projectDir, result);

        assert.ok(result.errors.some(e => e.rule === 'TS-DOD-003'));
        assert.ok(result.errors.some(e => e.severity === SEVERITY.BLOCKER));
    });

    test('should pass when deployed and synced', () => {
        const projectDir = path.join(tempDir, 'projects', 'test');
        fs.mkdirSync(projectDir, { recursive: true });

        const result = new LintResult();
        checkCanonSync({ deployed_date: '2024-01-01', canon_synced: '2024-01-01' }, projectDir, result);

        assert.strictEqual(result.errors.length, 0);
    });
});

// =============================================================================
// Full Integration Tests with Fixtures
// =============================================================================

describe('Integration: Valid Fixture', () => {
    test('should pass lint on valid-4.0 fixture', () => {
        // Skip if fixture doesn't exist
        if (!fs.existsSync(VALID_FIXTURE)) {
            console.log('Skipping: valid-4.0 fixture not found');
            return;
        }

        const result = lint(VALID_FIXTURE);
        const summary = result.getSummary();

        // Valid fixture should have no errors (warnings may exist)
        assert.strictEqual(summary.errors, 0, `Expected 0 errors but got ${summary.errors}: ${JSON.stringify(result.errors)}`);
    });
});

describe('Integration: Broken Fixture', () => {
    test('should find errors in broken-4.0 fixture', () => {
        // Skip if fixture doesn't exist
        if (!fs.existsSync(BROKEN_FIXTURE)) {
            console.log('Skipping: broken-4.0 fixture not found');
            return;
        }

        const result = lint(BROKEN_FIXTURE);
        const summary = result.getSummary();

        // Broken fixture should have errors
        assert.ok(summary.errors > 0, 'Expected errors in broken fixture');

        // Check specific expected errors
        const rules = result.errors.map(e => e.rule);

        // Should catch missing prefix (TS-PROD-002)
        assert.ok(rules.includes('TS-PROD-002') || result.errors.some(e => e.message.includes('prefix')),
            'Should catch missing prefix');
    });

    test('should catch wrong naming conventions', () => {
        if (!fs.existsSync(BROKEN_FIXTURE)) {
            console.log('Skipping: broken-4.0 fixture not found');
            return;
        }

        const result = lint(BROKEN_FIXTURE);

        // Should catch naming issues
        const namingErrors = result.errors.filter(e =>
            e.rule.startsWith('TS-NAMING') ||
            e.message.includes('naming convention')
        );

        assert.ok(namingErrors.length > 0, 'Should catch naming convention errors');
    });
});

// =============================================================================
// Format Results Tests
// =============================================================================

describe('formatResults', () => {
    test('should format empty results', () => {
        const result = new LintResult();
        const formatted = formatResults(result);

        assert.ok(formatted.includes('No lint errors'));
    });

    test('should format errors with file grouping', () => {
        const result = new LintResult();
        result.add('TS-TEST-1', 'Error 1', '/path/to/file.md', SEVERITY.ERROR);
        result.add('TS-TEST-2', 'Error 2', '/path/to/file.md', SEVERITY.ERROR);

        const formatted = formatResults(result);

        assert.ok(formatted.includes('/path/to/file.md'));
        assert.ok(formatted.includes('TS-TEST-1'));
        assert.ok(formatted.includes('TS-TEST-2'));
    });

    test('should show blocker message when blockers exist', () => {
        const result = new LintResult();
        result.add('TS-DOD-003', 'Blocker', '/file.md', SEVERITY.BLOCKER);

        const formatted = formatResults(result);

        assert.ok(formatted.includes('BLOCKERS'));
    });
});
