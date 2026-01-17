/**
 * useArtifactFilter Hook
 *
 * Custom React hook for managing artifact filter state with localStorage persistence.
 * Provides role-specific persistence so FA and BA dashboards maintain separate preferences.
 * 
 * Epic: TSV-007 (Dashboard Filtering and Smart State Ordering)
 * Stories: s-e007-001, s-e007-003
 * Feature-Increment: fi-TSV-007
 */

import { useState, useEffect, useCallback } from 'react';

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY_PREFIX = 'tsv_showCompleted_';

// ============================================================================
// Types
// ============================================================================

export type FilterRole = 'FA' | 'BA';

export interface UseArtifactFilterOptions {
    /** Role determines the localStorage key (FA and BA have separate preferences) */
    role: FilterRole;
    /** Default value if no stored preference exists. Defaults to true (show all). */
    defaultValue?: boolean;
}

export interface UseArtifactFilterResult {
    /** Current filter state - true means show completed artifacts */
    showCompleted: boolean;
    /** Set the filter state directly */
    setShowCompleted: (value: boolean) => void;
    /** Toggle the current filter state */
    toggleShowCompleted: () => void;
    /** Whether the preference was successfully persisted to localStorage */
    isPersisted: boolean;
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Check if localStorage is available and functional.
 * Handles private browsing mode and other restrictions.
 */
const isLocalStorageAvailable = (): boolean => {
    try {
        const testKey = '__tsv_storage_test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        return true;
    } catch {
        return false;
    }
};

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Hook to manage artifact visibility filter state with localStorage persistence.
 * 
 * @example
 * ```tsx
 * const { showCompleted, setShowCompleted, toggleShowCompleted } = useArtifactFilter({ role: 'FA' });
 * 
 * <Checkbox
 *   checked={showCompleted}
 *   onChange={(e) => setShowCompleted(e.target.checked)}
 * />
 * ```
 */
export const useArtifactFilter = ({
    role,
    defaultValue = true,
}: UseArtifactFilterOptions): UseArtifactFilterResult => {
    const storageKey = `${STORAGE_KEY_PREFIX}${role}`;
    const storageAvailable = isLocalStorageAvailable();

    // Initialize state from localStorage or default
    const [showCompleted, setShowCompletedState] = useState<boolean>(() => {
        if (!storageAvailable) {
            return defaultValue;
        }

        try {
            const stored = localStorage.getItem(storageKey);
            if (stored === null) {
                return defaultValue;
            }
            return stored === 'true';
        } catch (error) {
            console.warn('useArtifactFilter: Failed to read from localStorage:', error);
            return defaultValue;
        }
    });

    // Track if persistence is working
    const [isPersisted, setIsPersisted] = useState(storageAvailable);

    // Persist to localStorage on change
    useEffect(() => {
        if (!storageAvailable) {
            setIsPersisted(false);
            return;
        }

        try {
            localStorage.setItem(storageKey, showCompleted.toString());
            setIsPersisted(true);
        } catch (error) {
            // Could be QuotaExceededError or SecurityError
            console.warn('useArtifactFilter: Failed to persist to localStorage:', error);
            setIsPersisted(false);
        }
    }, [showCompleted, storageKey, storageAvailable]);

    // Memoized setters
    const setShowCompleted = useCallback((value: boolean) => {
        setShowCompletedState(value);
    }, []);

    const toggleShowCompleted = useCallback(() => {
        setShowCompletedState(prev => !prev);
    }, []);

    return {
        showCompleted,
        setShowCompleted,
        toggleShowCompleted,
        isPersisted,
    };
};

export default useArtifactFilter;
