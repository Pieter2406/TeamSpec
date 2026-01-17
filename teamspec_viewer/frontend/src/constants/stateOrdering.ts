/**
 * State Ordering Configuration
 *
 * Centralized state priority and grouping definitions for artifact filtering and sorting.
 * 
 * Epic: TSV-007 (Dashboard Filtering and Smart State Ordering)
 * Stories: s-e007-001, s-e007-002
 * Feature-Increment: fi-TSV-007
 */

// ============================================================================
// State Priority (lower number = higher priority, shown first)
// ============================================================================

export const STATE_PRIORITY: Record<string, number> = {
    'in-progress': 1,
    'active': 2,
    'ready': 3,
    'draft': 4,
    'proposed': 5,
    'pending': 6,
    'on-hold': 7,
    'deferred': 8,
    'out-of-scope': 9,
    'done': 10,
    'retired': 11,
    'archived': 12,
};

// ============================================================================
// State Groups (for visual categorization)
// ============================================================================

export const STATE_GROUPS = {
    'ACTIVE WORK': ['in-progress', 'active', 'ready', 'draft', 'proposed'],
    'WAITING': ['pending', 'on-hold'],
    'COMPLETED': ['deferred', 'out-of-scope', 'done', 'retired', 'archived'],
} as const;

// ============================================================================
// Terminal States (hidden when "Show Completed Artifacts" is unchecked)
// ============================================================================

export const TERMINAL_STATES: string[] = [
    'deferred',
    'out-of-scope',
    'done',
    'retired',
    'archived',
];

// ============================================================================
// Default Priority for Unknown States
// ============================================================================

export const DEFAULT_STATE_PRIORITY = 99;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get the category a state belongs to
 * @param status The status string to categorize
 * @returns The category name or null if not found
 */
export const getStateCategory = (status: string): string | null => {
    const normalizedStatus = status?.toLowerCase() || '';
    for (const [category, states] of Object.entries(STATE_GROUPS)) {
        if ((states as readonly string[]).includes(normalizedStatus)) {
            return category;
        }
    }
    return null;
};

/**
 * Check if a status is a terminal state
 * @param status The status string to check
 * @returns true if the status is terminal
 */
export const isTerminalState = (status: string): boolean => {
    const normalizedStatus = status?.toLowerCase() || '';
    return TERMINAL_STATES.includes(normalizedStatus);
};

/**
 * Get the priority of a status (lower = higher priority)
 * @param status The status string
 * @returns The priority number
 */
export const getStatePriority = (status: string): number => {
    const normalizedStatus = status?.toLowerCase() || '';
    return STATE_PRIORITY[normalizedStatus] ?? DEFAULT_STATE_PRIORITY;
};
