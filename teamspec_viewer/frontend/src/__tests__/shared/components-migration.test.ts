/**
 * Shared Components Migration Tests
 * TDD tests for s-e010-003: Verify shared components structure
 */
import { describe, it, expect } from 'vitest';
import path from 'path';
import { existsSync, readFileSync } from 'fs';

describe('Shared Components Migration', () => {
    const srcPath = path.resolve(__dirname, '../../');
    
    describe('Files Exist in shared/components/', () => {
        const componentFiles = [
            'shared/components/ArtifactTree.tsx',
            'shared/components/StatusDropdown.tsx',
            'shared/components/IconLegend.tsx',
            'shared/components/TBDIndicator.tsx',
            'shared/components/TbdHighlighter.tsx',
            'shared/components/index.ts',
        ];

        it.each(componentFiles)('should have %s', (file) => {
            const filePath = path.join(srcPath, file);
            expect(existsSync(filePath)).toBe(true);
        });
    });

    describe('Barrel Exports', () => {
        it('should have index.ts that exports all shared components', () => {
            const indexPath = path.join(srcPath, 'shared/components/index.ts');
            const content = readFileSync(indexPath, 'utf-8');
            
            expect(content).toContain('ArtifactTree');
            expect(content).toContain('StatusDropdown');
            expect(content).toContain('IconLegend');
            expect(content).toContain('TBDIndicator');
            expect(content).toContain('TbdHighlighter');
        });
    });

    describe('Deprecation Re-exports', () => {
        const deprecatedPaths = [
            'components/ArtifactTree.tsx',
            'components/StatusDropdown.tsx',
            'components/IconLegend.tsx',
            'components/TBDIndicator.tsx',
            'components/TbdHighlighter.tsx',
        ];

        it.each(deprecatedPaths)('should have deprecation re-export at %s', (file) => {
            const filePath = path.join(srcPath, file);
            expect(existsSync(filePath)).toBe(true);
        });
    });

    describe('Import Paths Updated', () => {
        it('should use @/shared paths in ArtifactTree', () => {
            const filePath = path.join(srcPath, 'shared/components/ArtifactTree.tsx');
            const content = readFileSync(filePath, 'utf-8');
            
            expect(content).toContain("from '@/shared/utils'");
            expect(content).toContain("from '@/shared/contexts'");
            expect(content).toContain("from '@/shared/constants'");
        });

        it('should use @/shared paths in StatusDropdown', () => {
            const filePath = path.join(srcPath, 'shared/components/StatusDropdown.tsx');
            const content = readFileSync(filePath, 'utf-8');
            
            expect(content).toContain("from '@/shared/utils'");
        });

        it('should use @/shared paths in IconLegend', () => {
            const filePath = path.join(srcPath, 'shared/components/IconLegend.tsx');
            const content = readFileSync(filePath, 'utf-8');
            
            expect(content).toContain("from '@/shared/utils'");
        });
    });
});
