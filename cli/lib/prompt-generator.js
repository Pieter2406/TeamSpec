/**
 * TeamSpec Copilot Command Generator
 * 
 * Generates GitHub Copilot prompt files for all TeamSpec commands.
 * Usage: teamspec generate-prompts
 */

const fs = require('fs');
const path = require('path');

// Command definitions from agent system
const COMMANDS = {
  ba: {
    name: 'Business Analyst',
    commands: [
      {
        name: 'project',
        description: 'Create project structure',
        prompt: `Execute project creation workflow:
1. Gather project information (name, ID, stakeholders, goals)
2. Create project folder structure in projects/{id}/
3. Generate project.yml with metadata
4. Create README.md
5. Initialize folders: features/, stories/backlog/, stories/ready-to-refine/, stories/ready-for-development/, adr/, decisions/, dev-plans/, qa/test-cases/, epics/, sprints/
6. Create features-index.md and story-ledger.md
Wait for user confirmation before creating files.`
      },
      {
        name: 'epic',
        description: 'Define an epic',
        prompt: `Execute epic creation workflow:
1. Identify epic scope and goal
2. Link to project
3. Break down into candidate features
4. Create epic file in epics/ folder
Wait for user confirmation before creating files.`
      },
      {
        name: 'feature',
        description: 'Create feature file',
        prompt: `Execute feature creation workflow:
1. Gather feature requirements (purpose, value, scope)
2. Define personas/actors
3. Create feature file in features/ folder using F-XXX-name.md format
4. Update features-index.md
Ensure feature is implementation-agnostic.
Wait for user confirmation before creating files.`
      },
      {
        name: 'decision',
        description: 'Log business decision',
        prompt: `Log a business decision:
1. Capture decision context
2. Document options considered
3. Record rationale
4. Link to affected features
5. Create decision file in decisions/ folder using DECISION-XXX-name.md format`
      }
    ]
  },
  fa: {
    name: 'Functional Analyst',
    commands: [
      {
        name: 'story',
        description: 'Create a new story',
        prompt: `Create a story as a DELTA to the Feature Canon:
1. Identify the linked feature (REQUIRED)
2. Document BEFORE state (reference Canon)
3. Document AFTER state (the delta)
4. Write testable Acceptance Criteria
5. Mark impact type (Adds/Changes/Fixes/Removes)
6. Create story in stories/backlog/ using S-XXX-name.md format
NEVER create a story without a feature link.`
      },
      {
        name: 'slice',
        description: 'Slice feature into stories',
        prompt: `Slice a feature into implementable stories:
1. Read the Feature Canon entry
2. Identify discrete behavior changes
3. Create story deltas for each change
4. Ensure each story is independently deliverable
5. Link all stories to the feature
Create files in stories/backlog/`
      },
      {
        name: 'refine',
        description: 'Move story to ready-to-refine',
        prompt: `Refine a story for development:
1. Verify feature link exists
2. Check Before/After delta is clear
3. Validate ACs are testable
4. Move file from stories/backlog/ to stories/ready-to-refine/`
      },
      {
        name: 'sync',
        description: 'Update Feature Canon after story completion',
        prompt: `CRITICAL: Canon sync workflow:
1. Identify completed story
2. Check impact type (Adds/Changes Behavior?)
3. Update Feature Canon sections in features/
4. Add Change Log entry with story reference
5. Update story-ledger.md
6. Verify DoD checkbox is checked
A story CANNOT be Done until Canon is synchronized.`
      }
    ]
  },
  arch: {
    name: 'Solution Architect',
    commands: [
      {
        name: 'adr',
        description: 'Create Architecture Decision Record',
        prompt: `Create an ADR:
1. Identify technical decision
2. Document context and options
3. Record decision and rationale
4. Link to affected features
5. Create ADR file in adr/ folder using ADR-XXX-name.md format`
      }
    ]
  },
  dev: {
    name: 'Developer',
    commands: [
      {
        name: 'plan',
        description: 'Create development plan',
        prompt: `Create a development plan:
1. Read the story and linked feature
2. Break down into implementation tasks
3. Estimate effort for each task
4. Identify dependencies and risks
5. Create dev plan in dev-plans/ using story-XXX-tasks.md format`
      },
      {
        name: 'implement',
        description: 'Execute implementation',
        prompt: `Execute implementation:
1. Load dev plan
2. Work through tasks sequentially
3. Update task completion status
4. Create/modify code files
5. Track actual vs estimated effort`
      },
      {
        name: 'ready',
        description: 'Move story to ready-for-development',
        prompt: `Move story to ready-for-development:
1. Verify dev plan exists
2. Check DoR criteria
3. Move file from stories/ready-to-refine/ to stories/ready-for-development/`
      }
    ]
  },
  qa: {
    name: 'QA Engineer',
    commands: [
      {
        name: 'test',
        description: 'Design test cases',
        prompt: `Design test cases:
1. Read feature specification
2. Identify test scenarios
3. Write test cases with steps and expected results
4. Create test file in qa/test-cases/ using F-XXX-test-cases.md format`
      },
      {
        name: 'bug',
        description: 'File bug report',
        prompt: `File a bug report:
1. Capture bug details
2. Document reproduction steps
3. Classify severity
4. Link to affected feature
5. Create bug file in bugs/ folder`
      },
      {
        name: 'dor-check',
        description: 'Validate Definition of Ready',
        prompt: `Check Definition of Ready:
1. Verify feature link exists
2. Check Before/After delta is clear
3. Validate ACs are testable
4. Confirm no TBD/placeholder content
5. Check estimate is assigned
Report any gaps.`
      }
    ]
  },
  sm: {
    name: 'Scrum Master',
    commands: [
      {
        name: 'sprint-create',
        description: 'Create new sprint',
        prompt: `Create new sprint:
1. Determine sprint number
2. Create sprint folder: sprints/sprint-N/
3. Create sprint-goal.md
4. Update active-sprint.md`
      },
      {
        name: 'sprint-plan',
        description: 'Plan sprint backlog',
        prompt: `Plan sprint backlog:
1. Review ready-for-development stories
2. Calculate team capacity
3. Select stories for sprint
4. Move story files to sprints/sprint-N/
5. Update sprint-goal.md`
      },
      {
        name: 'sprint-status',
        description: 'Sprint status report',
        prompt: `Generate sprint status:
1. Count stories by status
2. Calculate burndown
3. Identify blockers
4. Report health metrics`
      }
    ]
  }
};

/**
 * Generate GitHub Copilot prompt file
 */
function generatePromptFile(role, command, outputDir) {
  const filename = `${role}-${command.name}.prompt.md`;
  const filepath = path.join(outputDir, filename);
  
  const content = `# TeamSpec: ${COMMANDS[role].name} - ${command.description}

**Command:** \`ts:${role}-${command.name}\`

---

## Role Context

You are acting as a **${COMMANDS[role].name}** in the TeamSpec Feature Canon operating model.

## Task

${command.prompt}

## Quality Gates

- Follow TeamSpec naming conventions (F-XXX, S-XXX, ADR-XXX, etc.)
- Use templates from \`.teamspec/templates/\`
- Link to Feature Canon where applicable
- Wait for user confirmation before creating files
- Validate against Definition of Ready/Done

## Related Files

- Templates: \`.teamspec/templates/\`
- Project Structure: \`PROJECT_STRUCTURE.yml\`
- Role Definition: \`roles/ROLES_AND_RESPONSIBILITIES.md\`
- Agent Prompt: \`agents/AGENT_${role.toUpperCase()}.md\`

---

*Generated by TeamSpec CLI v3.0*
`;

  fs.writeFileSync(filepath, content, 'utf-8');
  return filename;
}

/**
 * Generate all prompt files
 */
function generateAllPrompts(targetDir = process.cwd()) {
  const outputDir = path.join(targetDir, '.github', 'copilot-prompts');
  
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('🚀 Generating GitHub Copilot prompt files...\n');
  
  const generated = [];
  
  // Generate prompts for each role and command
  for (const [role, config] of Object.entries(COMMANDS)) {
    console.log(`📋 ${config.name}:`);
    for (const command of config.commands) {
      const filename = generatePromptFile(role, command, outputDir);
      generated.push(filename);
      console.log(`   ✓ ${filename}`);
    }
  }
  
  // Generate index file
  const indexContent = `# TeamSpec Copilot Prompts

These prompt files provide structured guidance for TeamSpec commands in GitHub Copilot.

## Usage

In GitHub Copilot Chat, use the \`ts:\` prefix followed by role and command:

\`\`\`
ts:ba-project        # Create project structure
ts:fa-story         # Create delta-based story
ts:dev-plan         # Create development plan
ts:qa-test          # Design test cases
\`\`\`

## Available Commands

${Object.entries(COMMANDS).map(([role, config]) => `
### ${config.name} (\`ts:${role}-*\`)

${config.commands.map(cmd => `- \`ts:${role}-${cmd.name}\` - ${cmd.description}`).join('\n')}
`).join('\n')}

## How It Works

1. Type \`ts:role-command\` in Copilot Chat
2. Copilot loads the corresponding prompt file
3. Copilot provides role-specific guidance
4. Follow the workflow to create artifacts

---

*Generated by TeamSpec CLI v${require('../package.json').version}*
`;

  fs.writeFileSync(path.join(outputDir, 'README.md'), indexContent, 'utf-8');
  generated.push('README.md');
  
  console.log(`\n✅ Generated ${generated.length} files in ${outputDir}`);
  console.log('\n📖 See .github/copilot-prompts/README.md for usage instructions');
  
  return generated;
}

module.exports = {
  generateAllPrompts,
  COMMANDS
};

// CLI execution
if (require.main === module) {
  const targetDir = process.argv[2] || process.cwd();
  generateAllPrompts(targetDir);
}
