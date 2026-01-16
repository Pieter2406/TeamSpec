/**
 * Status Options Configuration
 *
 * Centralized status definitions for all TeamSpec artifact types.
 * Provides consistent status values for dropdown population and validation.
 *
 * Story: s-e006-001 (Status Options Utility)
 * Feature: f-TSV-008 (Inline Status Editing)
 */

import { ArtifactType } from './artifactIcons';

// ============================================================================
// Types
// ============================================================================

export type StatusValue = string;

export interface StatusConfig {
    value: StatusValue;
    label: string;
    color: string;  // For chip coloring
}

// ============================================================================
// Status Options by Artifact Type
// ============================================================================

export const STATUS_OPTIONS: Partial<Record<ArtifactType, StatusConfig[]>> = {
    'feature': [
        { value: 'Planned', label: 'Planned', color: '#9e9e9e' },
        { value: 'Active', label: 'Active', color: '#4caf50' },
        { value: 'Deprecated', label: 'Deprecated', color: '#ff9800' },
        { value: 'Retired', label: 'Retired', color: '#f44336' },
    ],
    'feature-increment': [
        { value: 'Proposed', label: 'Proposed', color: '#9e9e9e' },
        { value: 'Approved', label: 'Approved', color: '#2196f3' },
        { value: 'In-Progress', label: 'In-Progress', color: '#ff9800' },
        { value: 'Done', label: 'Done', color: '#4caf50' },
        { value: 'Rejected', label: 'Rejected', color: '#f44336' },
    ],
    'epic': [
        { value: 'Planned', label: 'Planned', color: '#9e9e9e' },
        { value: 'Active', label: 'Active', color: '#4caf50' },
        { value: 'Done', label: 'Done', color: '#2196f3' },
        { value: 'Cancelled', label: 'Cancelled', color: '#f44336' },
    ],
    'story': [
        { value: 'Backlog', label: 'Backlog', color: '#9e9e9e' },
        { value: 'Refining', label: 'Refining', color: '#ce93d8' },
        { value: 'Ready', label: 'Ready', color: '#2196f3' },
        { value: 'In-Progress', label: 'In-Progress', color: '#ff9800' },
        { value: 'Done', label: 'Done', color: '#4caf50' },
        { value: 'Deferred', label: 'Deferred', color: '#795548' },
        { value: 'Out-of-Scope', label: 'Out-of-Scope', color: '#607d8b' },
    ],
    'business-analysis': [
        { value: 'Draft', label: 'Draft', color: '#9e9e9e' },
        { value: 'Active', label: 'Active', color: '#4caf50' },
        { value: 'Deprecated', label: 'Deprecated', color: '#ff9800' },
    ],
    'ba-increment': [
        { value: 'Proposed', label: 'Proposed', color: '#9e9e9e' },
        { value: 'Approved', label: 'Approved', color: '#2196f3' },
        { value: 'Done', label: 'Done', color: '#4caf50' },
        { value: 'Rejected', label: 'Rejected', color: '#f44336' },
    ],
    'dev-plan': [
        { value: 'Draft', label: 'Draft', color: '#9e9e9e' },
        { value: 'In-Progress', label: 'In-Progress', color: '#ff9800' },
        { value: 'Implemented', label: 'Implemented', color: '#4caf50' },
        { value: 'Blocked', label: 'Blocked', color: '#f44336' },
    ],
    'solution-design': [
        { value: 'Draft', label: 'Draft', color: '#9e9e9e' },
        { value: 'Active', label: 'Active', color: '#4caf50' },
        { value: 'Deprecated', label: 'Deprecated', color: '#ff9800' },
    ],
    'sd-increment': [
        { value: 'Proposed', label: 'Proposed', color: '#9e9e9e' },
        { value: 'Approved', label: 'Approved', color: '#2196f3' },
        { value: 'Done', label: 'Done', color: '#4caf50' },
        { value: 'Rejected', label: 'Rejected', color: '#f44336' },
    ],
    'technical-architecture': [
        { value: 'Draft', label: 'Draft', color: '#9e9e9e' },
        { value: 'Active', label: 'Active', color: '#4caf50' },
        { value: 'Deprecated', label: 'Deprecated', color: '#ff9800' },
    ],
    'ta-increment': [
        { value: 'Proposed', label: 'Proposed', color: '#9e9e9e' },
        { value: 'Approved', label: 'Approved', color: '#2196f3' },
        { value: 'Done', label: 'Done', color: '#4caf50' },
        { value: 'Rejected', label: 'Rejected', color: '#f44336' },
    ],
    'test-case': [
        { value: 'Draft', label: 'Draft', color: '#9e9e9e' },
        { value: 'Active', label: 'Active', color: '#4caf50' },
        { value: 'Deprecated', label: 'Deprecated', color: '#ff9800' },
    ],
    'regression-test': [
        { value: 'Draft', label: 'Draft', color: '#9e9e9e' },
        { value: 'Active', label: 'Active', color: '#4caf50' },
        { value: 'Deprecated', label: 'Deprecated', color: '#ff9800' },
    ],
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get valid status options for an artifact type.
 * Returns empty array for unknown types.
 */
export function getStatusOptions(artifactType: ArtifactType | string): StatusConfig[] {
    return STATUS_OPTIONS[artifactType as ArtifactType] || [];
}

/**
 * Get just the status values (strings) for an artifact type.
 */
export function getStatusValues(artifactType: ArtifactType | string): string[] {
    return getStatusOptions(artifactType).map(s => s.value);
}

/**
 * Validate if a status is valid for an artifact type.
 */
export function isValidStatus(artifactType: ArtifactType | string, status: string): boolean {
    const validStatuses = getStatusValues(artifactType);
    return validStatuses.includes(status);
}

/**
 * Get the color for a specific status of an artifact type.
 * Returns default gray if not found.
 */
export function getStatusColor(artifactType: ArtifactType | string, status: string): string {
    const options = getStatusOptions(artifactType);
    const found = options.find(s => s.value === status);
    return found?.color || '#9e9e9e';
}

/**
 * Get all valid statuses as a formatted string (for error messages).
 */
export function getValidStatusesString(artifactType: ArtifactType | string): string {
    return getStatusValues(artifactType).join(', ');
}
