#!/usr/bin/env node
/**
 * Sync TeamSpec core files to CLI package
 * 
 * This script copies the canonical source files from the root folders
 * to the cli/teamspec-core/ folder, ensuring consistency.
 * 
 * Usage: node scripts/sync-cli-core.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CLI_CORE = path.join(ROOT, 'cli', 'teamspec-core');

// Files/folders to sync
const SYNC_CONFIG = [
    {
        source: 'agents',
        dest: 'agents',
        description: 'Agent prompt files'
    },
    {
        source: 'templates',
        dest: 'templates',
        description: 'Document templates',
        exclude: ['README.md'] // Keep CLI-specific README if exists
    },
    {
        source: 'spec/4.0/definitions',
        dest: 'definitions',
        description: 'DoR/DoD definitions (from spec/4.0)'
    }
];

// Individual YML files to sync from spec/4.0
const YML_FILES_TO_SYNC = [
    {
        source: 'spec/4.0/registry.yml',
        dest: 'registry.yml',
        description: 'Registry (roles, artifacts, commands, gates)'
    },
    {
        source: 'cli/teamspec-core/FOLDER_STRUCTURE.yml',
        dest: 'FOLDER_STRUCTURE.yml',
        description: 'Folder structure definition',
        skipIfMissing: true // Keep existing if source missing
    }
];

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`  Created directory: ${path.relative(ROOT, dir)}`);
    }
}

function copyFile(src, dest) {
    fs.copyFileSync(src, dest);
    console.log(`  Copied: ${path.relative(ROOT, src)} → ${path.relative(ROOT, dest)}`);
}

function syncFolder(config) {
    const srcDir = path.join(ROOT, config.source);
    const destDir = path.join(CLI_CORE, config.dest);
    const exclude = config.exclude || [];

    console.log(`\n📁 Syncing ${config.description}...`);
    console.log(`   Source: ${config.source}/`);
    console.log(`   Dest:   cli/teamspec-core/${config.dest}/`);

    if (!fs.existsSync(srcDir)) {
        console.log(`   ⚠️  Source directory not found, skipping`);
        return { copied: 0, skipped: 0 };
    }

    ensureDir(destDir);

    const files = fs.readdirSync(srcDir);
    let copied = 0;
    let skipped = 0;

    for (const file of files) {
        const srcPath = path.join(srcDir, file);
        const destPath = path.join(destDir, file);

        // Skip excluded files
        if (exclude.includes(file)) {
            console.log(`  Skipped (excluded): ${file}`);
            skipped++;
            continue;
        }

        // Skip directories (shallow copy only)
        if (fs.statSync(srcPath).isDirectory()) {
            console.log(`  Skipped (directory): ${file}/`);
            skipped++;
            continue;
        }

        copyFile(srcPath, destPath);
        copied++;
    }

    return { copied, skipped };
}

function syncYmlFiles() {
    console.log(`\n📄 Syncing YML configuration files...`);
    
    let copied = 0;
    let skipped = 0;

    for (const config of YML_FILES_TO_SYNC) {
        const srcPath = path.join(ROOT, config.source);
        const destPath = path.join(CLI_CORE, config.dest);

        console.log(`\n   ${config.description}`);
        console.log(`   Source: ${config.source}`);
        console.log(`   Dest:   cli/teamspec-core/${config.dest}`);

        if (!fs.existsSync(srcPath)) {
            if (config.skipIfMissing) {
                console.log(`   ⚠️  Source not found, keeping existing`);
                skipped++;
            } else {
                console.log(`   ❌ Source not found!`);
                skipped++;
            }
            continue;
        }

        copyFile(srcPath, destPath);
        copied++;
    }

    return { copied, skipped };
}

function main() {
    console.log('═══════════════════════════════════════════════════');
    console.log('  TeamSpec CLI Core Sync');
    console.log('═══════════════════════════════════════════════════');
    console.log(`\nRoot: ${ROOT}`);
    console.log(`CLI Core: ${CLI_CORE}`);

    // Ensure CLI core directory exists
    ensureDir(CLI_CORE);

    let totalCopied = 0;
    let totalSkipped = 0;

    // Sync folders
    for (const config of SYNC_CONFIG) {
        const result = syncFolder(config);
        totalCopied += result.copied;
        totalSkipped += result.skipped;
    }

    // Sync YML configuration files
    const ymlResult = syncYmlFiles();
    totalCopied += ymlResult.copied;
    totalSkipped += ymlResult.skipped;

    console.log('\n═══════════════════════════════════════════════════');
    console.log(`  ✅ Sync complete: ${totalCopied} files copied, ${totalSkipped} skipped`);
    console.log('═══════════════════════════════════════════════════\n');
}

main();
