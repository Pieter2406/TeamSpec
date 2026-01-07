/**
 * TeamSpec Init CLI - Pure JavaScript implementation
 * Version 3.0.0 - Feature Canon Operating Model
 * 
 * This CLI bootstraps TeamSpec 2.0 in any repository by:
 * 1. Asking team setup questions
 * 2. Deploying .teamspec/ folder with core files
 * 3. Creating project structure
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
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║ ████████╗███████╗ █████╗ ███╗   ███╗███████╗██████╗ ███████╗ ██████╗ ║
║ ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██╔════╝██╔══██╗██╔════╝██╔════╝ ║
║    ██║   █████╗  ███████║██╔████╔██║███████╗██████╔╝█████╗  ██║      ║
║    ██║   ██╔══╝  ██╔══██║██║╚██╔╝██║╚════██║██╔═══╝ ██╔══╝  ██║      ║
║    ██║   ███████╗██║  ██║██║ ╚═╝ ██║███████║██║     ███████╗╚██████╗ ║
║    ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚═╝     ╚══════╝ ╚═════╝ ║
║                                                                      ║
║                                                                      ║
║         Feature Canon Operating Model v2.0                           ║
╚══════════════════════════════════════════════════════════════════════╝
`;
  console.log(colored(banner, colors.cyan));
}

// =============================================================================
// Configuration Options
// =============================================================================

const PROFILE_OPTIONS = {
  none: 'No specific profile - vanilla TeamSpec',
  regulated: 'Regulated industry (banking, healthcare, government) - strict compliance',
  startup: 'Startup/MVP mode - lean documentation, speed focus',
  'platform-team': 'Platform/infrastructure team - API-first, SLA focus',
  enterprise: 'Enterprise - governance, audit trails, multi-team coordination',
};

const INDUSTRY_OPTIONS = {
  technology: 'Technology / Software',
  finance: 'Financial Services / Banking',
  healthcare: 'Healthcare / Life Sciences',
  retail: 'Retail / E-commerce',
  manufacturing: 'Manufacturing / Industrial',
  government: 'Government / Public Sector',
  other: 'Other',
};

const CADENCE_OPTIONS = {
  scrum: 'Scrum (time-boxed sprints)',
  kanban: 'Kanban (continuous flow)',
  scrumban: 'Scrumban (hybrid)',
};

const DEFAULT_PROJECT_ID = 'main-project';

// =============================================================================
// Argument Parsing
// =============================================================================

function parseArgs(args) {
  const options = {
    command: 'init',
    target: process.cwd(),
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

  if (args.length > 0 && !args[0].startsWith('-')) {
    const cmd = args[0].toLowerCase();
    if (['init', 'update', 'lint'].includes(cmd)) {
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
  lint [options]          Lint project artifacts against TeamSpec rules

${colored('OPTIONS:', colors.bold)}
  -h, --help              Show this help message
  -v, --version           Show version number
  -t, --target <dir>      Target directory (default: current directory)
  -p, --profile <profile> Team profile to use
  -o, --org <name>        Organization name
  --team <name>           Team name
  --project <id>          Project ID for folder structure (default: main-project)
  -y, --non-interactive   Run without prompts (use defaults)
  -f, --force             Force update without confirmation

${colored('PROFILES:', colors.bold)}
  none           Vanilla TeamSpec
  regulated      Banking, healthcare, government (strict compliance)
  startup        Lean documentation, speed focus
  platform-team  API-first, SLA focus
  enterprise     Full governance, audit trails

${colored('EXAMPLES:', colors.bold)}
  teamspec                              # Interactive setup
  teamspec --profile startup -y         # Quick setup with startup profile
  teamspec update                       # Update core files, keep context
  teamspec update --force               # Update without confirmation
  teamspec lint                         # Lint all projects
  teamspec lint --project my-project    # Lint specific project

${colored('WHAT GETS CREATED:', colors.bold)}
  .teamspec/                 Core framework
    ├── templates/           Document templates
    ├── definitions/         DoR/DoD checklists
    ├── profiles/            Profile overlays
    └── context/team.yml     Team configuration
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

  for (const fileName of filesToCopy) {
    const src = path.join(sourceDir, fileName);
    const dest = path.join(targetTeamspec, fileName);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`  ✓ Copied ${fileName}`);
    }
  }

  const contextDir = path.join(targetTeamspec, 'context');
  fs.mkdirSync(contextDir, { recursive: true });

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
  
  cadence:
    type: ${options.cadence}  # Options: scrum, kanban, scrumban
${options.sprintLengthDays ? `    sprint_length_days: ${options.sprintLengthDays}` : '    # sprint_length_days: N/A for kanban'}

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

# ==============================================================================
# Governance
# ==============================================================================
governance:
  sign_off_required: ${options.profile === 'regulated' || options.profile === 'enterprise'}
  audit_trail: ${options.profile === 'regulated' || options.profile === 'enterprise'}
  change_control_board: ${options.profile === 'regulated'}

# ==============================================================================
# Feature Canon Configuration
# ==============================================================================
feature_canon:
  ownership:
    purpose_and_scope: BA
    behavior: FA
    change_log: FA
  require_feature_links: true
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

  // project.yml
  const projectYml = `# Project Configuration: ${projectId}
project:
  id: "${projectId}"
  name: "${projectId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}"
  description: |
    # TODO: Add project description
  status: active  # active, paused, completed, archived
`;
  fs.writeFileSync(path.join(projectDir, 'project.yml'), projectYml, 'utf-8');
  console.log(`  ✓ Created projects/${projectId}/project.yml`);

  // features/
  const featuresDir = path.join(projectDir, 'features');
  fs.mkdirSync(featuresDir, { recursive: true });

  fs.writeFileSync(path.join(featuresDir, 'features-index.md'), `# Features Index (Feature Canon)

This is the master index of all features in this project.
The Feature Canon is the **source of truth** for system behavior.

## Feature Registry

| ID | Name | Status | Owner |
|----|------|--------|-------|
| _(none yet)_ | | | |

## Next Available ID: **F-001**

---

> **To add features:** Run \`ts:ba feature\` — features are never created implicitly.
`, 'utf-8');

  fs.writeFileSync(path.join(featuresDir, 'story-ledger.md'), `# Story Ledger

Tracks completed stories and their impact on the Feature Canon.

| Story ID | Title | Sprint | Features Modified | Merged Date |
|----------|-------|--------|-------------------|-------------|
| _(none yet)_ | | | | |
`, 'utf-8');
  console.log(`  ✓ Created projects/${projectId}/features/`);

  // stories/ with workflow folders
  const storiesDir = path.join(projectDir, 'stories');
  for (const folder of ['backlog', 'ready-to-refine', 'ready-for-development']) {
    fs.mkdirSync(path.join(storiesDir, folder), { recursive: true });
  }

  fs.writeFileSync(path.join(storiesDir, 'README.md'), `# Stories

## Workflow Folders

| Folder | Status | Owner |
|--------|--------|-------|
| \`backlog/\` | New stories | FA |
| \`ready-to-refine/\` | Ready for dev refinement | FA |
| \`ready-for-development/\` | Refined, ready for sprint | DEV |

## Rules

- Every story must link to features in the Feature Canon
- Stories describe DELTAS (changes), not full behavior
- Use \`ts:fa story\` to create properly formatted stories
`, 'utf-8');
  console.log(`  ✓ Created projects/${projectId}/stories/`);

  // adr/
  fs.mkdirSync(path.join(projectDir, 'adr'), { recursive: true });
  fs.writeFileSync(path.join(projectDir, 'adr', 'README.md'), `# Architecture Decision Records

Naming: \`ADR-NNN-<slug>.md\`

Use template: \`/.teamspec/templates/adr-template.md\`
`, 'utf-8');
  console.log(`  ✓ Created projects/${projectId}/adr/`);

  // decisions/
  fs.mkdirSync(path.join(projectDir, 'decisions'), { recursive: true });
  fs.writeFileSync(path.join(projectDir, 'decisions', 'README.md'), `# Business Decisions

Naming: \`DECISION-NNN-<slug>.md\`

Use template: \`/.teamspec/templates/decision-log-template.md\`
`, 'utf-8');
  console.log(`  ✓ Created projects/${projectId}/decisions/`);

  // dev-plans/
  fs.mkdirSync(path.join(projectDir, 'dev-plans'), { recursive: true });
  fs.writeFileSync(path.join(projectDir, 'dev-plans', 'README.md'), `# Development Plans

Naming: \`story-NNN-tasks.md\`

Rules:
- NEVER start coding without a dev plan
- No TBD/TODO items before implementation
- Mark tasks ✅ as completed
`, 'utf-8');
  console.log(`  ✓ Created projects/${projectId}/dev-plans/`);

  // qa/
  fs.mkdirSync(path.join(projectDir, 'qa', 'test-cases'), { recursive: true });
  fs.writeFileSync(path.join(projectDir, 'qa', 'README.md'), `# Quality Assurance

Tests validate **Feature Canon** behavior, not individual stories.

Use template: \`/.teamspec/templates/testcases-template.md\`
`, 'utf-8');
  console.log(`  ✓ Created projects/${projectId}/qa/`);

  // sprints/
  fs.mkdirSync(path.join(projectDir, 'sprints'), { recursive: true });
  fs.writeFileSync(path.join(projectDir, 'sprints', 'sprints-index.md'), `# Sprints Index

## Current Sprint: _None active_

## Sprint History

| Sprint | Goal | Status | Stories | Canon Synced |
|--------|------|--------|---------|--------------|
| _(none yet)_ | | | | |
`, 'utf-8');
  console.log(`  ✓ Created projects/${projectId}/sprints/`);

  // epics/
  fs.mkdirSync(path.join(projectDir, 'epics'), { recursive: true });
  fs.writeFileSync(path.join(projectDir, 'epics', 'epics-index.md'), `# Epics Index

| ID | Name | Status | Features | Target |
|----|------|--------|----------|--------|
| _(none yet)_ | | | | |

## Next Available ID: **EPIC-001**

> **To add epics:** Run \`ts:ba epic\` — epics are never created implicitly.
`, 'utf-8');
  console.log(`  ✓ Created projects/${projectId}/epics/`);
}

// =============================================================================
// Update Command
// =============================================================================

function updateTeamspecCore(targetDir, sourceDir) {
  const targetTeamspec = path.join(targetDir, '.teamspec');

  const dirsToUpdate = ['definitions', 'profiles', 'templates'];
  const filesToUpdate = ['teamspec.yml'];
  const contextFilesToUpdate = ['_schema.yml'];

  console.log(`\n${colored('Updating TeamSpec core files...', colors.blue)}`);

  const updated = [];
  const skipped = [];

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

  for (const fileName of filesToUpdate) {
    const src = path.join(sourceDir, fileName);
    const dest = path.join(targetTeamspec, fileName);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      updated.push(fileName);
      console.log(`  ✓ Updated ${fileName}`);
    }
  }

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
    if (fs.existsSync(path.join(contextDir, 'team.yml'))) {
      skipped.push('context/team.yml');
      console.log(`  ⏭ Preserved context/team.yml`);
    }
  }

  return { updated, skipped };
}

// =============================================================================
// Summary Output
// =============================================================================

function printNextSteps(targetDir, profile, projectId) {
  console.log(`\n${colored('='.repeat(70), colors.green)}`);
  console.log(colored('  ✅ TeamSpec 2.0 initialized successfully!', colors.green + colors.bold));
  console.log(colored('='.repeat(70), colors.green));

  console.log(`
${colored('📁 Created Structure:', colors.bold)}
    .teamspec/                    - Core framework
      ├── templates/              - Document templates
      ├── definitions/            - DoR/DoD checklists
      ├── profiles/               - Profile overlays
      └── context/team.yml        - Team configuration
    projects/${projectId}/
      ├── features/               - Feature Canon (source of truth)
      ├── stories/                - User stories (workflow folders)
      ├── adr/                    - Architecture decisions
      ├── decisions/              - Business decisions
      ├── dev-plans/              - Development task breakdowns
      ├── qa/                     - Test cases
      ├── sprints/                - Sprint management
      └── epics/                  - Epic specifications

${colored('🚀 Next Steps:', colors.bold + colors.yellow)}

${colored('1. Configure Your Team', colors.cyan)}
   Edit ${colored('.teamspec/context/team.yml', colors.bold)} to set your tech stack.

${colored('2. Create Your First Feature', colors.cyan)}
   Features are NEVER created implicitly. Use:
   ${colored('ts:ba feature', colors.bold)}    - Propose and create features

${colored('3. Start Using TeamSpec Commands', colors.cyan)}
   ${colored('ts:ba create', colors.bold)}       - Create business analysis
   ${colored('ts:fa story', colors.bold)}        - Create user story  
   ${colored('ts:dev plan', colors.bold)}        - Create development plan
   ${colored('ts:qa test', colors.bold)}         - Design test cases

${colored('📚 Documentation:', colors.bold)}
   - Templates:    .teamspec/templates/
   - Definitions:  .teamspec/definitions/
`);
}

function printUpdateSummary(coreResult) {
  const pkg = require('../package.json');

  console.log(`\n${colored('='.repeat(70), colors.green)}`);
  console.log(colored('  ✅ TeamSpec updated successfully!', colors.green + colors.bold));
  console.log(colored('='.repeat(70), colors.green));

  console.log(`\n${colored('Version:', colors.bold)} ${pkg.version}`);

  console.log(`\n${colored('Updated:', colors.bold)}`);
  for (const item of coreResult.updated) {
    console.log(`    ✓ ${item}`);
  }

  if (coreResult.skipped.length > 0) {
    console.log(`\n${colored('Preserved:', colors.bold)}`);
    for (const item of coreResult.skipped) {
      console.log(`    ⏭ ${item}`);
    }
  }
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

  // Handle lint command
  if (options.command === 'lint') {
    const { Linter, SEVERITY } = require('./linter');
    const targetDir = path.resolve(options.target);
    
    console.log(`\n${colored('TeamSpec Linter', colors.bold + colors.cyan)}`);
    console.log(`${colored('Scanning:', colors.bold)} ${targetDir}`);
    
    if (options.project) {
      console.log(`${colored('Project:', colors.bold)} ${options.project}`);
    }
    
    const linter = new Linter(targetDir);
    const results = await linter.run({ project: options.project });
    
    console.log(linter.formatResults(results));
    
    // Exit with error code if there are errors or blockers
    const hasErrors = results.some(r => r.severity === SEVERITY.ERROR || r.severity === SEVERITY.BLOCKER);
    if (hasErrors) {
      process.exit(1);
    }
    return;
  }

  // Handle update command
  if (options.command === 'update') {
    const targetDir = path.resolve(options.target);
    const teamspecDir = path.join(targetDir, '.teamspec');

    if (!fs.existsSync(teamspecDir)) {
      console.error(colored(`❌ TeamSpec not found in: ${targetDir}`, colors.red));
      console.error('Run `teamspec init` first.');
      process.exit(1);
    }

    const pkg = require('../package.json');
    console.log(`\n${colored('TeamSpec Update', colors.bold + colors.cyan)} v${pkg.version}`);

    if (!options.force && !options.nonInteractive) {
      const rl = createReadlineInterface();
      const proceed = await promptYesNo(
        rl,
        `${colored('Update core files (preserves team.yml)?', colors.bold)}`,
        true
      );
      rl.close();
      if (!proceed) {
        console.log('Cancelled.');
        process.exit(0);
      }
    }

    const sourceDir = getTeamspecCoreDir();
    if (!fs.existsSync(sourceDir)) {
      console.error(colored(`Error: Core files not found at: ${sourceDir}`, colors.red));
      process.exit(1);
    }

    const coreResult = updateTeamspecCore(targetDir, sourceDir);
    printUpdateSummary(coreResult);
    return;
  }

  // Default: init command
  printBanner();

  const targetDir = path.resolve(options.target);

  if (!fs.existsSync(targetDir)) {
    console.error(colored(`Error: Directory does not exist: ${targetDir}`, colors.red));
    process.exit(1);
  }

  const teamspecDir = path.join(targetDir, '.teamspec');
  if (fs.existsSync(teamspecDir)) {
    if (options.nonInteractive) {
      console.log(colored('TeamSpec exists. Overwriting...', colors.yellow));
    } else {
      const rl = createReadlineInterface();
      const overwrite = await promptYesNo(
        rl,
        colored('⚠️  TeamSpec exists. Overwrite?', colors.yellow),
        false
      );
      rl.close();
      if (!overwrite) {
        console.log('Aborted.');
        process.exit(0);
      }
    }
  }

  console.log(`\n${colored('Target:', colors.bold)} ${targetDir}`);

  // Set defaults for non-interactive mode
  if (options.nonInteractive) {
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

  // Validate profile
  if (!PROFILE_OPTIONS[options.profile]) {
    console.error(colored(`Error: Unknown profile: ${options.profile}`, colors.red));
    process.exit(1);
  }

  options.project = normalizeProjectId(options.project);

  console.log(`\n${colored('Initializing TeamSpec...', colors.bold)}`);

  const sourceDir = getTeamspecCoreDir();
  if (!fs.existsSync(sourceDir)) {
    console.error(colored(`Error: Core files not found at: ${sourceDir}`, colors.red));
    process.exit(1);
  }

  copyTeamspecCore(targetDir, sourceDir);
  createTeamContext(targetDir, options);
  createProjectStructure(targetDir, options.project);
  printNextSteps(targetDir, options.profile, options.project);
}

module.exports = { run };
