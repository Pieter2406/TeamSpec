/**
 * TeamSpec Prompt Generator Tests
 * Test-driven implementation of prompt generation functionality
 * 
 * Tests validate that prompts are generated correctly from registry.yml
 * 
 * Commands tested match registry.yml:
 * - PO: product, project, sync, status
 * - BA: analysis, ba-increment, review
 * - FA: feature, feature-increment, epic, story, sync-proposal, slice
 * - SA: ta, ta-increment, sd, sd-increment, review
 * - DEV: plan, implement
 * - QA: test, verify, regression, bug, uat
 * - SM: sprint, deploy-checklist, planning, standup, retro, sync
 */

const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Import prompt generator module
const { generateAllPrompts, COMMANDS, ROLES } = require('../lib/prompt-generator');

// =============================================================================
// Test Fixtures & Helpers
// =============================================================================

function createTempDir() {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'teamspec-prompt-test-'));
    return tempDir;
}

function cleanupTempDir(tempDir) {
    if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
}

function parsePromptFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

    if (!frontmatterMatch) {
        return { frontmatter: null, body: content };
    }

    const frontmatterLines = frontmatterMatch[1].split('\n');
    const frontmatter = {};

    for (const line of frontmatterLines) {
        const match = line.match(/^(\w+):\s*"?([^"]*)"?$/);
        if (match) {
            frontmatter[match[1]] = match[2];
        }
    }

    const body = content.slice(frontmatterMatch[0].length).trim();

    return { frontmatter, body };
}

function getGeneratedFiles(tempDir) {
    const promptsDir = path.join(tempDir, '.github', 'prompts');
    if (!fs.existsSync(promptsDir)) return [];
    return fs.readdirSync(promptsDir);
}

// =============================================================================
// ROLES Structure Tests
// =============================================================================

describe('ROLES Structure', () => {
    test('ROLES has all expected role keys', () => {
        const expectedRoles = ['PO', 'BA', 'FA', 'SA', 'DEV', 'QA', 'SM', 'DES'];
        for (const role of expectedRoles) {
            assert.ok(ROLES[role], `ROLES should have ${role}`);
        }
    });

    test('each role has required properties', () => {
        for (const [key, role] of Object.entries(ROLES)) {
            assert.ok(role.name, `${key} should have name`);
            assert.ok(role.agent, `${key} should have agent`);
        }
    });
});

// =============================================================================
// COMMANDS Structure Tests (legacy format for backwards compatibility)
// =============================================================================

describe('COMMANDS Structure', () => {
    test('COMMANDS has all role categories', () => {
        const expectedCategories = ['ba', 'fa', 'po', 'sa', 'dev', 'qa', 'sm', 'utility'];
        for (const cat of expectedCategories) {
            assert.ok(COMMANDS[cat], `COMMANDS should have ${cat}`);
            assert.ok(COMMANDS[cat].name, `${cat} should have name`);
            assert.ok(Array.isArray(COMMANDS[cat].commands), `${cat} should have commands array`);
        }
    });

    test('BA has correct commands per registry.yml', () => {
        const baCommands = COMMANDS.ba.commands.map(c => c.name);
        assert.ok(baCommands.includes('analysis'), 'BA should have analysis');
        assert.ok(baCommands.includes('ba-increment'), 'BA should have ba-increment');
        assert.ok(baCommands.includes('review'), 'BA should have review');
        assert.strictEqual(COMMANDS.ba.commands.length, 3, 'BA should have exactly 3 commands');
    });

    test('FA has correct commands per registry.yml', () => {
        const faCommands = COMMANDS.fa.commands.map(c => c.name);
        assert.ok(faCommands.includes('feature'), 'FA should have feature');
        assert.ok(faCommands.includes('feature-increment'), 'FA should have feature-increment');
        assert.ok(faCommands.includes('epic'), 'FA should have epic');
        assert.ok(faCommands.includes('story'), 'FA should have story');
        assert.ok(faCommands.includes('slice'), 'FA should have slice');
    });

    test('PO has correct commands per registry.yml', () => {
        const poCommands = COMMANDS.po.commands.map(c => c.name);
        assert.ok(poCommands.includes('product'), 'PO should have product');
        assert.ok(poCommands.includes('project'), 'PO should have project');
        assert.ok(poCommands.includes('sync'), 'PO should have sync');
        assert.ok(poCommands.includes('status'), 'PO should have status');
    });

    test('utility has lint and fix commands', () => {
        const utilCommands = COMMANDS.utility.commands.map(c => c.name);
        assert.ok(utilCommands.includes('lint'), 'Utility should have lint');
        assert.ok(utilCommands.includes('fix'), 'Utility should have fix');
    });
});

// =============================================================================
// Prompt Generation Tests
// =============================================================================

describe('Prompt Generation', () => {
    let tempDir;

    beforeEach(() => {
        tempDir = createTempDir();
    });

    afterEach(() => {
        cleanupTempDir(tempDir);
    });

    test('generates prompt files', () => {
        const files = generateAllPrompts(tempDir);
        assert.ok(files.length > 0, 'Should generate prompt files');
    });

    test('creates .github/prompts directory', () => {
        generateAllPrompts(tempDir);
        const promptsDir = path.join(tempDir, '.github', 'prompts');
        assert.ok(fs.existsSync(promptsDir), 'Should create .github/prompts/');
    });

    test('generates README.md', () => {
        generateAllPrompts(tempDir);
        const readmePath = path.join(tempDir, '.github', 'prompts', 'README.md');
        assert.ok(fs.existsSync(readmePath), 'Should generate README.md');
    });
});

// =============================================================================
// BA Command Prompts (TeamSpec 4.0)
// =============================================================================

describe('BA Command Prompts', () => {
    let tempDir;

    beforeEach(() => {
        tempDir = createTempDir();
        generateAllPrompts(tempDir);
    });

    afterEach(() => {
        cleanupTempDir(tempDir);
    });

    test('ba-analysis prompt is generated', () => {
        const promptPath = path.join(tempDir, '.github', 'prompts', 'ba-analysis.prompt.md');
        assert.ok(fs.existsSync(promptPath), 'ba-analysis.prompt.md should exist');
    });

    test('ba-ba-increment prompt is generated', () => {
        const promptPath = path.join(tempDir, '.github', 'prompts', 'ba-ba-increment.prompt.md');
        assert.ok(fs.existsSync(promptPath), 'ba-ba-increment.prompt.md should exist');
    });

    test('ba-review prompt is generated', () => {
        const promptPath = path.join(tempDir, '.github', 'prompts', 'ba-review.prompt.md');
        assert.ok(fs.existsSync(promptPath), 'ba-review.prompt.md should exist');
    });
});

// =============================================================================
// FA Command Prompts
// =============================================================================

describe('FA Command Prompts', () => {
    let tempDir;

    beforeEach(() => {
        tempDir = createTempDir();
        generateAllPrompts(tempDir);
    });

    afterEach(() => {
        cleanupTempDir(tempDir);
    });

    test('fa-feature prompt is generated', () => {
        const promptPath = path.join(tempDir, '.github', 'prompts', 'fa-feature.prompt.md');
        assert.ok(fs.existsSync(promptPath), 'fa-feature.prompt.md should exist');
    });

    test('fa-feature-increment prompt is generated', () => {
        const promptPath = path.join(tempDir, '.github', 'prompts', 'fa-feature-increment.prompt.md');
        assert.ok(fs.existsSync(promptPath), 'fa-feature-increment.prompt.md should exist');
    });

    test('fa-epic prompt is generated', () => {
        const promptPath = path.join(tempDir, '.github', 'prompts', 'fa-epic.prompt.md');
        assert.ok(fs.existsSync(promptPath), 'fa-epic.prompt.md should exist');
    });

    test('fa-story prompt is generated', () => {
        const promptPath = path.join(tempDir, '.github', 'prompts', 'fa-story.prompt.md');
        assert.ok(fs.existsSync(promptPath), 'fa-story.prompt.md should exist');
    });
});

// =============================================================================
// PO Command Prompts
// =============================================================================

describe('PO Command Prompts', () => {
    let tempDir;

    beforeEach(() => {
        tempDir = createTempDir();
        generateAllPrompts(tempDir);
    });

    afterEach(() => {
        cleanupTempDir(tempDir);
    });

    test('po-product prompt is generated', () => {
        const promptPath = path.join(tempDir, '.github', 'prompts', 'po-product.prompt.md');
        assert.ok(fs.existsSync(promptPath), 'po-product.prompt.md should exist');
    });

    test('po-project prompt is generated', () => {
        const promptPath = path.join(tempDir, '.github', 'prompts', 'po-project.prompt.md');
        assert.ok(fs.existsSync(promptPath), 'po-project.prompt.md should exist');
    });

    test('po-sync prompt is generated', () => {
        const promptPath = path.join(tempDir, '.github', 'prompts', 'po-sync.prompt.md');
        assert.ok(fs.existsSync(promptPath), 'po-sync.prompt.md should exist');
    });

    test('po-status prompt is generated', () => {
        const promptPath = path.join(tempDir, '.github', 'prompts', 'po-status.prompt.md');
        assert.ok(fs.existsSync(promptPath), 'po-status.prompt.md should exist');
    });
});

// =============================================================================
// QA Command Prompts
// =============================================================================

describe('QA Command Prompts', () => {
    let tempDir;

    beforeEach(() => {
        tempDir = createTempDir();
        generateAllPrompts(tempDir);
    });

    afterEach(() => {
        cleanupTempDir(tempDir);
    });

    test('qa-test prompt is generated', () => {
        const promptPath = path.join(tempDir, '.github', 'prompts', 'qa-test.prompt.md');
        assert.ok(fs.existsSync(promptPath), 'qa-test.prompt.md should exist');
    });

    test('qa-regression prompt is generated', () => {
        const promptPath = path.join(tempDir, '.github', 'prompts', 'qa-regression.prompt.md');
        assert.ok(fs.existsSync(promptPath), 'qa-regression.prompt.md should exist');
    });

    test('qa-bug prompt is generated', () => {
        const promptPath = path.join(tempDir, '.github', 'prompts', 'qa-bug.prompt.md');
        assert.ok(fs.existsSync(promptPath), 'qa-bug.prompt.md should exist');
    });
});

// =============================================================================
// SM Command Prompts
// =============================================================================

describe('SM Command Prompts', () => {
    let tempDir;

    beforeEach(() => {
        tempDir = createTempDir();
        generateAllPrompts(tempDir);
    });

    afterEach(() => {
        cleanupTempDir(tempDir);
    });

    test('sm-sprint prompt is generated', () => {
        const promptPath = path.join(tempDir, '.github', 'prompts', 'sm-sprint.prompt.md');
        assert.ok(fs.existsSync(promptPath), 'sm-sprint.prompt.md should exist');
    });

    test('sm-deploy-checklist prompt is generated', () => {
        const promptPath = path.join(tempDir, '.github', 'prompts', 'sm-deploy-checklist.prompt.md');
        assert.ok(fs.existsSync(promptPath), 'sm-deploy-checklist.prompt.md should exist');
    });
});

// =============================================================================
// Frontmatter Format Tests
// =============================================================================

describe('Frontmatter Format', () => {
    let tempDir;

    beforeEach(() => {
        tempDir = createTempDir();
        generateAllPrompts(tempDir);
    });

    afterEach(() => {
        cleanupTempDir(tempDir);
    });

    test('prompts have valid frontmatter', () => {
        const files = getGeneratedFiles(tempDir);
        const promptFiles = files.filter(f => f.endsWith('.prompt.md'));

        assert.ok(promptFiles.length > 0, 'Should have prompt files');

        for (const file of promptFiles) {
            const filePath = path.join(tempDir, '.github', 'prompts', file);
            const { frontmatter } = parsePromptFile(filePath);

            assert.ok(frontmatter, `${file} should have frontmatter`);
            assert.ok(frontmatter.name, `${file} should have name in frontmatter`);
            assert.ok(frontmatter.name.startsWith('ts:'), `${file} name should start with ts:`);
        }
    });

    test('prompts have description in frontmatter', () => {
        const promptPath = path.join(tempDir, '.github', 'prompts', 'ba-analysis.prompt.md');
        const { frontmatter } = parsePromptFile(promptPath);

        assert.ok(frontmatter.description, 'Should have description');
        assert.ok(frontmatter.description.includes('Business Analyst'), 'Should reference Business Analyst');
    });

    test('prompts reference agent files', () => {
        const promptPath = path.join(tempDir, '.github', 'prompts', 'fa-story.prompt.md');
        const { body } = parsePromptFile(promptPath);

        assert.ok(body.includes('AGENT_FA.md'), 'Should reference agent file');
    });
});

// =============================================================================
// README Tests
// =============================================================================

describe('README Generation', () => {
    let tempDir;

    beforeEach(() => {
        tempDir = createTempDir();
        generateAllPrompts(tempDir);
    });

    afterEach(() => {
        cleanupTempDir(tempDir);
    });

    test('README contains usage instructions', () => {
        const readmePath = path.join(tempDir, '.github', 'prompts', 'README.md');
        const content = fs.readFileSync(readmePath, 'utf-8');

        assert.ok(content.includes('Usage'), 'Should have usage section');
        assert.ok(content.includes('Copilot Chat'), 'Should mention Copilot Chat');
    });

    test('README lists available commands', () => {
        const readmePath = path.join(tempDir, '.github', 'prompts', 'README.md');
        const content = fs.readFileSync(readmePath, 'utf-8');

        assert.ok(content.includes('Available Commands'), 'Should list available commands');
        assert.ok(content.includes('ts:'), 'Should include ts: prefixed commands');
    });

    test('README has command reference table', () => {
        const readmePath = path.join(tempDir, '.github', 'prompts', 'README.md');
        const content = fs.readFileSync(readmePath, 'utf-8');

        assert.ok(content.includes('Command Reference'), 'Should have command reference');
        assert.ok(content.includes('| Command |'), 'Should have command table');
    });
});

// =============================================================================
// Integration Tests
// =============================================================================

describe('Integration', () => {
    let tempDir;

    beforeEach(() => {
        tempDir = createTempDir();
    });

    afterEach(() => {
        cleanupTempDir(tempDir);
    });

    test('all roles generate at least one prompt', () => {
        generateAllPrompts(tempDir);
        const files = getGeneratedFiles(tempDir);
        const promptFiles = files.filter(f => f.endsWith('.prompt.md'));

        // Check each role has prompts
        const rolesPrefixes = ['ba-', 'fa-', 'po-', 'sa-', 'dev-', 'qa-', 'sm-'];
        for (const prefix of rolesPrefixes) {
            const hasPrompt = promptFiles.some(f => f.startsWith(prefix));
            assert.ok(hasPrompt, `Should have prompts for ${prefix.replace('-', '').toUpperCase()}`);
        }
    });

    test('generates expected number of prompts', () => {
        generateAllPrompts(tempDir);
        const files = getGeneratedFiles(tempDir);
        const promptFiles = files.filter(f => f.endsWith('.prompt.md'));

        // Should have at least 20 prompts (PO: 4, BA: 3, FA: 6, SA: 5, DEV: 2, QA: 5, SM: 6)
        assert.ok(promptFiles.length >= 20, `Should have at least 20 prompts, got ${promptFiles.length}`);
    });
});
