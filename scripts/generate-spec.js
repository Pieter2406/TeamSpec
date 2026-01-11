#!/usr/bin/env node
/**
 * Generate spec documents from registry.yml
 * 
 * Usage: node scripts/generate-spec.js
 * 
 * Generates:
 * - spec/4.0/roles.md (from registry.yml roles section)
 * - spec/4.0/commands.md (from registry.yml commands section)
 * - spec/4.0/artifacts.md (from registry.yml artifacts section)
 */

const fs = require('fs');
const path = require('path');

// Simple YAML parser for our specific format
function parseYaml(content) {
    // This is a simplified parser - in production, use js-yaml
    const lines = content.split('\n');
    const result = { roles: {}, artifacts: {}, commands: [], gates: {} };
    let currentSection = null;
    let currentRole = null;
    let currentArtifact = null;
    let currentGate = null;
    let currentCommand = null;
    let currentKey = null;
    let currentList = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Skip comments and empty lines
        if (trimmed.startsWith('#') || trimmed === '') continue;

        // Detect sections
        if (trimmed === 'roles:') { currentSection = 'roles'; continue; }
        if (trimmed === 'artifacts:') { currentSection = 'artifacts'; continue; }
        if (trimmed === 'commands:') { currentSection = 'commands'; continue; }
        if (trimmed === 'gates:') { currentSection = 'gates'; continue; }
        if (trimmed === 'glossary:' || trimmed === 'invariants:' || trimmed === 'canon_rules:') {
            currentSection = null;
            continue;
        }

        // Parse based on section
        if (currentSection === 'roles') {
            const indent = line.search(/\S/);
            if (indent === 2 && trimmed.endsWith(':') && !trimmed.includes(' ')) {
                currentRole = trimmed.slice(0, -1);
                result.roles[currentRole] = { owns: [], creates: [], refuses: [], commands: [] };
                currentKey = null;
                currentList = null;
            } else if (indent === 4 && trimmed.endsWith(':')) {
                currentKey = trimmed.slice(0, -1);
                if (['owns', 'creates', 'refuses', 'commands', 'reviews', 'verifies'].includes(currentKey)) {
                    currentList = currentKey;
                    if (!result.roles[currentRole][currentKey]) {
                        result.roles[currentRole][currentKey] = [];
                    }
                }
            } else if (indent === 6 && trimmed.startsWith('- ') && currentRole && currentList) {
                const value = trimmed.slice(2).replace(/^"(.+)"$/, '$1');
                result.roles[currentRole][currentList].push(value);
            } else if (indent === 4 && trimmed.startsWith('name:')) {
                result.roles[currentRole].name = trimmed.split(': ')[1].replace(/^"(.+)"$/, '$1');
            }
        }

        if (currentSection === 'artifacts') {
            const indent = line.search(/\S/);
            if (indent === 2 && trimmed.endsWith(':') && !trimmed.includes(' ')) {
                currentArtifact = trimmed.slice(0, -1);
                result.artifacts[currentArtifact] = {};
            } else if (indent === 4 && currentArtifact && trimmed.includes(':')) {
                const [key, ...valueParts] = trimmed.split(':');
                const value = valueParts.join(':').trim().replace(/^"(.+)"$/, '$1');
                result.artifacts[currentArtifact][key.trim()] = value;
            }
        }

        if (currentSection === 'commands') {
            const indent = line.search(/\S/);
            if (indent === 2 && trimmed === '- id:' || (indent === 2 && trimmed.startsWith('- id:'))) {
                currentCommand = {};
                if (trimmed.includes(':')) {
                    const value = trimmed.split('id:')[1]?.trim();
                    if (value) currentCommand.id = value;
                }
                result.commands.push(currentCommand);
            } else if (indent === 4 && currentCommand && trimmed.includes(':')) {
                const colonIndex = trimmed.indexOf(':');
                const key = trimmed.slice(0, colonIndex).trim();
                const value = trimmed.slice(colonIndex + 1).trim().replace(/^"(.+)"$/, '$1');
                currentCommand[key] = value;
            }
        }

        if (currentSection === 'gates') {
            const indent = line.search(/\S/);
            if (indent === 2 && trimmed.endsWith(':') && !trimmed.includes(' ')) {
                currentGate = trimmed.slice(0, -1);
                result.gates[currentGate] = { checks: [] };
                currentList = null;
            } else if (indent === 4 && currentGate && trimmed.startsWith('checks:')) {
                currentList = 'checks';
            } else if (indent === 6 && trimmed.startsWith('- ') && currentGate && currentList === 'checks') {
                result.gates[currentGate].checks.push(trimmed.slice(2).replace(/^"(.+)"$/, '$1'));
            } else if (indent === 4 && currentGate && trimmed.includes(':')) {
                const [key, ...valueParts] = trimmed.split(':');
                const value = valueParts.join(':').trim().replace(/^"(.+)"$/, '$1');
                result.gates[currentGate][key.trim()] = value;
            }
        }
    }

    return result;
}

const REGISTRY_PATH = path.join(__dirname, '..', 'spec', '4.0', 'registry.yml');
const SPEC_DIR = path.join(__dirname, '..', 'spec', '4.0');
const GENERATED_HEADER = '<!-- DO NOT EDIT - Generated from registry.yml -->\n\n';

function loadRegistry() {
    const content = fs.readFileSync(REGISTRY_PATH, 'utf8');
    return parseYaml(content);
}

function generateRolesMd(registry) {
    let md = GENERATED_HEADER;
    md += '# TeamSpec 4.0 Roles\n\n';
    md += '> **Status:** Normative  \n';
    md += '> **Source:** [registry.yml](registry.yml)\n\n';
    md += '---\n\n';
    md += '## Role Ownership Matrix\n\n';
    md += '| Role | Owns | Creates | Refuses |\n';
    md += '|------|------|---------|--------|\n';

    for (const [id, role] of Object.entries(registry.roles)) {
        const owns = (role.owns || []).slice(0, 3).join(', ') + (role.owns?.length > 3 ? '...' : '');
        const creates = (role.creates || []).slice(0, 2).join(', ') + (role.creates?.length > 2 ? '...' : '');
        const refuses = (role.refuses || []).slice(0, 2).join(', ') + (role.refuses?.length > 2 ? '...' : '');
        md += `| **${id}** (${role.name || id}) | ${owns} | ${creates} | ${refuses} |\n`;
    }

    md += '\n---\n\n';
    md += '## Role Details\n\n';

    for (const [id, role] of Object.entries(registry.roles)) {
        md += `### ${id} (${role.name || id})\n\n`;

        if (role.owns?.length) {
            md += '**Owns:**\n';
            role.owns.forEach(item => md += `- ${item}\n`);
            md += '\n';
        }

        if (role.creates?.length) {
            md += '**Creates:**\n';
            role.creates.forEach(item => md += `- \`${item}\`\n`);
            md += '\n';
        }

        if (role.refuses?.length) {
            md += '**Refuses:**\n';
            role.refuses.forEach(item => md += `- ${item}\n`);
            md += '\n';
        }

        if (role.commands?.length) {
            md += '**Commands:**\n';
            role.commands.forEach(item => md += `- \`${item}\`\n`);
            md += '\n';
        }

        md += '---\n\n';
    }

    return md;
}

function generateCommandsMd(registry) {
    let md = GENERATED_HEADER;
    md += '# TeamSpec 4.0 Commands\n\n';
    md += '> **Status:** Normative  \n';
    md += '> **Source:** [registry.yml](registry.yml)\n\n';
    md += '---\n\n';

    // Group commands by status
    const active = registry.commands.filter(c => !c.status || c.status === 'Active');
    const deprecated = registry.commands.filter(c => c.status === 'DEPRECATED');
    const removed = registry.commands.filter(c => c.status === 'REMOVED');

    md += '## Active Commands\n\n';
    md += '| Invocation | Role | Purpose |\n';
    md += '|------------|------|--------|\n';

    for (const cmd of active) {
        md += `| \`${cmd.invocation || ''}\` | ${cmd.role || '-'} | ${cmd.purpose || ''} |\n`;
    }

    if (deprecated.length) {
        md += '\n---\n\n';
        md += '## Deprecated Commands\n\n';
        md += '| Invocation | Replacement | Reason |\n';
        md += '|------------|-------------|--------|\n';

        for (const cmd of deprecated) {
            md += `| \`${cmd.invocation || ''}\` | \`${cmd.replacement || ''}\` | ${cmd.reason || ''} |\n`;
        }
    }

    if (removed.length) {
        md += '\n---\n\n';
        md += '## Removed Commands\n\n';
        md += '| Invocation | Replacement | Reason |\n';
        md += '|------------|-------------|--------|\n';

        for (const cmd of removed) {
            md += `| \`${cmd.invocation || ''}\` | \`${cmd.replacement || ''}\` | ${cmd.reason || ''} |\n`;
        }
    }

    return md;
}

function generateArtifactsMd(registry) {
    let md = GENERATED_HEADER;
    md += '# TeamSpec 4.0 Artifacts\n\n';
    md += '> **Status:** Normative  \n';
    md += '> **Source:** [registry.yml](registry.yml)\n\n';
    md += '---\n\n';

    md += '## Artifact Types\n\n';
    md += '| Artifact | Location | Pattern | Owner |\n';
    md += '|----------|----------|---------|-------|\n';

    for (const [id, artifact] of Object.entries(registry.artifacts)) {
        md += `| ${id} | \`${artifact.location || ''}\` | \`${artifact.naming || ''}\` | ${artifact.owner || ''} |\n`;
    }

    return md;
}

function main() {
    console.log('📚 Loading registry.yml...');
    const registry = loadRegistry();

    console.log('📝 Generating roles.md...');
    const rolesMd = generateRolesMd(registry);
    fs.writeFileSync(path.join(SPEC_DIR, 'roles.md'), rolesMd);

    console.log('📝 Generating commands.md...');
    const commandsMd = generateCommandsMd(registry);
    fs.writeFileSync(path.join(SPEC_DIR, 'commands.md'), commandsMd);

    console.log('📝 Generating artifacts.md...');
    const artifactsMd = generateArtifactsMd(registry);
    fs.writeFileSync(path.join(SPEC_DIR, 'artifacts.md'), artifactsMd);

    console.log('✅ Generated spec files from registry.yml');
}

main();
