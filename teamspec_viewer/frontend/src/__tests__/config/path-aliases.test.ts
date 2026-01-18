/**
 * Path Aliases Configuration Tests
 * TDD tests for s-e010-001: Verify path alias configuration
 */
import { describe, it, expect } from 'vitest';
import path from 'path';
import { existsSync, readFileSync } from 'fs';

describe('Path Aliases Configuration', () => {
    const frontendRoot = path.resolve(__dirname, '../../../');
    
    describe('Folder Structure', () => {
        const requiredFolders = [
            'src/shared',
            'src/shared/contexts',
            'src/shared/hooks',
            'src/shared/utils',
            'src/shared/constants',
            'src/shared/components',
            'src/features',
            'src/features/layout',
            'src/features/search',
            'src/features/product-portfolio',
            'src/features/dashboards',
        ];

        it.each(requiredFolders)('should have folder: %s', (folder) => {
            const folderPath = path.join(frontendRoot, folder);
            expect(existsSync(folderPath)).toBe(true);
        });
    });

    describe('Vite Configuration', () => {
        it('should have vite.config.js with path aliases', () => {
            const viteConfigPath = path.join(frontendRoot, 'vite.config.js');
            expect(existsSync(viteConfigPath)).toBe(true);
            
            const config = readFileSync(viteConfigPath, 'utf-8');
            
            // Check for required aliases
            expect(config).toContain("'@':");
            expect(config).toContain("'@/shared':");
            expect(config).toContain("'@/features':");
            expect(config).toContain("'@/api':");
        });
    });

    describe('TypeScript Configuration', () => {
        it('should have tsconfig.json with matching path mappings', () => {
            const tsconfigPath = path.join(frontendRoot, 'tsconfig.json');
            expect(existsSync(tsconfigPath)).toBe(true);
            
            const content = readFileSync(tsconfigPath, 'utf-8');
            // tsconfig uses JSONC (comments allowed), so check content directly
            
            // Check for required paths
            expect(content).toContain('"@/*"');
            expect(content).toContain('"@/shared/*"');
            expect(content).toContain('"@/features/*"');
            expect(content).toContain('"@/api/*"');
        });
    });
});
