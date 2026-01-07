/**
 * TeamSpec Init CLI - Pure JavaScript implementation
 * Version 3.0.0 - Feature Canon Operating Model
 * 
 * This CLI bootstraps TeamSpec 2.0 in any repository by:
 * 1. Asking team setup questions
 * 2. Deploying .teamspec/ folder with core files
 * 3. Creating project structure
 * 4. Configuring IDE-specific agent files (placeholder for later)
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// =============================================================================
// ANSI Color Helpers
// =============================================================================

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[91m',
  green: '\x1b[92m',
  yellow: '\x1b[93m',
  blue: '\x1b[94m',
  magenta: '\x1b[95m',
  cyan: '\x1b[96m',
};

function colored(text, color) {
  if (process.stdout.isTTY) {
    return `${color}${text}${colors.reset}`;
  }
  return text;
}

// =============================================================================
// Banner
// =============================================================================

function printBanner() {
  const banner = `
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║   ████████╗███████╗ █████╗ ███╗   ███╗███████╗██████╗ ███████╗  ║
║   ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██╔════╝██╔══██╗██╔════╝  ║
║      ██║   █████╗  ███████║██╔████╔██║███████╗██████╔╝█████╗    ║
║      ██║   ██╔══╝  ██╔══██║██║╚██╔╝██║╚════██║██╔═══╝ ██╔══╝    ║
║      ██║   ███████╗██║  ██║██║ ╚═╝ ██║███████║██║     ███████╗  ║
║      ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚═╝     ╚══════╝  ║
║                                                                  ║
║         Feature Canon Operating Model v2.0                       ║
╚══════════════════════════════════════════════════════════════════╝
`;
  console.log(colored(banner, colors.cyan));
}

// =============================================================================
// Configuration Options
// =============================================================================

// IDE/Agent framework configurations
// Note: Agent files are placeholders - actual deployment handled later
const IDE_CONFIGS = {
  copilot: {
    name: 'GitHub Copilot',
    instructionPath: '.github/copilot-instructions.md',
    description: 'GitHub Copilot (VS Code, JetBrains, Neovim)',
  },
  cursor: {
    name: 'Cursor',
    instructionPath: '.cursor/rules',
    description: 'Cursor AI IDE',
  },
  claude: {
    name: 'Claude (Anthropic)',
    instructionPath: 'CLAUDE.md',
    description: 'Claude Code / Claude Projects',
  },
  windsurf: {
    name: 'Windsurf (Codeium)',
    instructionPath: '.windsurfrules',
    description: 'Windsurf AI IDE by Codeium',
  },
  aider: {
    name: 'Aider',
    instructionPath: '.aider/conventions.md',
    description: 'Aider AI pair programming',
  },
  cline: {
    name: 'Cline',
    instructionPath: '.clinerules',
    description: 'Cline VS Code extension',
  },
  continue: {
    name: 'Continue',
    instructionPath: '.continue/config.json',
    description: 'Continue.dev AI assistant',
    format: 'json',
  },
  generic: {
    name: 'Generic / Manual',
    instructionPath: '.teamspec/AGENT_INSTRUCTIONS.md',
    description: 'Generic instructions - configure manually',
  },
};

// Profile options
const PROFILE_OPTIONS = {
  none: 'No specific profile - vanilla TeamSpec',
  regulated: 'Regulated industry (banking, healthcare, government) - strict compliance',
  startup: 'Startup/MVP mode - lean documentation, speed focus',
  'platform-team': 'Platform/infrastructure team - API-first, SLA focus',
  enterprise: 'Enterprise - governance, audit trails, multi-team coordination',
};

// Industry options
const INDUSTRY_OPTIONS = {
  technology: 'Technology / Software',
  finance: 'Financial Services / Banking',
  healthcare: 'Healthcare / Life Sciences',
  retail: 'Retail / E-commerce',
  manufacturing: 'Manufacturing / Industrial',
  government: 'Government / Public Sector',
  other: 'Other',
};

// Cadence options
const CADENCE_OPTIONS = {
  scrum: 'Scrum (time-boxed sprints)',
  kanban: 'Kanban (continuous flow)',
  scrumban: 'Scrumban (hybrid)',
};

// Default project ID for single-project repos
const DEFAULT_PROJECT_ID = 'main-project';

// =============================================================================
// Argument Parsing
// =============================================================================

function parseArgs(args) {
  const options = {
    command: 'init', // default command
    target: process.cwd(),
    ide: null,
    profile: null,
    org: null,
    team: null,
    project: null,
    nonInteractive: false,
    help: false,
    version: false,
    force: false,
  };

  let i = 0;

  // Check if first argument is a command
  if (args.length > 0 && !args[0].startsWith('-')) {
    const cmd = args[0].toLowerCase();
    if (['init', 'update', 'version'].includes(cmd)) {
      options.command = cmd;
      i = 1;
    }
  }

  for (; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--help':
      case '-h':
        options.help = true;
        break;
      case '--version':
      case '-v':
        options.version = true;
        break;
      case '--target':
      case '-t':
        options.target = args[++i];
        break;
      case '--ide':
      case '-i':
        options.ide = args[++i];
        break;
      case '--profile':
      case '-p':
        options.profile = args[++i];
        break;
      case '--org':
      case '-o':
        options.org = args[++i];
        break;
      case '--team':
        options.team = args[++i];
        break;
      case '--project':
        options.project = args[++i];
        break;
      case '--non-interactive':
      case '-y':
        options.nonInteractive = true;
        break;
      case '--force':
      case '-f':
        options.force = true;
        break;
    }
  }

  return options;
}

// =============================================================================
// Help and Version
// =============================================================================

function printHelp() {
  console.log(`
${colored('TeamSpec Init', colors.bold)} - Bootstrap TeamSpec 2.0 Feature Canon Operating Model

${colored('USAGE:', colors.bold)}
  teamspec [command] [options]

${colored('COMMANDS:', colors.bold)}
  init [options]          Initialize TeamSpec in a repository (default)
  update [options]        Update TeamSpec core files (keeps team context)

${colored('OPTIONS:', colors.bold)}
  -h, --help              Show this help message
  -v, --version           Show version number
  -t, --target <dir>      Target directory (default: current directory)
  -i, --ide <ide>         AI IDE to configure
  -p, --profile <profile> Team profile to use
  -o, --org <name>        Organization name
  --team <name>           Team name
  --project <id>          Project ID for folder structure (default: main-project)
  -y, --non-interactive   Run without prompts (use defaults)
  -f, --force             Force update without confirmation

${colored('SUPPORTED IDEs:', colors.bold)}
  copilot      GitHub Copilot (VS Code, JetBrains, Neovim)
  cursor       Cursor AI IDE
  claude       Claude Code / Claude Projects
  windsurf     Windsurf AI IDE by Codeium
  aider        Aider AI pair programming
  cline        Cline VS Code extension
  continue     Continue.dev AI assistant
  generic      Generic instructions - configure manually

${colored('PROFILES:', colors.bold)}
  none           Vanilla TeamSpec
  regulated      Banking, healthcare, government (strict compliance)
  startup        Lean documentation, speed focus
  platform-team  API-first, SLA focus
  enterprise     Full governance, audit trails

${colored('EXAMPLES:', colors.bold)}
  teamspec                              # Interactive setup
  teamspec --ide copilot                # Quick setup for GitHub Copilot
  teamspec update                       # Update core files, keep context
  teamspec update --force               # Update without confirmation

${colored('WHAT GETS CREATED:', colors.bold)}
  .teamspec/                 Core framework
    ├── templates/           Document templates
    ├── definitions/         DoR/DoD checklists
    ├── context/             Team configuration (team.yml)
    └── profiles/            Profile overlays
  projects/<project-id>/     Project artifacts
    ├── features/            Feature Canon (source of truth)
    ├── stories/             User stories (workflow folders)
    ├── adr/                 Architecture decisions
    └── ...
`);
}

function printVersion() {
  const pkg = require('../package.json');
  console.log(`teamspec ${pkg.version}`);
}

// =============================================================================
// File System Utilities
// =============================================================================

function getTeamspecCoreDir() {
  return path.join(__dirname, '..', 'teamspec-core');
}

function copyDirRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// =============================================================================
// Interactive Prompts
// =============================================================================

function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function prompt(rl, question, defaultValue = '') {
  return new Promise((resolve) => {
    const defaultHint = defaultValue ? ` [${defaultValue}]` : '';
    rl.question(`${question}${defaultHint}: `, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

function promptYesNo(rl, question, defaultValue = true) {
  return new Promise((resolve) => {
    const choices = defaultValue ? '[Y/n]' : '[y/N]';
    rl.question(`${question} ${choices}: `, (answer) => {
      const normalized = answer.trim().toLowerCase();
      if (!normalized) {
        resolve(defaultValue);
      } else if (normalized === 'y' || normalized === 'yes') {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

async function promptChoice(rl, question, options, defaultValue = null) {
  console.log(`\n${colored(question, colors.bold)}`);
  const keys = Object.keys(options);
  for (const key of keys) {
    const marker = key === defaultValue ? ' (default)' : '';
    console.log(`  ${colored(key, colors.cyan)}: ${options[key]}${marker}`);
  }

  while (true) {
    const answer = await prompt(rl, `\nYour choice`, defaultValue || '');
    if (keys.includes(answer.toLowerCase())) {
      return answer.toLowerCase();
    }
    console.log(`Invalid choice. Please choose from: ${keys.join(', ')}`);
  }
}

// =============================================================================
// Team Setup Questions
// =============================================================================

async function runInteractive(options) {
  const rl = createReadlineInterface();

  try {
    // IDE selection
    if (!options.ide) {
      options.ide = await promptChoice(
        rl,
        'Which AI IDE/Agent will you use?',
        Object.fromEntries(Object.entries(IDE_CONFIGS).map(([k, v]) => [k, v.description])),
        'copilot'
      );
    }

    // Profile selection
    if (!options.profile) {
      options.profile = await promptChoice(
        rl,
        'What type of team/environment?',
        PROFILE_OPTIONS,
        'none'
      );
    }

    // Organization name
    if (!options.org) {
      options.org = await prompt(
        rl,
        `\n${colored('Organization name', colors.bold)}`,
        'My Organization'
      );
    }

    // Team name
    if (!options.team) {
      options.team = await prompt(
        rl,
        `${colored('Team name', colors.bold)}`,
        'My Team'
      );
    }

    // Industry
    options.industry = await promptChoice(
      rl,
      'What industry is your organization in?',
      INDUSTRY_OPTIONS,
      'technology'
    );

    // Cadence
    options.cadence = await promptChoice(
      rl,
      'What development cadence does your team use?',
      CADENCE_OPTIONS,
      'scrum'
    );

    // Sprint length (if scrum/scrumban)
    if (options.cadence !== 'kanban') {
      const sprintLength = await prompt(
        rl,
        `\n${colored('Sprint length (days)', colors.bold)}`,
        '14'
      );
      options.sprintLengthDays = parseInt(sprintLength, 10) || 14;
    } else {
      options.sprintLengthDays = null;
    }

    // Project ID
    if (!options.project) {
      console.log(`\n${colored('Project Structure', colors.bold)}`);
      console.log('  TeamSpec organizes artifacts in project folders: projects/<project-id>/');
      options.project = await prompt(
        rl,
        `${colored('Initial project ID', colors.bold)} (lowercase, hyphenated)`,
        DEFAULT_PROJECT_ID
      );
      options.project = normalizeProjectId(options.project);
    }

    // Confirmation
    console.log(`\n${colored('Configuration:', colors.bold)}`);
    console.log(`  IDE:             ${IDE_CONFIGS[options.ide].name}`);
    console.log(`  Profile:         ${options.profile}`);
    console.log(`  Organization:    ${options.org}`);
    console.log(`  Team:            ${options.team}`);
    console.log(`  Industry:        ${options.industry}`);
    console.log(`  Cadence:         ${options.cadence}`);
    if (options.sprintLengthDays) {
      console.log(`  Sprint Length:   ${options.sprintLengthDays} days`);
    }
    console.log(`  Project ID:      ${options.project}`);

    const proceed = await promptYesNo(
      rl,
      `\n${colored('Proceed with initialization?', colors.bold)}`,
      true
    );
    if (!proceed) {
      console.log('Aborted.');
      process.exit(0);
    }
  } finally {
    rl.close();
  }

  return options;
}

function normalizeProjectId(projectId) {
  const normalized = projectId.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return normalized || DEFAULT_PROJECT_ID;
}

// =============================================================================
// Core File Deployment
// =============================================================================

function copyTeamspecCore(targetDir, sourceDir) {
  const targetTeamspec = path.join(targetDir, '.teamspec');

  const dirsToCopy = [
    'definitions',
    'profiles',
    'templates',
  ];

  const filesToCopy = ['teamspec.yml'];

  console.log(`\n${colored('Copying TeamSpec core files...', colors.blue)}`);

  fs.mkdirSync(targetTeamspec, { recursive: true });

  // Copy directories
  for (const dirName of dirsToCopy) {
    const src = path.join(sourceDir, dirName);
    const dest = path.join(targetTeamspec, dirName);
    if (fs.existsSync(src)) {
      if (fs.existsSync(dest)) {
        fs.rmSync(dest, { recursive: true });
      }
      copyDirRecursive(src, dest);
      console.log(`  ✓ Copied ${dirName}/`);
    }
  }

  // Copy files
  for (const fileName of filesToCopy) {
    const src = path.join(sourceDir, fileName);
    const dest = path.join(targetTeamspec, fileName);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`  ✓ Copied ${fileName}`);
    }
  }

  // Create context directory
  const contextDir = path.join(targetTeamspec, 'context');
  fs.mkdirSync(contextDir, { recursive: true });

  // Copy schema
  const schemaSrc = path.join(sourceDir, 'context', '_schema.yml');
  if (fs.existsSync(schemaSrc)) {
    fs.copyFileSync(schemaSrc, path.join(contextDir, '_schema.yml'));
    console.log('  ✓ Copied context/_schema.yml');
  }
}

// =============================================================================
// Team Context Creation
// =============================================================================

function createTeamContext(targetDir, options) {
  const contextDir = path.join(targetDir, '.teamspec', 'context');
  fs.mkdirSync(contextDir, { recursive: true });

  const teamYml = `# Team Context Configuration
# This file parameterizes the TeamSpec Core for your specific team.
# See _schema.yml for full schema documentation.

# ==============================================================================
# Organization
# ==============================================================================
org:
  name: "${options.org}"
  department: "Engineering"
  industry: ${options.industry}
  profile: ${options.profile}  # Options: regulated, startup, platform-team, enterprise, none
  compliance: []  # Options: SOX, PCI-DSS, HIPAA, GDPR, SOC2, ISO27001, FedRAMP, POPIA

# ==============================================================================
# Team
# ==============================================================================
team:
  name: "${options.team}"
  roles:
    - BA   # Business Analyst
    - FA   # Functional Analyst
    - SA   # Solution Architect
    - DEV  # Developer
    - QA   # Quality Assurance
    - SM   # Scrum Master
    - DES  # Designer (optional)
  
  # Optional: Map roles to team members
  # roster:
  #   BA: ["alice@example.com"]
  #   FA: ["bob@example.com"]
  #   DEV: ["dev1@example.com", "dev2@example.com"]
  #   QA: ["tester@example.com"]
  
  cadence:
    type: ${options.cadence}  # Options: scrum, kanban, scrumban
${options.sprintLengthDays ? `    sprint_length_days: ${options.sprintLengthDays}` : '    # sprint_length_days: N/A for kanban'}
  
  # Optional: Team communication channels
  # channels:
  #   slack: "#your-team"
  #   jira_project: "PROJ"
  #   confluence_space: "TeamSpace"

# ==============================================================================
# Technology Stack
# ==============================================================================
tech:
  stack: []
    # Add your technologies, e.g.:
    # - Python
    # - React
    # - PostgreSQL
  
  architecture:
    type: monolith  # Options: monolith, microservices, modular-monolith, serverless
  
  # Optional: Quality gates
  # quality:
  #   min_test_coverage: 80
  #   require_code_review: true

# ==============================================================================
# Governance (customize based on your profile)
# ==============================================================================
governance:
  sign_off_required: ${options.profile === 'regulated' || options.profile === 'enterprise'}
  audit_trail: ${options.profile === 'regulated' || options.profile === 'enterprise'}
  change_control_board: ${options.profile === 'regulated'}

# ==============================================================================
# Feature Canon Configuration
# ==============================================================================
feature_canon:
  # Who owns different sections of feature files
  ownership:
    purpose_and_scope: BA
    behavior: FA
    change_log: FA
  
  # Require stories to link to features
  require_feature_links: true
  
  # Require delta format in stories
  require_delta_format: true
`;

  fs.writeFileSync(path.join(contextDir, 'team.yml'), teamYml, 'utf-8');
  console.log('  ✓ Created context/team.yml');
}

// =============================================================================
// Project Structure Creation
// =============================================================================

function createProjectStructure(targetDir, projectId) {
  const projectDir = path.join(targetDir, 'projects', projectId);
  fs.mkdirSync(projectDir, { recursive: true });

  console.log(`\n${colored(`Creating project structure: projects/${projectId}/...`, colors.blue)}`);

  // Create project.yml
  const projectYml = `# Project Configuration: ${projectId}
# This file defines project-specific settings and metadata.

project:
  id: "${projectId}"
  name: "${projectId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}"
  description: |
    # TODO: Add project description
  status: active  # active, paused, completed, archived
`;
  fs.writeFileSync(path.join(projectDir, 'project.yml'), projectYml, 'utf-8');
  console.log(`  ✓ Created projects/${projectId}/project.yml`);

  // Create features/ directory (Feature Canon)
  const featuresDir = path.join(projectDir, 'features');
  fs.mkdirSync(featuresDir, { recursive: true });

  const featuresIndex = `# Features Index (Feature Canon)

This is the master index of all features in this project.
The Feature Canon is the **source of truth** for system behavior.

## Status Legend

| Status | Description |
|--------|-------------|
| 🟢 Active | Feature is live in production |
| 🟡 Draft | Feature is being specified |
| 🔵 Planned | Feature is approved but not yet started |
| ⚪ Deprecated | Feature is being phased out |

## Feature Registry

| ID | Name | Status | Owner |
|----|------|--------|-------|
| _(none yet)_ | | | |

## Next Available ID

**F-001**

---

## ⚠️ How to Add Features

> **INVARIANT**: Features are NEVER created implicitly.

To add a new feature:

1. **Run \`ts:ba feature\`** — Analyzes and proposes new features
2. **Review the proposal** — Each feature must explain why it's a Feature (not a Story)
3. **Confirm creation** — Reply "Confirm" to create the feature files
4. **Update this index** — Add the new feature to the registry above

See \`/.teamspec/templates/feature-template.md\` for the feature format.
`;
  fs.writeFileSync(path.join(featuresDir, 'features-index.md'), featuresIndex, 'utf-8');
  console.log(`  ✓ Created projects/${projectId}/features/features-index.md`);

  // Create story-ledger.md
  const storyLedger = `# Story Ledger

This ledger tracks all completed stories and their impact on the Feature Canon.

## Purpose

- Provides audit trail of feature evolution
- Links stories to feature changes
- Enables traceability for compliance

## Completed Stories

| Story ID | Title | Sprint | Features Modified | Merged Date |
|----------|-------|--------|-------------------|-------------|
| _(none yet)_ | | | | |

---

> **Instructions**:
> - FA updates this after running \`ts:fa sync\`
> - Every completed story that modifies behavior MUST appear here
`;
  fs.writeFileSync(path.join(featuresDir, 'story-ledger.md'), storyLedger, 'utf-8');
  console.log(`  ✓ Created projects/${projectId}/features/story-ledger.md`);

  // Create stories/ directory with workflow subfolders
  const storiesDir = path.join(projectDir, 'stories');
  const storyFolders = ['backlog', 'ready-to-refine', 'ready-for-development'];
  
  for (const folder of storyFolders) {
    fs.mkdirSync(path.join(storiesDir, folder), { recursive: true });
  }

  fs.writeFileSync(
    path.join(storiesDir, 'README.md'),
    `# Stories

This directory contains user stories for the project.

## Workflow Folders

| Folder | Status | Owner |
|--------|--------|-------|
| \`backlog/\` | New stories | FA creates here |
| \`ready-to-refine/\` | Ready for dev refinement | FA moves here |
| \`ready-for-development/\` | Refined, ready for sprint | DEV moves here |

## Key Rules

1. **Every story must link to features** in the Feature Canon
2. **Stories describe DELTAS** (changes), not full behavior
3. Use \`ts:fa story\` to create properly formatted stories
4. Check Definition of Ready before sprint planning

## ⚠️ Before Creating Stories

Stories can only exist if their parent **Feature** exists in the Feature Canon.

If you need a new feature:
1. Run \`ts:ba feature\` to propose new features
2. Confirm the feature creation
3. Then create stories linked to that feature

**DO NOT** create stories for features that don't exist yet.
`,
    'utf-8'
  );
  console.log(`  ✓ Created projects/${projectId}/stories/ (with workflow folders)`);

  // Create adr/ directory
  const adrDir = path.join(projectDir, 'adr');
  fs.mkdirSync(adrDir, { recursive: true });
  fs.writeFileSync(
    path.join(adrDir, 'README.md'),
    `# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for this project.

## What is an ADR?

An ADR captures an important architectural decision along with its context and consequences.

## Naming Convention

\`ADR-NNN-<slug>.md\`

Example: \`ADR-001-use-postgresql-database.md\`

## Usage

Use the template in \`/.teamspec/templates/adr-template.md\`
`,
    'utf-8'
  );
  console.log(`  ✓ Created projects/${projectId}/adr/`);

  // Create decisions/ directory
  const decisionsDir = path.join(projectDir, 'decisions');
  fs.mkdirSync(decisionsDir, { recursive: true });
  fs.writeFileSync(
    path.join(decisionsDir, 'README.md'),
    `# Decisions

This directory contains business decision records (DEC) for this project.

## Naming Convention

\`DECISION-NNN-<slug>.md\`

Example: \`DECISION-001-mvp-scope-q1.md\`

## Usage

Use the template in \`/.teamspec/templates/decision-log-template.md\`
`,
    'utf-8'
  );
  console.log(`  ✓ Created projects/${projectId}/decisions/`);

  // Create dev-plans/ directory
  const devPlansDir = path.join(projectDir, 'dev-plans');
  fs.mkdirSync(devPlansDir, { recursive: true });
  fs.writeFileSync(
    path.join(devPlansDir, 'README.md'),
    `# Development Plans

This directory contains development task breakdowns for stories.

## Naming Convention

\`story-NNN-tasks.md\`

Example: \`story-001-tasks.md\`

## Rules

- NEVER start coding without a dev plan
- Task files must have no TBD/TODO items before implementation
- Mark tasks ✅ as completed
- Track actual vs estimated effort
`,
    'utf-8'
  );
  console.log(`  ✓ Created projects/${projectId}/dev-plans/`);

  // Create qa/ directory
  const qaDir = path.join(projectDir, 'qa');
  fs.mkdirSync(path.join(qaDir, 'test-cases'), { recursive: true });
  fs.writeFileSync(
    path.join(qaDir, 'README.md'),
    `# Quality Assurance

This directory contains QA artifacts for the project.

## Structure

\`\`\`
qa/
└── test-cases/     # Feature-level test cases
\`\`\`

## Key Principle

Tests validate **Feature Canon** behavior, not individual stories.

## Usage

Use the template in \`/.teamspec/templates/testcases-template.md\`
`,
    'utf-8'
  );
  console.log(`  ✓ Created projects/${projectId}/qa/`);

  // Create sprints/ directory
  const sprintsDir = path.join(projectDir, 'sprints');
  fs.mkdirSync(sprintsDir, { recursive: true });
  fs.writeFileSync(
    path.join(sprintsDir, 'sprints-index.md'),
    `# Sprints Index

This is the index of all sprints in this project.

## Current Sprint

_None active_

## Sprint History

| Sprint | Goal | Status | Stories | Canon Synced |
|--------|------|--------|---------|--------------|
| _(none yet)_ | | | | |

---

## Sprint Management

Use the following commands:
- \`ts:sm sprint create\` — Create a new sprint
- \`ts:sm sprint status\` — View sprint status
- \`ts:sm sprint close\` — Close sprint with metrics
`,
    'utf-8'
  );
  console.log(`  ✓ Created projects/${projectId}/sprints/`);

  // Create epics/ directory
  const epicsDir = path.join(projectDir, 'epics');
  fs.mkdirSync(epicsDir, { recursive: true });
  fs.writeFileSync(
    path.join(epicsDir, 'epics-index.md'),
    `# Epics Index

This is the index of all epics in this project.

## Epic Registry

| ID | Name | Status | Features | Target |
|----|------|--------|----------|--------|
| _(none yet)_ | | | | |

## Next Available ID

**EPIC-001**

---

## ⚠️ How to Add Epics

> **INVARIANT**: Epics are NEVER created implicitly.

To add a new epic:

1. **Run \`ts:ba epic\`** — Proposes epic boundaries with justification
2. **Review the proposal** — Each epic must explain why it's an Epic (not a Feature)
3. **Confirm creation** — Reply "Confirm" to create the epic files
`,
    'utf-8'
  );
  console.log(`  ✓ Created projects/${projectId}/epics/`);
}

// =============================================================================
// IDE/Agent Configuration
// =============================================================================

function setupIdeInstructions(targetDir, ide) {
  const config = IDE_CONFIGS[ide];

  console.log(`\n${colored(`Configuring ${config.name}...`, colors.blue)}`);

  // Create placeholder file directing to manual setup
  const instructionPath = path.join(targetDir, config.instructionPath);
  fs.mkdirSync(path.dirname(instructionPath), { recursive: true });

  const placeholder = `# TeamSpec Agent Instructions

This file will contain ${config.name}-specific agent instructions.

## Current Status

Agent-specific prompts will be deployed in a future CLI update.

## Manual Setup

For now, copy the agent prompts from the TeamSpec repository:
https://github.com/teamspec/teamspec/tree/main/agents

## Available Agent Prompts

- AGENT_BOOTSTRAP.md - Master system prompt
- AGENT_BA.md - Business Analyst
- AGENT_FA.md - Functional Analyst
- AGENT_SA.md - Solution Architect
- AGENT_DEV.md - Developer
- AGENT_QA.md - Quality Assurance
- AGENT_SM.md - Scrum Master
- AGENT_DES.md - Designer

## TeamSpec Commands

Once configured, use these commands:
- \`ts:ba create\` - Create business analysis
- \`ts:fa story\` - Create user story
- \`ts:dev plan\` - Create development plan
- \`ts:qa test\` - Design test cases
- \`ts:sm sprint create\` - Create sprint
`;

  if (config.format === 'json') {
    const jsonContent = {
      systemMessage: placeholder,
      docs: [{ name: 'TeamSpec', startUrl: '.teamspec/' }],
    };
    fs.writeFileSync(instructionPath, JSON.stringify(jsonContent, null, 2), 'utf-8');
  } else {
    fs.writeFileSync(instructionPath, placeholder, 'utf-8');
  }

  console.log(`  ✓ Created ${config.instructionPath} (placeholder)`);
  console.log(`  ℹ Agent-specific prompts will be added in a future update`);
}

// =============================================================================
// Update Command
// =============================================================================

function updateTeamspecCore(targetDir, sourceDir) {
  const targetTeamspec = path.join(targetDir, '.teamspec');

  const dirsToUpdate = [
    'definitions',
    'profiles',
    'templates',
  ];

  const filesToUpdate = ['teamspec.yml'];
  const contextFilesToUpdate = ['_schema.yml'];

  console.log(`\n${colored('Updating TeamSpec core files...', colors.blue)}`);

  const updated = [];
  const skipped = [];

  // Update directories
  for (const dirName of dirsToUpdate) {
    const src = path.join(sourceDir, dirName);
    const dest = path.join(targetTeamspec, dirName);
    if (fs.existsSync(src)) {
      if (fs.existsSync(dest)) {
        fs.rmSync(dest, { recursive: true });
      }
      copyDirRecursive(src, dest);
      updated.push(`${dirName}/`);
      console.log(`  ✓ Updated ${dirName}/`);
    }
  }

  // Update files
  for (const fileName of filesToUpdate) {
    const src = path.join(sourceDir, fileName);
    const dest = path.join(targetTeamspec, fileName);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      updated.push(fileName);
      console.log(`  ✓ Updated ${fileName}`);
    }
  }

  // Update context schema but preserve team.yml
  const contextDir = path.join(targetTeamspec, 'context');
  if (fs.existsSync(contextDir)) {
    for (const fileName of contextFilesToUpdate) {
      const src = path.join(sourceDir, 'context', fileName);
      const dest = path.join(contextDir, fileName);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        updated.push(`context/${fileName}`);
        console.log(`  ✓ Updated context/${fileName}`);
      }
    }
    const teamYmlPath = path.join(contextDir, 'team.yml');
    if (fs.existsSync(teamYmlPath)) {
      skipped.push('context/team.yml');
      console.log(`  ⏭ Preserved context/team.yml (team configuration)`);
    }
  }

  return { updated, skipped };
}

// =============================================================================
// Summary Output
// =============================================================================

function printNextSteps(targetDir, ide, profile, projectId) {
  const config = IDE_CONFIGS[ide];

  console.log(`\n${colored('='.repeat(70), colors.green)}`);
  console.log(colored('  ✅ TeamSpec 2.0 initialized successfully!', colors.green + colors.bold));
  console.log(colored('='.repeat(70), colors.green));

  console.log(`
${colored('📁 Created Structure:', colors.bold)}
    .teamspec/                    - Core framework (templates, definitions)
    .teamspec/context/team.yml    - Team configuration
    projects/${projectId}/        - Project artifacts
      ├── features/               - Feature Canon (source of truth)
      ├── stories/                - User stories (workflow folders)
      │   ├── backlog/            - New stories
      │   ├── ready-to-refine/    - Ready for dev refinement
      │   └── ready-for-dev/      - Ready for sprint
      ├── adr/                    - Architecture decisions
      ├── decisions/              - Business decisions
      ├── dev-plans/              - Development task breakdowns
      ├── qa/                     - Test cases
      ├── sprints/                - Sprint management
      └── epics/                  - Epic specifications
    ${config.instructionPath}     - AI agent instructions (placeholder)

${colored('🚀 Next Steps:', colors.bold + colors.yellow)}

${colored('1. Configure Your Team Context', colors.cyan)}
   Edit ${colored('.teamspec/context/team.yml', colors.bold)} to set:
   - Technology stack
   - Compliance requirements (if any)
   - Additional team settings

${colored('2. Configure AI Agent', colors.cyan)}
   The agent instructions file is a placeholder.
   Copy agent prompts from: https://github.com/teamspec/teamspec/tree/main/agents

${colored('3. Create Your First Feature', colors.cyan)}
   ⚠️  Features are NEVER created implicitly — use the BA commands:
   
   ${colored('ts:ba feature', colors.bold)}    - Propose and create features

${colored('4. Start Using TeamSpec Commands', colors.cyan)}
   Key commands for your AI assistant:
   - ${colored('ts:ba create', colors.bold)}       - Create business analysis
   - ${colored('ts:ba feature', colors.bold)}      - Create features (with justification)
   - ${colored('ts:fa story', colors.bold)}        - Create user story
   - ${colored('ts:dev plan', colors.bold)}        - Create development plan
   - ${colored('ts:qa test', colors.bold)}         - Design test cases
   - ${colored('ts:sm sprint create', colors.bold)} - Create sprint

${colored('📚 Documentation:', colors.bold)}
   - Templates:    .teamspec/templates/
   - Definitions:  .teamspec/definitions/
`);
}

function printUpdateSummary(targetDir, coreResult) {
  const pkg = require('../package.json');

  console.log(`\n${colored('='.repeat(70), colors.green)}`);
  console.log(colored('  ✅ TeamSpec updated successfully!', colors.green + colors.bold));
  console.log(colored('='.repeat(70), colors.green));

  console.log(`\n${colored('Version:', colors.bold)} ${pkg.version}`);

  console.log(`\n${colored('📁 Updated Files:', colors.bold)}`);
  for (const item of coreResult.updated) {
    console.log(`    ✓ ${item}`);
  }

  if (coreResult.skipped.length > 0) {
    console.log(`\n${colored('⏭ Preserved (team configuration):', colors.bold)}`);
    for (const item of coreResult.skipped) {
      console.log(`    ⏭ ${item}`);
    }
  }

  console.log(`
${colored('💡 What was updated:', colors.bold)}
   - Templates:    Latest document templates
   - Definitions:  DoR/DoD checklists
   - Profiles:     Profile overlays

${colored('⏭ What was preserved:', colors.bold)}
   - context/team.yml     Your team configuration
   - projects/            Your project artifacts
`);
}

// =============================================================================
// Main Entry Point
// =============================================================================

async function run(args) {
  const options = parseArgs(args);

  if (options.help) {
    printHelp();
    return;
  }

  if (options.version) {
    printVersion();
    return;
  }

  // Handle update command
  if (options.command === 'update') {
    const targetDir = path.resolve(options.target);
    const teamspecDir = path.join(targetDir, '.teamspec');

    if (!fs.existsSync(teamspecDir)) {
      console.error(colored(`❌ TeamSpec not found in: ${targetDir}`, colors.red));
      console.error('Run `teamspec init` first to initialize TeamSpec.');
      process.exit(1);
    }

    const pkg = require('../package.json');
    console.log(`\n${colored('TeamSpec Update', colors.bold + colors.cyan)} v${pkg.version}`);
    console.log(`${colored('Target:', colors.bold)} ${targetDir}`);

    if (!options.force && !options.nonInteractive) {
      const rl = createReadlineInterface();
      const proceed = await promptYesNo(
        rl,
        `\n${colored('This will update all TeamSpec core files but preserve your team context.', colors.yellow)}\n` +
        `${colored('Continue?', colors.bold)}`,
        true
      );
      rl.close();
      if (!proceed) {
        console.log('Update cancelled.');
        process.exit(0);
      }
    }

    const sourceDir = getTeamspecCoreDir();
    if (!fs.existsSync(sourceDir)) {
      console.error(colored(`Error: TeamSpec core files not found at: ${sourceDir}`, colors.red));
      process.exit(1);
    }

    const coreResult = updateTeamspecCore(targetDir, sourceDir);
    printUpdateSummary(targetDir, coreResult);
    return;
  }

  // Default: init command
  printBanner();

  const targetDir = path.resolve(options.target);

  if (!fs.existsSync(targetDir)) {
    console.error(colored(`Error: Target directory does not exist: ${targetDir}`, colors.red));
    process.exit(1);
  }

  const teamspecDir = path.join(targetDir, '.teamspec');
  if (fs.existsSync(teamspecDir)) {
    if (options.nonInteractive) {
      console.log(colored('TeamSpec already initialized. Overwriting...', colors.yellow));
    } else {
      const rl = createReadlineInterface();
      const overwrite = await promptYesNo(
        rl,
        colored('⚠️  TeamSpec already exists in this directory. Overwrite?', colors.yellow),
        false
      );
      rl.close();
      if (!overwrite) {
        console.log('Aborted.');
        process.exit(0);
      }
    }
  }

  console.log(`\n${colored('Target directory:', colors.bold)} ${targetDir}`);

  // Set defaults for non-interactive mode
  if (options.nonInteractive) {
    options.ide = options.ide || 'copilot';
    options.profile = options.profile || 'none';
    options.org = options.org || 'My Organization';
    options.team = options.team || 'My Team';
    options.project = options.project || DEFAULT_PROJECT_ID;
    options.industry = 'technology';
    options.cadence = 'scrum';
    options.sprintLengthDays = 14;
  } else {
    await runInteractive(options);
  }

  // Validate IDE choice
  if (!IDE_CONFIGS[options.ide]) {
    console.error(colored(`Error: Unknown IDE: ${options.ide}`, colors.red));
    console.error(`Valid options: ${Object.keys(IDE_CONFIGS).join(', ')}`);
    process.exit(1);
  }

  // Validate profile choice
  if (!PROFILE_OPTIONS[options.profile]) {
    console.error(colored(`Error: Unknown profile: ${options.profile}`, colors.red));
    console.error(`Valid options: ${Object.keys(PROFILE_OPTIONS).join(', ')}`);
    process.exit(1);
  }

  // Normalize project ID
  options.project = normalizeProjectId(options.project);

  console.log(`\n${colored('Initializing TeamSpec...', colors.bold)}`);

  const sourceDir = getTeamspecCoreDir();
  if (!fs.existsSync(sourceDir)) {
    console.error(colored(`Error: TeamSpec core files not found at: ${sourceDir}`, colors.red));
    console.error('This may indicate a corrupted installation. Try reinstalling the package.');
    process.exit(1);
  }

  // Perform initialization
  copyTeamspecCore(targetDir, sourceDir);
  createTeamContext(targetDir, options);
  createProjectStructure(targetDir, options.project);
  setupIdeInstructions(targetDir, options.ide);
  printNextSteps(targetDir, options.ide, options.profile, options.project);
}

module.exports = { run };
