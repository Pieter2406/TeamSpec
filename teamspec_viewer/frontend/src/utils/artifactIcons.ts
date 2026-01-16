/**
 * Artifact Icons Configuration
 * 
 * Centralized icon definitions for all TeamSpec artifact types.
 * Provides consistent icons, colors, and descriptions across the UI.
 * 
 * Story: s-e005-006 (Artifact Type Icons and Legend)
 * Dev Plan: dp-e005-s006
 */

import { SvgIconComponent } from '@mui/icons-material';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FlagIcon from '@mui/icons-material/Flag';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import InsightsIcon from '@mui/icons-material/Insights';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import HubIcon from '@mui/icons-material/Hub';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import CodeIcon from '@mui/icons-material/Code';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SecurityIcon from '@mui/icons-material/Security';
import GavelIcon from '@mui/icons-material/Gavel';
import SpeedIcon from '@mui/icons-material/Speed';

// ============================================================================
// Types
// ============================================================================

export type ArtifactType =
    | 'product'
    | 'feature'
    | 'feature-increment'
    | 'epic'
    | 'story'
    | 'business-analysis'
    | 'ba-increment'
    | 'solution-design'
    | 'sd-increment'
    | 'technical-architecture'
    | 'ta-increment'
    | 'dev-plan'
    | 'test-case'
    | 'regression-test'
    | 'decision'
    | 'sprint';

export type ArtifactCategory = 'product' | 'increment' | 'execution' | 'qa';

export interface ArtifactIconConfig {
    icon: SvgIconComponent;
    color: string;
    label: string;
    description: string;
    category: ArtifactCategory;
}

// ============================================================================
// Category Colors
// ============================================================================

export const CATEGORY_COLORS: Record<ArtifactCategory, string> = {
    product: '#1976d2',    // Blue - Product/Feature artifacts
    increment: '#ff9800',  // Amber/Orange - Increment artifacts (FI, BAI, SDI, TAI)
    execution: '#4caf50',  // Green - Execution artifacts (Epic, Story, Dev Plan)
    qa: '#9c27b0',         // Purple - QA artifacts
};

// ============================================================================
// Artifact Icon Configuration
// ============================================================================

export const ARTIFACT_ICONS: Record<ArtifactType, ArtifactIconConfig> = {
    'product': {
        icon: Inventory2Icon,
        color: '#1976d2',  // Blue
        label: 'Product',
        description: 'A product in the TeamSpec portfolio',
        category: 'product',
    },
    'feature': {
        icon: StarIcon,
        color: '#2196f3',  // Blue
        label: 'Feature',
        description: 'A documented capability in the Product Canon',
        category: 'product',
    },
    'feature-increment': {
        icon: TrendingUpIcon,
        color: '#ff9800',  // Amber
        label: 'Feature Increment',
        description: 'A proposed change to a Feature',
        category: 'increment',
    },
    'epic': {
        icon: FlagIcon,
        color: '#4caf50',  // Green
        label: 'Epic',
        description: 'A grouping of related stories',
        category: 'execution',
    },
    'story': {
        icon: AssignmentIcon,
        color: '#66bb6a',  // Green
        label: 'Story',
        description: 'An actionable work item in a sprint',
        category: 'execution',
    },
    'business-analysis': {
        icon: AnalyticsIcon,
        color: '#1976d2',  // Blue
        label: 'Business Analysis',
        description: 'Business requirements and analysis artifact',
        category: 'product',
    },
    'ba-increment': {
        icon: InsightsIcon,
        color: '#ff9800',  // Amber
        label: 'BA Increment',
        description: 'A proposed change to Business Analysis',
        category: 'increment',
    },
    'solution-design': {
        icon: ArchitectureIcon,
        color: '#1976d2',  // Blue
        label: 'Solution Design',
        description: 'Technical design and architecture documentation',
        category: 'product',
    },
    'sd-increment': {
        icon: AutoAwesomeIcon,
        color: '#ff9800',  // Amber
        label: 'SD Increment',
        description: 'A proposed change to Solution Design',
        category: 'increment',
    },
    'technical-architecture': {
        icon: HubIcon,
        color: '#1976d2',  // Blue
        label: 'Technical Architecture',
        description: 'System structure and infrastructure design',
        category: 'product',
    },
    'ta-increment': {
        icon: DynamicFeedIcon,
        color: '#ff9800',  // Amber
        label: 'TA Increment',
        description: 'A proposed change to Technical Architecture',
        category: 'increment',
    },
    'dev-plan': {
        icon: CodeIcon,
        color: '#4caf50',  // Green
        label: 'Dev Plan',
        description: 'Developer implementation plan for a story',
        category: 'execution',
    },
    'test-case': {
        icon: CheckCircleIcon,
        color: '#9c27b0',  // Purple
        label: 'Test Case',
        description: 'QA test case artifact',
        category: 'qa',
    },
    'regression-test': {
        icon: SecurityIcon,
        color: '#9c27b0',  // Purple
        label: 'Regression Test',
        description: 'Regression test coverage',
        category: 'qa',
    },
    'decision': {
        icon: GavelIcon,
        color: '#1976d2',  // Blue
        label: 'Decision',
        description: 'Product Owner or team decision record',
        category: 'product',
    },
    'sprint': {
        icon: SpeedIcon,
        color: '#4caf50',  // Green
        label: 'Sprint',
        description: 'Sprint planning and execution artifact',
        category: 'execution',
    },
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get icon configuration for an artifact type
 * @param type - The artifact type
 * @returns Icon configuration object
 */
export function getArtifactIcon(type: ArtifactType): ArtifactIconConfig {
    return ARTIFACT_ICONS[type] || ARTIFACT_ICONS['feature'];
}

/**
 * Get all artifact types grouped by category
 * @returns Map of category to artifact types
 */
export function getArtifactsByCategory(): Map<ArtifactCategory, Array<{ type: ArtifactType; config: ArtifactIconConfig }>> {
    const grouped = new Map<ArtifactCategory, Array<{ type: ArtifactType; config: ArtifactIconConfig }>>();

    // Initialize categories
    grouped.set('product', []);
    grouped.set('increment', []);
    grouped.set('execution', []);
    grouped.set('qa', []);

    // Group artifacts by category
    Object.entries(ARTIFACT_ICONS).forEach(([type, config]) => {
        const category = config.category;
        const items = grouped.get(category) || [];
        items.push({ type: type as ArtifactType, config });
        grouped.set(category, items);
    });

    return grouped;
}

/**
 * Get category label for display
 * @param category - The category
 * @returns Formatted category label
 */
export function getCategoryLabel(category: ArtifactCategory): string {
    const labels: Record<ArtifactCategory, string> = {
        product: 'Product & Features',
        increment: 'Increments',
        execution: 'Execution',
        qa: 'Quality Assurance',
    };
    return labels[category];
}
