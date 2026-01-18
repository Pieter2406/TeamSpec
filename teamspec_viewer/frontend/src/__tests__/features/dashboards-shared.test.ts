/**
 * Dashboard Shared Components Migration Tests
 * TDD tests for s-e010-005: Verify dashboard components structure
 */
import { describe, it, expect } from 'vitest';
import path from 'path';
import { existsSync, readFileSync } from 'fs';

describe('Dashboard Shared Components Migration', () => {
    const srcPath = path.resolve(__dirname, '../../');
    
    describe('Files Exist in features/dashboards/components/', () => {
        const componentFiles = [
            'features/dashboards/components/QuickViewPanel.tsx',
            'features/dashboards/components/LinkedStoriesPanel.tsx',
            'features/dashboards/components/ArtifactList.tsx',
            'features/dashboards/components/ArtifactReader.tsx',
            'features/dashboards/components/index.ts',
        ];

        it.each(componentFiles)('should have %s', (file) => {
            const filePath = path.join(srcPath, file);
            expect(existsSync(filePath)).toBe(true);
        });
    });

    describe('Barrel Exports', () => {
        it('should have index.ts that exports all dashboard components', () => {
            const indexPath = path.join(srcPath, 'features/dashboards/components/index.ts');
            const content = readFileSync(indexPath, 'utf-8');
            
            expect(content).toContain('QuickViewPanel');
            expect(content).toContain('LinkedStoriesPanel');
            expect(content).toContain('ArtifactList');
            expect(content).toContain('ArtifactReader');
        });

        it('should have features/dashboards/index.ts', () => {
            const indexPath = path.join(srcPath, 'features/dashboards/index.ts');
            expect(existsSync(indexPath)).toBe(true);
        });
    });

    describe('Deprecation Re-exports', () => {
        const deprecatedPaths = [
            'components/QuickViewPanel.tsx',
            'components/LinkedStoriesPanel.tsx',
            'components/ArtifactList.tsx',
            'components/ArtifactReader.tsx',
        ];

        it.each(deprecatedPaths)('should have deprecation re-export at %s', (file) => {
            const filePath = path.join(srcPath, file);
            expect(existsSync(filePath)).toBe(true);
        });
    });

    describe('Import Paths Updated', () => {
        it('should use @/api in QuickViewPanel', () => {
            const filePath = path.join(srcPath, 'features/dashboards/components/QuickViewPanel.tsx');
            const content = readFileSync(filePath, 'utf-8');
            expect(content).toContain("from '@/api/artifacts'");
        });

        it('should use @/shared in ArtifactReader', () => {
            const filePath = path.join(srcPath, 'features/dashboards/components/ArtifactReader.tsx');
            const content = readFileSync(filePath, 'utf-8');
            expect(content).toContain("from '@/shared/components'");
        });
    });
});
