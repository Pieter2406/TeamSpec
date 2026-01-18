/**
 * Feature Modules Migration Tests
 * TDD tests for s-e010-004: Verify feature module structure
 */
import { describe, it, expect } from 'vitest';
import path from 'path';
import { existsSync, readFileSync } from 'fs';

describe('Feature Modules Migration', () => {
    const srcPath = path.resolve(__dirname, '../../');
    
    describe('Layout Feature', () => {
        const files = [
            'features/layout/Header.tsx',
            'features/layout/index.ts',
        ];

        it.each(files)('should have %s', (file) => {
            const filePath = path.join(srcPath, file);
            expect(existsSync(filePath)).toBe(true);
        });

        it('should have barrel exports', () => {
            const indexPath = path.join(srcPath, 'features/layout/index.ts');
            const content = readFileSync(indexPath, 'utf-8');
            expect(content).toContain('Header');
        });
    });

    describe('Search Feature', () => {
        const files = [
            'features/search/SearchBar.tsx',
            'features/search/SearchFilters.tsx',
            'features/search/SearchResults.tsx',
            'features/search/index.ts',
        ];

        it.each(files)('should have %s', (file) => {
            const filePath = path.join(srcPath, file);
            expect(existsSync(filePath)).toBe(true);
        });

        it('should have barrel exports', () => {
            const indexPath = path.join(srcPath, 'features/search/index.ts');
            const content = readFileSync(indexPath, 'utf-8');
            expect(content).toContain('SearchBar');
            expect(content).toContain('SearchFilters');
            expect(content).toContain('SearchResults');
        });
    });

    describe('Product Portfolio Feature', () => {
        const files = [
            'features/product-portfolio/ProductPortfolio.tsx',
            'features/product-portfolio/ProductCard.tsx',
            'features/product-portfolio/ProductDetail.tsx',
            'features/product-portfolio/ProjectsList.tsx',
            'features/product-portfolio/index.ts',
        ];

        it.each(files)('should have %s', (file) => {
            const filePath = path.join(srcPath, file);
            expect(existsSync(filePath)).toBe(true);
        });

        it('should have barrel exports', () => {
            const indexPath = path.join(srcPath, 'features/product-portfolio/index.ts');
            const content = readFileSync(indexPath, 'utf-8');
            expect(content).toContain('ProductPortfolio');
            expect(content).toContain('ProductCard');
            expect(content).toContain('ProductDetail');
            expect(content).toContain('ProjectsList');
        });
    });

    describe('Features Barrel Export', () => {
        it('should have features/index.ts', () => {
            const indexPath = path.join(srcPath, 'features/index.ts');
            expect(existsSync(indexPath)).toBe(true);
        });

        it('should export all feature modules', () => {
            const indexPath = path.join(srcPath, 'features/index.ts');
            const content = readFileSync(indexPath, 'utf-8');
            expect(content).toContain('./layout');
            expect(content).toContain('./search');
            expect(content).toContain('./product-portfolio');
        });
    });

    describe('Deprecation Re-exports', () => {
        const deprecatedPaths = [
            'components/Header.tsx',
            'components/SearchBar.tsx',
            'components/SearchFilters.tsx',
            'components/SearchResults.tsx',
            'components/ProductPortfolio.tsx',
            'components/ProductCard.tsx',
            'components/ProductDetail.tsx',
            'components/ProjectsList.tsx',
        ];

        it.each(deprecatedPaths)('should have deprecation re-export at %s', (file) => {
            const filePath = path.join(srcPath, file);
            expect(existsSync(filePath)).toBe(true);
        });
    });
});
