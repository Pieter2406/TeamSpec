/**
 * TeamSpec Init CLI - Pure JavaScript implementation
 * Version 4.0.0 - Product/Project Operating Model
 * 
 * This CLI bootstraps TeamSpec 4.0 in any repository by:
 * 1. Asking team setup questions
 * 2. Deploying .teamspec/ folder with core files
 * 3. Creating product/project structure
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
║         Product/Project Operating Model v4.0                         ║
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

const IDE_OPTIONS = {
  none: 'No IDE integration - just files',
  vscode: 'VS Code with @teamspec chat participant',
  cursor: 'Cursor (VS Code settings only, no chat participant)',
  other: 'Other IDE (manual setup)',
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
    ide: null,
    copilot: null,
    nonInteractive: false,
    help: false,
    version: false,
    force: false,
    fix: false,
    rule: null,
    verbose: false,
  };

  let i = 0;

  if (args.length > 0 && !args[0].startsWith('-')) {
    const cmd = args[0].toLowerCase();
    if (['init', 'update', 'lint', 'generate-prompts', 'migrate'].includes(cmd)) {
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
      case '--ide':
        options.ide = args[++i];
        break;
      case '--copilot':
        const copilotArg = args[++i];
        options.copilot = copilotArg === 'true' || copilotArg === 'yes';
        break;
      case '--non-interactive':
      case '-y':
        options.nonInteractive = true;
        break;
      case '--force':
      case '-f':
        options.force = true;
        break;
      case '--fix':
        options.fix = true;
        break;
      case '--rule':
        options.rule = args[++i];
        break;
      case '--verbose':
        options.verbose = true;
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
${colored('TeamSpec Init', colors.bold)} - Bootstrap TeamSpec 4.0 Product-Canon Operating Model

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
  --ide <ide>             IDE integration (vscode, cursor, other, none)
  --copilot <yes|no>      Install GitHub Copilot instructions file (default: yes)
  -y, --non-interactive   Run without prompts (use defaults)
  -f, --force             Force update/migrate without confirmation
  --fix                   Apply migration changes (default: dry-run)

${colored('PROFILES:', colors.bold)}
  none           Vanilla TeamSpec
  regulated      Banking, healthcare, government (strict compliance)
  startup        Lean documentation, speed focus
  platform-team  API-first, SLA focus
  enterprise     Full governance, audit trails

${colored('EXAMPLES:', colors.bold)}
  teamspec                              # Interactive setup (4.0)
  teamspec --profile startup -y         # Quick setup with startup profile
  teamspec update                       # Update core files, keep context
  teamspec update --force               # Update without confirmation
  teamspec lint                         # Lint all projects
  teamspec lint --project my-project    # Lint specific project
  teamspec migrate                      # Analyze 2.0 → 4.0 migration (dry-run)
  teamspec migrate --fix                # Execute 2.0 → 4.0 migration
  teamspec generate-prompts             # Generate GitHub Copilot prompt files

${colored('WHAT GETS CREATED (4.0):', colors.bold)}
  .teamspec/                 Core framework
    ├── templates/           Document templates
    ├── definitions/         DoR/DoD checklists
    ├── profiles/            Profile overlays
    └── context/team.yml     Team configuration
  products/<product-id>/     Product artifacts (AS-IS, source of truth)
    ├── features/            Feature Canon
    ├── business-analysis/   BA documents
    └── ...
  projects/<project-id>/     Project artifacts (TO-BE changes)
    ├── feature-increments/  Changes to product features
    ├── epics/               Story containers
    ├── stories/             User stories
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
// TeamSpec Version Detection (4.0)
// =============================================================================

/**
 * Detect the TeamSpec version of a workspace
 * @param {string} targetDir - Path to workspace root
 * @returns {{ version: string, hasProducts: boolean, hasProjects: boolean, productCount: number, projectCount: number }}
 */
function detectWorkspaceVersion(targetDir) {
  const teamspecDir = path.join(targetDir, '.teamspec');
  const productsDir = path.join(targetDir, 'products');
  const projectsDir = path.join(targetDir, 'projects');

  // Not a TeamSpec workspace
  if (!fs.existsSync(teamspecDir)) {
    return { version: 'none', hasProducts: false, hasProjects: false, productCount: 0, projectCount: 0 };
  }

  const hasProducts = fs.existsSync(productsDir);
  const hasProjects = fs.existsSync(projectsDir);

  // Count products and projects
  let productCount = 0;
  let projectCount = 0;

  if (hasProducts) {
    productCount = fs.readdirSync(productsDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .filter(d => fs.existsSync(path.join(productsDir, d.name, 'product.yml')))
      .length;
  }

  if (hasProjects) {
    projectCount = fs.readdirSync(projectsDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .filter(d => fs.existsSync(path.join(projectsDir, d.name, 'project.yml')))
      .length;
  }

  // Detect 4.0 vs 2.0
  // 4.0 indicators: products/ folder with product.yml files, or product-index.md
  // 2.0 indicators: projects/ with features/ (features as canon in project)

  if (hasProducts && productCount > 0) {
    return { version: '4.0', hasProducts: true, hasProjects, productCount, projectCount };
  }

  // Check if any project has features/ folder (2.0 pattern)
  if (hasProjects && projectCount > 0) {
    const projects = fs.readdirSync(projectsDir, { withFileTypes: true })
      .filter(d => d.isDirectory());

    for (const project of projects) {
      const featuresDir = path.join(projectsDir, project.name, 'features');
      if (fs.existsSync(featuresDir)) {
        // 2.0 pattern: features inside projects
        return { version: '2.0', hasProducts: false, hasProjects: true, productCount: 0, projectCount };
      }
    }
  }

  // Has .teamspec but no recognizable structure
  return { version: 'unknown', hasProducts, hasProjects, productCount, projectCount };
}

/**
 * Find all products in a workspace
 * @param {string} targetDir - Path to workspace root
 * @returns {Array<{ id: string, prefix: string, path: string, name: string }>}
 */
function findProducts(targetDir) {
  const productsDir = path.join(targetDir, 'products');

  if (!fs.existsSync(productsDir)) {
    return [];
  }

  const products = [];
  const entries = fs.readdirSync(productsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const productYmlPath = path.join(productsDir, entry.name, 'product.yml');
    if (!fs.existsSync(productYmlPath)) continue;

    try {
      const content = fs.readFileSync(productYmlPath, 'utf-8');
      // Simple YAML parsing for prefix and name
      const prefixMatch = content.match(/prefix:\s*["']?([A-Z]{3,4})["']?/);
      const nameMatch = content.match(/name:\s*["']?(.+?)["']?\s*$/m);

      products.push({
        id: entry.name,
        prefix: prefixMatch ? prefixMatch[1] : entry.name.substring(0, 3).toUpperCase(),
        path: path.join(productsDir, entry.name),
        name: nameMatch ? nameMatch[1].trim() : entry.name
      });
    } catch (e) {
      // Skip malformed product.yml
    }
  }

  return products;
}

/**
 * Generate a product prefix from a name
 * @param {string} name - Product name (e.g., "DnD Initiative Tracker")
 * @returns {string} - 3-4 char uppercase prefix (e.g., "DIT")
 */
function generateProductPrefix(name) {
  // Extract first letter of each significant word
  const words = name
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 0 && !['the', 'a', 'an', 'and', 'or', 'for', 'of', 'in', 'to'].includes(w.toLowerCase()));

  if (words.length === 0) return 'PRD';
  if (words.length === 1) return words[0].substring(0, 3).toUpperCase();

  // Take first letter of first 3-4 words
  return words
    .slice(0, 4)
    .map(w => w[0])
    .join('')
    .toUpperCase();
}

/**
 * Validate a product prefix
 * @param {string} prefix - The prefix to validate
 * @param {string} targetDir - Workspace path to check for conflicts
 * @returns {{ valid: boolean, error?: string }}
 */
function validateProductPrefix(prefix, targetDir) {
  if (!prefix || prefix.length < 3 || prefix.length > 4) {
    return { valid: false, error: 'Prefix must be 3-4 characters' };
  }

  if (!/^[A-Z]{3,4}$/.test(prefix)) {
    return { valid: false, error: 'Prefix must be uppercase letters only' };
  }

  // Check for conflicts with existing products
  const existingProducts = findProducts(targetDir);
  const conflict = existingProducts.find(p => p.prefix === prefix);

  if (conflict) {
    return { valid: false, error: `Prefix "${prefix}" already used by product "${conflict.id}"` };
  }

  return { valid: true };
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

    // 4.0: Product vs Project-only mode
    console.log(`\n${colored('TeamSpec 4.0 Structure', colors.bold)}`);
    console.log('  Products = AS-IS (what exists, source of truth)');
    console.log('  Projects = TO-BE (changes to products)');

    const setupMode = await promptChoice(
      rl,
      'How do you want to set up your workspace?',
      {
        'product-first': 'Start with a Product (recommended) - creates product + optional project',
        'project-only': 'Project only - for quick starts, can add products later',
      },
      'product-first'
    );
    options.setupMode = setupMode;

    // Product setup (if product-first)
    if (setupMode === 'product-first') {
      console.log(`\n${colored('Product Setup', colors.bold)}`);
      console.log('  Products have a unique prefix (PRX) used in artifact naming.');
      console.log('  Example: "DnD Initiative Tracker" → prefix "DIT" → files like f-DIT-001.md');

      options.productName = await prompt(
        rl,
        `${colored('Product name', colors.bold)}`,
        'My Product'
      );

      // Generate suggested prefix
      const suggestedPrefix = generateProductPrefix(options.productName);
      options.productPrefix = await prompt(
        rl,
        `${colored('Product prefix (3-4 uppercase letters)', colors.bold)}`,
        suggestedPrefix
      );
      options.productPrefix = options.productPrefix.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 4);

      // Validate prefix
      if (options.productPrefix.length < 3) {
        options.productPrefix = suggestedPrefix;
      }

      // Generate product ID from name
      options.productId = options.productName.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-');

      // Ask if they want a project too
      options.createProject = await promptYesNo(
        rl,
        `\n${colored('Also create an initial project for this product?', colors.bold)}`,
        true
      );
    }

    // Project ID
    if (setupMode === 'project-only' || options.createProject) {
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
    }

    // IDE Integration
    if (!options.ide) {
      options.ide = await promptChoice(
        rl,
        'Which IDE are you using?',
        IDE_OPTIONS,
        'vscode'
      );
    }

    // GitHub Copilot Instructions
    if (options.copilot === null) {
      options.copilot = await promptYesNo(
        rl,
        `\n${colored('Install GitHub Copilot instructions file?', colors.bold)}\n  (Adds .github/copilot-instructions.md with TeamSpec guidance)`,
        true
      );
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
    console.log(`  Setup Mode:      ${options.setupMode}`);
    if (options.productName) {
      console.log(`  Product:         ${options.productName} (${options.productPrefix})`);
    }
    if (options.project) {
      console.log(`  Project ID:      ${options.project}`);
    }
    console.log(`  IDE:             ${options.ide}`);
    console.log(`  Copilot:         ${options.copilot ? 'Yes' : 'No'}`);

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
    'agents',
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
// Copilot Instructions Deployment
// =============================================================================

function copyCopilotInstructions(targetDir, sourceDir) {
  const githubDir = path.join(targetDir, '.github');
  fs.mkdirSync(githubDir, { recursive: true });

  const copilotSrc = path.join(sourceDir, 'copilot-instructions.md');
  const copilotDest = path.join(githubDir, 'copilot-instructions.md');

  if (fs.existsSync(copilotSrc)) {
    fs.copyFileSync(copilotSrc, copilotDest);
    console.log(`\n${colored('Copying GitHub Copilot instructions...', colors.blue)}`);
    console.log('  ✓ Copied .github/copilot-instructions.md');
    return true;
  } else {
    console.log(`  ⚠ Copilot instructions not found in source`);
    return false;
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
// Product Structure Creation (4.0)
// =============================================================================

/**
 * Create a new product structure
 * @param {string} targetDir - Workspace root path
 * @param {string} productId - Slug identifier (e.g., "dnd-initiative-tracker")
 * @param {string} productName - Human-readable name (e.g., "DnD Initiative Tracker")
 * @param {string} prefix - 3-4 char uppercase prefix (e.g., "DIT")
 * @returns {string} - Path to created product folder
 */
function createProductStructure(targetDir, productId, productName, prefix) {
  const productDir = path.join(targetDir, 'products', productId);
  fs.mkdirSync(productDir, { recursive: true });

  console.log(`\n${colored(`Creating product structure: products/${productId}/ (${prefix})...`, colors.blue)}`);

  // product.yml
  const productYml = `# Product Configuration: ${productName}
product:
  id: "${productId}"
  name: "${productName}"
  prefix: "${prefix}"
  description: |
    # TODO: Add product description - what IS this product (AS-IS)?
  status: active  # active, deprecated, archived
  
  # List of projects currently modifying this product
  active_projects: []
`;
  fs.writeFileSync(path.join(productDir, 'product.yml'), productYml, 'utf-8');
  console.log(`  ✓ Created products/${productId}/product.yml`);

  // README.md
  const readme = `# ${productName}

> **Product Prefix:** \`${prefix}\`

## Overview

_TODO: Describe what this product IS (current state, AS-IS)._

## Structure

| Folder | Purpose | Artifact Pattern |
|--------|---------|------------------|
| \`business-analysis/\` | Business context & processes | \`ba-${prefix}-XXX-*.md\` |
| \`features/\` | Feature Canon (source of truth) | \`f-${prefix}-XXX-*.md\` |
| \`solution-designs/\` | Solution designs & architecture | \`sd-${prefix}-XXX-*.md\` |
| \`technical-architecture/\` | Technical architecture decisions | \`ta-${prefix}-XXX-*.md\` |
| \`decisions/\` | Product-level business decisions | \`dec-${prefix}-XXX-*.md\` |

## Active Projects

_See \`product.yml\` for the list of projects currently modifying this product._
`;
  fs.writeFileSync(path.join(productDir, 'README.md'), readme, 'utf-8');
  console.log(`  ✓ Created products/${productId}/README.md`);

  // business-analysis/
  const baDir = path.join(productDir, 'business-analysis');
  fs.mkdirSync(baDir, { recursive: true });
  fs.writeFileSync(path.join(baDir, 'README.md'), `# Business Analysis

Documents the business context, processes, and domain knowledge for this product.

**Naming:** \`ba-${prefix}-XXX-<slug>.md\`

**Template:** \`/.teamspec/templates/business-analysis-template.md\`
`, 'utf-8');
  console.log(`  ✓ Created products/${productId}/business-analysis/`);

  // features/
  const featuresDir = path.join(productDir, 'features');
  fs.mkdirSync(featuresDir, { recursive: true });

  fs.writeFileSync(path.join(featuresDir, 'features-index.md'), `# Features Index (Feature Canon)

> **Product:** ${productName}  
> **Prefix:** \`${prefix}\`

This is the master index of all features for this product.
The Feature Canon is the **source of truth** for system behavior (AS-IS).

## Feature Registry

| ID | Name | Status | Owner |
|----|------|--------|-------|
| _(none yet)_ | | | |

## Next Available ID: **f-${prefix}-001**

---

> **To add features:** Features are created by the Product Owner or extracted from business analysis.
`, 'utf-8');

  fs.writeFileSync(path.join(featuresDir, 'story-ledger.md'), `# Story Ledger

Tracks completed stories and their impact on the Feature Canon.

| Story ID | Title | Project | Sprint | Features Modified | Synced Date |
|----------|-------|---------|--------|-------------------|-------------|
| _(none yet)_ | | | | | |
`, 'utf-8');
  console.log(`  ✓ Created products/${productId}/features/`);

  // solution-designs/
  const sdDir = path.join(productDir, 'solution-designs');
  fs.mkdirSync(sdDir, { recursive: true });
  fs.writeFileSync(path.join(sdDir, 'README.md'), `# Solution Designs

High-level solution architecture and design documents for this product.

**Naming:** \`sd-${prefix}-XXX-<slug>.md\`

**Template:** \`/.teamspec/templates/solution-design-template.md\`
`, 'utf-8');
  console.log(`  ✓ Created products/${productId}/solution-designs/`);

  // technical-architecture/
  const taDir = path.join(productDir, 'technical-architecture');
  fs.mkdirSync(taDir, { recursive: true });
  fs.writeFileSync(path.join(taDir, 'README.md'), `# Technical Architecture

Technical architecture decisions and documentation for this product.

**Naming:** \`ta-${prefix}-XXX-<slug>.md\`

**Template:** \`/.teamspec/templates/adr-template.md\`
`, 'utf-8');
  console.log(`  ✓ Created products/${productId}/technical-architecture/`);

  // decisions/
  const decisionsDir = path.join(productDir, 'decisions');
  fs.mkdirSync(decisionsDir, { recursive: true });
  fs.writeFileSync(path.join(decisionsDir, 'README.md'), `# Product Decisions

Product-level business decisions.

**Naming:** \`dec-${prefix}-XXX-<slug>.md\`

**Template:** \`/.teamspec/templates/decision-log-template.md\`
`, 'utf-8');
  console.log(`  ✓ Created products/${productId}/decisions/`);

  return productDir;
}

/**
 * Create products-index.md in the workspace root
 * @param {string} targetDir - Workspace root path
 */
function createProductsIndex(targetDir) {
  const productsDir = path.join(targetDir, 'products');
  fs.mkdirSync(productsDir, { recursive: true });

  const indexContent = `# Products Index

Master index of all products in this workspace.

## Product Registry

| Prefix | ID | Name | Status | Active Projects |
|--------|-----|------|--------|-----------------|
| _(none yet)_ | | | | |

---

> **To add products:** Run \`ts:po product\` or use \`teamspec init --product\`
`;
  fs.writeFileSync(path.join(productsDir, 'products-index.md'), indexContent, 'utf-8');
  console.log(`  ✓ Created products/products-index.md`);
}

// =============================================================================
// Project Structure Creation (4.0)
// =============================================================================

/**
 * Create a new project structure (4.0 format)
 * @param {string} targetDir - Workspace root path
 * @param {string} projectId - Slug identifier
 * @param {Object} options - Optional settings
 * @param {string[]} options.targetProducts - Products this project modifies
 */
function createProjectStructure(targetDir, projectId, options = {}) {
  const projectDir = path.join(targetDir, 'projects', projectId);
  fs.mkdirSync(projectDir, { recursive: true });

  console.log(`\n${colored(`Creating project structure: projects/${projectId}/...`, colors.blue)}`);

  const targetProducts = options.targetProducts || [];

  // project.yml (4.0 format with target_products)
  const projectYml = `# Project Configuration: ${projectId}
# TeamSpec 4.0 - TO-BE changes project
project:
  id: "${projectId}"
  name: "${projectId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}"
  description: |
    # TODO: Add project description - what CHANGES will this project deliver?
  status: active  # active, paused, completed, archived
  
  # Products this project modifies (populated via ts:fa feature-increment)
  target_products: ${targetProducts.length > 0 ? '\n    - ' + targetProducts.join('\n    - ') : '[]'}
`;
  fs.writeFileSync(path.join(projectDir, 'project.yml'), projectYml, 'utf-8');
  console.log(`  ✓ Created projects/${projectId}/project.yml`);

  // feature-increments/ (replaces features/ in 4.0)
  const fiDir = path.join(projectDir, 'feature-increments');
  fs.mkdirSync(fiDir, { recursive: true });
  fs.writeFileSync(path.join(fiDir, 'increments-index.md'), `# Feature Increments Index

> **Project:** ${projectId}

Feature Increments describe TO-BE changes to Product Features.
They are NOT the source of truth - the Product Canon is.

## Increment Registry

| ID | Product | Feature | Status | Epic |
|----|---------|---------|--------|------|
| _(none yet)_ | | | | |

## Next Available ID: _Derived from product prefix (fi-PRX-XXX)_

---

> **To add feature-increments:** Run \`ts:fa feature-increment <product-id> <feature-id>\`
`, 'utf-8');
  console.log(`  ✓ Created projects/${projectId}/feature-increments/`);

  // business-analysis-increments/
  const baiDir = path.join(projectDir, 'business-analysis-increments');
  fs.mkdirSync(baiDir, { recursive: true });
  fs.writeFileSync(path.join(baiDir, 'README.md'), `# Business Analysis Increments

TO-BE changes to product business analysis documents.

**Naming:** \`bai-PRX-XXX-<slug>.md\` (PRX = Product Prefix)

**Template:** \`/.teamspec/templates/business-analysis-template.md\`
`, 'utf-8');
  console.log(`  ✓ Created projects/${projectId}/business-analysis-increments/`);

  // solution-design-increments/
  const sdiDir = path.join(projectDir, 'solution-design-increments');
  fs.mkdirSync(sdiDir, { recursive: true });
  fs.writeFileSync(path.join(sdiDir, 'README.md'), `# Solution Design Increments

TO-BE changes to product solution designs.

**Naming:** \`sdi-PRX-XXX-<slug>.md\` (PRX = Product Prefix)

**Template:** \`/.teamspec/templates/solution-design-template.md\`
`, 'utf-8');
  console.log(`  ✓ Created projects/${projectId}/solution-design-increments/`);

  // technical-architecture-increments/
  const taiDir = path.join(projectDir, 'technical-architecture-increments');
  fs.mkdirSync(taiDir, { recursive: true });
  fs.writeFileSync(path.join(taiDir, 'README.md'), `# Technical Architecture Increments

TO-BE technical architecture decisions for this project.

**Naming:** \`tai-PRX-XXX-<slug>.md\` (PRX = Product Prefix)

**Template:** \`/.teamspec/templates/adr-template.md\`
`, 'utf-8');
  console.log(`  ✓ Created projects/${projectId}/technical-architecture-increments/`);

  // epics/ (now required containers for stories)
  fs.mkdirSync(path.join(projectDir, 'epics'), { recursive: true });
  fs.writeFileSync(path.join(projectDir, 'epics', 'epics-index.md'), `# Epics Index

Epics are required containers for stories. Each Epic links to Feature-Increments.

| ID | Name | Status | Feature Increments | Stories |
|----|------|--------|--------------------|---------|
| _(none yet)_ | | | | |

## Next Available ID: _Derived from product prefix (epic-PRX-XXX)_

> **To add epics:** Run \`ts:fa epic\`
`, 'utf-8');
  console.log(`  ✓ Created projects/${projectId}/epics/`);

  // stories/ with workflow folders (updated folder names)
  const storiesDir = path.join(projectDir, 'stories');
  for (const folder of ['backlog', 'ready-to-refine', 'ready-to-develop']) {
    fs.mkdirSync(path.join(storiesDir, folder), { recursive: true });
  }

  fs.writeFileSync(path.join(storiesDir, 'README.md'), `# Stories

## Workflow Folders

| Folder | Status | Owner |
|--------|--------|-------|
| \`backlog/\` | New stories | FA |
| \`ready-to-refine/\` | Ready for dev refinement | FA |
| \`ready-to-develop/\` | Refined, ready for sprint | DEV |

## Rules (4.0)

- **Stories MUST link to an Epic** via filename: \`s-eXXX-YYY-description.md\`
- Stories MAY reference Feature-Increments (fi-PRX-XXX) in content
- Stories describe DELTAS (before/after) not full behavior
- Use \`ts:fa story <epic-id>\` to create properly formatted stories
`, 'utf-8');
  console.log(`  ✓ Created projects/${projectId}/stories/`);

  // decisions/ (project-level decisions)
  fs.mkdirSync(path.join(projectDir, 'decisions'), { recursive: true });
  fs.writeFileSync(path.join(projectDir, 'decisions', 'README.md'), `# Project Decisions

Project-level business decisions.

**Naming:** \`dec-XXX-<slug>.md\`

Use template: \`/.teamspec/templates/decision-log-template.md\`
`, 'utf-8');
  console.log(`  ✓ Created projects/${projectId}/decisions/`);

  // dev-plans/
  fs.mkdirSync(path.join(projectDir, 'dev-plans'), { recursive: true });
  fs.writeFileSync(path.join(projectDir, 'dev-plans', 'README.md'), `# Development Plans

**Naming:** \`dp-sXXX-YYY-<slug>.md\` (matches story s-eXXX-YYY)

Rules:
- NEVER start coding without a dev plan
- No TBD/TODO items before implementation
- Mark tasks ✅ as completed
`, 'utf-8');
  console.log(`  ✓ Created projects/${projectId}/dev-plans/`);

  // qa/
  fs.mkdirSync(path.join(projectDir, 'qa', 'test-cases'), { recursive: true });
  fs.writeFileSync(path.join(projectDir, 'qa', 'README.md'), `# Quality Assurance

Tests validate **Feature Canon** behavior (AS-IS + TO-BE changes).

Use template: \`/.teamspec/templates/testcases-template.md\`
`, 'utf-8');
  console.log(`  ✓ Created projects/${projectId}/qa/`);

  // sprints/
  fs.mkdirSync(path.join(projectDir, 'sprints'), { recursive: true });
  fs.writeFileSync(path.join(projectDir, 'sprints', 'sprints-index.md'), `# Sprints Index

## Current Sprint: _None active_

## Sprint History

| Sprint | Goal | Status | Stories | Deployed | Canon Synced |
|--------|------|--------|---------|----------|--------------|
| _(none yet)_ | | | | | |
`, 'utf-8');
  console.log(`  ✓ Created projects/${projectId}/sprints/`);

  return projectDir;
}

// =============================================================================
// Update Command
// =============================================================================

function updateTeamspecCore(targetDir, sourceDir) {
  const targetTeamspec = path.join(targetDir, '.teamspec');

  // Directories to fully replace (core TeamSpec content)
  const dirsToUpdate = ['agents', 'definitions', 'profiles', 'templates'];

  // Root-level files to update (core configuration)
  const filesToUpdate = [
    'teamspec.yml',           // Core configuration
    'registry.yml',           // Roles, artifacts, commands, gates
    'copilot-instructions.md', // GitHub Copilot integration
    'FOLDER_STRUCTURE.yml'    // Folder structure validation
  ];

  // Context files to update (schema only, preserve user data)
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
    // Update schema files from source
    for (const fileName of contextFilesToUpdate) {
      const src = path.join(sourceDir, 'context', fileName);
      const dest = path.join(contextDir, fileName);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        updated.push(`context/${fileName}`);
        console.log(`  ✓ Updated context/${fileName}`);
      }
    }

    // Preserve team-specific context files (never overwrite)
    const preservedContextFiles = ['team.yml', 'org.yml', 'conventions.yml'];
    for (const fileName of preservedContextFiles) {
      const filePath = path.join(contextDir, fileName);
      if (fs.existsSync(filePath)) {
        skipped.push(`context/${fileName}`);
        console.log(`  ⏭ Preserved context/${fileName}`);
      }
    }
  }

  // Preserve products/ and projects/ directories (user content)
  const userDirs = ['products', 'projects'];
  for (const dirName of userDirs) {
    const dirPath = path.join(targetDir, dirName);
    if (fs.existsSync(dirPath)) {
      skipped.push(`${dirName}/`);
      console.log(`  ⏭ Preserved ${dirName}/`);
    }
  }

  return { updated, skipped };
}

// =============================================================================
// Git Status Check
// =============================================================================

/**
 * Check if directory is a git repository with uncommitted changes
 * @param {string} targetDir - Directory to check
 * @returns {{ isGitRepo: boolean, hasChanges: boolean, changedFiles: number }}
 */
function checkGitStatus(targetDir) {
  const { execSync } = require('child_process');

  try {
    // Check if it's a git repo
    execSync('git rev-parse --git-dir', {
      cwd: targetDir,
      stdio: 'pipe',
      encoding: 'utf-8'
    });

    // Check for uncommitted changes (staged + unstaged + untracked)
    const status = execSync('git status --porcelain', {
      cwd: targetDir,
      stdio: 'pipe',
      encoding: 'utf-8'
    });

    const changedFiles = status.trim().split('\n').filter(line => line.trim()).length;

    return {
      isGitRepo: true,
      hasChanges: changedFiles > 0,
      changedFiles
    };
  } catch {
    // Not a git repo or git not available
    return {
      isGitRepo: false,
      hasChanges: false,
      changedFiles: 0
    };
  }
}

/**
 * Warn user about uncommitted changes and prompt to continue
 * @param {object} rl - Readline interface
 * @param {object} gitStatus - Result from checkGitStatus
 * @param {boolean} force - Skip confirmation if true
 * @param {boolean} nonInteractive - Skip prompt if true
 * @returns {Promise<boolean>} - Whether to proceed
 */
async function warnUncommittedChanges(rl, gitStatus, force, nonInteractive) {
  if (!gitStatus.isGitRepo || !gitStatus.hasChanges) {
    return true; // No warning needed
  }

  console.log(colored(`\n⚠️  Git repository has ${gitStatus.changedFiles} uncommitted change(s)`, colors.yellow));
  console.log(colored('   Recommendation: Commit your changes first so TeamSpec updates can be', colors.yellow));
  console.log(colored('   easily verified and rolled back if needed.', colors.yellow));

  if (force) {
    console.log(colored('   Proceeding anyway (--force flag used)', colors.yellow));
    return true;
  }

  if (nonInteractive) {
    console.log(colored('\n❌ Uncommitted changes detected. Use --force to proceed anyway.', colors.red));
    return false;
  }

  const proceed = await promptYesNo(
    rl,
    `\n${colored('Proceed with uncommitted changes?', colors.bold)} `,
    false
  );

  return proceed;
}

// =============================================================================
// IDE Integration
// =============================================================================

async function setupIDEIntegration(targetDir, options) {
  if (!options.ide || options.ide === 'none') {
    return { skipped: true };
  }

  const { installExtension, copyExtensionToWorkspace, isVSCodeAvailable } = require('./extension-installer');
  const { generateAllPrompts } = require('./prompt-generator');

  console.log(`\n${colored('Setting up IDE integration...', colors.blue)}`);

  // Generate GitHub Copilot prompt files for VS Code and Cursor
  if (options.ide === 'vscode' || options.ide === 'cursor') {
    try {
      console.log('  → Generating GitHub Copilot prompt files...');
      const generatedFiles = generateAllPrompts(targetDir);
      console.log(`  ✓ Generated ${generatedFiles.length} prompt files in .github/prompts/`);
    } catch (error) {
      console.log(`  ⚠ Failed to generate prompts: ${error.message}`);
    }
  }

  // Create .vscode folder with settings
  const vscodeDir = path.join(targetDir, '.vscode');
  fs.mkdirSync(vscodeDir, { recursive: true });

  // Create or update settings.json
  const settingsPath = path.join(vscodeDir, 'settings.json');
  let settings = {};

  if (fs.existsSync(settingsPath)) {
    try {
      settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
    } catch {
      // Ignore parse errors
    }
  }

  // Add TeamSpec-specific settings
  settings['teamspec.enforceGates'] = true;
  settings['files.associations'] = settings['files.associations'] || {};
  settings['files.associations']['*.teamspec'] = 'yaml';
  settings['editor.formatOnSave'] = settings['editor.formatOnSave'] ?? true;

  // Add markdown settings for better feature/story editing
  settings['[markdown]'] = settings['[markdown]'] || {};
  settings['[markdown]']['editor.wordWrap'] = 'on';

  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  console.log('  ✓ Created .vscode/settings.json');

  // Create extensions.json to recommend the extension
  const extensionsPath = path.join(vscodeDir, 'extensions.json');
  const extensionsJson = {
    recommendations: ['teamspec.teamspec']
  };

  if (fs.existsSync(extensionsPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(extensionsPath, 'utf-8'));
      if (existing.recommendations) {
        const recs = new Set(existing.recommendations);
        recs.add('teamspec.teamspec');
        extensionsJson.recommendations = Array.from(recs);
      }
    } catch {
      // Ignore parse errors
    }
  }

  fs.writeFileSync(extensionsPath, JSON.stringify(extensionsJson, null, 2));
  console.log('  ✓ Created .vscode/extensions.json');

  return { success: true };
}

// =============================================================================
// Summary Output
// =============================================================================

function printNextSteps(targetDir, profile, projectId, ide, ideResult, copilot) {
  console.log(`\n${colored('='.repeat(70), colors.green)}`);
  console.log(colored('  ✅ TeamSpec 4.0 initialized successfully!', colors.green + colors.bold));
  console.log(colored('='.repeat(70), colors.green));

  const copilotSection = copilot !== false ? `
    .github/
      └── copilot-instructions.md - GitHub Copilot guidance` : '';

  console.log(`
${colored('📁 Created Structure:', colors.bold)}
    .teamspec/                    - Core framework
      ├── templates/              - Document templates
      ├── definitions/            - DoR/DoD checklists
      ├── profiles/               - Profile overlays
      └── context/team.yml        - Team configuration${copilotSection}
    projects/${projectId}/
      ├── features/               - Feature Canon (source of truth)
      ├── stories/                - User stories (workflow folders)
      ├── adr/                    - Architecture decisions
      ├── decisions/              - Business decisions
      ├── dev-plans/              - Development task breakdowns
      ├── qa/                     - Test cases
      ├── sprints/                - Sprint management
      └── epics/                  - Epic specifications
`);

  // IDE Integration Info
  if (ide === 'vscode') {
    console.log(`${colored('🖥️  VS Code Integration:', colors.bold)}`);
    console.log(`   ✓ Prompt templates generated in .github/prompts/`);
    console.log(`   ℹ Use with GitHub Copilot, Cursor, or your preferred AI assistant`);
    console.log('');
  } else if (ide === 'cursor') {
    console.log(`${colored('🖥️  Cursor Integration:', colors.bold)}`);
    console.log(`   ✓ Prompt templates generated in .github/prompts/`);
    console.log(`   ℹ VS Code settings configured for Cursor compatibility`);
    console.log('');
  }

  console.log(`${colored('🚀 Next Steps:', colors.bold + colors.yellow)}

  ${colored('1. Configure Your Team', colors.cyan)}
    Edit ${colored('.teamspec/context/team.yml', colors.bold)} to set your tech stack.

  ${colored('2. Create Your First Feature-Increment', colors.cyan)}
    Feature-Increments are NEVER created implicitly. Use:
    ${colored('ts:fa feature-increment', colors.bold)}    - Create feature-increment (FI)

  ${colored('3. Start Using TeamSpec Commands', colors.cyan)}
    ${colored('ts:ba create', colors.bold)}       - Create business analysis
    ${colored('ts:fa story', colors.bold)}        - Create user story
    ${colored('ts:dev plan', colors.bold)}        - Create development plan
    ${colored('ts:qa test', colors.bold)}         - Design test cases

    Or use templates in .github/prompts/ with GitHub Copilot, Cursor, or Claude

  ${colored('📚 Documentation:', colors.bold)}
    - Templates:    .teamspec/templates/
    - Definitions:  .teamspec/definitions/
  `);
}

function printUpdateSummary(coreResult) {
  const pkg = require('../package.json');

  console.log(`\n${colored('='.repeat(70), colors.green)} `);
  console.log(colored('  ✅ TeamSpec updated successfully!', colors.green + colors.bold));
  console.log(colored('='.repeat(70), colors.green));

  console.log(`\n${colored('Version:', colors.bold)} ${pkg.version} `);

  console.log(`\n${colored('Updated:', colors.bold)} `);
  for (const item of coreResult.updated) {
    console.log(`    ✓ ${item} `);
  }

  if (coreResult.skipped.length > 0) {
    console.log(`\n${colored('Preserved:', colors.bold)} `);
    for (const item of coreResult.skipped) {
      console.log(`    ⏭ ${item} `);
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
    const { runLint } = require('./linter');
    const targetDir = path.resolve(options.target);

    const exitCode = runLint(targetDir, {
      project: options.project,
      rule: options.rule,
      verbose: options.verbose
    });

    process.exit(exitCode);
  }

  // Handle migrate command
  if (options.command === 'migrate') {
    const { analyzeMigration, printMigrationPlan, executeMigration } = require('./migrate');
    const targetDir = path.resolve(options.target);

    console.log(`\n${colored('TeamSpec Migration Tool', colors.bold + colors.cyan)} `);
    console.log(`${colored('Target:', colors.bold)} ${targetDir} `);

    // Detect workspace version
    const versionInfo = detectWorkspaceVersion(targetDir);
    console.log(`${colored('Detected version:', colors.bold)} ${versionInfo.version}`);

    if (versionInfo.version === 'none') {
      console.error(colored(`\n❌ No TeamSpec workspace found in: ${targetDir}`, colors.red));
      console.error('Run `teamspec init` first to create a new workspace.');
      process.exit(1);
    }

    if (versionInfo.version === '4.0') {
      console.log(colored(`\n✅ Workspace is already at version 4.0`, colors.green));
      console.log(`  Products: ${versionInfo.productCount}`);
      console.log(`  Projects: ${versionInfo.projectCount}`);
      return;
    }

    if (versionInfo.version !== '2.0') {
      console.error(colored(`\n❌ Unknown workspace version: ${versionInfo.version}`, colors.red));
      console.error('Manual migration may be required.');
      process.exit(1);
    }

    // Analyze and plan migration
    console.log(`\nAnalyzing workspace for migration...`);
    const plan = analyzeMigration(targetDir);
    printMigrationPlan(plan);

    if (!plan.canMigrate) {
      process.exit(1);
    }

    // Dry run by default unless --fix is specified
    const dryRun = !options.fix;

    if (dryRun) {
      console.log(`\n${colored('ℹ️  Dry run mode', colors.yellow)} - no changes will be made.`);
      console.log(`   Run with ${colored('--fix', colors.bold)} to apply changes.`);
    } else {
      if (!options.force && !options.nonInteractive) {
        const rl = createReadlineInterface();
        const proceed = await promptYesNo(
          rl,
          `\n${colored('Proceed with migration?', colors.bold)}`,
          false
        );
        rl.close();
        if (!proceed) {
          console.log('Cancelled.');
          process.exit(0);
        }
      }
    }

    // Execute migration
    console.log(`\n${colored('Executing migration...', colors.bold)}`);
    const result = executeMigration(targetDir, plan, { dryRun });

    // Summary
    console.log(`\n${colored('Migration Summary:', colors.bold)}`);
    console.log(`  Actions completed: ${result.actionsCompleted}`);
    console.log(`  Actions failed:    ${result.actionsFailed}`);

    if (result.errors.length > 0) {
      console.log(`\n${colored('Errors:', colors.red)}`);
      for (const error of result.errors) {
        console.log(`  • ${error}`);
      }
      process.exit(1);
    }

    if (!dryRun) {
      console.log(`\n${colored('✅ Migration complete!', colors.green + colors.bold)}`);
      console.log(`\nNext steps:`);
      console.log(`  1. Review the migrated product structure in products/`);
      console.log(`  2. Update product descriptions in product.yml files`);
      console.log(`  3. Run ${colored('teamspec lint', colors.cyan)} to verify the migration`);
    }

    return;
  }

  // Handle generate-prompts command
  if (options.command === 'generate-prompts') {
    const { generateAllPrompts } = require('./prompt-generator');
    const targetDir = path.resolve(options.target);

    console.log(`\n${colored('TeamSpec Copilot Prompt Generator', colors.bold + colors.cyan)} `);
    console.log(`${colored('Target:', colors.bold)} ${targetDir} \n`);

    try {
      generateAllPrompts(targetDir);
      console.log(`\n${colored('✨ Done!', colors.green + colors.bold)} `);
      console.log(`\nYou can now use ${colored('ts:role-command', colors.cyan)} in GitHub Copilot Chat.`);
      console.log(`Example: ${colored('ts:ba-project', colors.cyan)} or ${colored('ts:fa-story', colors.cyan)} `);
    } catch (error) {
      console.error(colored(`❌ Error: ${error.message} `, colors.red));
      process.exit(1);
    }
    return;
  }

  // Handle update command
  if (options.command === 'update') {
    const targetDir = path.resolve(options.target);
    const teamspecDir = path.join(targetDir, '.teamspec');

    if (!fs.existsSync(teamspecDir)) {
      console.error(colored(`❌ TeamSpec not found in: ${targetDir} `, colors.red));
      console.error('Run `teamspec init` first.');
      process.exit(1);
    }

    const pkg = require('../package.json');
    console.log(`\n${colored('TeamSpec Update', colors.bold + colors.cyan)} v${pkg.version} `);

    // Check for uncommitted changes
    const gitStatus = checkGitStatus(targetDir);
    if (gitStatus.isGitRepo && gitStatus.hasChanges) {
      const rl = createReadlineInterface();
      const proceed = await warnUncommittedChanges(rl, gitStatus, options.force, options.nonInteractive);
      rl.close();
      if (!proceed) {
        console.log('Cancelled. Please commit your changes first.');
        process.exit(0);
      }
    }

    if (!options.force && !options.nonInteractive) {
      const rl = createReadlineInterface();
      const proceed = await promptYesNo(
        rl,
        `${colored('Update core files (preserves team.yml)?', colors.bold)} `,
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
      console.error(colored(`Error: Core files not found at: ${sourceDir} `, colors.red));
      process.exit(1);
    }

    const coreResult = updateTeamspecCore(targetDir, sourceDir);

    // Update copilot instructions if they exist
    const copilotPath = path.join(targetDir, '.github', 'copilot-instructions.md');
    if (fs.existsSync(copilotPath)) {
      console.log(`\n${colored('Updating GitHub Copilot instructions...', colors.blue)}`);
      copyCopilotInstructions(targetDir, sourceDir);
    }

    // Regenerate prompt files if prompts folder exists
    const promptsPath = path.join(targetDir, '.github', 'prompts');
    if (fs.existsSync(promptsPath)) {
      console.log(`\n${colored('Regenerating prompt files...', colors.blue)}`);
      // Delete old prompts folder to remove obsolete files
      fs.rmSync(promptsPath, { recursive: true });
      const { generateAllPrompts } = require('./prompt-generator');
      try {
        const generatedFiles = generateAllPrompts(targetDir);
        console.log(`  ✓ Regenerated ${generatedFiles.length} prompt files`);
        coreResult.updated.push('.github/prompts/');
      } catch (error) {
        console.log(`  ⚠ Failed to regenerate prompts: ${error.message}`);
      }
    }

    printUpdateSummary(coreResult);
    return;
  }

  // Default: init command
  printBanner();

  const targetDir = path.resolve(options.target);

  if (!fs.existsSync(targetDir)) {
    console.error(colored(`Error: Directory does not exist: ${targetDir} `, colors.red));
    process.exit(1);
  }

  // Check for uncommitted changes before init
  const gitStatus = checkGitStatus(targetDir);
  if (gitStatus.isGitRepo && gitStatus.hasChanges) {
    const rl = createReadlineInterface();
    const proceed = await warnUncommittedChanges(rl, gitStatus, options.force, options.nonInteractive);
    rl.close();
    if (!proceed) {
      console.log('Cancelled. Please commit your changes first.');
      process.exit(0);
    }
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

  console.log(`\n${colored('Target:', colors.bold)} ${targetDir} `);

  // Set defaults for non-interactive mode
  if (options.nonInteractive) {
    options.profile = options.profile || 'none';
    options.org = options.org || 'My Organization';
    options.team = options.team || 'My Team';
    options.project = options.project || DEFAULT_PROJECT_ID;
    options.ide = options.ide || 'none';
    options.copilot = options.copilot !== false; // Default to true unless explicitly set to false
    options.industry = 'technology';
    options.cadence = 'scrum';
    options.sprintLengthDays = 14;
    options.setupMode = options.setupMode || 'project-only'; // Default to project-only for non-interactive
  } else {
    await runInteractive(options);
  }

  // Validate profile
  if (!PROFILE_OPTIONS[options.profile]) {
    console.error(colored(`Error: Unknown profile: ${options.profile} `, colors.red));
    process.exit(1);
  }

  if (options.project) {
    options.project = normalizeProjectId(options.project);
  }

  console.log(`\n${colored('Initializing TeamSpec 4.0...', colors.bold)} `);

  const sourceDir = getTeamspecCoreDir();
  if (!fs.existsSync(sourceDir)) {
    console.error(colored(`Error: Core files not found at: ${sourceDir} `, colors.red));
    process.exit(1);
  }

  copyTeamspecCore(targetDir, sourceDir);
  createTeamContext(targetDir, options);

  // Create products-index.md
  createProductsIndex(targetDir);

  // Create product structure (if product-first mode)
  if (options.setupMode === 'product-first' && options.productName) {
    createProductStructure(targetDir, options.productId, options.productName, options.productPrefix);

    // Create project linked to product
    if (options.createProject && options.project) {
      createProjectStructure(targetDir, options.project, {
        targetProducts: [options.productId]
      });
    }
  } else if (options.project) {
    // Project-only mode
    createProjectStructure(targetDir, options.project);
  }

  // Copy GitHub Copilot instructions if requested
  if (options.copilot !== false) {
    copyCopilotInstructions(targetDir, sourceDir);
  }

  // Setup IDE integration
  const ideResult = await setupIDEIntegration(targetDir, options);

  printNextSteps(targetDir, options.profile, options.project, options.ide, ideResult, options.copilot);
}

module.exports = { run };
