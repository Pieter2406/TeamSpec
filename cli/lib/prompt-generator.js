/**
 * TeamSpec Copilot Prompt Generator
 * 
 * Generates GitHub Copilot prompt files for all TeamSpec commands.
 * Commands are loaded from registry.yml to ensure consistency.
 * 
 * Usage: teamspec generate-prompts
 * Version: 4.0
 */

const fs = require('fs');
const path = require('path');
const { loadRegistry, getCommandsFromRegistry } = require('./structure-loader');

// =============================================================================
// ROLE DEFINITIONS (from registry.yml)
// =============================================================================

const ROLES = {
    PO: {
        name: 'Product Owner',
        agent: 'AGENT_PO',
        description: 'Product ownership, PRX assignment, deployment approval, canon sync'
    },
    BA: {
        name: 'Business Analyst',
        agent: 'AGENT_BA',
        description: 'Business analysis, domain knowledge, process documentation'
    },
    FA: {
        name: 'Functional Analyst',
        agent: 'AGENT_FA',
        description: 'Features, Feature-Increments, Epics, Stories'
    },
    SA: {
        name: 'Solution Architect',
        agent: 'AGENT_SA',
        description: 'Technical architecture, solution designs'
    },
    DEV: {
        name: 'Developer',
        agent: 'AGENT_DEV',
        description: 'Development plans, implementation'
    },
    QA: {
        name: 'QA Engineer',
        agent: 'AGENT_QA',
        description: 'Test cases, regression tests, bug reports, verification'
    },
    SM: {
        name: 'Scrum Master',
        agent: 'AGENT_SM',
        description: 'Sprint management, deployment checklist, facilitation'
    },
    DES: {
        name: 'Designer',
        agent: 'AGENT_DES',
        description: 'UX/UI design artifacts'
    }
};

// =============================================================================
// COMMAND PROMPTS (detailed workflow guidance)
// =============================================================================

const COMMAND_PROMPTS = {
    // PO Commands
    'po.product': {
        workflow: `Create a new Product:
1. Gather product information (name, description)
2. Generate unique 3-4 char PRX prefix
3. Create products/{id}/ folder structure
4. Generate product.yml with metadata
5. Create subfolders: business-analysis/, features/, solution-designs/, technical-architecture/, decisions/, qa/regression-tests/
6. Update products-index.md`,
        template: 'product-template.yml',
        output: 'products/{id}/ structure'
    },
    'po.project': {
        workflow: `Create a new Project:
1. Gather project information (name, target products)
2. Create projects/{id}/ folder structure
3. Generate project.yml with target_products
4. Create subfolders per FOLDER_STRUCTURE.yml
5. Initialize index files`,
        template: 'project-template.yml',
        output: 'projects/{id}/ structure'
    },
    'po.sync': {
        workflow: `Sync Product Canon (post-deployment ONLY):
1. Verify Deployment Verification gate passed
2. For each Feature-Increment in project:
   - Merge TO-BE content into Product Feature
   - Update Feature Change Log
3. Update story-ledger.md
4. Set canon_synced in project.yml
5. Archive or close project`,
        precondition: 'Deployment Verification gate passed',
        output: 'Updated Product Canon'
    },
    'po.status': {
        workflow: `Generate business/management status report:
1. Count products and projects
2. Show project health (stories by status)
3. List Feature-Increment states
4. Show QA coverage status
5. Display gate readiness
6. Show sync readiness`,
        output: 'Status report (read-only)'
    },

    // BA Commands
    'ba.analysis': {
        workflow: `Create Business Analysis document:
1. Understand the business domain and problem
2. Document Current State (As-Is) - how users solve problem today
3. Define Future State (To-Be) - improved workflow
4. Identify business rules and success metrics
5. Create ba-PRX-NNN-description.md using template
6. Link to candidate features`,
        template: 'business-analysis-template.md',
        output: 'products/{id}/business-analysis/ba-PRX-*.md'
    },
    'ba.ba-increment': {
        workflow: `Create BA Increment for project:
1. Identify product BA document being modified
2. Document proposed changes
3. Create bai-PRX-NNN-description.md using template
4. Link to affected features`,
        template: 'bai-template.md',
        output: 'projects/{id}/business-analysis-increments/bai-PRX-*.md'
    },
    'ba.review': {
        workflow: `Review artifacts for business intent:
1. Read specified artifact
2. Check business requirements alignment
3. Verify domain terminology
4. Provide feedback`,
        output: 'Review comments'
    },

    // FA Commands
    'fa.feature': {
        workflow: `Create Feature in Product Canon:
1. Gather feature requirements (purpose, value, scope)
2. Define personas/actors
3. Write behavior specification (implementation-agnostic)
4. Create f-PRX-NNN-description.md using template
5. Update features-index.md`,
        template: 'feature-template.md',
        output: 'products/{id}/features/f-PRX-*.md'
    },
    'fa.feature-increment': {
        workflow: `Create Feature-Increment (TO-BE change):
1. Identify target Product Feature (f-PRX-NNN)
2. Document AS-IS (copy from Canon)
3. Document TO-BE (proposed changes)
4. Write Acceptance Criteria
5. Create fi-PRX-NNN-description.md using template
6. Update increments-index.md`,
        template: 'feature-increment-template.md',
        output: 'projects/{id}/feature-increments/fi-PRX-*.md'
    },
    'fa.epic': {
        workflow: `Create Epic (story container):
1. Define epic goal and scope
2. Link to Feature-Increment(s)
3. Identify candidate stories
4. Create epic-PRX-NNN-description.md using template
5. Update epics-index.md`,
        template: 'epic-template.md',
        output: 'projects/{id}/epics/epic-PRX-*.md'
    },
    'fa.story': {
        workflow: `Create Story (delta to Feature):
1. Identify linked Epic (REQUIRED)
2. Reference Feature-Increment
3. Write testable Acceptance Criteria
4. Mark impact type (Adds/Changes/Fixes/Removes)
5. Create s-eXXX-YYY-description.md in stories/backlog/
NEVER create a story without an epic link`,
        template: 'story-template.md',
        output: 'projects/{id}/stories/backlog/s-eXXX-YYY-*.md'
    },
    'fa.sync-proposal': {
        workflow: `Prepare sync proposal for PO:
1. List all completed Feature-Increments
2. Document changes to Product Canon
3. Verify all DoD criteria met
4. Create sync proposal document`,
        output: 'Sync proposal document'
    },
    'fa.slice': {
        workflow: `Slice Feature into Stories:
1. Read Feature Canon entry
2. Identify discrete behavior changes
3. Create story deltas for each change
4. Ensure each story is independently deliverable
5. Link all stories to epic`,
        output: 'Multiple story files'
    },

    // SA Commands
    'sa.ta': {
        workflow: `Create Technical Architecture document:
1. Identify technical decision context
2. Document options considered
3. Record decision and rationale
4. Create ta-PRX-NNN-description.md using template`,
        template: 'ta-template.md',
        output: 'products/{id}/technical-architecture/ta-PRX-*.md'
    },
    'sa.ta-increment': {
        workflow: `Create TA Increment for project:
1. Identify technical changes needed
2. Document architecture delta
3. Create tai-PRX-NNN-description.md using template`,
        template: 'tai-template.md',
        output: 'projects/{id}/technical-architecture-increments/tai-PRX-*.md'
    },
    'sa.sd': {
        workflow: `Create Solution Design document:
1. Define solution scope
2. Document high-level design
3. Create sd-PRX-NNN-description.md using template`,
        template: 'sd-template.md',
        output: 'products/{id}/solution-designs/sd-PRX-*.md'
    },
    'sa.sd-increment': {
        workflow: `Create SD Increment for project:
1. Identify design changes
2. Document solution delta
3. Create sdi-PRX-NNN-description.md using template`,
        template: 'sdi-template.md',
        output: 'projects/{id}/solution-design-increments/sdi-PRX-*.md'
    },
    'sa.review': {
        workflow: `Review technical approach:
1. Read specified artifact
2. Assess technical feasibility
3. Check architecture alignment
4. Provide technical feedback`,
        output: 'Technical assessment'
    },

    // DEV Commands
    'dev.plan': {
        workflow: `Create Development Plan:
1. Read story and linked Feature-Increment
2. Break down into implementation tasks
3. Estimate effort for each task
4. Identify dependencies and risks
5. Create dp-eXXX-sYYY-description.md using template`,
        template: 'dev-plan-template.md',
        output: 'projects/{id}/dev-plans/dp-eXXX-sYYY-*.md'
    },
    'dev.implement': {
        workflow: `Execute Implementation:
1. Load dev plan
2. Work through tasks sequentially
3. Update task completion status (✅)
4. Create/modify code files
5. Track actual vs estimated effort`,
        output: 'Code changes'
    },

    // QA Commands
    'qa.test': {
        workflow: `Create Test Cases for Feature-Increment:
1. Read Feature-Increment and linked stories
2. Identify test scenarios
3. Write test cases with steps and expected results
4. Create tc-fi-PRX-NNN-description.md using template`,
        template: 'tc-template.md',
        output: 'projects/{id}/qa/test-cases/tc-fi-PRX-*.md'
    },
    'qa.verify': {
        workflow: `Validate DoD Compliance:
1. Check all AC verified
2. Verify code reviewed and merged
3. Confirm tests passing
4. Check Feature-Increment TO-BE complete
5. Report verification status`,
        output: 'Verification report'
    },
    'qa.regression': {
        workflow: `Update Product Regression Tests:
1. Identify Feature being modified
2. Create/update regression test documentation
3. Create rt-f-PRX-NNN-description.md using template
4. Link to Product Feature`,
        template: 'rt-template.md',
        output: 'products/{id}/qa/regression-tests/rt-f-PRX-*.md'
    },
    'qa.bug': {
        workflow: `Create Bug Report:
1. Capture bug details and reproduction steps
2. Classify severity
3. Link to affected Feature/Story
4. Create bug-{project}-NNN-description.md using template`,
        template: 'bug-report-template.md',
        output: 'projects/{id}/qa/bug-reports/bug-*.md'
    },
    'qa.uat': {
        workflow: `Create UAT Test Pack:
1. Gather acceptance criteria from stories
2. Create UAT scenarios
3. Prepare test data requirements
4. Create UAT pack using template`,
        template: 'uat-pack-template.md',
        output: 'UAT artifacts'
    },

    // SM Commands
    'sm.sprint': {
        workflow: `Create/Manage Sprint:
1. Determine sprint number
2. Create sprint folder: sprints/sprint-N/
3. Create sprint-goal.md using template
4. Update active-sprint.md
5. Initialize committed-stories.md`,
        template: 'sprint-template.md',
        output: 'projects/{id}/sprints/sprint-N/*'
    },
    'sm.deploy-checklist': {
        workflow: `Run Deployment Readiness Checklist:
1. Verify all sprint stories in terminal state
2. Check Feature-Increments reviewed
3. Confirm code deployed
4. Verify feature toggles enabled
5. Confirm smoke tests passed
6. Check regression impact recorded
7. Get QA sign-off
8. Get PO approval`,
        output: 'Deployment checklist'
    },
    'sm.planning': {
        workflow: `Facilitate Sprint Planning:
1. Review ready-for-development stories
2. Calculate team capacity
3. Select stories for sprint
4. Move story files to sprint folder
5. Update sprint-goal.md`,
        output: 'Sprint plan artifacts'
    },
    'sm.standup': {
        workflow: `Facilitate Daily Standup:
1. Review yesterday's progress
2. Identify blockers
3. Plan today's work
4. Update sprint board`,
        output: 'Standup notes'
    },
    'sm.retro': {
        workflow: `Facilitate Retrospective:
1. Gather what went well
2. Identify improvements
3. Create action items
4. Document retrospective`,
        output: 'Retrospective notes'
    },
    'sm.sync': {
        workflow: `Facilitate Cross-Team Sync:
1. Share team progress
2. Identify dependencies
3. Coordinate on blockers
4. Align on priorities`,
        output: 'Sync notes'
    },

    // Universal Commands
    'lint': {
        workflow: `Run TeamSpec Linter:
1. Scan products/ and projects/ folders
2. Check naming conventions
3. Validate required fields
4. Check cross-references
5. Report errors and warnings`,
        output: 'Lint report'
    },
    'fix': {
        workflow: `Auto-Fix Linter Errors:
1. Run linter to identify errors
2. Apply automatic fixes where possible
3. Report manual fixes needed
4. Re-run linter to verify`,
        output: 'Fixed files'
    }
};

// =============================================================================
// PROMPT FILE GENERATION
// =============================================================================

/**
 * Sanitize a string for use in filenames
 * Removes or replaces invalid characters
 */
function sanitizeFilename(str) {
    return str
        .replace(/<[^>]+>/g, '')  // Remove angle bracket patterns like <role>
        .replace(/[\\/:*?"<>|]/g, '') // Remove Windows-invalid chars
        .replace(/\s+/g, '-')     // Replace spaces with dashes
        .replace(/-+/g, '-')      // Collapse multiple dashes
        .replace(/^-|-$/g, '');   // Remove leading/trailing dashes
}

/**
 * Generate GitHub Copilot prompt file
 */
function generatePromptFile(command, outputDir, registry) {
    // Parse command invocation (e.g., "ts:po product" -> role="po", action="product")
    const match = command.invocation.match(/^ts:(\w+)(?:\s+(.+))?$/);
    if (!match) return null;

    const [, roleOrCmd, action] = match;

    // Skip commands with placeholders in action (e.g., ts:agent <role>)
    if (action && action.includes('<')) {
        return null;
    }

    // Determine filename and command name
    let filename, commandName;
    if (action) {
        // Role-specific command (e.g., ts:po product)
        const sanitizedAction = sanitizeFilename(action);
        filename = `${roleOrCmd}-${sanitizedAction}.prompt.md`;
        commandName = `ts:${roleOrCmd}-${sanitizedAction}`;
    } else {
        // Universal command (e.g., ts:lint)
        filename = `${roleOrCmd}.prompt.md`;
        commandName = `ts:${roleOrCmd}`;
    }

    const filepath = path.join(outputDir, filename);

    // Get role info
    const roleKey = roleOrCmd.toUpperCase();
    const role = ROLES[roleKey] || { name: 'TeamSpec', agent: 'AGENT_BOOTSTRAP', description: 'Universal command' };

    // Get command prompt details
    const promptKey = command.id || `${roleOrCmd}.${action || roleOrCmd}`;
    const promptDetails = COMMAND_PROMPTS[promptKey] || {};

    // Build prompt content
    const content = `---
name: "${commandName}"
description: "TeamSpec ${role.name}: ${command.purpose || action || roleOrCmd}"
agent: "agent"
---

# ${command.purpose || `${role.name} - ${action || roleOrCmd}`}

Execute the **${action || roleOrCmd}** workflow as a **${role.name}**.

See full role instructions: [${role.agent}.md](../../.teamspec/agents/${role.agent}.md)

## Workflow

${promptDetails.workflow || command.purpose || 'Execute the command workflow.'}

${promptDetails.template ? `## Template

Use template: \`/.teamspec/templates/${promptDetails.template}\`
` : ''}
## Output

${promptDetails.output || command.output || 'Generated artifacts'}

${promptDetails.precondition ? `## Precondition

${promptDetails.precondition}
` : ''}
---

> Generated from registry.yml - TeamSpec 4.0
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

    // Load registry
    const registry = loadRegistry(targetDir);
    const commands = getCommandsFromRegistry(registry);

    const generated = [];
    const byRole = {};

    // Generate prompts for each command
    for (const command of commands) {
        if (command.status === 'REMOVED') continue;

        const filename = generatePromptFile(command, outputDir, registry);
        if (filename) {
            generated.push(filename);

            // Group by role for summary
            const role = command.role || 'Any';
            if (!byRole[role]) byRole[role] = [];
            byRole[role].push({ filename, command });
        }
    }

    // Print summary by role
    for (const [role, cmds] of Object.entries(byRole)) {
        const roleName = ROLES[role]?.name || role;
        console.log(`📋 ${roleName}:`);
        for (const { filename } of cmds) {
            console.log(`   ✓ ${filename}`);
        }
    }

    // Generate README index
    generateReadme(outputDir, byRole, registry);
    generated.push('README.md');

    console.log(`\n✅ Generated ${generated.length} files in ${outputDir}`);
    console.log('\n📖 See .github/prompts/README.md for usage instructions');
    console.log('💡 In Copilot Chat, type "/" to see available prompts');

    return generated;
}

/**
 * Generate README index file
 */
function generateReadme(outputDir, byRole, registry) {
    const pkg = require('../package.json');

    const rolesSections = Object.entries(byRole).map(([role, cmds]) => {
        const roleName = ROLES[role]?.name || role;
        const cmdList = cmds.map(({ filename, command }) => {
            const cmdName = filename.replace('.prompt.md', '');
            return `- \`/ts:${cmdName}\` - ${command.purpose || cmdName}`;
        }).join('\n');

        return `
### ${roleName}

${cmdList}
`;
    }).join('\n');

    const content = `# TeamSpec Copilot Prompts

These prompt files provide structured guidance for TeamSpec commands in GitHub Copilot Chat.

## Usage

In VS Code, type \`/\` in Copilot Chat to see available prompts. Look for prompts starting with \`ts:\`.

Alternatively, run any prompt directly:
- Press \`Ctrl+Shift+P\` (or \`Cmd+Shift+P\` on Mac)
- Type "Chat: Run Prompt"
- Select a TeamSpec prompt

## Available Commands

${rolesSections}

## How It Works

1. Type \`/\` in Copilot Chat to see prompts
2. Select a \`ts:\` prefixed prompt
3. Copilot provides role-specific guidance
4. Follow the workflow to create artifacts

## Command Reference

| Command | Role | Purpose |
|---------|------|---------|
${Object.values(byRole).flat().map(({ command }) =>
        `| \`${command.invocation}\` | ${command.role || 'Any'} | ${command.purpose || '-'} |`
    ).join('\n')}

---

*Generated by TeamSpec CLI v${pkg.version}*
*Source: registry.yml - TeamSpec ${registry?.version || '4.0'}*
`;

    fs.writeFileSync(path.join(outputDir, 'README.md'), content, 'utf-8');
}

/**
 * Get all commands for external use (backwards compatibility)
 */
function getCommands(targetDir = process.cwd()) {
    const registry = loadRegistry(targetDir);
    return getCommandsFromRegistry(registry);
}

// Legacy COMMANDS export for backwards compatibility with tests
const COMMANDS = {
    ba: {
        name: 'Business Analyst',
        commands: [
            { name: 'analysis', description: 'Create business analysis document', prompt: COMMAND_PROMPTS['ba.analysis']?.workflow || '' },
            { name: 'ba-increment', description: 'Create BA increment', prompt: COMMAND_PROMPTS['ba.ba-increment']?.workflow || '' },
            { name: 'review', description: 'Review artifacts', prompt: COMMAND_PROMPTS['ba.review']?.workflow || '' }
        ]
    },
    fa: {
        name: 'Functional Analyst',
        commands: [
            { name: 'feature', description: 'Create feature', prompt: COMMAND_PROMPTS['fa.feature']?.workflow || '' },
            { name: 'feature-increment', description: 'Create feature-increment', prompt: COMMAND_PROMPTS['fa.feature-increment']?.workflow || '' },
            { name: 'epic', description: 'Create epic', prompt: COMMAND_PROMPTS['fa.epic']?.workflow || '' },
            { name: 'story', description: 'Create story', prompt: COMMAND_PROMPTS['fa.story']?.workflow || '' },
            { name: 'slice', description: 'Slice feature', prompt: COMMAND_PROMPTS['fa.slice']?.workflow || '' },
            { name: 'sync-proposal', description: 'Prepare sync proposal', prompt: COMMAND_PROMPTS['fa.sync-proposal']?.workflow || '' }
        ]
    },
    po: {
        name: 'Product Owner',
        commands: [
            { name: 'product', description: 'Create product', prompt: COMMAND_PROMPTS['po.product']?.workflow || '' },
            { name: 'project', description: 'Create project', prompt: COMMAND_PROMPTS['po.project']?.workflow || '' },
            { name: 'sync', description: 'Sync canon', prompt: COMMAND_PROMPTS['po.sync']?.workflow || '' },
            { name: 'status', description: 'Status report', prompt: COMMAND_PROMPTS['po.status']?.workflow || '' }
        ]
    },
    sa: {
        name: 'Solution Architect',
        commands: [
            { name: 'ta', description: 'Create TA', prompt: COMMAND_PROMPTS['sa.ta']?.workflow || '' },
            { name: 'ta-increment', description: 'Create TAI', prompt: COMMAND_PROMPTS['sa.ta-increment']?.workflow || '' },
            { name: 'sd', description: 'Create SD', prompt: COMMAND_PROMPTS['sa.sd']?.workflow || '' },
            { name: 'sd-increment', description: 'Create SDI', prompt: COMMAND_PROMPTS['sa.sd-increment']?.workflow || '' },
            { name: 'review', description: 'Review technical', prompt: COMMAND_PROMPTS['sa.review']?.workflow || '' }
        ]
    },
    dev: {
        name: 'Developer',
        commands: [
            { name: 'plan', description: 'Create dev plan', prompt: COMMAND_PROMPTS['dev.plan']?.workflow || '' },
            { name: 'implement', description: 'Implement', prompt: COMMAND_PROMPTS['dev.implement']?.workflow || '' }
        ]
    },
    qa: {
        name: 'QA Engineer',
        commands: [
            { name: 'test', description: 'Create test cases', prompt: COMMAND_PROMPTS['qa.test']?.workflow || '' },
            { name: 'verify', description: 'Verify DoD', prompt: COMMAND_PROMPTS['qa.verify']?.workflow || '' },
            { name: 'regression', description: 'Update regression', prompt: COMMAND_PROMPTS['qa.regression']?.workflow || '' },
            { name: 'bug', description: 'File bug', prompt: COMMAND_PROMPTS['qa.bug']?.workflow || '' },
            { name: 'uat', description: 'Create UAT pack', prompt: COMMAND_PROMPTS['qa.uat']?.workflow || '' }
        ]
    },
    sm: {
        name: 'Scrum Master',
        commands: [
            { name: 'sprint', description: 'Manage sprint', prompt: COMMAND_PROMPTS['sm.sprint']?.workflow || '' },
            { name: 'deploy-checklist', description: 'Deploy checklist', prompt: COMMAND_PROMPTS['sm.deploy-checklist']?.workflow || '' },
            { name: 'planning', description: 'Sprint planning', prompt: COMMAND_PROMPTS['sm.planning']?.workflow || '' },
            { name: 'standup', description: 'Daily standup', prompt: COMMAND_PROMPTS['sm.standup']?.workflow || '' },
            { name: 'retro', description: 'Retrospective', prompt: COMMAND_PROMPTS['sm.retro']?.workflow || '' },
            { name: 'sync', description: 'Team sync', prompt: COMMAND_PROMPTS['sm.sync']?.workflow || '' }
        ]
    },
    utility: {
        name: 'Utility',
        commands: [
            { name: 'lint', description: 'Run linter', prompt: COMMAND_PROMPTS['lint']?.workflow || '' },
            { name: 'fix', description: 'Auto-fix', prompt: COMMAND_PROMPTS['fix']?.workflow || '' }
        ]
    }
};

module.exports = {
    generateAllPrompts,
    getCommands,
    COMMANDS,
    ROLES,
    COMMAND_PROMPTS
};

// CLI execution
if (require.main === module) {
    const targetDir = process.argv[2] || process.cwd();
    generateAllPrompts(targetDir);
}
