/**
 * Architecture Validation Tests
 * 
 * Validates the final folder structure after refactoring.
 * No more deprecation re-exports - clean modular architecture.
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const FRONTEND_ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(FRONTEND_ROOT, 'src');

describe('Frontend Architecture', () => {
  describe('Clean folder structure (no legacy folders)', () => {
    it('should NOT have src/components/ folder', () => {
      expect(fs.existsSync(path.join(SRC_DIR, 'components'))).toBe(false);
    });

    it('should NOT have src/contexts/ folder', () => {
      expect(fs.existsSync(path.join(SRC_DIR, 'contexts'))).toBe(false);
    });

    it('should NOT have src/hooks/ folder', () => {
      expect(fs.existsSync(path.join(SRC_DIR, 'hooks'))).toBe(false);
    });

    it('should NOT have src/utils/ folder', () => {
      expect(fs.existsSync(path.join(SRC_DIR, 'utils'))).toBe(false);
    });

    it('should NOT have src/constants/ folder', () => {
      expect(fs.existsSync(path.join(SRC_DIR, 'constants'))).toBe(false);
    });
  });

  describe('New modular structure exists', () => {
    it('should have src/shared/ folder', () => {
      expect(fs.existsSync(path.join(SRC_DIR, 'shared'))).toBe(true);
    });

    it('should have src/features/ folder', () => {
      expect(fs.existsSync(path.join(SRC_DIR, 'features'))).toBe(true);
    });

    it('should have src/api/ folder', () => {
      expect(fs.existsSync(path.join(SRC_DIR, 'api'))).toBe(true);
    });
  });

  describe('Shared module structure', () => {
    const sharedDir = path.join(SRC_DIR, 'shared');

    it('should have shared/contexts/', () => {
      expect(fs.existsSync(path.join(sharedDir, 'contexts'))).toBe(true);
    });

    it('should have shared/hooks/', () => {
      expect(fs.existsSync(path.join(sharedDir, 'hooks'))).toBe(true);
    });

    it('should have shared/utils/', () => {
      expect(fs.existsSync(path.join(sharedDir, 'utils'))).toBe(true);
    });

    it('should have shared/constants/', () => {
      expect(fs.existsSync(path.join(sharedDir, 'constants'))).toBe(true);
    });

    it('should have shared/components/', () => {
      expect(fs.existsSync(path.join(sharedDir, 'components'))).toBe(true);
    });

    it('should have shared/index.ts barrel export', () => {
      expect(fs.existsSync(path.join(sharedDir, 'index.ts'))).toBe(true);
    });
  });

  describe('Features module structure', () => {
    const featuresDir = path.join(SRC_DIR, 'features');

    it('should have features/layout/', () => {
      expect(fs.existsSync(path.join(featuresDir, 'layout'))).toBe(true);
    });

    it('should have features/search/', () => {
      expect(fs.existsSync(path.join(featuresDir, 'search'))).toBe(true);
    });

    it('should have features/product-portfolio/', () => {
      expect(fs.existsSync(path.join(featuresDir, 'product-portfolio'))).toBe(true);
    });

    it('should have features/dashboards/', () => {
      expect(fs.existsSync(path.join(featuresDir, 'dashboards'))).toBe(true);
    });

    it('should have features/index.ts barrel export', () => {
      expect(fs.existsSync(path.join(featuresDir, 'index.ts'))).toBe(true);
    });
  });

  describe('Dashboards structure', () => {
    const dashboardsDir = path.join(SRC_DIR, 'features/dashboards');

    it('should have dashboards/components/', () => {
      expect(fs.existsSync(path.join(dashboardsDir, 'components'))).toBe(true);
    });

    it('should have dashboards/fa/', () => {
      expect(fs.existsSync(path.join(dashboardsDir, 'fa'))).toBe(true);
    });

    it('should have dashboards/ba/', () => {
      expect(fs.existsSync(path.join(dashboardsDir, 'ba'))).toBe(true);
    });

    it('should have dashboards/dev/', () => {
      expect(fs.existsSync(path.join(dashboardsDir, 'dev'))).toBe(true);
    });

    it('should have dashboards/sa/', () => {
      expect(fs.existsSync(path.join(dashboardsDir, 'sa'))).toBe(true);
    });

    it('should have dashboards/qa/', () => {
      expect(fs.existsSync(path.join(dashboardsDir, 'qa'))).toBe(true);
    });
  });

  describe('API module structure', () => {
    const apiDir = path.join(SRC_DIR, 'api');

    it('should NOT have artifacts.ts (old monolithic file)', () => {
      expect(fs.existsSync(path.join(apiDir, 'artifacts.ts'))).toBe(false);
    });

    it('should have common.ts', () => {
      expect(fs.existsSync(path.join(apiDir, 'common.ts'))).toBe(true);
    });

    it('should have products.ts', () => {
      expect(fs.existsSync(path.join(apiDir, 'products.ts'))).toBe(true);
    });

    it('should have features.ts', () => {
      expect(fs.existsSync(path.join(apiDir, 'features.ts'))).toBe(true);
    });

    it('should have stories.ts', () => {
      expect(fs.existsSync(path.join(apiDir, 'stories.ts'))).toBe(true);
    });

    it('should have business.ts', () => {
      expect(fs.existsSync(path.join(apiDir, 'business.ts'))).toBe(true);
    });

    it('should have solution.ts', () => {
      expect(fs.existsSync(path.join(apiDir, 'solution.ts'))).toBe(true);
    });

    it('should have qa.ts', () => {
      expect(fs.existsSync(path.join(apiDir, 'qa.ts'))).toBe(true);
    });

    it('should have search.ts', () => {
      expect(fs.existsSync(path.join(apiDir, 'search.ts'))).toBe(true);
    });

    it('should have index.ts barrel export', () => {
      expect(fs.existsSync(path.join(apiDir, 'index.ts'))).toBe(true);
    });
  });

  describe('Layout feature has all components', () => {
    const layoutDir = path.join(SRC_DIR, 'features/layout');

    it('should have Header.tsx', () => {
      expect(fs.existsSync(path.join(layoutDir, 'Header.tsx'))).toBe(true);
    });

    it('should have RoleBadge.tsx', () => {
      expect(fs.existsSync(path.join(layoutDir, 'RoleBadge.tsx'))).toBe(true);
    });

    it('should have RoleSelector.tsx', () => {
      expect(fs.existsSync(path.join(layoutDir, 'RoleSelector.tsx'))).toBe(true);
    });

    it('should have index.ts with all exports', () => {
      const content = fs.readFileSync(path.join(layoutDir, 'index.ts'), 'utf-8');
      expect(content).toContain('Header');
      expect(content).toContain('RoleBadge');
      expect(content).toContain('RoleSelector');
    });
  });

  describe('App.tsx uses new import paths', () => {
    it('should import from @/shared/contexts', () => {
      const content = fs.readFileSync(path.join(SRC_DIR, 'App.tsx'), 'utf-8');
      expect(content).toContain("from '@/shared/contexts'");
    });

    it('should import from @/features/layout', () => {
      const content = fs.readFileSync(path.join(SRC_DIR, 'App.tsx'), 'utf-8');
      expect(content).toContain("from '@/features/layout'");
    });

    it('should import from @/features/dashboards/', () => {
      const content = fs.readFileSync(path.join(SRC_DIR, 'App.tsx'), 'utf-8');
      expect(content).toContain("from '@/features/dashboards/");
    });

    it('should NOT import from ./components/', () => {
      const content = fs.readFileSync(path.join(SRC_DIR, 'App.tsx'), 'utf-8');
      expect(content).not.toContain("from './components/");
    });

    it('should NOT import from ./contexts/', () => {
      const content = fs.readFileSync(path.join(SRC_DIR, 'App.tsx'), 'utf-8');
      expect(content).not.toContain("from './contexts/");
    });
  });
});
