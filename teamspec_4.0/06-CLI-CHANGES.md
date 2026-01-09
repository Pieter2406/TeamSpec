# 06 — CLI Changes

> **Document:** TeamSpec 4.0 CLI Updates  
> **Status:** Planning  
> **Last Updated:** 2026-01-09

---

## 1. CLI Command Changes

### 1.1 Command Overview

| Command | 2.0 | 4.0 | Change |
|---------|-----|-----|--------|
| `teamspec init` | ✓ | ✓ | MODIFIED |
| `teamspec update` | ✓ | ✓ | MODIFIED |
| `teamspec lint` | ✓ | ✓ | MODIFIED |
| `teamspec migrate` | — | ✓ | NEW |
| `teamspec generate-prompts` | ✓ | ✓ | MODIFIED |

---

## 2. `teamspec init` Changes

### 2.1 Version Detection

The init command must detect existing workspaces:

```javascript
function detectWorkspaceVersion(targetDir) {
  const productsDir = path.join(targetDir, 'products');
  const projectsDir = path.join(targetDir, 'projects');
  const teamspecDir = path.join(targetDir, '.teamspec');
  const teamspecYml = path.join(teamspecDir, 'teamspec.yml');
  
  // Check for 4.0 indicators
  if (fs.existsSync(productsDir)) {
    return '4.0';
  }
  
  // Check teamspec.yml version
  if (fs.existsSync(teamspecYml)) {
    const content = fs.readFileSync(teamspecYml, 'utf-8');
    const versionMatch = content.match(/version:\s*["']?(\d+\.\d+)/);
    if (versionMatch) {
      return versionMatch[1];
    }
  }
  
  // Check for 2.0 indicators
  if (fs.existsSync(projectsDir)) {
    return '2.0';
  }
  
  return 'none';
}
```

### 2.2 Fresh Install Flow (4.0)

When no existing workspace is detected:

```
teamspec init
│
├─→ Print banner (updated for 4.0)
│
├─→ Check for existing workspace
│   └─→ None detected
│
├─→ Ask: Start with Product or Project?
│   │
│   ├─→ "Product first" (recommended for established systems)
│   │   ├─→ Prompt for product details
│   │   ├─→ Create products/{product-id}/ structure
│   │   ├─→ Ask: Create initial project?
│   │   │   ├─→ Yes: Prompt for project details, link to product
│   │   │   └─→ No: Complete init
│   │   └─→ Deploy .teamspec/
│   │
│   └─→ "Project first" (for greenfield/MVPs)
│       ├─→ Create implicit product (product-id = project-id)
│       ├─→ Create projects/{project-id}/ structure
│       ├─→ Link project to implicit product
│       └─→ Deploy .teamspec/
│
├─→ Standard setup questions (profile, org, team, etc.)
│
└─→ Deploy .github/copilot-instructions.md (if selected)
```

### 2.3 Upgrade Detection Flow

When 2.0 workspace detected:

```
teamspec init
│
├─→ Detect existing 2.0 workspace
│
├─→ Print warning:
│   "TeamSpec 2.0 workspace detected.
│    To upgrade to 4.0, run: teamspec migrate"
│
├─→ Offer options:
│   1. Run migration now (teamspec migrate)
│   2. Update 2.0 core files (teamspec update)
│   3. Abort
│
└─→ Execute selected action
```

### 2.4 New Init Questions

Additional prompts for 4.0:

```javascript
const INIT_QUESTIONS_V4 = {
  startWith: {
    question: 'How would you like to start?',
    options: {
      'product-first': 'Create a Product first (for established systems)',
      'project-first': 'Create a Project first (for new/greenfield work)',
    },
    default: 'product-first',
  },
  
  productName: {
    question: 'Product name',
    default: 'My Product',
  },
  
  productDomain: {
    question: 'Business domain',
    options: {
      'e-commerce': 'E-Commerce / Retail',
      'fintech': 'Financial Services',
      'healthcare': 'Healthcare',
      'saas': 'SaaS Platform',
      'internal': 'Internal Tools',
      'other': 'Other',
    },
    default: 'other',
  },
};
```

### 2.5 Product Structure Creation

New function to create product structure:

```javascript
function createProductStructure(targetDir, productId, options) {
  const productDir = path.join(targetDir, 'products', productId);
  fs.mkdirSync(productDir, { recursive: true });

  console.log(`Creating product structure: products/${productId}/...`);

  // product.yml
  const productYml = `# Product Configuration: ${productId}
product:
  id: "${productId}"
  name: "${options.productName}"
  description: |
    # TODO: Add product description
  status: active
  
  owner:
    role: PO
    name: "${options.productOwner || 'TBD'}"

  business:
    domain: "${options.productDomain || 'other'}"

active_projects: []
`;
  fs.writeFileSync(path.join(productDir, 'product.yml'), productYml, 'utf-8');
  console.log(`  ✓ Created products/${productId}/product.yml`);

  // README.md
  const readme = `# ${options.productName}

## Overview

[Product description]

## Features

See [features/features-index.md](./features/features-index.md) for the Feature Canon.

## Active Projects

_No active projects yet._
`;
  fs.writeFileSync(path.join(productDir, 'README.md'), readme, 'utf-8');

  // features/
  const featuresDir = path.join(productDir, 'features');
  fs.mkdirSync(featuresDir, { recursive: true });

  fs.writeFileSync(path.join(featuresDir, 'features-index.md'), `# Features Index (Product Canon)

This is the master index of all features in this product.
The Product Canon is the **source of truth** for production behavior.

## Feature Registry

| ID | Name | Status | Owner |
|----|------|--------|-------|
| _(none yet)_ | | | |

## Next Available ID: **F-001**
`, 'utf-8');

  fs.writeFileSync(path.join(featuresDir, 'story-ledger.md'), `# Story Ledger

Tracks all changes to this product's Feature Canon.

| Date | Project | Story | Features Modified | Summary |
|------|---------|-------|-------------------|---------|
| _(none yet)_ | | | | |
`, 'utf-8');

  console.log(`  ✓ Created products/${productId}/features/`);

  // adr/
  fs.mkdirSync(path.join(productDir, 'adr'), { recursive: true });
  fs.writeFileSync(path.join(productDir, 'adr', 'README.md'), `# Architecture Decision Records

Production-level ADRs for this product.

Naming: \`ADR-NNN-<slug>.md\`
`, 'utf-8');
  console.log(`  ✓ Created products/${productId}/adr/`);

  // decisions/
  fs.mkdirSync(path.join(productDir, 'decisions'), { recursive: true });
  fs.writeFileSync(path.join(productDir, 'decisions', 'README.md'), `# Business Decisions

Production-level business decisions for this product.

Naming: \`DEC-NNN-<slug>.md\`
`, 'utf-8');
  console.log(`  ✓ Created products/${productId}/decisions/`);
}
```

### 2.6 Updated Project Structure Creation

Modified function with feature-increments:

```javascript
function createProjectStructure(targetDir, projectId, options) {
  const projectDir = path.join(targetDir, 'projects', projectId);
  fs.mkdirSync(projectDir, { recursive: true });

  console.log(`Creating project structure: projects/${projectId}/...`);

  // project.yml (updated for 4.0)
  const projectYml = `# Project Configuration: ${projectId}
project:
  id: "${projectId}"
  name: "${options.projectName || projectId}"
  description: |
    # TODO: Add project description
  status: active
  
  owner:
    role: BA
    name: "${options.projectOwner || 'TBD'}"
  
  timeline:
    started: ${new Date().toISOString().split('T')[0]}
    target_completion: null

# Target products this project modifies
target_products:
${options.targetProducts ? options.targetProducts.map(p => `  - product_id: "${p}"
    impact: major
    features_affected: []`).join('\n') : '  # - product_id: "product-id"\n  #   impact: major\n  #   features_affected: []'}
`;
  fs.writeFileSync(path.join(projectDir, 'project.yml'), projectYml, 'utf-8');
  console.log(`  ✓ Created projects/${projectId}/project.yml`);

  // feature-increments/ (renamed from features/)
  const incrementsDir = path.join(projectDir, 'feature-increments');
  fs.mkdirSync(incrementsDir, { recursive: true });

  fs.writeFileSync(path.join(incrementsDir, 'increments-index.md'), `# Feature-Increments Index

This index tracks proposed changes to product features.

## Increment Registry

| ID | Target Product | Target Feature | Status | Epic |
|----|----------------|----------------|--------|------|
| _(none yet)_ | | | | |

## Next Available ID: **FI-001**

> **To add increments:** Run \`ts:fa feature-increment\`
`, 'utf-8');
  console.log(`  ✓ Created projects/${projectId}/feature-increments/`);

  // epics/ (elevated importance)
  const epicsDir = path.join(projectDir, 'epics');
  fs.mkdirSync(epicsDir, { recursive: true });

  fs.writeFileSync(path.join(epicsDir, 'epics-index.md'), `# Epics Index

Epics are coherent increments that group stories.

## Epic Registry

| ID | Name | Status | Feature-Increments | Stories |
|----|------|--------|-------------------|---------|
| _(none yet)_ | | | | |

## Next Available ID: **EPIC-001**

> **To add epics:** Run \`ts:ba epic\`
`, 'utf-8');
  console.log(`  ✓ Created projects/${projectId}/epics/`);

  // stories/ (unchanged structure)
  const storiesDir = path.join(projectDir, 'stories');
  for (const folder of ['backlog', 'ready-to-refine', 'ready-for-development']) {
    fs.mkdirSync(path.join(storiesDir, folder), { recursive: true });
  }

  fs.writeFileSync(path.join(storiesDir, 'README.md'), `# Stories

## Rules (4.0)

- Every story must link to an **Epic**
- Stories describe DELTAS (changes), not full behavior
- Feature/FI links are optional metadata
- Use \`ts:fa story\` to create properly formatted stories
`, 'utf-8');
  console.log(`  ✓ Created projects/${projectId}/stories/`);

  // Rest unchanged (adr, decisions, dev-plans, qa, sprints)
  // ...
}
```

---

## 3. `teamspec migrate` Command

### 3.1 Purpose

Migrate a TeamSpec 2.0 workspace to 4.0 structure.

### 3.2 Syntax

```
teamspec migrate [options]

Options:
  --dry-run        Show what would be migrated without making changes
  --fix            Auto-fix common migration issues
  --product <id>   Specify product ID for migrated features (default: auto-detect)
  --force          Force migration even with warnings
```

### 3.3 Migration Flow

```javascript
async function migrateToV4(targetDir, options = {}) {
  console.log('TeamSpec Migration: 2.0 → 4.0\n');
  
  const dryRun = options.dryRun || false;
  const fix = options.fix || false;
  
  // Step 1: Analyze current structure
  console.log('Step 1: Analyzing current structure...');
  const analysis = analyzeV2Workspace(targetDir);
  
  if (analysis.errors.length > 0 && !options.force) {
    console.log('Errors detected. Fix these before migrating:');
    analysis.errors.forEach(e => console.log(`  ❌ ${e}`));
    return { success: false, errors: analysis.errors };
  }
  
  // Step 2: Create products structure
  console.log('\nStep 2: Creating products structure...');
  const productId = options.product || deriveProductId(analysis);
  
  if (!dryRun) {
    createProductFromProjectFeatures(targetDir, productId, analysis);
  } else {
    console.log(`  [DRY RUN] Would create: products/${productId}/`);
  }
  
  // Step 3: Rename features/ to feature-increments/
  console.log('\nStep 3: Converting project features to feature-increments...');
  for (const project of analysis.projects) {
    if (!dryRun) {
      convertFeaturesToIncrements(targetDir, project, productId);
    } else {
      console.log(`  [DRY RUN] Would convert: projects/${project}/features/ → feature-increments/`);
    }
  }
  
  // Step 4: Update project.yml files
  console.log('\nStep 4: Updating project.yml files...');
  for (const project of analysis.projects) {
    if (!dryRun) {
      updateProjectYamlForV4(targetDir, project, productId);
    } else {
      console.log(`  [DRY RUN] Would update: projects/${project}/project.yml`);
    }
  }
  
  // Step 5: Update .teamspec core files
  console.log('\nStep 5: Updating .teamspec core files...');
  if (!dryRun) {
    updateTeamspecCore(targetDir);
  }
  
  // Step 6: Run linter to find remaining issues
  console.log('\nStep 6: Running linter...');
  const lintResults = await lint(targetDir, { version: '4.0' });
  
  if (lintResults.length > 0) {
    console.log(`\n${lintResults.length} issues found after migration:`);
    lintResults.forEach(r => console.log(`  ${r.severity}: ${r.message}`));
    
    if (fix) {
      console.log('\nAttempting auto-fix...');
      // Run fix agent logic
    }
  }
  
  // Step 7: Generate migration report
  console.log('\nMigration complete!');
  return {
    success: true,
    productCreated: productId,
    projectsUpdated: analysis.projects,
    issues: lintResults,
  };
}
```

### 3.4 Feature → Product Migration Logic

```javascript
function createProductFromProjectFeatures(targetDir, productId, analysis) {
  const productDir = path.join(targetDir, 'products', productId);
  const productFeaturesDir = path.join(productDir, 'features');
  
  fs.mkdirSync(productFeaturesDir, { recursive: true });
  
  // Find all features across projects
  const allFeatures = new Map();
  
  for (const project of analysis.projects) {
    const featuresDir = path.join(targetDir, 'projects', project, 'features');
    if (!fs.existsSync(featuresDir)) continue;
    
    const featureFiles = fs.readdirSync(featuresDir)
      .filter(f => f.match(/^F-\d{3,}-.*\.md$/));
    
    for (const file of featureFiles) {
      const featureId = file.match(/^(F-\d{3,})/)[1];
      
      if (!allFeatures.has(featureId)) {
        // Copy first occurrence to product
        const src = path.join(featuresDir, file);
        const dest = path.join(productFeaturesDir, file);
        fs.copyFileSync(src, dest);
        console.log(`  ✓ Migrated ${file} to products/${productId}/features/`);
        allFeatures.set(featureId, file);
      } else {
        console.log(`  ⚠ Skipped duplicate ${featureId} from ${project}`);
      }
    }
  }
  
  // Copy index files
  // ...
  
  // Create product.yml
  createProductYml(productDir, productId, analysis);
}
```

### 3.5 Feature-Increment Conversion

```javascript
function convertFeaturesToIncrements(targetDir, projectId, productId) {
  const projectDir = path.join(targetDir, 'projects', projectId);
  const featuresDir = path.join(projectDir, 'features');
  const incrementsDir = path.join(projectDir, 'feature-increments');
  
  if (!fs.existsSync(featuresDir)) {
    console.log(`  ⏭ No features/ folder in ${projectId}`);
    return;
  }
  
  // Create feature-increments folder
  fs.mkdirSync(incrementsDir, { recursive: true });
  
  // Get feature files (excluding index files)
  const featureFiles = fs.readdirSync(featuresDir)
    .filter(f => f.match(/^F-\d{3,}-.*\.md$/));
  
  let fiNumber = 1;
  
  for (const file of featureFiles) {
    const content = fs.readFileSync(path.join(featuresDir, file), 'utf-8');
    const featureId = file.match(/^(F-\d{3,})/)[1];
    const slug = file.match(/^F-\d{3,}-(.+)\.md$/)[1];
    
    // Create FI file
    const fiId = `FI-${String(fiNumber).padStart(3, '0')}`;
    const fiFile = `${fiId}-${slug}.md`;
    
    const fiContent = convertFeatureToIncrement(content, featureId, productId);
    fs.writeFileSync(path.join(incrementsDir, fiFile), fiContent, 'utf-8');
    
    console.log(`  ✓ Converted ${file} → ${fiFile}`);
    fiNumber++;
  }
  
  // Create increments-index.md
  // ...
  
  // Optionally remove old features folder (or rename to .bak)
  fs.renameSync(featuresDir, `${featuresDir}.migrated`);
  console.log(`  ✓ Renamed features/ → features.migrated/`);
}
```

---

## 4. `teamspec update` Changes

### 4.1 Version-Aware Updates

```javascript
async function update(targetDir, options = {}) {
  const version = detectWorkspaceVersion(targetDir);
  
  if (version === 'none') {
    console.log('No TeamSpec workspace found. Run: teamspec init');
    return;
  }
  
  if (version === '2.0' && !options.keepVersion) {
    console.log('TeamSpec 2.0 workspace detected.');
    console.log('Options:');
    console.log('  1. Update to 4.0 (recommended): teamspec migrate');
    console.log('  2. Update 2.0 files only: teamspec update --keep-version');
    return;
  }
  
  // Update core files for detected version
  const sourceDir = getTeamspecCoreDir(version);
  updateTeamspecCore(targetDir, sourceDir);
}
```

### 4.2 New Core Files

The update command must handle new 4.0 files:

```javascript
const CORE_DIRS_V4 = [
  'agents',      // Now includes AGENT_PO.md
  'definitions',
  'profiles',
  'templates',   // Now includes feature-increment-template.md
];

const CORE_FILES_V4 = [
  'teamspec.yml',
];
```

---

## 5. `teamspec lint` Changes

### 5.1 Version-Aware Linting

```javascript
async function lintCommand(workspaceDir, options = {}) {
  const version = detectWorkspaceVersion(workspaceDir);
  
  console.log(`Linting TeamSpec ${version} workspace...\n`);
  
  // Load version-appropriate rules
  const rules = loadRules(version);
  
  // Create context
  const ctx = createLintContext(workspaceDir, options.project);
  ctx.version = version;
  
  // Run rules
  const results = [];
  for (const rule of rules) {
    const ruleResults = await rule.check(ctx);
    results.push(...ruleResults);
  }
  
  // Output results
  outputResults(results, options);
  
  return results.length === 0 ? 0 : 1;
}
```

### 5.2 New Context Properties

```javascript
function createLintContext(workspaceDir, targetProject) {
  return {
    workspaceDir,
    version: detectWorkspaceVersion(workspaceDir),
    projects: findProjects(workspaceDir),
    products: findProducts(workspaceDir),  // NEW
    targetProject,
  };
}

function findProducts(workspaceDir) {
  const productsDir = path.join(workspaceDir, 'products');
  if (!fs.existsSync(productsDir)) return [];
  
  return fs.readdirSync(productsDir, { withFileTypes: true })
    .filter(e => e.isDirectory() && !e.name.startsWith('.'))
    .map(e => e.name);
}
```

---

## 6. `teamspec generate-prompts` Changes

### 6.1 New Files to Generate

```javascript
const PROMPT_FILES_V4 = {
  // Core agents
  'AGENT_BOOTSTRAP.md': '.teamspec/agents/',
  'AGENT_PO.md': '.teamspec/agents/',       // NEW
  'AGENT_BA.md': '.teamspec/agents/',
  'AGENT_FA.md': '.teamspec/agents/',
  'AGENT_SA.md': '.teamspec/agents/',
  'AGENT_DEV.md': '.teamspec/agents/',
  'AGENT_QA.md': '.teamspec/agents/',
  'AGENT_SM.md': '.teamspec/agents/',
  'AGENT_DES.md': '.teamspec/agents/',
  'AGENT_FIX.md': '.teamspec/agents/',
  
  // Copilot instructions
  'copilot-instructions.md': '.github/',
};
```

### 6.2 Updated copilot-instructions.md

The generated copilot-instructions.md must reflect 4.0 concepts.

---

## 7. CLI Help Updates

### 7.1 New Help Text

```javascript
function printHelp() {
  console.log(`
${colored('TeamSpec Init', colors.bold)} - Bootstrap TeamSpec 4.0 Product-Canon Operating Model

${colored('USAGE:', colors.bold)}
  teamspec [command] [options]

${colored('COMMANDS:', colors.bold)}
  init [options]          Initialize TeamSpec in a repository (default)
  migrate [options]       Migrate 2.0 workspace to 4.0
  update [options]        Update TeamSpec core files (keeps context)
  lint [options]          Lint artifacts against TeamSpec rules
  generate-prompts        Generate/update prompt files

${colored('OPTIONS:', colors.bold)}
  -h, --help              Show this help message
  -v, --version           Show version number
  -t, --target <dir>      Target directory (default: current directory)
  -p, --profile <profile> Team profile to use
  --product <id>          Product ID (for init/migrate)
  --project <id>          Project ID (for init)
  --dry-run               Show changes without applying (migrate/lint)
  --fix                   Auto-fix issues (migrate/lint)
  -y, --non-interactive   Run without prompts (use defaults)

${colored('MIGRATE OPTIONS:', colors.bold)}
  --dry-run               Preview migration without changes
  --fix                   Auto-fix issues after migration
  --product <id>          Specify product ID for features
  --force                 Force migration with warnings

${colored('EXAMPLES:', colors.bold)}
  teamspec                              # Interactive setup
  teamspec --profile startup -y         # Quick setup
  teamspec migrate                      # Migrate 2.0 → 4.0
  teamspec migrate --dry-run            # Preview migration
  teamspec migrate --fix                # Migrate and auto-fix
  teamspec lint                         # Lint all projects
  teamspec update                       # Update core files

${colored('WHAT GETS CREATED (4.0):', colors.bold)}
  .teamspec/                 Core framework
    ├── agents/              Agent prompts (includes AGENT_PO.md)
    ├── templates/           Document templates
    └── ...
  products/{product-id}/     Product (production truth)
    ├── features/            Feature Canon
    └── ...
  projects/{project-id}/     Project (change initiative)
    ├── feature-increments/  Proposed changes
    ├── epics/               Story containers
    └── ...
`);
}
```

---

## 8. Package.json Updates

```json
{
  "name": "teamspec",
  "version": "4.0.0",
  "description": "TeamSpec Product-Canon Operating Model CLI",
  "main": "lib/cli.js",
  "bin": {
    "teamspec": "bin/teamspec-init.js"
  },
  "scripts": {
    "test": "node test/cli.test.js && node test/linter.test.js && node test/migrate.test.js"
  }
}
```

---

## 9. Summary of CLI Changes

| Component | Change Level | Description |
|-----------|--------------|-------------|
| `teamspec init` | HIGH | New flow for products, upgrade detection |
| `teamspec migrate` | NEW | Complete new command |
| `teamspec update` | MEDIUM | Version-aware updates |
| `teamspec lint` | HIGH | New rules, product awareness |
| `teamspec generate-prompts` | MEDIUM | New agent files |
| Help text | MEDIUM | Updated for 4.0 |
| Core files | HIGH | New templates, agents |
