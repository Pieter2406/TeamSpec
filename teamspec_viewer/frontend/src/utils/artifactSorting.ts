/**
 * Artifact Sorting and Filtering Utilities
 *
 * Provides functions for filtering and sorting artifacts by state priority.
 * 
 * Epic: TSV-007 (Dashboard Filtering and Smart State Ordering)
 * Stories: s-e007-001, s-e007-002
 * Feature-Increment: fi-TSV-007
 */

import {
    STATE_PRIORITY,
    DEFAULT_STATE_PRIORITY,
    TERMINAL_STATES,
    getStateCategory,
} from '../constants/stateOrdering';

// ============================================================================
// Types
// ============================================================================

/**
 * Minimal artifact interface for filtering/sorting.
 * Any artifact with these fields can be processed.
 */
export interface SortableArtifact {
    id: string;
    title: string;
    status?: string;
}

// ============================================================================
// Filter Functions
// ============================================================================

/**
 * Filter artifacts based on visibility of completed states.
 * When showCompleted is false, hides artifacts with terminal states
 * (done, retired, deferred, out-of-scope, archived).
 * 
 * @param artifacts Array of artifacts to filter
 * @param showCompleted Whether to show completed/terminal artifacts
 * @returns Filtered array (does not mutate original)
 */
export const filterArtifacts = <T extends SortableArtifact>(
    artifacts: T[],
    showCompleted: boolean
): T[] => {
    if (showCompleted) return artifacts;

    return artifacts.filter(artifact => {
        const normalizedStatus = artifact.status?.toLowerCase() || '';
        return !TERMINAL_STATES.includes(normalizedStatus);
    });
};

// ============================================================================
// Sort Functions
// ============================================================================

/**
 * Sort artifacts by state priority, then alphabetically by title.
 * Lower priority number = shown first (in-progress before done).
 * 
 * @param artifacts Array of artifacts to sort
 * @returns New sorted array (does not mutate original)
 */
export const sortArtifacts = <T extends SortableArtifact>(artifacts: T[]): T[] => {
    return [...artifacts].sort((a, b) => {
        // Primary sort: state priority (lower number first)
        const statusA = a.status?.toLowerCase() || '';
        const statusB = b.status?.toLowerCase() || '';
        const priorityA = STATE_PRIORITY[statusA] ?? DEFAULT_STATE_PRIORITY;
        const priorityB = STATE_PRIORITY[statusB] ?? DEFAULT_STATE_PRIORITY;

        if (priorityA !== priorityB) {
            return priorityA - priorityB;
        }

        // Secondary sort: alphabetical by title
        return (a.title || '').localeCompare(b.title || '');
    });
};

// ============================================================================
// Combined Operations
// ============================================================================

/**
 * Filter and sort artifacts in one operation.
 * First filters out terminal states (if showCompleted is false),
 * then sorts by state priority and title.
 * 
 * @param artifacts Array of artifacts to process
 * @param showCompleted Whether to show completed/terminal artifacts
 * @returns Filtered and sorted array
 */
export const filterAndSortArtifacts = <T extends SortableArtifact>(
    artifacts: T[],
    showCompleted: boolean
): T[] => {
    const filtered = filterArtifacts(artifacts, showCompleted);
    return sortArtifacts(filtered);
};

// ============================================================================
// Grouping Functions
// ============================================================================

/**
 * Group artifacts by state category for visual display.
 * Categories: "ACTIVE WORK", "WAITING", "COMPLETED", "OTHER"
 * Artifacts within each group are sorted by priority.
 * 
 * @param artifacts Array of artifacts to group
 * @returns Map of category -> sorted artifacts
 */
export const groupArtifactsByCategory = <T extends SortableArtifact>(
    artifacts: T[]
): Map<string, T[]> => {
    const groups = new Map<string, T[]>();

    // Initialize groups in order
    groups.set('ACTIVE WORK', []);
    groups.set('WAITING', []);
    groups.set('COMPLETED', []);
    groups.set('OTHER', []);

    // Sort all artifacts first, then distribute to groups
    for (const artifact of sortArtifacts(artifacts)) {
        const normalizedStatus = artifact.status?.toLowerCase() || '';
        const category = getStateCategory(normalizedStatus) || 'OTHER';
        const group = groups.get(category) || [];
        group.push(artifact);
        groups.set(category, group);
    }

    // Remove empty groups
    for (const [key, value] of groups.entries()) {
        if (value.length === 0) {
            groups.delete(key);
        }
    }

    return groups;
};

/**
 * Count artifacts by category.
 * Useful for displaying category counts without full grouping.
 * 
 * @param artifacts Array of artifacts to count
 * @returns Object with category counts
 */
export const countByCategory = <T extends SortableArtifact>(
    artifacts: T[]
): Record<string, number> => {
    const counts: Record<string, number> = {
        'ACTIVE WORK': 0,
        'WAITING': 0,
        'COMPLETED': 0,
        'OTHER': 0,
    };

    for (const artifact of artifacts) {
        const normalizedStatus = artifact.status?.toLowerCase() || '';
        const category = getStateCategory(normalizedStatus) || 'OTHER';
        counts[category]++;
    }

    return counts;
};
