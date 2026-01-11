/**
 * TeamSpec Structure Loader
 * 
 * Loads folder structure and registry definitions from YAML files.
 * This module is the single source of truth for CLI structure generation.
 * 
 * Version: 4.0
 */

const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

/**
 * Parse YAML content using the yaml library
 */
function parseYaml(content) {
    try {
        return YAML.parse(content);
    } catch (err) {
        console.warn(`Warning: YAML parse error: ${err.message}`);
        return {};
    }
}

/**
 * Load the registry.yml from spec/4.0/
 * Falls back to bundled version in cli/teamspec-core/ if not found
 */
function loadRegistry(workspaceRoot) {
    const specPath = path.join(workspaceRoot, 'spec', '4.0', 'registry.yml');
    const bundledPath = path.join(__dirname, '..', 'teamspec-core', 'registry.yml');
    const localBundled = path.join(__dirname, '..', '..', 'spec', '4.0', 'registry.yml');

    let registryPath;
    if (fs.existsSync(specPath)) {
        registryPath = specPath;
    } else if (fs.existsSync(bundledPath)) {
        registryPath = bundledPath;
    } else if (fs.existsSync(localBundled)) {
        registryPath = localBundled;
    } else {
        return getDefaultRegistry();
    }

    try {
        const content = fs.readFileSync(registryPath, 'utf-8');
        return parseYaml(content);
    } catch (err) {
        console.warn(`Warning: Could not parse registry.yml: ${err.message}`);
        return getDefaultRegistry();
    }
}

/**
 * Load FOLDER_STRUCTURE.yml from spec/4.0/
 */
function loadFolderStructure(workspaceRoot) {
    const specPath = path.join(workspaceRoot, 'spec', '4.0', 'FOLDER_STRUCTURE.yml');
    const bundledPath = path.join(__dirname, '..', 'teamspec-core', 'FOLDER_STRUCTURE.yml');
    const localBundled = path.join(__dirname, '..', '..', 'spec', '4.0', 'FOLDER_STRUCTURE.yml');

    let structurePath;
    if (fs.existsSync(specPath)) {
        structurePath = specPath;
    } else if (fs.existsSync(bundledPath)) {
        structurePath = bundledPath;
    } else if (fs.existsSync(localBundled)) {
        structurePath = localBundled;
    } else {
        return getDefaultFolderStructure();
    }

    try {
        const content = fs.readFileSync(structurePath, 'utf-8');
        return parseYaml(content);
    } catch (err) {
        console.warn(`Warning: Could not parse FOLDER_STRUCTURE.yml: ${err.message}`);
        return getDefaultFolderStructure();
    }
}

/**
 * Get default folder structure when YAML not available
 */
function getDefaultFolderStructure() {
    return {
        structure: {
            products: {
                path: 'products/',
                product_folder: {
                    path: 'products/{product-id}/',
                    subfolders: [
                        { path: 'business-analysis/' },
                        { path: 'features/' },
                        { path: 'solution-designs/' },
                        { path: 'technical-architecture/' },
                        { path: 'qa/regression-tests/' },
                        { path: 'decisions/' }
                    ]
                }
            },
            projects: {
                path: 'projects/',
                project_folder: {
                    path: 'projects/{project-id}/',
                    subfolders: [
                        { path: 'business-analysis-increments/' },
                        { path: 'feature-increments/' },
                        { path: 'solution-design-increments/' },
                        { path: 'technical-architecture-increments/' },
                        { path: 'epics/' },
                        { path: 'stories/', workflow_subfolders: ['backlog/', 'ready-to-refine/', 'ready-to-develop/', 'deferred/', 'out-of-scope/'] },
                        { path: 'decisions/' },
                        { path: 'dev-plans/' },
                        { path: 'qa/', subfolders: ['test-cases/', 'bug-reports/', 'uat/', 'regression-impact/'] },
                        { path: 'sprints/' }
                    ]
                }
            }
        },
        story_workflow_folders: [
            { folder: 'stories/backlog/', state: 'backlog' },
            { folder: 'stories/ready-to-refine/', state: 'ready-to-refine' },
            { folder: 'stories/ready-to-develop/', state: 'ready-to-develop' },
            { folder: 'sprints/sprint-N/', state: 'in-sprint' },
            { folder: 'stories/deferred/', state: 'deferred', terminal: true },
            { folder: 'stories/out-of-scope/', state: 'out-of-scope', terminal: true }
        ],
        canon_sync_paths: [
            { from: 'projects/{project-id}/feature-increments/', to: 'products/{product-id}/features/' },
            { from: 'projects/{project-id}/business-analysis-increments/', to: 'products/{product-id}/business-analysis/' },
            { from: 'projects/{project-id}/solution-design-increments/', to: 'products/{product-id}/solution-designs/' },
            { from: 'projects/{project-id}/technical-architecture-increments/', to: 'products/{product-id}/technical-architecture/' }
        ]
    };
}

/**
 * Get default registry when YAML not available
 */
function getDefaultRegistry() {
    return {
        version: '4.0',
        model: 'Product-Canon',
        roles: {
            PO: { name: 'Product Owner', commands: ['ts:po product', 'ts:po project', 'ts:po sync', 'ts:po status'] },
            BA: { name: 'Business Analyst', commands: ['ts:ba analysis', 'ts:ba ba-increment', 'ts:ba review'] },
            FA: { name: 'Functional Analyst', commands: ['ts:fa feature', 'ts:fa feature-increment', 'ts:fa epic', 'ts:fa story', 'ts:fa sync-proposal', 'ts:fa slice'] },
            SA: { name: 'Solution Architect', commands: ['ts:sa ta', 'ts:sa ta-increment', 'ts:sa sd', 'ts:sa sd-increment', 'ts:sa review'] },
            DEV: { name: 'Developer', commands: ['ts:dev plan', 'ts:dev implement'] },
            QA: { name: 'QA Engineer', commands: ['ts:qa test', 'ts:qa verify', 'ts:qa regression', 'ts:qa bug', 'ts:qa uat'] },
            SM: { name: 'Scrum Master', commands: ['ts:sm sprint', 'ts:sm deploy-checklist', 'ts:sm planning', 'ts:sm standup', 'ts:sm retro', 'ts:sm sync'] }
        },
        artifacts: {
            feature: { location: 'products/{product-id}/features/', naming: 'f-{PRX}-{NNN}-{description}.md', owner: 'FA' },
            'feature-increment': { location: 'projects/{project-id}/feature-increments/', naming: 'fi-{PRX}-{NNN}-{description}.md', owner: 'FA' },
            epic: { location: 'projects/{project-id}/epics/', naming: 'epic-{PRX}-{NNN}-{description}.md', owner: 'FA' },
            story: { location: 'projects/{project-id}/stories/{state}/', naming: 's-e{EEE}-{SSS}-{description}.md', owner: 'FA' },
            'dev-plan': { location: 'projects/{project-id}/dev-plans/', naming: 'dp-e{EEE}-s{SSS}-{description}.md', owner: 'DEV' },
            'project-test-case': { location: 'projects/{project-id}/qa/test-cases/', naming: 'tc-fi-{PRX}-{NNN}-{description}.md', owner: 'QA' },
            'product-regression-test': { location: 'products/{product-id}/qa/regression-tests/', naming: 'rt-f-{PRX}-{NNN}-{description}.md', owner: 'QA' },
            'regression-impact': { location: 'projects/{project-id}/qa/regression-impact/', naming: 'ri-fi-{PRX}-{NNN}.md', owner: 'QA' },
            'bug-report': { location: 'projects/{project-id}/qa/bug-reports/', naming: 'bug-{project-id}-{NNN}-{description}.md', owner: 'QA' }
        },
        commands: [],
        gates: {
            dor: { name: 'Definition of Ready', checks: [] },
            dod: { name: 'Definition of Done', checks: [] },
            deployment: { name: 'Deployment Verification Gate', checks: [] }
        }
    };
}

/**
 * Extract all commands from registry for prompt generation
 */
function getCommandsFromRegistry(registry) {
    const commands = [];

    // Extract commands array if it exists
    if (Array.isArray(registry.commands)) {
        for (const cmd of registry.commands) {
            if (cmd.status === 'REMOVED') continue;
            if (!cmd.invocation) continue;

            commands.push({
                id: cmd.id,
                invocation: cmd.invocation,
                role: cmd.role,
                purpose: cmd.purpose,
                output: cmd.output
            });
        }
    }

    // Also extract from roles.*.commands
    if (registry.roles) {
        for (const [roleKey, roleData] of Object.entries(registry.roles)) {
            if (Array.isArray(roleData.commands)) {
                for (const cmdInvocation of roleData.commands) {
                    // Check if already in commands array
                    const exists = commands.some(c => c.invocation === cmdInvocation);
                    if (!exists) {
                        commands.push({
                            id: cmdInvocation.replace('ts:', '').replace(' ', '.'),
                            invocation: cmdInvocation,
                            role: roleKey,
                            purpose: `${roleData.name} command`
                        });
                    }
                }
            }
        }
    }

    return commands;
}

/**
 * Get artifact naming patterns from registry
 */
function getArtifactPatterns(registry) {
    const patterns = {};

    if (registry.artifacts) {
        for (const [artifactKey, artifactData] of Object.entries(registry.artifacts)) {
            patterns[artifactKey] = {
                location: artifactData.location,
                naming: artifactData.naming,
                owner: artifactData.owner,
                example: artifactData.example
            };
        }
    }

    return patterns;
}

/**
 * Get product folders from structure
 */
function getProductFolders(structure) {
    const folders = [];

    if (structure?.structure?.products?.product_folder?.subfolders) {
        for (const subfolder of structure.structure.products.product_folder.subfolders) {
            if (subfolder.path) {
                folders.push(subfolder.path.replace(/\/$/, ''));
            }
        }
    }

    return folders.length > 0 ? folders : [
        'business-analysis',
        'features',
        'solution-designs',
        'technical-architecture',
        'qa/regression-tests',
        'decisions'
    ];
}

/**
 * Get project folders from structure
 */
function getProjectFolders(structure) {
    const folders = [];

    if (structure?.structure?.projects?.project_folder?.subfolders) {
        for (const subfolder of structure.structure.projects.project_folder.subfolders) {
            if (subfolder.path) {
                const basePath = subfolder.path.replace(/\/$/, '');
                folders.push(basePath);

                // Add nested workflow subfolders
                if (subfolder.workflow_subfolders) {
                    for (const wf of subfolder.workflow_subfolders) {
                        folders.push(`${basePath}/${wf.replace(/\/$/, '')}`);
                    }
                }

                // Add nested subfolders
                if (subfolder.subfolders) {
                    for (const sf of subfolder.subfolders) {
                        folders.push(`${basePath}/${sf.replace(/\/$/, '')}`);
                    }
                }
            }
        }
    }

    return folders.length > 0 ? folders : [
        'business-analysis-increments',
        'feature-increments',
        'solution-design-increments',
        'technical-architecture-increments',
        'epics',
        'stories',
        'stories/backlog',
        'stories/ready-to-refine',
        'stories/ready-to-develop',
        'stories/deferred',
        'stories/out-of-scope',
        'decisions',
        'dev-plans',
        'qa',
        'qa/test-cases',
        'qa/bug-reports',
        'qa/uat',
        'qa/regression-impact',
        'sprints'
    ];
}

/**
 * Get story workflow folders
 */
function getStoryWorkflowFolders(structure) {
    if (structure?.story_workflow_folders) {
        return structure.story_workflow_folders;
    }

    return [
        { folder: 'stories/backlog/', state: 'backlog' },
        { folder: 'stories/ready-to-refine/', state: 'ready-to-refine' },
        { folder: 'stories/ready-to-develop/', state: 'ready-to-develop' },
        { folder: 'sprints/sprint-N/', state: 'in-sprint' }
    ];
}

/**
 * Convert naming pattern from registry.yml to regex
 * 
 * Converts patterns like:
 * - "f-{PRX}-{NNN}-{description}.md" -> /^f-[A-Z]{3,4}-\d{3}-[\w-]+\.md$/
 * - "s-e{EEE}-{SSS}-{description}.md" -> /^s-e\d{3}-\d{3}-[\w-]+\.md$/
 * 
 * @param {string} pattern - Naming pattern from registry
 * @returns {RegExp} - Compiled regex pattern
 */
function namingPatternToRegex(pattern) {
    if (!pattern) return null;

    // Escape special regex characters first (except { and })
    let regexStr = pattern
        .replace(/\./g, '\\.')
        .replace(/\*/g, '.*');

    // Replace placeholders with regex patterns
    regexStr = regexStr
        .replace(/\{PRX\}/g, '[A-Z]{3,4}')         // Product prefix
        .replace(/\{NNN\}/g, '\\d{3}')             // 3-digit number
        .replace(/\{EEE\}/g, '\\d{3}')             // Epic number
        .replace(/\{SSS\}/g, '\\d{3}')             // Story sequence
        .replace(/\{N\}/g, '\\d+')                 // Sprint number
        .replace(/\{description\}/g, '[\\w-]+')   // Description slug
        .replace(/\{product-id\}/g, '[\\w-]+')    // Product ID
        .replace(/\{project-id\}/g, '[\\w-]+')    // Project ID
        .replace(/\{state\}/g, '[\\w-]+');        // Story state

    return new RegExp(`^${regexStr}$`);
}

/**
 * Get naming patterns as regex from registry artifacts
 * @param {Object} registry - Parsed registry
 * @returns {Object} - Map of artifact type to regex pattern
 */
function getArtifactNamingRegex(registry) {
    const patterns = {};

    if (registry?.artifacts) {
        for (const [artifactKey, artifactData] of Object.entries(registry.artifacts)) {
            if (artifactData.naming) {
                const regex = namingPatternToRegex(artifactData.naming);
                if (regex) {
                    patterns[artifactKey] = regex;
                }
            }
        }
    }

    return patterns;
}

module.exports = {
    parseYaml,
    loadRegistry,
    loadFolderStructure,
    getCommandsFromRegistry,
    getArtifactPatterns,
    getArtifactNamingRegex,
    namingPatternToRegex,
    getProductFolders,
    getProjectFolders,
    getStoryWorkflowFolders,
    getDefaultRegistry,
    getDefaultFolderStructure
};
