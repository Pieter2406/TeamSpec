/**
 * TeamSpec Linter
 * Enforces TeamSpec Feature Canon operating model rules
 * 
 * Rule Categories:
 * - TS-PROJ: Project structure and registration
 * - TS-FEAT: Feature Canon integrity
 * - TS-STORY: Story format and delta compliance
 * - TS-ADR: Architecture decisions
 * - TS-DEVPLAN: Development planning
 * - TS-DOD: Definition of Done gates
 * - TS-NAMING: Naming conventions (from PROJECT_STRUCTURE.yml)
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
// Naming Patterns (from PROJECT_STRUCTURE.yml)
// =============================================================================

const NAMING_PATTERNS = {
  feature: /^F-\d{3,}-[a-z][a-z0-9-]*\.md$/,
  story: /^S-\d{3,}-[a-z][a-z0-9-]*\.md$/,
  adr: /^ADR-\d{3,}-[a-z][a-z0-9-]*\.md$/,
  decision: /^DECISION-\d{3,}-[a-z][a-z0-9-]*\.md$/,
  epic: /^EPIC-\d{3,}-[a-z][a-z0-9-]*\.md$/,
  devPlan: /^story-\d{3,}-tasks\.md$/,
  sprint: /^sprint-\d+$/,
};

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
    requiredFields: ['project_id', 'name', 'status', 'stakeholders', 'roles'],
    async check(ctx) {
      const results = [];
      
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
        const yaml = parseSimpleYaml(content);
        
        for (const field of this.requiredFields) {
          if (!(field in yaml)) {
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
  // Feature Rules (TS-FEAT)
  // -------------------------------------------------------------------------
  
  'TS-FEAT-001': {
    id: 'TS-FEAT-001',
    name: 'Feature file required for any story link',
    severity: SEVERITY.ERROR,
    owner: 'BA/FA',
    async check(ctx) {
      const results = [];
      
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
      
      return results;
    },
  },
  
  'TS-FEAT-003': {
    id: 'TS-FEAT-003',
    name: 'Feature IDs must be unique within project',
    severity: SEVERITY.ERROR,
    owner: 'BA/FA',
    async check(ctx) {
      const results = [];
      
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
      
      return results;
    },
  },
  
  // -------------------------------------------------------------------------
  // Story Rules (TS-STORY)
  // -------------------------------------------------------------------------
  
  'TS-STORY-001': {
    id: 'TS-STORY-001',
    name: 'Story must link to feature',
    severity: SEVERITY.ERROR,
    owner: 'FA',
    async check(ctx) {
      const results = [];
      
      for (const projectId of ctx.projects) {
        const storiesDir = path.join(ctx.workspaceDir, 'projects', projectId, 'stories');
        const storyFiles = findFiles(storiesDir, /^S-\d{3,}-.*\.md$/);
        
        for (const storyFile of storyFiles) {
          const content = fs.readFileSync(storyFile, 'utf-8');
          const featureLinks = extractFeatureLinks(content);
          
          // Check for Linked Features section
          const hasLinkedSection = /##\s*(Linked Features?|Features?)/i.test(content);
          
          if (featureLinks.length === 0 && !hasLinkedSection) {
            results.push({
              ruleId: 'TS-STORY-001',
              severity: SEVERITY.ERROR,
              file: storyFile,
              message: 'Story has no feature link. Stories must link to at least one feature.',
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
        const storyFiles = findFiles(storiesDir, /^S-\d{3,}-.*\.md$/);
        
        for (const storyFile of storyFiles) {
          const content = fs.readFileSync(storyFile, 'utf-8');
          
          // Check for Before/After pattern
          const hasBefore = /\b(Before|Current behavior).*:/i.test(content);
          const hasAfter = /\b(After|New behavior).*:/i.test(content);
          
          if (!hasBefore || !hasAfter) {
            results.push({
              ruleId: 'TS-STORY-002',
              severity: SEVERITY.ERROR,
              file: storyFile,
              message: 'Story must have Before/After sections describing delta behavior.',
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
        const storyFiles = findFiles(storiesDir, /^S-\d{3,}-.*\.md$/);
        
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
        const readyDir = path.join(ctx.workspaceDir, 'projects', projectId, 'stories', 'ready-for-development');
        if (!fs.existsSync(readyDir)) continue;
        
        const storyFiles = findFiles(readyDir, /\.md$/);
        
        for (const storyFile of storyFiles) {
          if (path.basename(storyFile) === 'README.md') continue;
          
          const content = fs.readFileSync(storyFile, 'utf-8');
          
          // Stories in ready-for-development folder must have complete DoR
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
      
      return results;
    },
  },
  
  // -------------------------------------------------------------------------
  // ADR Rules (TS-ADR)
  // -------------------------------------------------------------------------
  
  'TS-ADR-001': {
    id: 'TS-ADR-001',
    name: 'Feature marked "Architecture Required" must have ADR',
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
          const adrRequired = checkboxes.some(c => c.checked && /ADR Required/i.test(c.text));
          
          if (adrRequired) {
            // Check for ADR reference
            const hasAdrRef = /ADR-\d{3,}/i.test(content);
            
            if (!hasAdrRef) {
              results.push({
                ruleId: 'TS-ADR-001',
                severity: SEVERITY.ERROR,
                file: storyFile,
                message: 'Story has "ADR Required" checked but no ADR reference found.',
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
        const adrDir = path.join(ctx.workspaceDir, 'projects', projectId, 'adr');
        if (!fs.existsSync(adrDir)) continue;
        
        const adrFiles = findFiles(adrDir, /^ADR-\d{3,}-.*\.md$/);
        
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
    
    const ctx = {
      workspaceDir: this.workspaceDir,
      projects,
    };
    
    const results = [];
    
    for (const rule of Object.values(rules)) {
      try {
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
    
    const ctx = {
      workspaceDir: this.workspaceDir,
      projects,
    };
    
    return rule.check(ctx);
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
};
