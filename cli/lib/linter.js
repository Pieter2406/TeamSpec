/**
 * TeamSpec Linter
 * 
 * Validates project artifacts against TeamSpec 4.0 rules.
 * Rules are defined in spec/4.0/lint-rules.md and registry.yml
 * 
 * Version: 4.0
 */

const fs = require('fs');
const path = require('path');
const { loadRegistry, loadFolderStructure, getArtifactPatterns, getArtifactNamingRegex } = require('./structure-loader');

// =============================================================================
// SEVERITY LEVELS
// =============================================================================

const SEVERITY = {
    BLOCKER: 'blocker',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

// =============================================================================
// LINT RESULT
// =============================================================================

class LintResult {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.info = [];
    }

    add(rule, message, file, severity = SEVERITY.ERROR) {
        const result = { rule, message, file, severity };

        switch (severity) {
            case SEVERITY.BLOCKER:
            case SEVERITY.ERROR:
                this.errors.push(result);
                break;
            case SEVERITY.WARNING:
                this.warnings.push(result);
                break;
            case SEVERITY.INFO:
                this.info.push(result);
                break;
        }
    }

    hasErrors() {
        return this.errors.length > 0;
    }

    hasBlockers() {
        return this.errors.some(e => e.severity === SEVERITY.BLOCKER);
    }

    getAll() {
        return [...this.errors, ...this.warnings, ...this.info];
    }

    getSummary() {
        return {
            errors: this.errors.length,
            warnings: this.warnings.length,
            info: this.info.length,
            total: this.getAll().length,
            passed: !this.hasErrors()
        };
    }
}

// =============================================================================
// YAML PARSER (Simple)
// =============================================================================

function parseYamlSimple(content) {
    const result = {};
    const lines = content.split('\n');

    for (const line of lines) {
        if (!line.trim() || line.trim().startsWith('#')) continue;

        const match = line.match(/^\s*(\w+[\w.-]*):\s*(.*)$/);
        if (match) {
            let [, key, value] = match;
            value = value.trim().replace(/^["']|["']$/g, '');

            // Handle nested keys
            if (key.includes('.')) {
                const parts = key.split('.');
                let obj = result;
                for (let i = 0; i < parts.length - 1; i++) {
                    if (!obj[parts[i]]) obj[parts[i]] = {};
                    obj = obj[parts[i]];
                }
                obj[parts[parts.length - 1]] = value;
            } else {
                result[key] = value;
            }
        }
    }

    return result;
}

/**
 * Parse YAML frontmatter from markdown files
 */
function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return {};
    return parseYamlSimple(match[1]);
}

/**
 * Parse product.yml or project.yml
 */
function parseConfigYaml(filePath) {
    if (!fs.existsSync(filePath)) return null;

    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const result = {};
        const lines = content.split('\n');
        let currentSection = null;
        let inArray = false;
        let arrayKey = null;

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;

            // Handle array items
            if (trimmed.startsWith('- ')) {
                if (arrayKey && result[arrayKey]) {
                    result[arrayKey].push(trimmed.slice(2).trim());
                }
                continue;
            }

            const colonIdx = trimmed.indexOf(':');
            if (colonIdx === -1) continue;

            const key = trimmed.slice(0, colonIdx).trim();
            let value = trimmed.slice(colonIdx + 1).trim();

            // Handle section headers (product:, project:)
            if (value === '' || value === '|') {
                currentSection = key;
                continue;
            }

            // Handle arrays
            if (value === '[]') {
                result[key] = [];
                arrayKey = key;
                continue;
            }

            // Clean quoted values
            value = value.replace(/^["']|["']$/g, '');

            result[key] = value;
        }

        return result;
    } catch (err) {
        return null;
    }
}

// =============================================================================
// NAMING PATTERN VALIDATION
// =============================================================================

// =============================================================================
// MARKER VOCABULARY - Controlled Values (from spec/4.0/marker-vocabulary.md)
// =============================================================================

const MARKER_VOCABULARY = {
    // artifact_kind controlled vocabulary
    artifactKinds: new Set([
        'feature', 'fi', 'story', 'epic', 'ba', 'bai', 'ta', 'tai', 'sd', 'sdi',
        'decision', 'tc', 'rt', 'ri', 'bug', 'devplan', 'sprint', 'uat',
        'refinement-notes', 'functional-spec', 'storymap', 'sprint-goal',
        'active-sprint', 'sprints-index'
    ]),

    // role_owner controlled vocabulary
    roleOwners: new Set(['FA', 'BA', 'PO', 'SA', 'DEV', 'QA', 'SM', 'DES']),

    // Required frontmatter fields
    requiredFrontmatter: ['artifact_kind', 'spec_version', 'role_owner'],

    // Recommended frontmatter fields
    recommendedFrontmatter: ['keywords'],

    // Required sections (universal)
    requiredSections: ['## Purpose', '## Links']
};

// Cache for naming patterns loaded from registry
let _namingPatterns = null;
let _registry = null;

// Fallback hardcoded patterns (used when registry unavailable)
const FALLBACK_PATTERNS = {
    'feature': /^f-[A-Z]{3,4}-\d{3}-[\w-]+\.md$/,
    'business-analysis': /^ba-[A-Z]{3,4}-\d{3}-[\w-]+\.md$/,
    'solution-design': /^sd-[A-Z]{3,4}-\d{3}-[\w-]+\.md$/,
    'technical-architecture': /^ta-[A-Z]{3,4}-\d{3}-[\w-]+\.md$/,
    'product-decision': /^dec-[A-Z]{3,4}-\d{3}-[\w-]+\.md$/,
    'product-regression-test': /^rt-f-[A-Z]{3,4}-\d{3}-[\w-]+\.md$/,
    'feature-increment': /^fi-[A-Z]{3,4}-\d{3}-[\w-]+\.md$/,
    'epic': /^epic-[A-Z]{3,4}-\d{3}-[\w-]+\.md$/,
    'story': /^s-e\d{3}-\d{3}-[\w-]+\.md$/,
    'dev-plan': /^dp-e\d{3}-s\d{3}-[\w-]+\.md$/,
    'project-test-case': /^tc-fi-[A-Z]{3,4}-\d{3}-[\w-]+\.md$/,
    'ba-increment': /^bai-[A-Z]{3,4}-\d{3}-[\w-]+\.md$/,
    'sd-increment': /^sdi-[A-Z]{3,4}-\d{3}-[\w-]+\.md$/,
    'ta-increment': /^tai-[A-Z]{3,4}-\d{3}-[\w-]+\.md$/,
    'bug-report': /^bug-[\w-]+-\d{3}-[\w-]+\.md$/,
    'regression-impact': /^ri-fi-[A-Z]{3,4}-\d{3}\.md$/
};

/**
 * Get naming patterns from registry (cached)
 * Falls back to hardcoded patterns if registry unavailable
 */
function getNamingPatterns(workspaceDir) {
    // Return fallback patterns if no workspace
    if (!workspaceDir) {
        return FALLBACK_PATTERNS;
    }

    if (_namingPatterns && _registry) {
        return _namingPatterns;
    }

    // Try to load from registry
    try {
        const registry = loadRegistry(workspaceDir);
        if (registry?.artifacts) {
            _registry = registry;
            _namingPatterns = getArtifactNamingRegex(registry);

            // Fill in any missing patterns from fallback
            for (const key of Object.keys(FALLBACK_PATTERNS)) {
                if (!_namingPatterns[key]) {
                    _namingPatterns[key] = FALLBACK_PATTERNS[key];
                }
            }
            return _namingPatterns;
        }
    } catch (err) {
        // Fall through to fallback
    }

    // Fallback to hardcoded patterns if registry not available
    return FALLBACK_PATTERNS;
}

/**
 * Reset cached patterns (for testing)
 */
function resetNamingPatterns() {
    _namingPatterns = null;
    _registry = null;
}

// =============================================================================
// MARKER VOCABULARY RULES (MV-*)
// =============================================================================

/**
 * MV-001: artifact_kind present and valid
 */
function checkArtifactKind(filePath, frontmatter, result) {
    const filename = path.basename(filePath);

    if (!frontmatter.artifact_kind) {
        result.add('MV-001', `Missing required frontmatter field: artifact_kind`, filePath, SEVERITY.ERROR);
        return;
    }

    if (!MARKER_VOCABULARY.artifactKinds.has(frontmatter.artifact_kind)) {
        result.add('MV-001', `Invalid artifact_kind: '${frontmatter.artifact_kind}'. Must be one of: ${[...MARKER_VOCABULARY.artifactKinds].join(', ')}`, filePath, SEVERITY.ERROR);
    }
}

/**
 * MV-002: spec_version present
 */
function checkSpecVersion(filePath, frontmatter, result) {
    if (!frontmatter.spec_version) {
        result.add('MV-002', `Missing required frontmatter field: spec_version`, filePath, SEVERITY.ERROR);
    }
}

/**
 * MV-003: role_owner present and valid
 */
function checkRoleOwner(filePath, frontmatter, result) {
    if (!frontmatter.role_owner) {
        result.add('MV-003', `Missing required frontmatter field: role_owner`, filePath, SEVERITY.ERROR);
        return;
    }

    if (!MARKER_VOCABULARY.roleOwners.has(frontmatter.role_owner)) {
        result.add('MV-003', `Invalid role_owner: '${frontmatter.role_owner}'. Must be one of: ${[...MARKER_VOCABULARY.roleOwners].join(', ')}`, filePath, SEVERITY.ERROR);
    }
}

/**
 * MV-004: keywords present (warning if missing)
 */
function checkKeywords(filePath, frontmatter, result) {
    if (!frontmatter.keywords) {
        result.add('MV-004', `Missing recommended frontmatter field: keywords (aids LLM retrieval)`, filePath, SEVERITY.WARNING);
    }
}

/**
 * MV-010: ## Purpose section exists
 */
function checkPurposeSection(filePath, content, result) {
    // Skip templates (they don't have filled purpose)
    if (filePath.includes('-template.md')) return;

    if (!content.includes('## Purpose') && !content.includes('## 1. Purpose')) {
        result.add('MV-010', `Missing required section: ## Purpose`, filePath, SEVERITY.ERROR);
    }
}

/**
 * MV-011: ## Links section exists (warning)
 */
function checkLinksSection(filePath, content, result) {
    // Skip templates
    if (filePath.includes('-template.md')) return;

    if (!content.includes('## Links') && !content.includes('## Related')) {
        result.add('MV-011', `Missing recommended section: ## Links`, filePath, SEVERITY.WARNING);
    }
}

/**
 * Check all marker vocabulary rules for a file
 */
function checkMarkerVocabulary(filePath, result, options = {}) {
    // Only check .md files
    if (!filePath.endsWith('.md')) return;

    // Skip non-artifact files
    const filename = path.basename(filePath);
    const skipFiles = ['README.md', 'readme.md', 'index.md', '.gitkeep'];
    if (skipFiles.includes(filename)) return;

    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const frontmatter = parseFrontmatter(content);

        // Skip files without frontmatter (not TeamSpec artifacts)
        if (Object.keys(frontmatter).length === 0) return;

        // MV-001 to MV-004: Frontmatter checks
        if (!options.rule || options.rule === 'MV-001') {
            checkArtifactKind(filePath, frontmatter, result);
        }
        if (!options.rule || options.rule === 'MV-002') {
            checkSpecVersion(filePath, frontmatter, result);
        }
        if (!options.rule || options.rule === 'MV-003') {
            checkRoleOwner(filePath, frontmatter, result);
        }
        if (!options.rule || options.rule === 'MV-004') {
            checkKeywords(filePath, frontmatter, result);
        }

        // MV-010, MV-011: Section checks
        if (!options.rule || options.rule === 'MV-010') {
            checkPurposeSection(filePath, content, result);
        }
        if (!options.rule || options.rule === 'MV-011') {
            checkLinksSection(filePath, content, result);
        }
    } catch (err) {
        // Skip files that can't be read
    }
}

// =============================================================================
// RULE IMPLEMENTATIONS
// =============================================================================

/**
 * TS-PROD-001: Product folder must be registered
 */
function checkProductRegistered(workspaceDir, productId, result) {
    const indexPath = path.join(workspaceDir, 'products', 'products-index.md');

    if (!fs.existsSync(indexPath)) {
        result.add('TS-PROD-001', `products-index.md does not exist`, indexPath, SEVERITY.WARNING);
        return;
    }

    const indexContent = fs.readFileSync(indexPath, 'utf-8');
    if (!indexContent.includes(productId)) {
        result.add('TS-PROD-001', `Product '${productId}' is not registered in products-index.md`, indexPath, SEVERITY.ERROR);
    }
}

/**
 * TS-PROD-002: product.yml required with PRX
 */
function checkProductYml(productDir, productId, result) {
    const ymlPath = path.join(productDir, 'product.yml');

    if (!fs.existsSync(ymlPath)) {
        result.add('TS-PROD-002', `product.yml is missing for product '${productId}'`, ymlPath, SEVERITY.ERROR);
        return null;
    }

    const config = parseConfigYaml(ymlPath);
    if (!config) {
        result.add('TS-PROD-002', `product.yml could not be parsed for product '${productId}'`, ymlPath, SEVERITY.ERROR);
        return null;
    }

    // Check required fields
    const requiredFields = ['id', 'name', 'prefix'];
    for (const field of requiredFields) {
        if (!config[field]) {
            result.add('TS-PROD-002', `product.yml is missing required field: '${field}'`, ymlPath, SEVERITY.ERROR);
        }
    }

    // Check PRX format
    if (config.prefix && !/^[A-Z]{3,4}$/.test(config.prefix)) {
        result.add('TS-PROD-002', `PRX '${config.prefix}' does not match pattern [A-Z]{3,4}`, ymlPath, SEVERITY.ERROR);
    }

    return config;
}

/**
 * TS-PROJ-001: Project folder must be registered
 */
function checkProjectRegistered(workspaceDir, projectId, result) {
    const indexPath = path.join(workspaceDir, 'projects', 'projects-index.md');

    if (!fs.existsSync(indexPath)) {
        // projects-index.md is optional
        return;
    }

    const indexContent = fs.readFileSync(indexPath, 'utf-8');
    if (!indexContent.includes(projectId)) {
        result.add('TS-PROJ-001', `Project '${projectId}' is not registered in projects-index.md`, indexPath, SEVERITY.WARNING);
    }
}

/**
 * TS-PROJ-002: project.yml required with minimum metadata
 */
function checkProjectYml(projectDir, projectId, result) {
    const ymlPath = path.join(projectDir, 'project.yml');

    if (!fs.existsSync(ymlPath)) {
        result.add('TS-PROJ-002', `project.yml is missing for project '${projectId}'`, ymlPath, SEVERITY.ERROR);
        return null;
    }

    const config = parseConfigYaml(ymlPath);
    if (!config) {
        result.add('TS-PROJ-002', `project.yml could not be parsed for project '${projectId}'`, ymlPath, SEVERITY.ERROR);
        return null;
    }

    // Check required fields
    const requiredFields = ['id', 'name', 'status'];
    for (const field of requiredFields) {
        if (!config[field]) {
            result.add('TS-PROJ-002', `project.yml is missing required field: '${field}'`, ymlPath, SEVERITY.ERROR);
        }
    }

    return config;
}

/**
 * TS-FI-001: Feature-Increment must have AS-IS and TO-BE sections
 */
function checkFIContent(filePath, result) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const filename = path.basename(filePath);

    // Check for AS-IS section
    if (!content.includes('## AS-IS') && !content.includes('## 2. AS-IS') && !content.includes('## Current State')) {
        result.add('TS-FI-001', `Feature-Increment '${filename}' is missing AS-IS section`, filePath, SEVERITY.ERROR);
    }

    // Check for TO-BE section
    if (!content.includes('## TO-BE') && !content.includes('## 3. TO-BE') && !content.includes('## Proposed State')) {
        result.add('TS-FI-001', `Feature-Increment '${filename}' is missing TO-BE section`, filePath, SEVERITY.ERROR);
    }
}

/**
 * TS-FI-002: Feature-Increment must link to target Feature
 */
function checkFIFeatureLink(filePath, workspaceDir, result) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const filename = path.basename(filePath);

    // Look for feature reference (f-PRX-NNN pattern)
    const featureRef = content.match(/f-[A-Z]{3,4}-\d{3}/);

    if (!featureRef) {
        result.add('TS-FI-002', `Feature-Increment '${filename.replace('.md', '')}' does not reference a target feature`, filePath, SEVERITY.ERROR);
        return;
    }

    // Verify the referenced feature exists
    const featurePattern = new RegExp(`${featureRef[0]}[\\w-]*\\.md`);
    const productsDir = path.join(workspaceDir, 'products');

    if (fs.existsSync(productsDir)) {
        let featureFound = false;
        const products = fs.readdirSync(productsDir, { withFileTypes: true })
            .filter(d => d.isDirectory())
            .map(d => d.name);

        for (const prod of products) {
            const featuresDir = path.join(productsDir, prod, 'features');
            if (fs.existsSync(featuresDir)) {
                const features = fs.readdirSync(featuresDir);
                if (features.some(f => featurePattern.test(f))) {
                    featureFound = true;
                    break;
                }
            }
        }

        if (!featureFound) {
            result.add('TS-FI-002', `Feature '${featureRef[0]}' referenced by FI does not exist`, filePath, SEVERITY.WARNING);
        }
    }
}

/**
 * TS-EPIC-001: Epic file naming convention
 */
function checkEpicNaming(filePath, result, workspaceDir = null) {
    const filename = path.basename(filePath);
    const patterns = getNamingPatterns(workspaceDir);
    const pattern = patterns.epic || patterns['epic'];

    if (pattern && !pattern.test(filename)) {
        result.add('TS-EPIC-001', `Epic file '${filename}' does not match naming convention: epic-PRX-XXX-description.md`, filePath, SEVERITY.ERROR);
    }
}

/**
 * TS-STORY-001: Story must link to Epic via filename
 */
function checkStoryEpicLink(filePath, projectDir, result, workspaceDir = null) {
    const filename = path.basename(filePath);
    const patterns = getNamingPatterns(workspaceDir);
    const pattern = patterns.story || patterns['story'];

    // Check naming pattern
    if (pattern && !pattern.test(filename)) {
        result.add('TS-STORY-001', `Story '${filename}' does not match naming convention: s-eXXX-YYY-description.md`, filePath, SEVERITY.ERROR);
        return;
    }

    // Extract epic number
    const epicMatch = filename.match(/s-e(\d{3})-/);
    if (epicMatch) {
        const epicNum = epicMatch[1];
        const epicsDir = path.join(projectDir, 'epics');

        if (fs.existsSync(epicsDir)) {
            const epics = fs.readdirSync(epicsDir);
            const epicExists = epics.some(e => e.includes(`-${epicNum}-`) || e.includes(`-${parseInt(epicNum)}-`));

            if (!epicExists) {
                result.add('TS-STORY-001', `Story '${filename}' references non-existent epic ${epicNum}`, filePath, SEVERITY.ERROR);
            }
        }
    }
}

/**
 * TS-STORY-002: Story describes delta, not full behavior
 */
function checkStoryDelta(filePath, result) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const filename = path.basename(filePath);

    // Look for delta language
    const deltaTerms = ['adds', 'changes', 'removes', 'modifies', 'updates', 'introduces', 'replaces'];
    const hasDeltaLanguage = deltaTerms.some(term =>
        content.toLowerCase().includes(term)
    );

    // Look for Feature-Increment reference
    const hasFIRef = /fi-[A-Z]{3,4}-\d{3}/.test(content);

    if (!hasDeltaLanguage && !hasFIRef) {
        result.add('TS-STORY-002', `Story '${filename.replace('.md', '')}' appears to describe full behavior instead of delta`, filePath, SEVERITY.WARNING);
    }
}

/**
 * TS-NAMING-*: Artifact naming conventions
 * Allows README.md and index files in artifact folders
 */
function checkArtifactNaming(filePath, artifactType, result, workspaceDir = null) {
    const filename = path.basename(filePath);

    // Skip documentation and index files - these are allowed in any artifact folder
    const allowedFiles = ['README.md', 'readme.md', 'index.md', '.gitkeep'];
    if (allowedFiles.includes(filename)) {
        return;
    }

    const patterns = getNamingPatterns(workspaceDir);
    const pattern = patterns[artifactType];

    if (pattern && !pattern.test(filename)) {
        const ruleId = `TS-NAMING-${artifactType.toUpperCase().replace(/-/g, '')}`;
        result.add(ruleId, `File '${filename}' does not match naming convention for ${artifactType}`, filePath, SEVERITY.ERROR);
    }
}

/**
 * TS-DOD-001: Story must have all AC verified
 */
function checkDoneStoryAC(filePath, result) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const filename = path.basename(filePath);

    // Check for unverified AC (unchecked checkboxes)
    const hasUnverifiedAC = /- \[ \]/.test(content);

    if (hasUnverifiedAC) {
        result.add('TS-DOD-001', `Story '${filename.replace('.md', '')}' has unverified acceptance criteria`, filePath, SEVERITY.ERROR);
    }
}

/**
 * TS-DOD-003: Product sync after deployment
 */
function checkCanonSync(projectConfig, projectDir, result) {
    if (projectConfig.deployed_date && !projectConfig.canon_synced) {
        result.add('TS-DOD-003', `Project deployed but Product Canon not synced. Run ts:po sync`, path.join(projectDir, 'project.yml'), SEVERITY.BLOCKER);
    }
}

/**
 * TS-QA-001: Deployed Feature-Increment must have test coverage
 */
function checkFITestCoverage(fiFile, projectDir, result) {
    const fiName = path.basename(fiFile, '.md');
    const fiMatch = fiName.match(/^fi-([A-Z]{3,4}-\d{3})/);

    if (!fiMatch) return;

    const tcDir = path.join(projectDir, 'qa', 'test-cases');
    if (!fs.existsSync(tcDir)) {
        result.add('TS-QA-001', `No test-cases directory for FI test coverage validation`, tcDir, SEVERITY.WARNING);
        return;
    }

    const tcFiles = fs.readdirSync(tcDir);
    const hasTestCase = tcFiles.some(tc => tc.includes(fiMatch[1]));

    if (!hasTestCase) {
        result.add('TS-QA-001', `Deployed FI '${fiName}' has no test coverage. Expected: tc-fi-${fiMatch[1]}-*.md`, fiFile, SEVERITY.WARNING);
    }
}

/**
 * TS-QA-003: Regression impact must be recorded for each FI
 */
function checkRegressionImpact(fiFile, projectDir, workspaceDir, result) {
    const fiName = path.basename(fiFile, '.md');
    const fiMatch = fiName.match(/^fi-([A-Z]{3,4})-(\d{3})/);

    if (!fiMatch) return;

    const prx = fiMatch[1];
    const num = fiMatch[2];
    const riDir = path.join(projectDir, 'qa', 'regression-impact');
    const riFile = path.join(riDir, `ri-fi-${prx}-${num}.md`);

    if (!fs.existsSync(riFile)) {
        result.add('TS-QA-003', `FI '${fiName}' has no regression impact record. Create ri-fi-${prx}-${num}.md`, fiFile, SEVERITY.ERROR);
        return;
    }

    // Check ri file content
    const riContent = fs.readFileSync(riFile, 'utf-8');

    // Check for assessment field
    const assessmentMatch = riContent.match(/assessment:\s*([\w-]+)/);
    if (!assessmentMatch) {
        result.add('TS-QA-003', `ri-fi-${prx}-${num}.md is missing 'assessment' field`, riFile, SEVERITY.ERROR);
        return;
    }

    const assessment = assessmentMatch[1];

    if (assessment === 'update-required') {
        // Check for regression_tests field
        if (!riContent.includes('regression_tests:')) {
            result.add('TS-QA-003', `ri-fi-${prx}-${num}.md has assessment: update-required but no regression_tests listed`, riFile, SEVERITY.ERROR);
        } else {
            // Check that listed rt files exist
            const rtMatches = riContent.match(/rt-f-[A-Z]{3,4}-\d{3}[\w-]*\.md/g) || [];
            for (const rtFile of rtMatches) {
                const rtFound = findRegressionTest(workspaceDir, prx, rtFile);
                if (!rtFound) {
                    result.add('TS-QA-003', `ri-fi-${prx}-${num}.md lists ${rtFile} but file does not exist`, riFile, SEVERITY.ERROR);
                }
            }
        }
    } else if (assessment === 'no-impact') {
        // Check for rationale
        if (!riContent.includes('rationale:') || !/rationale:\s*\S/.test(riContent)) {
            result.add('TS-QA-003', `ri-fi-${prx}-${num}.md has assessment: no-impact but no rationale provided`, riFile, SEVERITY.ERROR);
        }
    }
}

/**
 * Find a regression test file in products
 */
function findRegressionTest(workspaceDir, prx, rtFilename) {
    const productsDir = path.join(workspaceDir, 'products');
    if (!fs.existsSync(productsDir)) return false;

    const products = fs.readdirSync(productsDir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);

    for (const prod of products) {
        const rtDir = path.join(productsDir, prod, 'qa', 'regression-tests');
        if (fs.existsSync(rtDir)) {
            const rtPath = path.join(rtDir, rtFilename);
            if (fs.existsSync(rtPath)) return true;
        }
    }

    return false;
}

// =============================================================================
// MAIN LINTER
// =============================================================================

/**
 * Lint a TeamSpec workspace
 * @param {string} workspaceDir - Path to workspace root
 * @param {Object} options - Linting options
 * @param {string} options.project - Specific project to lint
 * @param {string} options.rule - Specific rule to check
 * @returns {LintResult}
 */
function lint(workspaceDir, options = {}) {
    const result = new LintResult();

    // Load registry for patterns (if available)
    const registry = loadRegistry(workspaceDir);

    // Lint products
    const productsDir = path.join(workspaceDir, 'products');
    if (fs.existsSync(productsDir)) {
        const products = fs.readdirSync(productsDir, { withFileTypes: true })
            .filter(d => d.isDirectory())
            .map(d => d.name);

        for (const productId of products) {
            lintProduct(workspaceDir, productId, result, options);
        }
    }

    // Lint projects
    const projectsDir = path.join(workspaceDir, 'projects');
    if (fs.existsSync(projectsDir)) {
        const projects = fs.readdirSync(projectsDir, { withFileTypes: true })
            .filter(d => d.isDirectory())
            .map(d => d.name);

        for (const projectId of projects) {
            if (options.project && options.project !== projectId) continue;
            lintProject(workspaceDir, projectId, result, options);
        }
    }

    return result;
}

/**
 * Lint a product folder
 */
function lintProduct(workspaceDir, productId, result, options) {
    const productDir = path.join(workspaceDir, 'products', productId);

    // TS-PROD-001: Product registered
    if (!options.rule || options.rule === 'TS-PROD-001') {
        checkProductRegistered(workspaceDir, productId, result);
    }

    // TS-PROD-002: product.yml validation
    if (!options.rule || options.rule === 'TS-PROD-002') {
        const productConfig = checkProductYml(productDir, productId, result);

        if (productConfig) {
            // Lint features naming
            const featuresDir = path.join(productDir, 'features');
            if (fs.existsSync(featuresDir)) {
                const features = fs.readdirSync(featuresDir)
                    .filter(f => f.endsWith('.md') && !f.toLowerCase().startsWith('readme') && f !== 'features-index.md' && f !== 'story-ledger.md');

                for (const feature of features) {
                    checkArtifactNaming(path.join(featuresDir, feature), 'feature', result, workspaceDir);
                    // MV-*: Marker vocabulary checks
                    if (!options.rule || options.rule.startsWith('MV-')) {
                        checkMarkerVocabulary(path.join(featuresDir, feature), result, options);
                    }
                }
            }

            // Lint regression tests naming
            const rtDir = path.join(productDir, 'qa', 'regression-tests');
            if (fs.existsSync(rtDir)) {
                const rtFiles = fs.readdirSync(rtDir).filter(f => f.endsWith('.md') && !f.toLowerCase().startsWith('readme'));
                for (const rt of rtFiles) {
                    checkArtifactNaming(path.join(rtDir, rt), 'product-regression-test', result, workspaceDir);
                    // MV-*: Marker vocabulary checks
                    if (!options.rule || options.rule.startsWith('MV-')) {
                        checkMarkerVocabulary(path.join(rtDir, rt), result, options);
                    }
                }
            }
        }
    }
}

/**
 * Lint a project folder
 */
function lintProject(workspaceDir, projectId, result, options) {
    const projectDir = path.join(workspaceDir, 'projects', projectId);

    // TS-PROJ-001: Project registered
    if (!options.rule || options.rule === 'TS-PROJ-001') {
        checkProjectRegistered(workspaceDir, projectId, result);
    }

    // TS-PROJ-002: project.yml validation
    let projectConfig = null;
    if (!options.rule || options.rule === 'TS-PROJ-002') {
        projectConfig = checkProjectYml(projectDir, projectId, result);
    } else {
        projectConfig = parseConfigYaml(path.join(projectDir, 'project.yml'));
    }

    // TS-DOD-003: Canon sync check
    if (projectConfig && (!options.rule || options.rule === 'TS-DOD-003')) {
        checkCanonSync(projectConfig, projectDir, result);
    }

    // Lint Feature-Increments
    const fiDir = path.join(projectDir, 'feature-increments');
    if (fs.existsSync(fiDir)) {
        const fiFiles = fs.readdirSync(fiDir).filter(f => f.endsWith('.md') && !f.toLowerCase().startsWith('readme') && f !== 'increments-index.md');

        for (const fi of fiFiles) {
            const fiPath = path.join(fiDir, fi);

            // TS-FI-001: AS-IS/TO-BE sections
            if (!options.rule || options.rule === 'TS-FI-001') {
                checkFIContent(fiPath, result);
            }

            // TS-FI-002: Feature link
            if (!options.rule || options.rule === 'TS-FI-002') {
                checkFIFeatureLink(fiPath, workspaceDir, result);
            }

            // TS-NAMING-FI
            if (!options.rule || options.rule === 'TS-NAMING-FI') {
                checkArtifactNaming(fiPath, 'feature-increment', result, workspaceDir);
            }

            // TS-QA-001: Test coverage (for deployed projects)
            if (projectConfig?.status === 'deployed' || projectConfig?.deployed_date) {
                if (!options.rule || options.rule === 'TS-QA-001') {
                    checkFITestCoverage(fiPath, projectDir, result);
                }
            }

            // TS-QA-003: Regression impact
            if (projectConfig?.status === 'deployed' || projectConfig?.deployed_date) {
                if (!options.rule || options.rule === 'TS-QA-003') {
                    checkRegressionImpact(fiPath, projectDir, workspaceDir, result);
                }
            }

            // MV-*: Marker vocabulary checks
            if (!options.rule || options.rule.startsWith('MV-')) {
                checkMarkerVocabulary(fiPath, result, options);
            }
        }
    }

    // Lint Epics
    const epicsDir = path.join(projectDir, 'epics');
    if (fs.existsSync(epicsDir)) {
        const epics = fs.readdirSync(epicsDir)
            .filter(f => f.endsWith('.md') && !f.toLowerCase().startsWith('readme') && f !== 'epics-index.md');

        for (const epic of epics) {
            const epicPath = path.join(epicsDir, epic);

            // TS-EPIC-001: Naming
            if (!options.rule || options.rule === 'TS-EPIC-001') {
                checkEpicNaming(epicPath, result, workspaceDir);
            }
        }
    }

    // Lint Stories
    const storiesDir = path.join(projectDir, 'stories');
    if (fs.existsSync(storiesDir)) {
        const storyFolders = ['backlog', 'ready-to-refine', 'ready-to-develop', 'deferred', 'out-of-scope'];

        for (const folder of storyFolders) {
            const folderPath = path.join(storiesDir, folder);
            if (!fs.existsSync(folderPath)) continue;

            const stories = fs.readdirSync(folderPath).filter(f => f.endsWith('.md') && f !== 'README.md');

            for (const story of stories) {
                const storyPath = path.join(folderPath, story);

                // TS-STORY-001: Epic link
                if (!options.rule || options.rule === 'TS-STORY-001') {
                    checkStoryEpicLink(storyPath, projectDir, result, workspaceDir);
                }

                // TS-STORY-002: Delta language
                if (!options.rule || options.rule === 'TS-STORY-002') {
                    checkStoryDelta(storyPath, result);
                }

                // MV-*: Marker vocabulary checks
                if (!options.rule || options.rule.startsWith('MV-')) {
                    checkMarkerVocabulary(storyPath, result, options);
                }
            }
        }
    }

    // Lint stories in sprint folders
    const sprintsDir = path.join(projectDir, 'sprints');
    if (fs.existsSync(sprintsDir)) {
        const sprints = fs.readdirSync(sprintsDir, { withFileTypes: true })
            .filter(d => d.isDirectory() && d.name.startsWith('sprint-'))
            .map(d => d.name);

        for (const sprint of sprints) {
            const sprintDir = path.join(sprintsDir, sprint);
            const stories = fs.readdirSync(sprintDir)
                .filter(f => f.startsWith('s-') && f.endsWith('.md'));

            for (const story of stories) {
                const storyPath = path.join(sprintDir, story);

                // TS-STORY-001
                if (!options.rule || options.rule === 'TS-STORY-001') {
                    checkStoryEpicLink(storyPath, projectDir, result, workspaceDir);
                }

                // TS-DOD-001: Done stories need verified AC
                if (!options.rule || options.rule === 'TS-DOD-001') {
                    checkDoneStoryAC(storyPath, result);
                }

                // MV-*: Marker vocabulary checks
                if (!options.rule || options.rule.startsWith('MV-')) {
                    checkMarkerVocabulary(storyPath, result, options);
                }
            }
        }
    }

    // Lint test cases naming
    const tcDir = path.join(projectDir, 'qa', 'test-cases');
    if (fs.existsSync(tcDir)) {
        const tcFiles = fs.readdirSync(tcDir).filter(f => f.endsWith('.md') && !f.toLowerCase().startsWith('readme'));
        for (const tc of tcFiles) {
            const tcPath = path.join(tcDir, tc);
            checkArtifactNaming(tcPath, 'project-test-case', result, workspaceDir);
            // MV-*: Marker vocabulary checks
            if (!options.rule || options.rule.startsWith('MV-')) {
                checkMarkerVocabulary(tcPath, result, options);
            }
        }
    }

    // Lint bug reports naming
    const bugDir = path.join(projectDir, 'qa', 'bug-reports');
    if (fs.existsSync(bugDir)) {
        const bugFiles = fs.readdirSync(bugDir).filter(f => f.endsWith('.md') && !f.toLowerCase().startsWith('readme'));
        for (const bug of bugFiles) {
            const bugPath = path.join(bugDir, bug);
            checkArtifactNaming(bugPath, 'bug-report', result, workspaceDir);
            // MV-*: Marker vocabulary checks
            if (!options.rule || options.rule.startsWith('MV-')) {
                checkMarkerVocabulary(bugPath, result, options);
            }
        }
    }
}

/**
 * Format lint results for console output
 */
function formatResults(result, verbose = false) {
    const output = [];
    const summary = result.getSummary();

    if (summary.total === 0) {
        output.push('✅ No lint errors found');
        return output.join('\n');
    }

    // Group by file
    const byFile = {};
    for (const item of result.getAll()) {
        if (!byFile[item.file]) byFile[item.file] = [];
        byFile[item.file].push(item);
    }

    for (const [file, items] of Object.entries(byFile)) {
        output.push(`\n📄 ${file}`);
        for (const item of items) {
            const icon = item.severity === SEVERITY.ERROR || item.severity === SEVERITY.BLOCKER
                ? '❌'
                : item.severity === SEVERITY.WARNING
                    ? '⚠️'
                    : 'ℹ️';
            output.push(`  ${icon} [${item.rule}] ${item.message}`);
        }
    }

    output.push('\n---');
    output.push(`Summary: ${summary.errors} errors, ${summary.warnings} warnings, ${summary.info} info`);

    if (result.hasBlockers()) {
        output.push('🚫 BLOCKERS found - cannot proceed');
    } else if (result.hasErrors()) {
        output.push('❌ Lint check FAILED');
    } else {
        output.push('✅ Lint check passed (warnings only)');
    }

    return output.join('\n');
}

// =============================================================================
// CLI INTEGRATION
// =============================================================================

/**
 * Run linter from CLI
 */
function runLint(targetDir, options = {}) {
    console.log(`\n🔍 Linting TeamSpec workspace: ${targetDir}\n`);

    const result = lint(targetDir, options);
    console.log(formatResults(result, options.verbose));

    return result.hasErrors() ? 1 : 0;
}

module.exports = {
    lint,
    runLint,
    formatResults,
    LintResult,
    SEVERITY,
    MARKER_VOCABULARY,
    getNamingPatterns,
    resetNamingPatterns,
    // Export individual checks for testing
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
    checkArtifactNaming,
    // Marker vocabulary checks
    checkMarkerVocabulary,
    checkArtifactKind,
    checkSpecVersion,
    checkRoleOwner,
    checkKeywords,
    checkPurposeSection,
    checkLinksSection
};
