/**
 * TDD Tests for s-e010-006: Migrate role-specific dashboards
 * 
 * Validates that all role-specific dashboard components have been
 * properly migrated to features/dashboards/{role}/ structure.
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const FRONTEND_ROOT = path.resolve(__dirname, '..');
const FEATURES_DASHBOARDS = path.join(FRONTEND_ROOT, 'src/features/dashboards');

describe('s-e010-006: Role-specific dashboards migration', () => {
  describe('FA Dashboard module', () => {
    const faDir = path.join(FEATURES_DASHBOARDS, 'fa');
    
    it('should have fa/ directory', () => {
      expect(fs.existsSync(faDir)).toBe(true);
    });

    it('should have FADashboard.tsx', () => {
      expect(fs.existsSync(path.join(faDir, 'FADashboard.tsx'))).toBe(true);
    });

    it('should have FeatureCard.tsx', () => {
      expect(fs.existsSync(path.join(faDir, 'FeatureCard.tsx'))).toBe(true);
    });

    it('should have FeatureFIPanel.tsx', () => {
      expect(fs.existsSync(path.join(faDir, 'FeatureFIPanel.tsx'))).toBe(true);
    });

    it('should have FIDetailView.tsx', () => {
      expect(fs.existsSync(path.join(faDir, 'FIDetailView.tsx'))).toBe(true);
    });

    it('should have index.ts barrel export', () => {
      expect(fs.existsSync(path.join(faDir, 'index.ts'))).toBe(true);
    });

    it('should export all FA components from barrel', () => {
      const indexContent = fs.readFileSync(path.join(faDir, 'index.ts'), 'utf-8');
      expect(indexContent).toContain("export { FADashboard }");
      expect(indexContent).toContain("export { FeatureCard");
      expect(indexContent).toContain("export { FeatureFIPanel }");
      expect(indexContent).toContain("export { FIDetailView }");
    });
  });

  describe('BA Dashboard module', () => {
    const baDir = path.join(FEATURES_DASHBOARDS, 'ba');
    
    it('should have ba/ directory', () => {
      expect(fs.existsSync(baDir)).toBe(true);
    });

    it('should have BADashboard.tsx', () => {
      expect(fs.existsSync(path.join(baDir, 'BADashboard.tsx'))).toBe(true);
    });

    it('should have BATree.tsx', () => {
      expect(fs.existsSync(path.join(baDir, 'BATree.tsx'))).toBe(true);
    });

    it('should have BACard.tsx', () => {
      expect(fs.existsSync(path.join(baDir, 'BACard.tsx'))).toBe(true);
    });

    it('should have index.ts barrel export', () => {
      expect(fs.existsSync(path.join(baDir, 'index.ts'))).toBe(true);
    });

    it('should export all BA components from barrel', () => {
      const indexContent = fs.readFileSync(path.join(baDir, 'index.ts'), 'utf-8');
      expect(indexContent).toContain("export { BADashboard }");
      expect(indexContent).toContain("export { BACard");
      expect(indexContent).toContain("export { BATree }");
    });
  });

  describe('DEV Dashboard module', () => {
    const devDir = path.join(FEATURES_DASHBOARDS, 'dev');
    
    it('should have dev/ directory', () => {
      expect(fs.existsSync(devDir)).toBe(true);
    });

    it('should have DEVDashboard.tsx', () => {
      expect(fs.existsSync(path.join(devDir, 'DEVDashboard.tsx'))).toBe(true);
    });

    it('should have DEVTree.tsx', () => {
      expect(fs.existsSync(path.join(devDir, 'DEVTree.tsx'))).toBe(true);
    });

    it('should have index.ts barrel export', () => {
      expect(fs.existsSync(path.join(devDir, 'index.ts'))).toBe(true);
    });

    it('should export all DEV components from barrel', () => {
      const indexContent = fs.readFileSync(path.join(devDir, 'index.ts'), 'utf-8');
      expect(indexContent).toContain("export { DEVDashboard }");
      expect(indexContent).toContain("export { DEVTree }");
    });
  });

  describe('SA Dashboard module', () => {
    const saDir = path.join(FEATURES_DASHBOARDS, 'sa');
    
    it('should have sa/ directory', () => {
      expect(fs.existsSync(saDir)).toBe(true);
    });

    it('should have SADashboard.tsx', () => {
      expect(fs.existsSync(path.join(saDir, 'SADashboard.tsx'))).toBe(true);
    });

    it('should have SATree.tsx', () => {
      expect(fs.existsSync(path.join(saDir, 'SATree.tsx'))).toBe(true);
    });

    it('should have index.ts barrel export', () => {
      expect(fs.existsSync(path.join(saDir, 'index.ts'))).toBe(true);
    });

    it('should export all SA components from barrel', () => {
      const indexContent = fs.readFileSync(path.join(saDir, 'index.ts'), 'utf-8');
      expect(indexContent).toContain("export { SADashboard }");
      expect(indexContent).toContain("export { SATree }");
    });
  });

  describe('QA Dashboard module', () => {
    const qaDir = path.join(FEATURES_DASHBOARDS, 'qa');
    
    it('should have qa/ directory', () => {
      expect(fs.existsSync(qaDir)).toBe(true);
    });

    it('should have QADashboard.tsx', () => {
      expect(fs.existsSync(path.join(qaDir, 'QADashboard.tsx'))).toBe(true);
    });

    it('should have QATree.tsx', () => {
      expect(fs.existsSync(path.join(qaDir, 'QATree.tsx'))).toBe(true);
    });

    it('should have index.ts barrel export', () => {
      expect(fs.existsSync(path.join(qaDir, 'index.ts'))).toBe(true);
    });

    it('should export all QA components from barrel', () => {
      const indexContent = fs.readFileSync(path.join(qaDir, 'index.ts'), 'utf-8');
      expect(indexContent).toContain("export { QADashboard }");
      expect(indexContent).toContain("export { QATree }");
    });
  });

  describe('Dashboards barrel export', () => {
    it('should export all role modules from features/dashboards/index.ts', () => {
      const indexPath = path.join(FEATURES_DASHBOARDS, 'index.ts');
      const content = fs.readFileSync(indexPath, 'utf-8');
      
      expect(content).toContain("export * from './components'");
      expect(content).toContain("export * from './fa'");
      expect(content).toContain("export * from './ba'");
      expect(content).toContain("export * from './dev'");
      expect(content).toContain("export * from './sa'");
      expect(content).toContain("export * from './qa'");
    });
  });

  describe('Deprecation re-exports', () => {
    const componentsDir = path.join(FRONTEND_ROOT, 'src/components');

    it('should have FADashboard.tsx deprecation re-export', () => {
      const content = fs.readFileSync(path.join(componentsDir, 'FADashboard.tsx'), 'utf-8');
      expect(content).toContain('@deprecated');
      expect(content).toContain("@/features/dashboards/fa");
    });

    it('should have FeatureCard.tsx deprecation re-export', () => {
      const content = fs.readFileSync(path.join(componentsDir, 'FeatureCard.tsx'), 'utf-8');
      expect(content).toContain('@deprecated');
      expect(content).toContain("@/features/dashboards/fa");
    });

    it('should have BADashboard.tsx deprecation re-export', () => {
      const content = fs.readFileSync(path.join(componentsDir, 'BADashboard.tsx'), 'utf-8');
      expect(content).toContain('@deprecated');
      expect(content).toContain("@/features/dashboards/ba");
    });

    it('should have DEVDashboard.tsx deprecation re-export', () => {
      const content = fs.readFileSync(path.join(componentsDir, 'DEVDashboard.tsx'), 'utf-8');
      expect(content).toContain('@deprecated');
      expect(content).toContain("@/features/dashboards/dev");
    });

    it('should have SADashboard.tsx deprecation re-export', () => {
      const content = fs.readFileSync(path.join(componentsDir, 'SADashboard.tsx'), 'utf-8');
      expect(content).toContain('@deprecated');
      expect(content).toContain("@/features/dashboards/sa");
    });

    it('should have QADashboard.tsx deprecation re-export', () => {
      const content = fs.readFileSync(path.join(componentsDir, 'QADashboard.tsx'), 'utf-8');
      expect(content).toContain('@deprecated');
      expect(content).toContain("@/features/dashboards/qa");
    });
  });

  describe('Import path updates', () => {
    it('FADashboard should use @/ path aliases', () => {
      const content = fs.readFileSync(path.join(FEATURES_DASHBOARDS, 'fa/FADashboard.tsx'), 'utf-8');
      expect(content).toContain("from '@/api");
      expect(content).toContain("from '@/shared");
    });

    it('BADashboard should use @/ path aliases', () => {
      const content = fs.readFileSync(path.join(FEATURES_DASHBOARDS, 'ba/BADashboard.tsx'), 'utf-8');
      expect(content).toContain("from '@/api");
      expect(content).toContain("from '@/shared");
    });

    it('DEVDashboard should use @/ path aliases', () => {
      const content = fs.readFileSync(path.join(FEATURES_DASHBOARDS, 'dev/DEVDashboard.tsx'), 'utf-8');
      expect(content).toContain("from '@/api");
      expect(content).toContain("from '@/shared");
    });

    it('SADashboard should use @/ path aliases', () => {
      const content = fs.readFileSync(path.join(FEATURES_DASHBOARDS, 'sa/SADashboard.tsx'), 'utf-8');
      expect(content).toContain("from '@/api");
      expect(content).toContain("from '@/shared");
    });

    it('QADashboard should use @/ path aliases', () => {
      const content = fs.readFileSync(path.join(FEATURES_DASHBOARDS, 'qa/QADashboard.tsx'), 'utf-8');
      expect(content).toContain("from '@/api");
      expect(content).toContain("from '@/shared");
    });
  });
});
