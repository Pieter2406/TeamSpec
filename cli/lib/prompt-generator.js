/**
 * TeamSpec Copilot Prompt Generator
 * 
 * Generates GitHub Copilot prompt files for all TeamSpec commands.
 * Commands and roles are loaded from registry.yml to ensure consistency.
 * 
 * Prompts are kept minimal and reference agent files for detailed guidance.
 * 
 * Usage: teamspec generate-prompts
 * Version: 4.0
 */

const fs = require('fs');
const path = require('path');
const { loadRegistry, getCommandsFromRegistry } = require('./structure-loader');

// =============================================================================
// ROLE EXTRACTION FROM REGISTRY
// =============================================================================

/**
 * Extract roles from registry.yml
 * @param {Object} registry - Parsed registry object
 * @returns {Object} - Roles keyed by role ID
 */
function extractRoles(registry) {
    const roles = {};

    if (registry?.roles) {
        for (const [roleId, roleData] of Object.entries(registry.roles)) {
            roles[roleId] = {
                id: roleId,
                name: roleData.name || roleId,
                agent: `AGENT_${roleId}`,
                owns: roleData.owns || [],
                creates: roleData.creates || [],
                commands: roleData.commands || []
            };
        }
    }

    return roles;
}

/**
 * Get role info from registry roles
 * @param {Object} roles - Extracted roles
 * @param {string} roleKey - Role key (e.g., 'PO', 'BA')
 * @returns {Object} - Role info with defaults
 */
function getRoleInfo(roles, roleKey) {
    const key = roleKey?.toUpperCase();
    return roles[key] || {
        id: key || 'ANY',
        name: 'TeamSpec',
        agent: 'AGENT_BOOTSTRAP',
        owns: [],
        creates: [],
        commands: []
    };
}

// =============================================================================
// COMMAND EXTRACTION FROM REGISTRY
// =============================================================================

/**
 * Group commands by role
 * @param {Array} commands - Commands from registry
 * @returns {Object} - Commands grouped by role
 */
function groupCommandsByRole(commands) {
    const byRole = {};

    for (const cmd of commands) {
        if (cmd.status === 'REMOVED') continue;

        const role = cmd.role || 'Any';
        if (!byRole[role]) byRole[role] = [];
        byRole[role].push(cmd);
    }

    return byRole;
}

// =============================================================================
// PROMPT FILE GENERATION
// =============================================================================

/**
 * Sanitize a string for use in filenames
 */
function sanitizeFilename(str) {
    return str
        .replace(/<[^>]+>/g, '')      // Remove angle bracket patterns like <role>
        .replace(/[\\/:*?"<>|]/g, '') // Remove Windows-invalid chars
        .replace(/\s+/g, '-')         // Replace spaces with dashes
        .replace(/-+/g, '-')          // Collapse multiple dashes
        .replace(/^-|-$/g, '');       // Remove leading/trailing dashes
}

/**
 * Parse command invocation to extract role and action
 * @param {string} invocation - Command invocation (e.g., "ts:po product")
 * @returns {Object|null} - Parsed command parts or null if invalid
 */
function parseInvocation(invocation) {
    const match = invocation.match(/^ts:(\w+)(?:\s+(.+))?$/);
    if (!match) return null;

    const [, roleOrCmd, action] = match;

    // Skip commands with placeholders
    if (action && action.includes('<')) return null;

    return { roleOrCmd, action };
}

/**
 * Generate a clean, minimal GitHub Copilot prompt file
 * The prompt references the agent file for detailed guidance.
 */
function generatePromptFile(command, outputDir, roles) {
    const parsed = parseInvocation(command.invocation);
    if (!parsed) return null;

    const { roleOrCmd, action } = parsed;
    const role = getRoleInfo(roles, roleOrCmd);

    // Determine filename
    let filename, commandName;
    if (action) {
        const sanitizedAction = sanitizeFilename(action);
        filename = `${roleOrCmd}-${sanitizedAction}.prompt.md`;
        commandName = `ts:${roleOrCmd} ${action}`;
    } else {
        filename = `${roleOrCmd}.prompt.md`;
        commandName = `ts:${roleOrCmd}`;
    }

    const filepath = path.join(outputDir, filename);

    // Build clean, minimal prompt content
    const content = `---
name: "${commandName}"
description: "${command.purpose || `${role.name} command`}"
---

# ${command.purpose || `${role.name} - ${action || roleOrCmd}`}

You are acting as **${role.name}**.

## Command

\`${commandName}\`

## Agent Instructions

See full role instructions and command details in:
- [${role.agent}.md](../../.teamspec/agents/${role.agent}.md)

${command.output ? `## Output

${command.output}
` : ''}
${command.precondition ? `## Precondition

${command.precondition}
` : ''}
---
*Command from registry.yml - TeamSpec 4.0*
`;

    fs.writeFileSync(filepath, content, 'utf-8');
    return filename;
}

/**
 * Generate all prompt files from registry
 */
function generateAllPrompts(targetDir = process.cwd()) {
    const outputDir = path.join(targetDir, '.github', 'prompts');

    // Create output directory
    fs.mkdirSync(outputDir, { recursive: true });

    console.log('🚀 Generating GitHub Copilot prompt files...\n');

    // Load registry and extract data
    const registry = loadRegistry(targetDir);
    const roles = extractRoles(registry);
    const commands = getCommandsFromRegistry(registry);
    const byRole = groupCommandsByRole(commands);

    const generated = [];
    const generatedByRole = {};

    // Generate prompts for each command
    for (const command of commands) {
        if (command.status === 'REMOVED') continue;

        const filename = generatePromptFile(command, outputDir, roles);
        if (filename) {
            generated.push(filename);

            // Track by role for summary
            const role = command.role || 'Any';
            if (!generatedByRole[role]) generatedByRole[role] = [];
            generatedByRole[role].push({ filename, command });
        }
    }

    // Print summary by role
    for (const [roleKey, cmds] of Object.entries(generatedByRole)) {
        const role = getRoleInfo(roles, roleKey);
        console.log(`📋 ${role.name}:`);
        for (const { filename } of cmds) {
            console.log(`   ✓ ${filename}`);
        }
    }

    // Generate README index
    generateReadme(outputDir, generatedByRole, roles, registry);
    generated.push('README.md');

    console.log(`\n✅ Generated ${generated.length} files in ${outputDir}`);
    console.log('\n📖 See .github/prompts/README.md for usage instructions');
    console.log('💡 In Copilot Chat, type "/" to see available prompts');

    return generated;
}

/**
 * Generate README index file
 */
function generateReadme(outputDir, byRole, roles, registry) {
    let pkgVersion = '4.0';
    try {
        const pkg = require('../package.json');
        pkgVersion = pkg.version;
    } catch (e) {
        // Use default
    }

    const rolesSections = Object.entries(byRole).map(([roleKey, cmds]) => {
        const role = getRoleInfo(roles, roleKey);
        const cmdList = cmds.map(({ filename, command }) => {
            return `- \`/${filename.replace('.prompt.md', '')}\` - ${command.purpose || 'Command'}`;
        }).join('\n');

        return `
### ${role.name}

${cmdList}
`;
    }).join('\n');

    const content = `# TeamSpec Copilot Prompts

These prompt files provide structured guidance for TeamSpec commands in GitHub Copilot Chat.

## Usage

In VS Code, type \`/\` in Copilot Chat to see available prompts. Look for prompts starting with \`ts:\`.

## Available Commands

${rolesSections}

## How It Works

1. Type \`/\` in Copilot Chat to see prompts
2. Select a TeamSpec prompt
3. Copilot loads role-specific agent instructions
4. Follow the workflow to create artifacts

## Command Reference

| Command | Role | Purpose |
|---------|------|---------|
${Object.values(byRole).flat().map(({ command }) => {
        const role = getRoleInfo(roles, command.role);
        return `| \`${command.invocation}\` | ${role.name} | ${command.purpose || '-'} |`;
    }).join('\n')}

---

*Generated by TeamSpec CLI v${pkgVersion}*
*Source: registry.yml - TeamSpec ${registry?.version || '4.0'}*
`;

    fs.writeFileSync(path.join(outputDir, 'README.md'), content, 'utf-8');
}

// =============================================================================
// BACKWARDS COMPATIBILITY EXPORTS
// =============================================================================

/**
 * Get all commands for external use
 */
function getCommands(targetDir = process.cwd()) {
    const registry = loadRegistry(targetDir);
    return getCommandsFromRegistry(registry);
}

/**
 * Get ROLES object (extracted from registry)
 * For backwards compatibility with tests
 */
function getRolesFromRegistry(targetDir = process.cwd()) {
    const registry = loadRegistry(targetDir);
    return extractRoles(registry);
}

// Legacy ROLES export - now dynamically loaded
// Kept for backwards compatibility with tests
const ROLES = (() => {
    try {
        const registry = loadRegistry(process.cwd());
        return extractRoles(registry);
    } catch (e) {
        // Fallback for when registry not available
        return {
            PO: { id: 'PO', name: 'Product Owner', agent: 'AGENT_PO', owns: [], creates: [], commands: [] },
            BA: { id: 'BA', name: 'Business Analyst', agent: 'AGENT_BA', owns: [], creates: [], commands: [] },
            FA: { id: 'FA', name: 'Functional Analyst', agent: 'AGENT_FA', owns: [], creates: [], commands: [] },
            SA: { id: 'SA', name: 'Solution Architect', agent: 'AGENT_SA', owns: [], creates: [], commands: [] },
            DEV: { id: 'DEV', name: 'Developer', agent: 'AGENT_DEV', owns: [], creates: [], commands: [] },
            QA: { id: 'QA', name: 'QA Engineer', agent: 'AGENT_QA', owns: [], creates: [], commands: [] },
            SM: { id: 'SM', name: 'Scrum Master', agent: 'AGENT_SM', owns: [], creates: [], commands: [] },
            DES: { id: 'DES', name: 'Designer', agent: 'AGENT_DES', owns: [], creates: [], commands: [] }
        };
    }
})();

// Legacy COMMANDS export - now dynamically built from registry
// Kept for backwards compatibility with tests
const COMMANDS = (() => {
    try {
        const registry = loadRegistry(process.cwd());
        const commands = getCommandsFromRegistry(registry);
        const roles = extractRoles(registry);
        const byRole = groupCommandsByRole(commands);

        const result = {};
        for (const [roleKey, cmds] of Object.entries(byRole)) {
            const role = getRoleInfo(roles, roleKey);
            const normalizedKey = roleKey.toLowerCase() === 'any' ? 'utility' : roleKey.toLowerCase();

            result[normalizedKey] = {
                name: role.name,
                commands: cmds.map(cmd => ({
                    name: cmd.invocation.replace(/^ts:\w+\s*/, '').trim() || cmd.id.split('.').pop(),
                    description: cmd.purpose || '',
                    prompt: ''  // No longer embedding workflow in prompt
                }))
            };
        }

        return result;
    } catch (e) {
        // Fallback for when registry not available
        return {
            ba: { name: 'Business Analyst', commands: [] },
            fa: { name: 'Functional Analyst', commands: [] },
            po: { name: 'Product Owner', commands: [] },
            sa: { name: 'Solution Architect', commands: [] },
            dev: { name: 'Developer', commands: [] },
            qa: { name: 'QA Engineer', commands: [] },
            sm: { name: 'Scrum Master', commands: [] },
            utility: { name: 'Utility', commands: [] }
        };
    }
})();

module.exports = {
    generateAllPrompts,
    getCommands,
    getRolesFromRegistry,
    extractRoles,
    groupCommandsByRole,
    COMMANDS,
    ROLES
};

// CLI execution
if (require.main === module) {
    const targetDir = process.argv[2] || process.cwd();
    generateAllPrompts(targetDir);
}
