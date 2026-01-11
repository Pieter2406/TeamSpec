#!/usr/bin/env node
/**
 * Check for banned strings that indicate 2.0 remnants
 * 
 * Bans specific misleading strings, NOT legitimate concepts like "Feature Canon"
 * 
 * Usage: node scripts/check-banlist.js
 * Exit code: 0 if clean, 1 if violations found
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BANNED = [
    { pattern: /TeamSpec 2\.0/g, reason: '2.0 branding in 4.0 codebase' },
    { pattern: /Feature Canon operating model/gi, reason: 'Old model name (use Product-Canon)' },
    { pattern: /projects\/\{project-id\}\/features/g, reason: '2.0 path structure (features are in products/)' },
    { pattern: /ts:ba epic(?!\s+review)/g, reason: 'Removed command (use ts:fa epic)' },
    { pattern: /ts:ba feature(?!\s+review)/g, reason: 'Removed command (use ts:fa feature)' },
];

// These paths are allowed to contain banned strings (historical/audit content)
// Note: Use both forward and backslash to support Windows and Unix paths
const ALLOWED_PATHS = [
    /review[\/\\]/,                    // Review/audit documents
    /teamspec_test[\/\\]/,             // Test fixtures
    /test[\/\\]fixtures[\/\\]/,        // Test fixtures
    /CHANGELOG/i,                      // Historical changelog
    /migration/i,                      // Migration guides
    /migrate\.js$/,                    // Migration module (describes 2.0→4.0)
    /spec[\/\\].*[\/\\]audit[\/\\]/,   // Truth audit documents
    /spec[\/\\].*[\/\\]registry\.yml$/,// Registry documents removed commands
    /spec[\/\\].*[\/\\]commands\.md$/, // Commands doc lists removed commands
    /spec[\/\\].*[\/\\]glossary\.md$/, // Glossary references removed commands
    /scripts[\/\\]check-banlist\.js$/, // This script contains banned patterns
    /node_modules[\/\\]/,              // Dependencies
    /\.git[\/\\]/,                     // Git internals
];

// File extensions to check
const EXTENSIONS = ['.md', '.js', '.yml', '.yaml', '.json', '.ts'];

function shouldCheck(filePath) {
    // Skip allowed paths
    for (const allowedPattern of ALLOWED_PATHS) {
        if (allowedPattern.test(filePath)) {
            return false;
        }
    }

    // Only check relevant extensions
    const ext = path.extname(filePath).toLowerCase();
    return EXTENSIONS.includes(ext);
}

function findFiles(dir, files = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            // Skip node_modules and .git
            if (entry.name === 'node_modules' || entry.name === '.git') continue;
            findFiles(fullPath, files);
        } else if (entry.isFile() && shouldCheck(fullPath)) {
            files.push(fullPath);
        }
    }

    return files;
}

function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const violations = [];

    for (const { pattern, reason } of BANNED) {
        // Reset regex state
        pattern.lastIndex = 0;

        let match;
        while ((match = pattern.exec(content)) !== null) {
            // Find line number
            const beforeMatch = content.slice(0, match.index);
            const lineNumber = (beforeMatch.match(/\n/g) || []).length + 1;

            violations.push({
                file: filePath,
                line: lineNumber,
                match: match[0],
                reason
            });
        }
    }

    return violations;
}

function main() {
    const rootDir = path.join(__dirname, '..');
    console.log('🔍 Checking for banned strings...\n');

    const files = findFiles(rootDir);
    let allViolations = [];

    for (const file of files) {
        const violations = checkFile(file);
        allViolations = allViolations.concat(violations);
    }

    if (allViolations.length === 0) {
        console.log('✅ No banned strings found');
        process.exit(0);
    } else {
        console.log(`❌ Found ${allViolations.length} violation(s):\n`);

        for (const v of allViolations) {
            const relativePath = path.relative(rootDir, v.file);
            console.log(`  ${relativePath}:${v.line}`);
            console.log(`    Found: "${v.match}"`);
            console.log(`    Reason: ${v.reason}\n`);
        }

        process.exit(1);
    }
}

main();
