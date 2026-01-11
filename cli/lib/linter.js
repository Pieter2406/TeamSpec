/**
 * TeamSpec Linter
 * Enforces TeamSpec 4.0 Product-Canon operating model rules
 * 
 * Rule Categories (Legacy 2.0):
 * - TS-PROJ: Project structure and registration
 * - TS-FEAT: Feature Canon integrity (deprecated)
 * - TS-STORY: Story format and delta compliance
 * - TS-ADR: Architecture decisions
 * - TS-DEVPLAN: Development planning
 * - TS-DOD: Definition of Done gates
 * - TS-NAMING: Naming conventions
 * 
 * Rule Categories (4.0):
 * - TS-PROD: Product structure and registration
 * - TS-FI: Feature-Increment rules
 * - TS-EPIC: Epic rules
 * - TS-QA: QA coverage and regression rules
 */

const fs = require('fs');
const path = require('path');

// =============================================================================
// Severity Levels
// =============================================================================

const SEVERITY = {
  ERROR: 'error',
  BLOCKER: 'blocker',
  WARNING: 'warning',
  INFO: 'info',
};

// =============================================================================
// Naming Patterns - Legacy (pre-4.0)
// =============================================================================

const NAMING_PATTERNS_V2 = {
  feature: /^F-\d{3,}-[a-z][a-z0-9-]*\.md$/,
  story: /^S-\d{3,}-[a-z][a-z0-9-]*\.md$/,
  adr: /^ADR-\d{3,}-[a-z][a-z0-9-]*\.md$/,
  decision: /^DECISION-\d{3,}-[a-z][a-z0-9-]*\.md$/,
  epic: /^EPIC-\d{3,}-[a-z][a-z0-9-]*\.md$/,
  devPlan: /^story-\d{3,}-tasks\.md$/,
  sprint: /^sprint-\d+$/,
};

// =============================================================================
// Naming Patterns - TeamSpec 4.0
// =============================================================================

const NAMING_PATTERNS_V4 = {
  // Products
  product: /^[a-z][a-z0-9-]*$/,           // folder name
  productPrefix: /^[A-Z]{3,4}$/,          // PRX (3-4 uppercase chars)

  // Business Analysis (in products)
  businessAnalysis: /^ba-[A-Z]{3,4}-\d{3,}-[a-z][a-z0-9-]*\.md$/,

  // Features (in products) - lowercase f- prefix
  feature: /^f-[A-Z]{3,4}-\d{3,}-[a-z][a-z0-9-]*\.md$/,

  // Solution Designs (in products)
  solutionDesign: /^sd-[A-Z]{3,4}-\d{3,}-[a-z][a-z0-9-]*\.md$/,

  // Technical Architecture (in products)
  techArch: /^ta-[A-Z]{3,4}-\d{3,}-[a-z][a-z0-9-]*\.md$/,

  // Decisions (product level)
  decisionProduct: /^dec-[A-Z]{3,4}-\d{3,}-[a-z][a-z0-9-]*\.md$/,

  // BA Increments (in projects)
  baIncrement: /^bai-[A-Z]{3,4}-\d{3,}-[a-z][a-z0-9-]*\.md$/,

  // Feature-Increments (in projects)
  featureIncrement: /^fi-[A-Z]{3,4}-\d{3,}-[a-z][a-z0-9-]*\.md$/,

  // Solution Design Increments (in projects)
  sdIncrement: /^sdi-[A-Z]{3,4}-\d{3,}-[a-z][a-z0-9-]*\.md$/,

  // Tech Architecture Increments (in projects)
  taIncrement: /^tai-[A-Z]{3,4}-\d{3,}-[a-z][a-z0-9-]*\.md$/,

  // Epics
  epic: /^epic-[A-Z]{3,4}-\d{3,}-[a-z][a-z0-9-]*\.md$/,

  // Stories (with epic reference) - s-eXXX-YYY-description.md
  story: /^s-e\d{3,}-\d{3,}-[a-z][a-z0-9-]*\.md$/,

  // Decisions (project level)
  decisionProject: /^dec-\d{3,}-[a-z][a-z0-9-]*\.md$/,

  // Dev Plans (explicit prefix: e=epic, s=story)
  devPlan: /^dp-e\d{3,}-s\d{3,}-[a-z][a-z0-9-]*\.md$/,

  // Sprints
  sprint: /^sprint-\d+$/,
};

// Alias for backward compatibility
const NAMING_PATTERNS = NAMING_PATTERNS_V2;

// =============================================================================
// Required Sections
// =============================================================================

const FEATURE_REQUIRED_SECTIONS = [
  'Purpose',
  'Scope|In Scope',
  'Actors|Personas|Users',
  'Main Flow|Current Behavior|Behavior',
  'Business Rules|Rules',
  'Edge Cases|Exceptions|Error Handling',
  'Non-Goals|Out of Scope',
  'Change Log|Story Ledger|Changelog',
];

const STORY_FORBIDDEN_HEADINGS = [
  'Full Specification',
  'Complete Requirements',
  'End-to-End Behavior',
  'Full Flow',
];

const PLACEHOLDER_PATTERNS = [
  /\{TBD\}/i,
  /\bTBD\b/,
  /\?\?\?/,
  /lorem ipsum/i,
  /to be defined/i,
  /\bplaceholder\b/i,
];

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Parse YAML-like frontmatter from markdown
 */
function parseYamlFrontmatter(content) {
  const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!yamlMatch) return {};

  const yaml = {};
  const lines = yamlMatch[1].split('\n');
  for (const line of lines) {
    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (match) {
      yaml[match[1].trim()] = match[2].trim();
    }
  }
  return yaml;
}

/**
 * Parse simple YAML file
 */
function parseSimpleYaml(content) {
  const result = {};
  const lines = content.split('\n');
  let currentKey = null;
  let currentArray = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Array item
    if (trimmed.startsWith('- ')) {
      if (currentArray) {
        currentArray.push(trimmed.slice(2).trim());
      }
      continue;
    }

    // Key-value pair
    const match = trimmed.match(/^([^:]+):\s*(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();

      if (value === '' || value === '[]') {
        result[key] = [];
        currentArray = result[key];
        currentKey = key;
      } else {
        result[key] = value;
        currentArray = null;
        currentKey = key;
      }
    }
  }

  return result;
}

/**
 * Extract headings from markdown
 */
function extractHeadings(content) {
  const headings = [];
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+?)[\r\s]*$/);
    if (match) {
      headings.push({
        level: match[1].length,
        text: match[2].trim(),
      });
    }
  }
  return headings;
}

/**
 * Check if content contains a pattern
 */
function containsPattern(content, pattern) {
  if (typeof pattern === 'string') {
    return content.includes(pattern);
  }
  return pattern.test(content);
}

/**
 * Extract checkboxes from markdown
 */
function extractCheckboxes(content, sectionHeading = null) {
  let searchContent = content;

  if (sectionHeading) {
    const sectionPattern = new RegExp(`##\\s+(${sectionHeading})\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`, 'i');
    const match = content.match(sectionPattern);
    if (match) {
      searchContent = match[2];
    } else {
      return [];
    }
  }

  const checkboxes = [];
  const regex = /- \[([ xX])\]\s*(.+)/g;
  let match;

  while ((match = regex.exec(searchContent)) !== null) {
    checkboxes.push({
      checked: match[1].toLowerCase() === 'x',
      text: match[2].trim(),
    });
  }

  return checkboxes;
}

/**
 * Extract feature ID from story content
 */
function extractFeatureLinks(content) {
  const links = [];
  const patterns = [
    /\[F-(\d{3,})/g,
    /F-(\d{3,})/g,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      links.push(`F-${match[1]}`);
    }
  }

  return [...new Set(links)];
}

/**
 * Extract story ID from filename or content
 */
function extractStoryId(filename, content) {
  // Try filename first
  const filenameMatch = filename.match(/S-(\d{3,})/);
  if (filenameMatch) return filenameMatch[1];

  // Try content
  const contentMatch = content.match(/# Story: S-(\d{3,})/);
  if (contentMatch) return contentMatch[1];

  return null;
}

/**
 * Get metadata from markdown (bold fields like **Status:** value)
 */
function extractMetadata(content) {
  const metadata = {};
  const patterns = [
    // Pattern: **Key:** Value (colon inside bold)
    /\*\*([^*:]+):\*\*\s*(.+)/g,
    // Pattern: **Key**: Value (colon outside bold)
    /\*\*([^*]+)\*\*:\s*(.+)/g,
    // Pattern: Key: Value at line start
    /^([A-Za-z ]+):\s*(.+)/gm,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const key = match[1].trim().replace(/:$/, '');  // Remove trailing colon if any
      const value = match[2].trim();
      if (!metadata[key]) {  // Don't overwrite existing keys
        metadata[key] = value;
      }
    }
  }

  return metadata;
}

/**
 * Recursively find files matching a pattern
 */
function findFiles(dir, pattern, results = []) {
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      findFiles(fullPath, pattern, results);
    } else if (pattern.test(entry.name)) {
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * Find all projects in workspace
 */
function findProjects(workspaceDir) {
  const projectsDir = path.join(workspaceDir, 'projects');
  if (!fs.existsSync(projectsDir)) return [];

  const entries = fs.readdirSync(projectsDir, { withFileTypes: true });
  return entries
    .filter(e => e.isDirectory() && e.name !== '.git')
    .map(e => e.name);
}

/**
 * Find all products in workspace (4.0)
 */
function findProducts(workspaceDir) {
  const productsDir = path.join(workspaceDir, 'products');
  if (!fs.existsSync(productsDir)) return [];

  const entries = fs.readdirSync(productsDir, { withFileTypes: true });
  return entries
    .filter(e => e.isDirectory() && e.name !== '.git')
    .filter(e => {
      // Must have product.yml to be considered a product
      const productYml = path.join(productsDir, e.name, 'product.yml');
      return fs.existsSync(productYml);
    })
    .map(e => e.name);
}

/**
 * Detect workspace version (2.0 vs 4.0)
 */
function detectWorkspaceVersion(workspaceDir) {
  const productsDir = path.join(workspaceDir, 'products');
  const projectsDir = path.join(workspaceDir, 'projects');

  // 4.0 indicator: products/ folder with at least one product.yml
  if (fs.existsSync(productsDir)) {
    const products = findProducts(workspaceDir);
    if (products.length > 0) {
      return '4.0';
    }
  }

  // 2.0 indicator: projects/ with features/ inside
  if (fs.existsSync(projectsDir)) {
    const projects = findProjects(workspaceDir);
    for (const project of projects) {
      const featuresDir = path.join(projectsDir, project, 'features');
      if (fs.existsSync(featuresDir)) {
        return '2.0';
      }
    }
  }

  // Default to 2.0 if not clear
  return '2.0';
}

/**
 * Parse nested YAML structure (for product.yml and project.yml)
 */
function parseNestedYaml(content) {
  const result = {};
  const lines = content.split('\n');
  let currentSection = null;
  let currentArray = null;
  let indentLevel = 0;

  for (const line of lines) {
    // Skip empty lines and comments
    if (!line.trim() || line.trim().startsWith('#')) continue;

    // Calculate indent
    const leadingSpaces = line.match(/^(\s*)/)[1].length;
    const trimmed = line.trim();

    // Array item
    if (trimmed.startsWith('- ')) {
      if (currentArray) {
        const value = trimmed.slice(2).trim();
        // Handle objects in arrays
        if (value.includes(':')) {
          const obj = {};
          const match = value.match(/^([^:]+):\s*(.*)$/);
          if (match) {
            obj[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
          }
          currentArray.push(obj);
        } else {
          currentArray.push(value.replace(/^["']|["']$/g, ''));
        }
      }
      continue;
    }

    // Key-value pair
    const match = trimmed.match(/^([^:]+):\s*(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim().replace(/^["']|["']$/g, '');

      // Top-level section (like 'product:', 'project:')
      if (leadingSpaces === 0) {
        if (value === '' || value === '[]') {
          result[key] = {};
          currentSection = result[key];
          currentArray = null;
        } else {
          result[key] = value;
          currentSection = null;
          currentArray = null;
        }
        indentLevel = 0;
      } else if (currentSection !== null) {
        // Nested property
        if (value === '' || value === '[]') {
          currentSection[key] = [];
          currentArray = currentSection[key];
        } else if (value === '|') {
          // Multi-line string - read following lines
          currentSection[key] = '';
          currentArray = null;
        } else {
          currentSection[key] = value;
          currentArray = null;
        }
      }
    }
  }

  return result;
}

/**
 * Load and parse product.yml
 */
function loadProductYaml(workspaceDir, productId) {
  const ymlPath = path.join(workspaceDir, 'products', productId, 'product.yml');
  if (!fs.existsSync(ymlPath)) return null;

  const content = fs.readFileSync(ymlPath, 'utf-8');
  return parseNestedYaml(content);
}

/**
 * Load and parse project.yml
 */
function loadProjectYaml(workspaceDir, projectId) {
  const ymlPath = path.join(workspaceDir, 'projects', projectId, 'project.yml');
  if (!fs.existsSync(ymlPath)) return null;

  const content = fs.readFileSync(ymlPath, 'utf-8');
  return parseNestedYaml(content);
}

// =============================================================================
// Rule Definitions
// =============================================================================

const rules = {
  // -------------------------------------------------------------------------
  // Project Rules (TS-PROJ)
  // -------------------------------------------------------------------------

  'TS-PROJ-001': {
    id: 'TS-PROJ-001',
    name: 'Project folder must be registered',
    severity: SEVERITY.ERROR,
    owner: 'BA',
    async check(ctx) {
      const results = [];
      const indexPath = path.join(ctx.workspaceDir, 'projects', 'projects-index.md');

      if (!fs.existsSync(indexPath)) {
        // If no index exists, skip (will be caught by other rules)
        return results;
      }

      const indexContent = fs.readFileSync(indexPath, 'utf-8');

      for (const projectId of ctx.projects) {
        if (!indexContent.includes(projectId)) {
          results.push({
            ruleId: 'TS-PROJ-001',
            severity: SEVERITY.ERROR,
            file: path.join(ctx.workspaceDir, 'projects', projectId),
            message: `Project '${projectId}' is not registered in projects-index.md`,
            owner: 'BA',
          });
        }
      }

      return results;
    },
  },

  'TS-PROJ-002': {
    id: 'TS-PROJ-002',
    name: 'project.yml required with minimum metadata',
    severity: SEVERITY.ERROR,
    owner: 'BA',
    async check(ctx) {
      const results = [];

      // Different required fields for 2.0 vs 4.0
      const requiredFieldsV2 = ['id', 'name', 'status'];
      const requiredFieldsV4 = ['id', 'name', 'status'];
      const requiredFields = ctx.workspaceVersion === '4.0' ? requiredFieldsV4 : requiredFieldsV2;

      for (const projectId of ctx.projects) {
        const ymlPath = path.join(ctx.workspaceDir, 'projects', projectId, 'project.yml');

        if (!fs.existsSync(ymlPath)) {
          results.push({
            ruleId: 'TS-PROJ-002',
            severity: SEVERITY.ERROR,
            file: ymlPath,
            message: `project.yml is missing for project '${projectId}'`,
            owner: 'BA',
          });
          continue;
        }

        const content = fs.readFileSync(ymlPath, 'utf-8');

        // Try nested format first (4.0), then flat format (2.0)
        let yaml = parseNestedYaml(content);
        let project = yaml.project || {};

        // If no nested 'project:' key found, treat as flat format (2.0 style)
        if (Object.keys(project).length === 0) {
          project = parseSimpleYaml(content);
          // Map flat keys to expected format (project_id -> id, etc.)
          if (project.project_id) project.id = project.project_id;
        }

        for (const field of requiredFields) {
          if (!project[field]) {
            results.push({
              ruleId: 'TS-PROJ-002',
              severity: SEVERITY.ERROR,
              file: ymlPath,
              message: `project.yml is missing required field: '${field}'`,
              owner: 'BA',
            });
          }
        }
      }

      return results;
    },
  },

  // -------------------------------------------------------------------------
  // Feature Rules (TS-FEAT) - Version-aware
  // In 2.0: Features are in projects/{project}/features/
  // In 4.0: Features are in products/{product}/features/ (Canon)
  // -------------------------------------------------------------------------

  'TS-FEAT-001': {
    id: 'TS-FEAT-001',
    name: 'Feature file required for any story link',
    severity: SEVERITY.ERROR,
    owner: 'BA/FA',
    async check(ctx) {
      const results = [];

      // In 4.0, this rule is less strict - stories link to Epics, not features directly
      // Skip this check in 4.0 (handled by TS-STORY-006/007 for Epic linking)
      if (ctx.workspaceVersion === '4.0') return results;

      for (const projectId of ctx.projects) {
        const storiesDir = path.join(ctx.workspaceDir, 'projects', projectId, 'stories');
        const featuresDir = path.join(ctx.workspaceDir, 'projects', projectId, 'features');
        const storyFiles = findFiles(storiesDir, /\.md$/);

        for (const storyFile of storyFiles) {
          if (path.basename(storyFile) === 'README.md') continue;

          const content = fs.readFileSync(storyFile, 'utf-8');
          const featureLinks = extractFeatureLinks(content);

          for (const featureId of featureLinks) {
            const featurePattern = new RegExp(`^${featureId}-.*\\.md$`);
            const featureFiles = fs.existsSync(featuresDir)
              ? fs.readdirSync(featuresDir).filter(f => featurePattern.test(f))
              : [];

            if (featureFiles.length === 0) {
              results.push({
                ruleId: 'TS-FEAT-001',
                severity: SEVERITY.ERROR,
                file: storyFile,
                message: `Referenced feature '${featureId}' not found in features/`,
                owner: 'BA/FA',
              });
            }
          }
        }
      }

      return results;
    },
  },

  'TS-FEAT-002': {
    id: 'TS-FEAT-002',
    name: 'Feature must include canon sections',
    severity: SEVERITY.ERROR,
    owner: 'BA/FA',
    async check(ctx) {
      const results = [];

      if (ctx.workspaceVersion === '4.0') {
        // In 4.0, check product features
        for (const productId of ctx.products) {
          const featuresDir = path.join(ctx.workspaceDir, 'products', productId, 'features');
          if (!fs.existsSync(featuresDir)) continue;

          const featureFiles = findFiles(featuresDir, /^f-[A-Z]{3,4}-\d{3,}-.*\.md$/);

          for (const featureFile of featureFiles) {
            const content = fs.readFileSync(featureFile, 'utf-8');
            const headings = extractHeadings(content);
            const headingTexts = headings.map(h => h.text);

            for (const required of FEATURE_REQUIRED_SECTIONS) {
              const patterns = required.split('|');
              const found = patterns.some(p =>
                headingTexts.some(h => h.toLowerCase().includes(p.toLowerCase()))
              );

              if (!found) {
                results.push({
                  ruleId: 'TS-FEAT-002',
                  severity: SEVERITY.ERROR,
                  file: featureFile,
                  message: `Feature is missing required section: '${required}'`,
                  owner: 'BA/FA',
                });
              }
            }
          }
        }
      } else {
        // In 2.0, check project features
        for (const projectId of ctx.projects) {
          const featuresDir = path.join(ctx.workspaceDir, 'projects', projectId, 'features');
          if (!fs.existsSync(featuresDir)) continue;

          const featureFiles = findFiles(featuresDir, /^F-\d{3,}-.*\.md$/);

          for (const featureFile of featureFiles) {
            const content = fs.readFileSync(featureFile, 'utf-8');
            const headings = extractHeadings(content);
            const headingTexts = headings.map(h => h.text);

            for (const required of FEATURE_REQUIRED_SECTIONS) {
              const patterns = required.split('|');
              const found = patterns.some(p =>
                headingTexts.some(h => h.toLowerCase().includes(p.toLowerCase()))
              );

              if (!found) {
                results.push({
                  ruleId: 'TS-FEAT-002',
                  severity: SEVERITY.ERROR,
                  file: featureFile,
                  message: `Feature is missing required section: '${required}'`,
                  owner: 'BA/FA',
                });
              }
            }
          }
        }
      }

      return results;
    },
  },

  'TS-FEAT-003': {
    id: 'TS-FEAT-003',
    name: 'Feature IDs must be unique within project/product',
    severity: SEVERITY.ERROR,
    owner: 'BA/FA',
    async check(ctx) {
      const results = [];

      if (ctx.workspaceVersion === '4.0') {
        // In 4.0, check product features
        for (const productId of ctx.products) {
          const featuresDir = path.join(ctx.workspaceDir, 'products', productId, 'features');
          if (!fs.existsSync(featuresDir)) continue;

          const featureFiles = findFiles(featuresDir, /^f-[A-Z]{3,4}-\d{3,}-.*\.md$/);
          const idToFiles = new Map();

          for (const featureFile of featureFiles) {
            const match = path.basename(featureFile).match(/^(f-[A-Z]{3,4}-\d{3,})/);
            if (match) {
              const id = match[1];
              if (!idToFiles.has(id)) {
                idToFiles.set(id, []);
              }
              idToFiles.get(id).push(featureFile);
            }
          }

          for (const [id, files] of idToFiles) {
            if (files.length > 1) {
              results.push({
                ruleId: 'TS-FEAT-003',
                severity: SEVERITY.ERROR,
                file: files[1],
                message: `Duplicate feature ID '${id}' found in: ${files.map(f => path.basename(f)).join(', ')}`,
                owner: 'BA/FA',
              });
            }
          }
        }
      } else {
        // In 2.0, check project features
        for (const projectId of ctx.projects) {
          const featuresDir = path.join(ctx.workspaceDir, 'projects', projectId, 'features');
          if (!fs.existsSync(featuresDir)) continue;

          const featureFiles = findFiles(featuresDir, /^F-\d{3,}-.*\.md$/);
          const idToFiles = new Map();

          for (const featureFile of featureFiles) {
            const match = path.basename(featureFile).match(/^(F-\d{3,})/);
            if (match) {
              const id = match[1];
              if (!idToFiles.has(id)) {
                idToFiles.set(id, []);
              }
              idToFiles.get(id).push(featureFile);
            }
          }

          for (const [id, files] of idToFiles) {
            if (files.length > 1) {
              results.push({
                ruleId: 'TS-FEAT-003',
                severity: SEVERITY.ERROR,
                file: files[1],
                message: `Duplicate feature ID '${id}' found in: ${files.map(f => path.basename(f)).join(', ')}`,
                owner: 'BA/FA',
              });
            }
          }
        }
      }

      return results;
    },
  },

  // -------------------------------------------------------------------------
  // Story Rules (TS-STORY) - Version-aware
  // In 2.0: Stories are S-XXX-*.md and link to features
  // In 4.0: Stories are s-eXXX-YYY-*.md and link to Epics
  // -------------------------------------------------------------------------

  'TS-STORY-001': {
    id: 'TS-STORY-001',
    name: 'Story must link to feature',
    severity: SEVERITY.WARNING, // Demoted to WARNING in 4.0, was ERROR in 2.0
    owner: 'FA',
    async check(ctx) {
      const results = [];

      // In 4.0, stories link to Epics, feature links are optional (for traceability)
      const severity = ctx.workspaceVersion === '4.0' ? SEVERITY.WARNING : SEVERITY.ERROR;

      for (const projectId of ctx.projects) {
        const storiesDir = path.join(ctx.workspaceDir, 'projects', projectId, 'stories');

        // Different patterns for 2.0 vs 4.0
        const storyPattern = ctx.workspaceVersion === '4.0'
          ? /^s-e\d{3,}-\d{3,}-.*\.md$/
          : /^S-\d{3,}-.*\.md$/;

        const storyFiles = findFiles(storiesDir, storyPattern);

        for (const storyFile of storyFiles) {
          const content = fs.readFileSync(storyFile, 'utf-8');
          const featureLinks = extractFeatureLinks(content);

          // Also check for feature-increment references in 4.0
          const hasFIRef = ctx.workspaceVersion === '4.0' && /fi-[A-Z]{3,4}-\d{3,}/.test(content);

          // Check for Linked Features section
          const hasLinkedSection = /##\s*(Linked Features?|Features?|Feature-Increments?)/i.test(content);

          if (featureLinks.length === 0 && !hasLinkedSection && !hasFIRef) {
            const message = ctx.workspaceVersion === '4.0'
              ? 'Story has no feature or feature-increment link. Consider adding for traceability.'
              : 'Story has no feature link. Stories must link to at least one feature.';

            results.push({
              ruleId: 'TS-STORY-001',
              severity: severity,
              file: storyFile,
              message: message,
              owner: 'FA',
            });
          }
        }
      }

      return results;
    },
  },

  'TS-STORY-002': {
    id: 'TS-STORY-002',
    name: 'Story must describe delta-only behavior',
    severity: SEVERITY.ERROR,
    owner: 'FA',
    async check(ctx) {
      const results = [];

      for (const projectId of ctx.projects) {
        const storiesDir = path.join(ctx.workspaceDir, 'projects', projectId, 'stories');

        // Different patterns for 2.0 vs 4.0
        const storyPattern = ctx.workspaceVersion === '4.0'
          ? /^s-e\d{3,}-\d{3,}-.*\.md$/
          : /^S-\d{3,}-.*\.md$/;

        const storyFiles = findFiles(storiesDir, storyPattern);

        for (const storyFile of storyFiles) {
          const content = fs.readFileSync(storyFile, 'utf-8');

          // Check for Before/After pattern (or AS-IS/TO-BE in 4.0)
          const hasBefore = /\b(Before|Current behavior|AS-IS|Current State).*:/i.test(content);
          const hasAfter = /\b(After|New behavior|TO-BE|Target State).*:/i.test(content);

          if (!hasBefore || !hasAfter) {
            results.push({
              ruleId: 'TS-STORY-002',
              severity: SEVERITY.ERROR,
              file: storyFile,
              message: 'Story must have Before/After (or AS-IS/TO-BE) sections describing delta behavior.',
              owner: 'FA',
            });
          }

          // Check for forbidden full-spec headings
          const headings = extractHeadings(content);
          for (const heading of headings) {
            for (const forbidden of STORY_FORBIDDEN_HEADINGS) {
              if (heading.text.toLowerCase().includes(forbidden.toLowerCase())) {
                results.push({
                  ruleId: 'TS-STORY-002',
                  severity: SEVERITY.ERROR,
                  file: storyFile,
                  message: `Story contains forbidden heading '${heading.text}'. Stories describe deltas, not full specifications.`,
                  owner: 'FA',
                });
              }
            }
          }
        }
      }

      return results;
    },
  },

  'TS-STORY-003': {
    id: 'TS-STORY-003',
    name: 'Acceptance Criteria must be present and testable',
    severity: SEVERITY.ERROR,
    owner: 'FA',
    async check(ctx) {
      const results = [];

      for (const projectId of ctx.projects) {
        const storiesDir = path.join(ctx.workspaceDir, 'projects', projectId, 'stories');

        // Different patterns for 2.0 vs 4.0
        const storyPattern = ctx.workspaceVersion === '4.0'
          ? /^s-e\d{3,}-\d{3,}-.*\.md$/
          : /^S-\d{3,}-.*\.md$/;

        const storyFiles = findFiles(storiesDir, storyPattern);

        for (const storyFile of storyFiles) {
          const content = fs.readFileSync(storyFile, 'utf-8');

          // Check for AC section
          const hasAC = /##\s*Acceptance Criteria/i.test(content);

          if (!hasAC) {
            results.push({
              ruleId: 'TS-STORY-003',
              severity: SEVERITY.ERROR,
              file: storyFile,
              message: 'Acceptance Criteria section is missing.',
              owner: 'FA',
            });
            continue;
          }

          // Check for placeholders
          for (const pattern of PLACEHOLDER_PATTERNS) {
            if (pattern.test(content)) {
              results.push({
                ruleId: 'TS-STORY-003',
                severity: SEVERITY.ERROR,
                file: storyFile,
                message: `Story contains placeholder text (${pattern.source}). All content must be complete.`,
                owner: 'FA',
              });
              break;
            }
          }
        }
      }

      return results;
    },
  },

  'TS-STORY-004': {
    id: 'TS-STORY-004',
    name: 'Only SM can assign sprint',
    severity: SEVERITY.ERROR,
    owner: 'SM',
    async check(ctx) {
      const results = [];

      for (const projectId of ctx.projects) {
        const storiesDir = path.join(ctx.workspaceDir, 'projects', projectId, 'stories');
        const storyFiles = findFiles(storiesDir, /\.md$/);

        for (const storyFile of storyFiles) {
          if (path.basename(storyFile) === 'README.md') continue;

          const content = fs.readFileSync(storyFile, 'utf-8');
          const metadata = extractMetadata(content);

          // Check if sprint is assigned
          if (metadata.Sprint && metadata.Sprint !== '-' && metadata.Sprint !== 'None') {
            // Check for SM role in assignment - various patterns
            const hasSMAssignment = /Assigned By:.*Role:\s*SM/i.test(content) ||
              /Role:\s*SM.*Assigned/i.test(content) ||
              /\*\*Assigned By:\*\*.*SM/i.test(content) ||
              /Assigned By:.*SM\s*$/im.test(content);

            // Also fail if explicitly NOT SM
            const hasNonSMAssignment = /\*\*Assigned By:\*\*\s*(DEV|BA|FA|ARCH|QA)\s*(\(|$)/i.test(content);

            if (!hasSMAssignment || hasNonSMAssignment) {
              results.push({
                ruleId: 'TS-STORY-004',
                severity: SEVERITY.ERROR,
                file: storyFile,
                message: 'Sprint assignment must be done by SM role. Add "Assigned By: Role: SM".',
                owner: 'SM',
              });
            }
          }
        }
      }

      return results;
    },
  },

  'TS-STORY-005': {
    id: 'TS-STORY-005',
    name: 'Ready for Development requires DoR checklist complete',
    severity: SEVERITY.ERROR,
    owner: 'FA',
    async check(ctx) {
      const results = [];

      for (const projectId of ctx.projects) {
        // Check both folder names: 2.0 uses "ready-for-development", 4.0 uses "ready-to-develop"
        const readyDirV2 = path.join(ctx.workspaceDir, 'projects', projectId, 'stories', 'ready-for-development');
        const readyDirV4 = path.join(ctx.workspaceDir, 'projects', projectId, 'stories', 'ready-to-develop');

        const readyDirs = [];
        if (fs.existsSync(readyDirV2)) readyDirs.push(readyDirV2);
        if (fs.existsSync(readyDirV4)) readyDirs.push(readyDirV4);

        for (const readyDir of readyDirs) {
          const storyFiles = findFiles(readyDir, /\.md$/);

          for (const storyFile of storyFiles) {
            if (path.basename(storyFile) === 'README.md') continue;

            const content = fs.readFileSync(storyFile, 'utf-8');

            // Stories in ready folder must have complete DoR
            // Check for DoR section
            const dorCheckboxes = extractCheckboxes(content, 'DoR Checklist|Definition of Ready');

            if (dorCheckboxes.length > 0) {
              const unchecked = dorCheckboxes.filter(c => !c.checked);
              if (unchecked.length > 0) {
                results.push({
                  ruleId: 'TS-STORY-005',
                  severity: SEVERITY.ERROR,
                  file: storyFile,
                  message: `DoR Checklist incomplete. Unchecked items: ${unchecked.map(c => c.text).join(', ')}`,
                  owner: 'FA',
                });
              }
            }
          }
        }
      }

      return results;
    },
  },

  // -------------------------------------------------------------------------
  // ADR Rules (TS-ADR) - Version-aware
  // In 2.0: ADRs are in projects/{project}/adr/
  // In 4.0: ADRs are technical-architecture-increments/ (project) or technical-architecture/ (product)
  // -------------------------------------------------------------------------

  'TS-ADR-001': {
    id: 'TS-ADR-001',
    name: 'Story marked "Architecture Required" must have ADR',
    severity: SEVERITY.ERROR,
    owner: 'SA',
    async check(ctx) {
      const results = [];

      for (const projectId of ctx.projects) {
        const storiesDir = path.join(ctx.workspaceDir, 'projects', projectId, 'stories');
        const storyFiles = findFiles(storiesDir, /\.md$/);

        for (const storyFile of storyFiles) {
          if (path.basename(storyFile) === 'README.md') continue;

          const content = fs.readFileSync(storyFile, 'utf-8');

          // Check if ADR Required is checked
          const checkboxes = extractCheckboxes(content);
          const adrRequired = checkboxes.some(c => c.checked && /ADR Required|Architecture Required/i.test(c.text));

          if (adrRequired) {
            // Check for ADR reference - support both 2.0 and 4.0 patterns
            const hasAdrRef = /ADR-\d{3,}|tai-[A-Z]{3,4}-\d{3,}/i.test(content);

            if (!hasAdrRef) {
              const refType = ctx.workspaceVersion === '4.0' ? 'ADR/TAI (tai-PRX-XXX)' : 'ADR';
              results.push({
                ruleId: 'TS-ADR-001',
                severity: SEVERITY.ERROR,
                file: storyFile,
                message: `Story has "ADR Required" checked but no ${refType} reference found.`,
                owner: 'SA',
              });
            }
          }
        }
      }

      return results;
    },
  },

  'TS-ADR-002': {
    id: 'TS-ADR-002',
    name: 'ADR must link to feature(s)',
    severity: SEVERITY.ERROR,
    owner: 'SA',
    async check(ctx) {
      const results = [];

      for (const projectId of ctx.projects) {
        // Check both 2.0 (adr/) and 4.0 (technical-architecture-increments/) locations
        const adrDirV2 = path.join(ctx.workspaceDir, 'projects', projectId, 'adr');
        const adrDirV4 = path.join(ctx.workspaceDir, 'projects', projectId, 'technical-architecture-increments');

        // 2.0 pattern
        if (fs.existsSync(adrDirV2)) {
          const adrFiles = findFiles(adrDirV2, /^ADR-\d{3,}-.*\.md$/);

          for (const adrFile of adrFiles) {
            const content = fs.readFileSync(adrFile, 'utf-8');

            // Check for feature reference
            const hasFeatureRef = /F-\d{3,}|Linked Feature|Related Feature/i.test(content);

            if (!hasFeatureRef) {
              results.push({
                ruleId: 'TS-ADR-002',
                severity: SEVERITY.ERROR,
                file: adrFile,
                message: 'ADR must link to at least one feature.',
                owner: 'SA',
              });
            }
          }
        }

        // 4.0 pattern
        if (fs.existsSync(adrDirV4)) {
          const taiFiles = findFiles(adrDirV4, /^tai-[A-Z]{3,4}-\d{3,}-.*\.md$/);

          for (const taiFile of taiFiles) {
            const content = fs.readFileSync(taiFile, 'utf-8');

            // Check for feature or feature-increment reference
            const hasRef = /f-[A-Z]{3,4}-\d{3,}|fi-[A-Z]{3,4}-\d{3,}|Linked Feature|Target Feature/i.test(content);

            if (!hasRef) {
              results.push({
                ruleId: 'TS-ADR-002',
                severity: SEVERITY.ERROR,
                file: taiFile,
                message: 'Technical Architecture Increment must link to at least one feature or feature-increment.',
                owner: 'SA',
              });
            }
          }
        }
      }

      return results;
    },
  },

  // -------------------------------------------------------------------------
  // Dev Plan Rules (TS-DEVPLAN)
  // -------------------------------------------------------------------------

  'TS-DEVPLAN-001': {
    id: 'TS-DEVPLAN-001',
    name: 'Story in sprint must have dev plan',
    severity: SEVERITY.ERROR,
    owner: 'DEV',
    async check(ctx) {
      const results = [];

      for (const projectId of ctx.projects) {
        const storiesDir = path.join(ctx.workspaceDir, 'projects', projectId, 'stories');
        const devPlansDir = path.join(ctx.workspaceDir, 'projects', projectId, 'dev-plans');
        const storyFiles = findFiles(storiesDir, /^S-\d{3,}-.*\.md$/);

        for (const storyFile of storyFiles) {
          const content = fs.readFileSync(storyFile, 'utf-8');
          const metadata = extractMetadata(content);

          // Check if story is in sprint
          const isInSprint = metadata.Status && /in sprint|in progress|ready for testing/i.test(metadata.Status);

          if (isInSprint) {
            const storyId = extractStoryId(path.basename(storyFile), content);

            if (storyId) {
              const devPlanPath = path.join(devPlansDir, `story-${storyId}-tasks.md`);

              if (!fs.existsSync(devPlanPath)) {
                results.push({
                  ruleId: 'TS-DEVPLAN-001',
                  severity: SEVERITY.ERROR,
                  file: storyFile,
                  message: `Story is in sprint but dev plan is missing. Expected: dev-plans/story-${storyId}-tasks.md`,
                  owner: 'DEV',
                });
              }
            }
          }
        }
      }

      return results;
    },
  },

  // -------------------------------------------------------------------------
  // DoD Rules (TS-DOD)
  // -------------------------------------------------------------------------

  'TS-DOD-001': {
    id: 'TS-DOD-001',
    name: 'Story cannot be Done if behavior changed and Canon not updated',
    severity: SEVERITY.BLOCKER,
    owner: 'FA',
    async check(ctx) {
      const results = [];

      for (const projectId of ctx.projects) {
        const storiesDir = path.join(ctx.workspaceDir, 'projects', projectId, 'stories');
        const storyFiles = findFiles(storiesDir, /\.md$/);

        for (const storyFile of storyFiles) {
          if (path.basename(storyFile) === 'README.md') continue;

          const content = fs.readFileSync(storyFile, 'utf-8');
          const metadata = extractMetadata(content);

          // Check if status is Done
          const isDone = metadata.Status && /done/i.test(metadata.Status);

          if (isDone) {
            // Check if behavior is being added/changed (anywhere in file)
            const allCheckboxes = extractCheckboxes(content);
            const addsBehavior = allCheckboxes.some(c => c.checked && /adds behavior/i.test(c.text));
            const changesBehavior = allCheckboxes.some(c => c.checked && /changes behavior/i.test(c.text));

            if (addsBehavior || changesBehavior) {
              // Check DoD for Canon update - look for unchecked "Feature Canon updated" item
              const dodCheckboxes = extractCheckboxes(content, 'DoD Checklist|Definition of Done');
              const canonChecked = dodCheckboxes.some(c => c.checked && /feature canon updated|canon updated/i.test(c.text));
              const canonUnchecked = dodCheckboxes.some(c => !c.checked && /feature canon updated|canon updated/i.test(c.text));

              if (canonUnchecked || (!canonChecked && dodCheckboxes.length > 0)) {
                results.push({
                  ruleId: 'TS-DOD-001',
                  severity: SEVERITY.BLOCKER,
                  file: storyFile,
                  message: 'Story is marked Done with behavior changes but Feature Canon not updated. This blocks release.',
                  owner: 'FA',
                });
              }
            }
          }
        }
      }

      return results;
    },
  },

  // -------------------------------------------------------------------------
  // Naming Convention Rules (TS-NAMING)
  // -------------------------------------------------------------------------

  'TS-NAMING-FEATURE': {
    id: 'TS-NAMING-FEATURE',
    name: 'Feature file naming convention',
    severity: SEVERITY.WARNING,
    owner: 'FA',
    async check(ctx) {
      const results = [];

      for (const projectId of ctx.projects) {
        const featuresDir = path.join(ctx.workspaceDir, 'projects', projectId, 'features');
        if (!fs.existsSync(featuresDir)) continue;

        const files = fs.readdirSync(featuresDir).filter(f => f.endsWith('.md'));

        for (const file of files) {
          if (['features-index.md', 'story-ledger.md', 'README.md'].includes(file)) continue;

          if (!NAMING_PATTERNS.feature.test(file)) {
            results.push({
              ruleId: 'TS-NAMING-FEATURE',
              severity: SEVERITY.WARNING,
              file: path.join(featuresDir, file),
              message: `Feature file '${file}' does not match naming convention: F-NNN-description.md`,
              owner: 'FA',
            });
          }
        }
      }

      return results;
    },
  },

  'TS-NAMING-STORY': {
    id: 'TS-NAMING-STORY',
    name: 'Story file naming convention',
    severity: SEVERITY.WARNING,
    owner: 'FA',
    async check(ctx) {
      const results = [];

      for (const projectId of ctx.projects) {
        const storiesDir = path.join(ctx.workspaceDir, 'projects', projectId, 'stories');
        if (!fs.existsSync(storiesDir)) continue;

        const storyFiles = findFiles(storiesDir, /\.md$/);

        for (const storyFile of storyFiles) {
          const filename = path.basename(storyFile);
          if (filename === 'README.md') continue;

          if (!NAMING_PATTERNS.story.test(filename)) {
            results.push({
              ruleId: 'TS-NAMING-STORY',
              severity: SEVERITY.WARNING,
              file: storyFile,
              message: `Story file '${filename}' does not match naming convention: S-NNN-description.md`,
              owner: 'FA',
            });
          }
        }
      }

      return results;
    },
  },

  'TS-NAMING-DEVPLAN': {
    id: 'TS-NAMING-DEVPLAN',
    name: 'Dev plan file naming convention',
    severity: SEVERITY.WARNING,
    owner: 'DEV',
    async check(ctx) {
      const results = [];

      for (const projectId of ctx.projects) {
        const devPlansDir = path.join(ctx.workspaceDir, 'projects', projectId, 'dev-plans');
        if (!fs.existsSync(devPlansDir)) continue;

        const files = fs.readdirSync(devPlansDir).filter(f => f.endsWith('.md'));

        for (const file of files) {
          if (file === 'README.md') continue;

          if (!NAMING_PATTERNS.devPlan.test(file)) {
            results.push({
              ruleId: 'TS-NAMING-DEVPLAN',
              severity: SEVERITY.WARNING,
              file: path.join(devPlansDir, file),
              message: `Dev plan file '${file}' does not match naming convention: story-NNN-tasks.md`,
              owner: 'DEV',
            });
          }
        }
      }

      return results;
    },
  },

  'TS-NAMING-ADR': {
    id: 'TS-NAMING-ADR',
    name: 'ADR file naming convention',
    severity: SEVERITY.WARNING,
    owner: 'SA',
    async check(ctx) {
      const results = [];

      for (const projectId of ctx.projects) {
        const adrDir = path.join(ctx.workspaceDir, 'projects', projectId, 'adr');
        if (!fs.existsSync(adrDir)) continue;

        const files = fs.readdirSync(adrDir).filter(f => f.endsWith('.md'));

        for (const file of files) {
          if (file === 'README.md') continue;

          if (!NAMING_PATTERNS.adr.test(file)) {
            results.push({
              ruleId: 'TS-NAMING-ADR',
              severity: SEVERITY.WARNING,
              file: path.join(adrDir, file),
              message: `ADR file '${file}' does not match naming convention: ADR-NNN-description.md`,
              owner: 'SA',
            });
          }
        }
      }

      return results;
    },
  },

  // ===========================================================================
  // TeamSpec 4.0 Rules
  // ===========================================================================

  // -------------------------------------------------------------------------
  // Product Rules (TS-PROD) - 4.0 Only
  // -------------------------------------------------------------------------

  'TS-PROD-001': {
    id: 'TS-PROD-001',
    name: 'Product folder must be registered',
    severity: SEVERITY.ERROR,
    owner: 'PO',
    v4Only: true,
    async check(ctx) {
      const results = [];
      if (ctx.workspaceVersion !== '4.0') return results;

      const indexPath = path.join(ctx.workspaceDir, 'products', 'products-index.md');

      if (!fs.existsSync(indexPath)) {
        // If no products-index.md, skip
        return results;
      }

      const indexContent = fs.readFileSync(indexPath, 'utf-8');

      for (const productId of ctx.products) {
        if (!indexContent.includes(productId)) {
          results.push({
            ruleId: 'TS-PROD-001',
            severity: SEVERITY.ERROR,
            file: path.join(ctx.workspaceDir, 'products', productId),
            message: `Product '${productId}' is not registered in products-index.md`,
            owner: 'PO',
          });
        }
      }

      return results;
    },
  },

  'TS-PROD-002': {
    id: 'TS-PROD-002',
    name: 'product.yml required with minimum metadata',
    severity: SEVERITY.ERROR,
    owner: 'PO',
    v4Only: true,
    async check(ctx) {
      const results = [];
      if (ctx.workspaceVersion !== '4.0') return results;

      for (const productId of ctx.products) {
        const ymlPath = path.join(ctx.workspaceDir, 'products', productId, 'product.yml');

        if (!fs.existsSync(ymlPath)) {
          results.push({
            ruleId: 'TS-PROD-002',
            severity: SEVERITY.ERROR,
            file: ymlPath,
            message: `product.yml is missing for product '${productId}'`,
            owner: 'PO',
          });
          continue;
        }

        const content = fs.readFileSync(ymlPath, 'utf-8');
        const yaml = parseNestedYaml(content);
        const product = yaml.product || {};

        // Check required fields
        const requiredFields = ['id', 'prefix', 'name', 'status'];
        for (const field of requiredFields) {
          if (!product[field]) {
            results.push({
              ruleId: 'TS-PROD-002',
              severity: SEVERITY.ERROR,
              file: ymlPath,
              message: `product.yml is missing required field: 'product.${field}'`,
              owner: 'PO',
            });
          }
        }

        // Validate prefix format (3-4 uppercase chars)
        if (product.prefix && !/^[A-Z]{3,4}$/.test(product.prefix)) {
          results.push({
            ruleId: 'TS-PROD-002',
            severity: SEVERITY.ERROR,
            file: ymlPath,
            message: `product.prefix must be 3-4 uppercase characters, got: '${product.prefix}'`,
            owner: 'PO',
          });
        }
      }

      return results;
    },
  },

  'TS-PROD-003': {
    id: 'TS-PROD-003',
    name: 'Product-Project bidirectional consistency',
    severity: SEVERITY.WARNING,
    owner: 'PO/BA',
    v4Only: true,
    async check(ctx) {
      const results = [];
      if (ctx.workspaceVersion !== '4.0') return results;

      // Build project -> products map
      const projectToProducts = new Map();
      for (const projectId of ctx.projects) {
        const yaml = loadProjectYaml(ctx.workspaceDir, projectId);
        if (yaml && yaml.project && yaml.project.target_products) {
          const targets = Array.isArray(yaml.project.target_products)
            ? yaml.project.target_products
            : [];
          projectToProducts.set(projectId, targets);
        }
      }

      // Build product -> projects map
      const productToProjects = new Map();
      for (const productId of ctx.products) {
        const yaml = loadProductYaml(ctx.workspaceDir, productId);
        if (yaml && yaml.product && yaml.product.active_projects) {
          const active = Array.isArray(yaml.product.active_projects)
            ? yaml.product.active_projects
            : [];
          productToProjects.set(productId, active);
        }
      }

      // Check consistency: project targets product but product doesn't list project
      for (const [projectId, products] of projectToProducts) {
        for (const productId of products) {
          // Handle both string and object format
          const targetProductId = typeof productId === 'object' ? productId.product_id : productId;
          const projectsInProduct = productToProjects.get(targetProductId) || [];

          const projectListed = projectsInProduct.some(p => {
            const pId = typeof p === 'object' ? p.project_id : p;
            return pId === projectId;
          });

          if (!projectListed && ctx.products.includes(targetProductId)) {
            results.push({
              ruleId: 'TS-PROD-003',
              severity: SEVERITY.WARNING,
              file: path.join(ctx.workspaceDir, 'products', targetProductId, 'product.yml'),
              message: `Project '${projectId}' targets product '${targetProductId}' but product doesn't list it in active_projects`,
              owner: 'PO/BA',
            });
          }
        }
      }

      return results;
    },
  },

  'TS-PROD-004': {
    id: 'TS-PROD-004',
    name: 'Product features-index.md required',
    severity: SEVERITY.ERROR,
    owner: 'PO',
    v4Only: true,
    async check(ctx) {
      const results = [];
      if (ctx.workspaceVersion !== '4.0') return results;

      for (const productId of ctx.products) {
        const indexPath = path.join(ctx.workspaceDir, 'products', productId, 'features', 'features-index.md');

        if (!fs.existsSync(indexPath)) {
          results.push({
            ruleId: 'TS-PROD-004',
            severity: SEVERITY.ERROR,
            file: path.join(ctx.workspaceDir, 'products', productId, 'features'),
            message: `Product '${productId}' is missing features/features-index.md`,
            owner: 'PO',
          });
        }
      }

      return results;
    },
  },

  'TS-PROD-005': {
    id: 'TS-PROD-005',
    name: 'Product story-ledger.md required',
    severity: SEVERITY.ERROR,
    owner: 'PO',
    v4Only: true,
    async check(ctx) {
      const results = [];
      if (ctx.workspaceVersion !== '4.0') return results;

      for (const productId of ctx.products) {
        const ledgerPath = path.join(ctx.workspaceDir, 'products', productId, 'features', 'story-ledger.md');

        if (!fs.existsSync(ledgerPath)) {
          results.push({
            ruleId: 'TS-PROD-005',
            severity: SEVERITY.ERROR,
            file: path.join(ctx.workspaceDir, 'products', productId, 'features'),
            message: `Product '${productId}' is missing features/story-ledger.md`,
            owner: 'PO',
          });
        }
      }

      return results;
    },
  },

  // -------------------------------------------------------------------------
  // Feature-Increment Rules (TS-FI) - 4.0 Only
  // -------------------------------------------------------------------------

  'TS-FI-001': {
    id: 'TS-FI-001',
    name: 'Feature-Increment must reference product and feature',
    severity: SEVERITY.ERROR,
    owner: 'BA',
    v4Only: true,
    async check(ctx) {
      const results = [];
      if (ctx.workspaceVersion !== '4.0') return results;

      for (const projectId of ctx.projects) {
        const fiDir = path.join(ctx.workspaceDir, 'projects', projectId, 'feature-increments');
        if (!fs.existsSync(fiDir)) continue;

        // Pattern: fi-PRX-XXX-*.md
        const fiFiles = findFiles(fiDir, /^fi-[A-Z]{3,4}-\d{3,}-.*\.md$/);

        for (const fiFile of fiFiles) {
          const content = fs.readFileSync(fiFile, 'utf-8');
          const filename = path.basename(fiFile);

          // Extract PRX from filename
          const prxMatch = filename.match(/^fi-([A-Z]{3,4})-/);
          const prx = prxMatch ? prxMatch[1] : null;

          // Check for product reference
          const hasProduct = /\*\*Target Product\*\*:|product_id:|target_product:/i.test(content);
          // Check for feature reference (f-PRX-XXX pattern)
          const hasFeature = /\*\*Target Feature\*\*:|f-[A-Z]{3,4}-\d{3,}/i.test(content);

          if (!hasProduct) {
            results.push({
              ruleId: 'TS-FI-001',
              severity: SEVERITY.ERROR,
              file: fiFile,
              message: 'Feature-Increment must specify Target Product',
              owner: 'BA',
            });
          }

          if (!hasFeature) {
            results.push({
              ruleId: 'TS-FI-001',
              severity: SEVERITY.ERROR,
              file: fiFile,
              message: `Feature-Increment must specify Target Feature (f-${prx || 'PRX'}-XXX)`,
              owner: 'BA',
            });
          }
        }
      }

      return results;
    },
  },

  'TS-FI-002': {
    id: 'TS-FI-002',
    name: 'Feature-Increment must have AS-IS and TO-BE sections',
    severity: SEVERITY.ERROR,
    owner: 'BA/FA',
    v4Only: true,
    async check(ctx) {
      const results = [];
      if (ctx.workspaceVersion !== '4.0') return results;

      for (const projectId of ctx.projects) {
        const fiDir = path.join(ctx.workspaceDir, 'projects', projectId, 'feature-increments');
        if (!fs.existsSync(fiDir)) continue;

        const fiFiles = findFiles(fiDir, /^fi-[A-Z]{3,4}-\d{3,}-.*\.md$/);

        for (const fiFile of fiFiles) {
          const content = fs.readFileSync(fiFile, 'utf-8');

          const hasAsIs = /##\s*(AS-IS|Current State|Current Behavior)/i.test(content);
          const hasToBe = /##\s*(TO-BE|Target State|New Behavior|Proposed)/i.test(content);

          if (!hasAsIs) {
            results.push({
              ruleId: 'TS-FI-002',
              severity: SEVERITY.ERROR,
              file: fiFile,
              message: 'Feature-Increment must have AS-IS section describing current state',
              owner: 'BA/FA',
            });
          }

          if (!hasToBe) {
            results.push({
              ruleId: 'TS-FI-002',
              severity: SEVERITY.ERROR,
              file: fiFile,
              message: 'Feature-Increment must have TO-BE section describing target state',
              owner: 'BA/FA',
            });
          }
        }
      }

      return results;
    },
  },

  'TS-FI-003': {
    id: 'TS-FI-003',
    name: 'Feature-Increment target feature must exist in product',
    severity: SEVERITY.ERROR,
    owner: 'BA',
    v4Only: true,
    async check(ctx) {
      const results = [];
      if (ctx.workspaceVersion !== '4.0') return results;

      // Build map of product prefixes to feature files
      const productFeatures = new Map();
      for (const productId of ctx.products) {
        const yaml = loadProductYaml(ctx.workspaceDir, productId);
        const prefix = yaml?.product?.prefix;
        if (!prefix) continue;

        const featuresDir = path.join(ctx.workspaceDir, 'products', productId, 'features');
        if (fs.existsSync(featuresDir)) {
          const features = fs.readdirSync(featuresDir)
            .filter(f => f.match(/^f-[A-Z]{3,4}-\d{3,}/))
            .map(f => f.match(/^(f-[A-Z]{3,4}-\d{3,})/)?.[1])
            .filter(Boolean);
          productFeatures.set(prefix, features);
        }
      }

      for (const projectId of ctx.projects) {
        const fiDir = path.join(ctx.workspaceDir, 'projects', projectId, 'feature-increments');
        if (!fs.existsSync(fiDir)) continue;

        const fiFiles = findFiles(fiDir, /^fi-[A-Z]{3,4}-\d{3,}-.*\.md$/);

        for (const fiFile of fiFiles) {
          const content = fs.readFileSync(fiFile, 'utf-8');

          // Extract feature references from content
          const featureRefs = content.match(/f-[A-Z]{3,4}-\d{3,}/g) || [];

          for (const featureRef of [...new Set(featureRefs)]) {
            const prxMatch = featureRef.match(/f-([A-Z]{3,4})-/);
            if (!prxMatch) continue;

            const prx = prxMatch[1];
            const features = productFeatures.get(prx) || [];

            if (!features.includes(featureRef)) {
              results.push({
                ruleId: 'TS-FI-003',
                severity: SEVERITY.ERROR,
                file: fiFile,
                message: `Referenced feature '${featureRef}' does not exist in product with prefix '${prx}'`,
                owner: 'BA',
              });
            }
          }
        }
      }

      return results;
    },
  },

  'TS-FI-004': {
    id: 'TS-FI-004',
    name: 'Feature-Increment IDs must be unique within project',
    severity: SEVERITY.ERROR,
    owner: 'BA',
    v4Only: true,
    async check(ctx) {
      const results = [];
      if (ctx.workspaceVersion !== '4.0') return results;

      for (const projectId of ctx.projects) {
        const fiDir = path.join(ctx.workspaceDir, 'projects', projectId, 'feature-increments');
        if (!fs.existsSync(fiDir)) continue;

        const fiFiles = findFiles(fiDir, /^fi-[A-Z]{3,4}-\d{3,}-.*\.md$/);
        const idToFiles = new Map();

        for (const fiFile of fiFiles) {
          const match = path.basename(fiFile).match(/^(fi-[A-Z]{3,4}-\d{3,})/);
          if (match) {
            const id = match[1];
            if (!idToFiles.has(id)) {
              idToFiles.set(id, []);
            }
            idToFiles.get(id).push(fiFile);
          }
        }

        for (const [id, files] of idToFiles) {
          if (files.length > 1) {
            results.push({
              ruleId: 'TS-FI-004',
              severity: SEVERITY.ERROR,
              file: files[1],
              message: `Duplicate Feature-Increment ID '${id}' found in: ${files.map(f => path.basename(f)).join(', ')}`,
              owner: 'BA',
            });
          }
        }
      }

      return results;
    },
  },

  // -------------------------------------------------------------------------
  // Epic Rules (TS-EPIC) - 4.0 Only
  // -------------------------------------------------------------------------

  'TS-EPIC-001': {
    id: 'TS-EPIC-001',
    name: 'Epic must link to Feature-Increments',
    severity: SEVERITY.ERROR,
    owner: 'BA',
    v4Only: true,
    async check(ctx) {
      const results = [];
      if (ctx.workspaceVersion !== '4.0') return results;

      for (const projectId of ctx.projects) {
        const epicsDir = path.join(ctx.workspaceDir, 'projects', projectId, 'epics');
        if (!fs.existsSync(epicsDir)) continue;

        // Pattern: epic-PRX-XXX-*.md
        const epicFiles = findFiles(epicsDir, /^epic-[A-Z]{3,4}-\d{3,}-.*\.md$/);

        for (const epicFile of epicFiles) {
          const content = fs.readFileSync(epicFile, 'utf-8');

          // Check for fi-PRX-XXX reference
          const hasFI = /fi-[A-Z]{3,4}-\d{3,}/.test(content);

          if (!hasFI) {
            results.push({
              ruleId: 'TS-EPIC-001',
              severity: SEVERITY.ERROR,
              file: epicFile,
              message: 'Epic must link to at least one Feature-Increment (fi-PRX-XXX)',
              owner: 'BA',
            });
          }
        }
      }

      return results;
    },
  },

  'TS-EPIC-002': {
    id: 'TS-EPIC-002',
    name: 'Epic must define TO-BE state',
    severity: SEVERITY.ERROR,
    owner: 'BA/FA',
    v4Only: true,
    async check(ctx) {
      const results = [];
      if (ctx.workspaceVersion !== '4.0') return results;

      for (const projectId of ctx.projects) {
        const epicsDir = path.join(ctx.workspaceDir, 'projects', projectId, 'epics');
        if (!fs.existsSync(epicsDir)) continue;

        const epicFiles = findFiles(epicsDir, /^epic-[A-Z]{3,4}-\d{3,}-.*\.md$/);

        for (const epicFile of epicFiles) {
          const content = fs.readFileSync(epicFile, 'utf-8');

          const hasToBe = /##\s*(TO-BE|Target State|Outcome|Business Value|Value Proposition)/i.test(content);

          if (!hasToBe) {
            results.push({
              ruleId: 'TS-EPIC-002',
              severity: SEVERITY.ERROR,
              file: epicFile,
              message: 'Epic must define TO-BE state or Business Value section',
              owner: 'BA/FA',
            });
          }
        }
      }

      return results;
    },
  },

  'TS-EPIC-003': {
    id: 'TS-EPIC-003',
    name: 'Epic IDs must be unique within project',
    severity: SEVERITY.ERROR,
    owner: 'BA',
    v4Only: true,
    async check(ctx) {
      const results = [];
      if (ctx.workspaceVersion !== '4.0') return results;

      for (const projectId of ctx.projects) {
        const epicsDir = path.join(ctx.workspaceDir, 'projects', projectId, 'epics');
        if (!fs.existsSync(epicsDir)) continue;

        const epicFiles = findFiles(epicsDir, /^epic-[A-Z]{3,4}-\d{3,}-.*\.md$/);
        const idToFiles = new Map();

        for (const epicFile of epicFiles) {
          const match = path.basename(epicFile).match(/^(epic-[A-Z]{3,4}-\d{3,})/);
          if (match) {
            const id = match[1];
            if (!idToFiles.has(id)) {
              idToFiles.set(id, []);
            }
            idToFiles.get(id).push(epicFile);
          }
        }

        for (const [id, files] of idToFiles) {
          if (files.length > 1) {
            results.push({
              ruleId: 'TS-EPIC-003',
              severity: SEVERITY.ERROR,
              file: files[1],
              message: `Duplicate Epic ID '${id}' found in: ${files.map(f => path.basename(f)).join(', ')}`,
              owner: 'BA',
            });
          }
        }
      }

      return results;
    },
  },

  // -------------------------------------------------------------------------
  // Updated Project Rules (TS-PROJ) - 4.0 Extensions
  // -------------------------------------------------------------------------

  'TS-PROJ-003': {
    id: 'TS-PROJ-003',
    name: 'Project must target at least one product',
    severity: SEVERITY.ERROR,
    owner: 'BA',
    v4Only: true,
    async check(ctx) {
      const results = [];
      if (ctx.workspaceVersion !== '4.0') return results;

      for (const projectId of ctx.projects) {
        const ymlPath = path.join(ctx.workspaceDir, 'projects', projectId, 'project.yml');

        if (!fs.existsSync(ymlPath)) continue;

        const content = fs.readFileSync(ymlPath, 'utf-8');
        const yaml = parseNestedYaml(content);
        const project = yaml.project || {};
        const targets = project.target_products || [];

        if (!Array.isArray(targets) || targets.length === 0) {
          results.push({
            ruleId: 'TS-PROJ-003',
            severity: SEVERITY.ERROR,
            file: ymlPath,
            message: 'Project must target at least one product in target_products',
            owner: 'BA',
          });
        }
      }

      return results;
    },
  },

  'TS-PROJ-004': {
    id: 'TS-PROJ-004',
    name: 'Target products must exist',
    severity: SEVERITY.ERROR,
    owner: 'BA',
    v4Only: true,
    async check(ctx) {
      const results = [];
      if (ctx.workspaceVersion !== '4.0') return results;

      for (const projectId of ctx.projects) {
        const yaml = loadProjectYaml(ctx.workspaceDir, projectId);
        if (!yaml || !yaml.project) continue;

        const targets = yaml.project.target_products || [];

        for (const target of targets) {
          const productId = typeof target === 'object' ? target.product_id : target;

          if (!ctx.products.includes(productId)) {
            results.push({
              ruleId: 'TS-PROJ-004',
              severity: SEVERITY.ERROR,
              file: path.join(ctx.workspaceDir, 'projects', projectId, 'project.yml'),
              message: `Target product '${productId}' does not exist in products/`,
              owner: 'BA',
            });
          }
        }
      }

      return results;
    },
  },

  // -------------------------------------------------------------------------
  // Updated Story Rules (TS-STORY) - 4.0 Extensions
  // -------------------------------------------------------------------------

  'TS-STORY-006': {
    id: 'TS-STORY-006',
    name: 'Story must link to Epic (4.0)',
    severity: SEVERITY.ERROR,
    owner: 'FA',
    v4Only: true,
    async check(ctx) {
      const results = [];
      if (ctx.workspaceVersion !== '4.0') return results;

      for (const projectId of ctx.projects) {
        const storiesDir = path.join(ctx.workspaceDir, 'projects', projectId, 'stories');
        if (!fs.existsSync(storiesDir)) continue;

        // Check all story folders
        const storyFolders = ['backlog', 'ready-to-refine', 'ready-to-develop'];

        for (const folder of storyFolders) {
          const folderPath = path.join(storiesDir, folder);
          if (!fs.existsSync(folderPath)) continue;

          // Find all .md files (except README)
          const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.md') && f !== 'README.md');

          for (const file of files) {
            // Check if filename matches s-eXXX-YYY pattern
            if (!NAMING_PATTERNS_V4.story.test(file)) {
              results.push({
                ruleId: 'TS-STORY-006',
                severity: SEVERITY.ERROR,
                file: path.join(folderPath, file),
                message: `Story filename must include Epic ID (s-eXXX-YYY-description.md), got: '${file}'`,
                owner: 'FA',
              });
            }
          }
        }
      }

      return results;
    },
  },

  'TS-STORY-007': {
    id: 'TS-STORY-007',
    name: 'Linked Epic must exist',
    severity: SEVERITY.ERROR,
    owner: 'FA',
    v4Only: true,
    async check(ctx) {
      const results = [];
      if (ctx.workspaceVersion !== '4.0') return results;

      for (const projectId of ctx.projects) {
        const storiesDir = path.join(ctx.workspaceDir, 'projects', projectId, 'stories');
        const epicsDir = path.join(ctx.workspaceDir, 'projects', projectId, 'epics');
        if (!fs.existsSync(storiesDir)) continue;

        // Get all epic numbers from the epics folder
        const epicNumbers = new Set();
        if (fs.existsSync(epicsDir)) {
          const epicFiles = fs.readdirSync(epicsDir);
          for (const epicFile of epicFiles) {
            const match = epicFile.match(/^epic-[A-Z]{3,4}-(\d{3,})/);
            if (match) epicNumbers.add(match[1]);
          }
        }

        // Check all story folders
        const storyFolders = ['backlog', 'ready-to-refine', 'ready-to-develop'];

        for (const folder of storyFolders) {
          const folderPath = path.join(storiesDir, folder);
          if (!fs.existsSync(folderPath)) continue;

          const storyFiles = findFiles(folderPath, /^s-e\d{3,}-\d{3,}-.*\.md$/);

          for (const storyFile of storyFiles) {
            const match = path.basename(storyFile).match(/^s-e(\d{3,})-/);
            if (match && !epicNumbers.has(match[1])) {
              results.push({
                ruleId: 'TS-STORY-007',
                severity: SEVERITY.ERROR,
                file: storyFile,
                message: `Referenced Epic e${match[1]} does not exist in epics folder`,
                owner: 'FA',
              });
            }
          }
        }
      }

      return results;
    },
  },

  // -------------------------------------------------------------------------
  // Updated DoD Rules (TS-DOD) - 4.0 Extensions
  // -------------------------------------------------------------------------

  'TS-DOD-003': {
    id: 'TS-DOD-003',
    name: 'Product sync after deployment',
    severity: SEVERITY.BLOCKER,
    owner: 'PO',
    v4Only: true,
    async check(ctx) {
      const results = [];
      if (ctx.workspaceVersion !== '4.0') return results;

      for (const projectId of ctx.projects) {
        const yaml = loadProjectYaml(ctx.workspaceDir, projectId);
        if (!yaml || !yaml.project) continue;

        const deployment = yaml.project.deployment || yaml.deployment || {};

        // Check if project is marked as deployed
        if (deployment.deployed_date || deployment.deployed) {
          // Check if sync has been executed
          if (!deployment.canon_synced) {
            results.push({
              ruleId: 'TS-DOD-003',
              severity: SEVERITY.BLOCKER,
              file: path.join(ctx.workspaceDir, 'projects', projectId, 'project.yml'),
              message: 'Project deployed but Product Canon not synced. Run ts:po sync',
              owner: 'PO',
            });
          }
        }
      }

      return results;
    },
  },

  // -------------------------------------------------------------------------
  // 4.0 Naming Convention Rules
  // -------------------------------------------------------------------------

  'TS-NAMING-FI': {
    id: 'TS-NAMING-FI',
    name: 'Feature-Increment file naming convention',
    severity: SEVERITY.WARNING,
    owner: 'BA',
    v4Only: true,
    async check(ctx) {
      const results = [];
      if (ctx.workspaceVersion !== '4.0') return results;

      for (const projectId of ctx.projects) {
        const fiDir = path.join(ctx.workspaceDir, 'projects', projectId, 'feature-increments');
        if (!fs.existsSync(fiDir)) continue;

        const files = fs.readdirSync(fiDir).filter(f => f.endsWith('.md'));

        for (const file of files) {
          if (['increments-index.md', 'README.md'].includes(file)) continue;

          if (!NAMING_PATTERNS_V4.featureIncrement.test(file)) {
            results.push({
              ruleId: 'TS-NAMING-FI',
              severity: SEVERITY.WARNING,
              file: path.join(fiDir, file),
              message: `Feature-Increment file '${file}' does not match naming convention: fi-PRX-XXX-description.md`,
              owner: 'BA',
            });
          }
        }
      }

      return results;
    },
  },

  'TS-NAMING-EPIC': {
    id: 'TS-NAMING-EPIC',
    name: 'Epic file naming convention (4.0)',
    severity: SEVERITY.WARNING,
    owner: 'BA',
    v4Only: true,
    async check(ctx) {
      const results = [];
      if (ctx.workspaceVersion !== '4.0') return results;

      for (const projectId of ctx.projects) {
        const epicsDir = path.join(ctx.workspaceDir, 'projects', projectId, 'epics');
        if (!fs.existsSync(epicsDir)) continue;

        const files = fs.readdirSync(epicsDir).filter(f => f.endsWith('.md'));

        for (const file of files) {
          if (['epics-index.md', 'README.md'].includes(file)) continue;

          if (!NAMING_PATTERNS_V4.epic.test(file)) {
            results.push({
              ruleId: 'TS-NAMING-EPIC',
              severity: SEVERITY.WARNING,
              file: path.join(epicsDir, file),
              message: `Epic file '${file}' does not match naming convention: epic-PRX-XXX-description.md`,
              owner: 'BA',
            });
          }
        }
      }

      return results;
    },
  },

  'TS-NAMING-PRODUCT': {
    id: 'TS-NAMING-PRODUCT',
    name: 'Product folder naming convention',
    severity: SEVERITY.WARNING,
    owner: 'PO',
    v4Only: true,
    async check(ctx) {
      const results = [];
      if (ctx.workspaceVersion !== '4.0') return results;

      const productsDir = path.join(ctx.workspaceDir, 'products');
      if (!fs.existsSync(productsDir)) return results;

      const entries = fs.readdirSync(productsDir, { withFileTypes: true });

      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        if (entry.name === '.git') continue;

        // Check if it has a product.yml (valid product folder)
        const productYml = path.join(productsDir, entry.name, 'product.yml');
        if (!fs.existsSync(productYml)) continue;

        if (!NAMING_PATTERNS_V4.product.test(entry.name)) {
          results.push({
            ruleId: 'TS-NAMING-PRODUCT',
            severity: SEVERITY.WARNING,
            file: path.join(productsDir, entry.name),
            message: `Product folder '${entry.name}' does not match naming convention: lowercase-with-dashes`,
            owner: 'PO',
          });
        }
      }

      return results;
    },
  },

  // -------------------------------------------------------------------------
  // QA Rules (TS-QA) - Test coverage and regression
  // -------------------------------------------------------------------------

  'TS-QA-001': {
    id: 'TS-QA-001',
    name: 'Deployed Feature-Increment must have test coverage',
    severity: SEVERITY.WARNING,
    owner: 'QA',
    v4Only: true,
    async check(ctx) {
      const results = [];
      if (ctx.workspaceVersion !== '4.0') return results;

      for (const projectId of ctx.projects) {
        // Check if project is deployed
        const yaml = loadProjectYaml(ctx.workspaceDir, projectId);
        if (!yaml || !yaml.project) continue;

        const deployment = yaml.project.deployment || yaml.deployment || {};
        if (!deployment.deployed_date && !deployment.deployed) continue;

        // Find all FIs in project
        const fiDir = path.join(ctx.workspaceDir, 'projects', projectId, 'feature-increments');
        if (!fs.existsSync(fiDir)) continue;

        const fiFiles = fs.readdirSync(fiDir)
          .filter(f => f.endsWith('.md') && !['increments-index.md', 'README.md'].includes(f));

        // Check each FI for corresponding test case file
        const qaDir = path.join(ctx.workspaceDir, 'projects', projectId, 'qa', 'test-cases');

        for (const fiFile of fiFiles) {
          // Extract FI ID from filename (e.g., fi-ACME-001-description.md -> fi-ACME-001)
          const match = fiFile.match(/^(fi-[A-Z]{3,4}-\d{3,})/);
          if (!match) continue;

          const fiId = match[1];

          // Look for test case file (tc-fi-PRX-XXX-*.md)
          if (!fs.existsSync(qaDir)) {
            results.push({
              ruleId: 'TS-QA-001',
              severity: SEVERITY.WARNING,
              file: path.join(fiDir, fiFile),
              message: `Deployed FI '${fiId}' has no test coverage (no qa/test-cases directory)`,
              owner: 'QA',
            });
            continue;
          }

          const tcFiles = fs.readdirSync(qaDir);
          const hasTestCoverage = tcFiles.some(tc => tc.startsWith(`tc-${fiId}`) && tc.endsWith('.md'));

          if (!hasTestCoverage) {
            results.push({
              ruleId: 'TS-QA-001',
              severity: SEVERITY.WARNING,
              file: path.join(fiDir, fiFile),
              message: `Deployed FI '${fiId}' has no test coverage. Expected: tc-${fiId}-*.md`,
              owner: 'QA',
            });
          }
        }
      }

      return results;
    },
  },

  'TS-QA-002': {
    id: 'TS-QA-002',
    name: 'Deployment without regression confirmation',
    severity: SEVERITY.WARNING,
    owner: 'QA',
    v4Only: true,
    async check(ctx) {
      const results = [];
      if (ctx.workspaceVersion !== '4.0') return results;

      for (const projectId of ctx.projects) {
        const yaml = loadProjectYaml(ctx.workspaceDir, projectId);
        if (!yaml || !yaml.project) continue;

        const deployment = yaml.project.deployment || yaml.deployment || {};

        // Check if deployment is recent (has date but no regression confirmation)
        if (deployment.deployed_date || deployment.deployed) {
          const regressionConfirmed = deployment.regression_confirmed ||
            deployment.regression_passed ||
            deployment.regression_verified;

          if (!regressionConfirmed) {
            results.push({
              ruleId: 'TS-QA-002',
              severity: SEVERITY.WARNING,
              file: path.join(ctx.workspaceDir, 'projects', projectId, 'project.yml'),
              message: 'Deployment without regression test confirmation. Add regression_confirmed: true to project.yml after verification',
              owner: 'QA',
            });
          }
        }
      }

      return results;
    },
  },
};

// =============================================================================
// Linter Class
// =============================================================================

class Linter {
  constructor(workspaceDir) {
    this.workspaceDir = workspaceDir;
  }

  /**
   * Run all linter rules
   */
  async run(options = {}) {
    const projects = options.project
      ? [options.project]
      : findProjects(this.workspaceDir);

    const products = findProducts(this.workspaceDir);
    const workspaceVersion = detectWorkspaceVersion(this.workspaceDir);

    const ctx = {
      workspaceDir: this.workspaceDir,
      projects,
      products,
      workspaceVersion,
    };

    const results = [];

    for (const rule of Object.values(rules)) {
      try {
        // Skip 4.0-only rules in 2.0 workspaces
        if (rule.v4Only && workspaceVersion !== '4.0') {
          continue;
        }

        const ruleResults = await rule.check(ctx);
        results.push(...ruleResults);
      } catch (err) {
        results.push({
          ruleId: rule.id,
          severity: SEVERITY.ERROR,
          file: this.workspaceDir,
          message: `Rule execution failed: ${err.message}`,
          owner: 'System',
        });
      }
    }

    return results;
  }

  /**
   * Run a specific rule
   */
  async runRule(ruleId, options = {}) {
    const rule = rules[ruleId];
    if (!rule) {
      throw new Error(`Unknown rule: ${ruleId}`);
    }

    const projects = options.project
      ? [options.project]
      : findProjects(this.workspaceDir);

    const products = findProducts(this.workspaceDir);
    const workspaceVersion = detectWorkspaceVersion(this.workspaceDir);

    const ctx = {
      workspaceDir: this.workspaceDir,
      projects,
      products,
      workspaceVersion,
    };

    return rule.check(ctx);
  }

  /**
   * Get workspace version
   */
  getWorkspaceVersion() {
    return detectWorkspaceVersion(this.workspaceDir);
  }

  /**
   * Group results by file
   */
  groupByFile(results) {
    const grouped = {};

    for (const result of results) {
      if (!grouped[result.file]) {
        grouped[result.file] = [];
      }
      grouped[result.file].push(result);
    }

    return grouped;
  }

  /**
   * Format results for console output
   */
  formatResults(results) {
    if (results.length === 0) {
      return '✅ No issues found.';
    }

    const lines = [];
    const grouped = this.groupByFile(results);

    for (const [file, fileResults] of Object.entries(grouped)) {
      lines.push(`\n📄 ${path.relative(this.workspaceDir, file)}`);

      for (const result of fileResults) {
        const icon = result.severity === SEVERITY.ERROR || result.severity === SEVERITY.BLOCKER
          ? '❌'
          : result.severity === SEVERITY.WARNING
            ? '⚠️'
            : 'ℹ️';

        lines.push(`   ${icon} [${result.ruleId}] ${result.message}`);
        lines.push(`      Owner: ${result.owner}`);
      }
    }

    // Summary
    const errors = results.filter(r => r.severity === SEVERITY.ERROR || r.severity === SEVERITY.BLOCKER).length;
    const warnings = results.filter(r => r.severity === SEVERITY.WARNING).length;
    const info = results.filter(r => r.severity === SEVERITY.INFO).length;

    lines.push('\n' + '─'.repeat(60));
    lines.push(`Summary: ${errors} errors, ${warnings} warnings, ${info} info`);

    return lines.join('\n');
  }
}

// =============================================================================
// Exports
// =============================================================================

module.exports = {
  Linter,
  rules,
  SEVERITY,
  NAMING_PATTERNS,
  NAMING_PATTERNS_V2,
  NAMING_PATTERNS_V4,
  findProjects,
  findProducts,
  detectWorkspaceVersion,
};
