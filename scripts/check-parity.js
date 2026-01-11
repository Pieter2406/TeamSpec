#!/usr/bin/env node
/**
 * Verify agent and template files are identical across directories
 * 
 * Checks parity between:
 * - agents/ ↔ .teamspec/agents/ ↔ cli/teamspec-core/agents/
 * - templates/ ↔ .teamspec/templates/ ↔ cli/teamspec-core/templates/
 * 
 * Usage: node scripts/check-parity.js
 * Exit code: 0 if identical, 1 if differences found
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT_DIR = path.join(__dirname, '..');

// Directories to check for parity
const PARITY_SETS = [
    {
        name: 'agents',
        dirs: [
            'agents',
            '.teamspec/agents',
            'cli/teamspec-core/agents'
        ]
    },
    {
        name: 'templates',
        dirs: [
            'templates',
            '.teamspec/templates',
            'cli/teamspec-core/templates'
        ]
    }
];

function hashFile(filePath) {
    if (!fs.existsSync(filePath)) {
        return null;
    }
    const content = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(content).digest('hex');
}

function getFiles(dir) {
    const fullDir = path.join(ROOT_DIR, dir);
    if (!fs.existsSync(fullDir)) {
        return [];
    }

    return fs.readdirSync(fullDir)
        .filter(f => fs.statSync(path.join(fullDir, f)).isFile())
        .filter(f => !f.startsWith('.'));
}

function checkParitySet(paritySet) {
    const { name, dirs } = paritySet;
    const issues = [];

    // Get authoritative files (first directory)
    const authDir = dirs[0];
    const authFiles = getFiles(authDir);

    if (authFiles.length === 0) {
        issues.push(`No files found in authoritative directory: ${authDir}`);
        return issues;
    }

    // Check each file against other directories
    for (const file of authFiles) {
        const authPath = path.join(ROOT_DIR, authDir, file);
        const authHash = hashFile(authPath);

        for (let i = 1; i < dirs.length; i++) {
            const copyDir = dirs[i];
            const copyPath = path.join(ROOT_DIR, copyDir, file);
            const copyHash = hashFile(copyPath);

            if (copyHash === null) {
                issues.push(`Missing file: ${copyDir}/${file} (exists in ${authDir})`);
            } else if (authHash !== copyHash) {
                issues.push(`Content mismatch: ${authDir}/${file} ≠ ${copyDir}/${file}`);
            }
        }
    }

    // Check for extra files in copy directories
    for (let i = 1; i < dirs.length; i++) {
        const copyDir = dirs[i];
        const copyFiles = getFiles(copyDir);

        for (const file of copyFiles) {
            if (!authFiles.includes(file)) {
                issues.push(`Extra file: ${copyDir}/${file} (not in ${authDir})`);
            }
        }
    }

    return issues;
}

function main() {
    console.log('🔍 Checking file parity across directories...\n');

    let allIssues = [];

    for (const paritySet of PARITY_SETS) {
        console.log(`Checking ${paritySet.name}...`);
        const issues = checkParitySet(paritySet);

        if (issues.length === 0) {
            console.log(`  ✅ ${paritySet.name}: All files match\n`);
        } else {
            console.log(`  ❌ ${paritySet.name}: ${issues.length} issue(s)\n`);
            issues.forEach(issue => console.log(`    - ${issue}`));
            console.log('');
            allIssues = allIssues.concat(issues);
        }
    }

    if (allIssues.length === 0) {
        console.log('✅ All parity checks passed');
        process.exit(0);
    } else {
        console.log(`\n❌ ${allIssues.length} parity issue(s) found`);
        console.log('\nTo fix, sync from authoritative directories:');
        console.log('  - agents/ → .teamspec/agents/, cli/teamspec-core/agents/');
        console.log('  - templates/ → .teamspec/templates/, cli/teamspec-core/templates/');
        process.exit(1);
    }
}

main();
