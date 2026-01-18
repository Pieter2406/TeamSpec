/**
 * QATree Component
 *
 * Displays hierarchical QA artifact relationships using MUI TreeView:
 * Feature Increment → Test Cases (linked by naming convention)
 * Feature → Regression Tests (linked by naming convention)
 *
 * Story: s-e009-004 (QA Dashboard)
 * Feature: f-TSV-002 (Role-specific dashboards)
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography, Skeleton, CircularProgress } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import {
    getTestCases,
    getRegressionTests,
    Artifact,
    ScopedArtifactsResponse,
    updateArtifactStatus,
} from '../api/artifacts';
import { getArtifactIcon } from '../utils/artifactIcons';
import { StatusDropdown } from './StatusDropdown';
import { TBDIndicator } from './TBDIndicator';
import { useToast } from '../contexts/ToastContext';
import { isTerminalState, getStatePriority } from '../constants/stateOrdering';

// ============================================================================
// Status State Types
// ============================================================================

interface NodeStatusState {
    [path: string]: {
        status: string;
        loading: boolean;
    };
}

// ============================================================================
// Types
// ============================================================================

export interface QATreeNodeData {
    type: 'feature-increment' | 'feature' | 'test-case' | 'regression-test';
    id: string;
    title: string;
    status?: string;
    path: string;
    project?: string;
}

interface QATreeProps {
    /** The parent artifact (Feature Increment or Feature) */
    parentArtifact: Artifact;
    /** Type of tree: 'fi' for Feature Increment → Test Cases, 'feature' for Feature → Regression Tests */
    treeType: 'fi' | 'feature';
    /** Callback when a node is selected */
    onNodeSelect?: (node: QATreeNodeData) => void;
    /** Show completed/terminal artifacts. Defaults to true. */
    showCompleted?: boolean;
    /** Project ID for test cases, Product ID for regression tests */
    scopeId: string;
    /** Callback after successful status update */
    onStatusUpdate?: () => void;
}

// ============================================================================
// Tree Node Label Component
// ============================================================================

interface NodeLabelProps {
    icon: React.ReactNode;
    title: string;
    badge?: string;
    statusElement?: React.ReactNode;
    hasTBD?: boolean;
}

function NodeLabel({ icon, title, badge, statusElement, hasTBD }: NodeLabelProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                py: 0.5,
            }}
        >
            <Box sx={{ color: '#64748b', display: 'flex', alignItems: 'center' }}>
                {icon}
            </Box>
            <Typography
                variant="body2"
                sx={{
                    fontWeight: 500,
                    color: '#1e293b',
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}
            >
                {title}
            </Typography>
            <TBDIndicator show={hasTBD ?? false} size="small" />
            {badge && (
                <Typography
                    variant="caption"
                    sx={{
                        px: 0.75,
                        py: 0.25,
                        borderRadius: 0.5,
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        bgcolor: '#f1f5f9',
                        color: '#64748b',
                    }}
                >
                    {badge}
                </Typography>
            )}
            {statusElement}
        </Box>
    );
}

// ============================================================================
// Main QATree Component
// ============================================================================

export function QATree({
    parentArtifact,
    treeType,
    onNodeSelect,
    showCompleted = true,
    scopeId,
    onStatusUpdate,
}: QATreeProps) {
    const [childArtifacts, setChildArtifacts] = useState<Artifact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [statusStates, setStatusStates] = useState<NodeStatusState>({});
    const { showError } = useToast();

    // Get icon configurations based on tree type
    const parentIconConfig = getArtifactIcon(treeType === 'fi' ? 'feature-increment' : 'feature');
    const ParentIcon = parentIconConfig.icon;
    const childIconConfig = getArtifactIcon(treeType === 'fi' ? 'test-case' : 'regression-test');
    const ChildIcon = childIconConfig.icon;

    // Filter and sort helper
    const filterAndSort = useCallback((items: Artifact[]): Artifact[] => {
        const filtered = showCompleted
            ? items
            : items.filter(item => !isTerminalState(item.status || ''));
        return [...filtered].sort((a, b) => {
            const priorityA = getStatePriority(a.status || '');
            const priorityB = getStatePriority(b.status || '');
            if (priorityA !== priorityB) return priorityA - priorityB;
            return a.title.localeCompare(b.title);
        });
    }, [showCompleted]);

    // Fetch child artifacts based on tree type
    useEffect(() => {
        if (!parentArtifact) return;

        setLoading(true);
        setError(null);

        const fetchArtifacts = treeType === 'fi' ? getTestCases : getRegressionTests;

        fetchArtifacts(scopeId)
            .then((response: ScopedArtifactsResponse) => {
                const parentId = parentArtifact.id.replace(/\.md$/, '');

                let relevantArtifacts: Artifact[] = [];
                if (treeType === 'fi') {
                    // Test cases pattern: tc-fi-TSV-001-xxx matches fi-TSV-001
                    // Extract FI ID: fi-TSV-001 → TSV-001
                    const fiMatch = parentId.match(/^fi-([A-Z]+-\d+)/i);
                    if (fiMatch) {
                        const fiPrefix = fiMatch[1];
                        relevantArtifacts = response.artifacts.filter(tc => {
                            const tcId = tc.id.replace(/\.md$/, '');
                            return tcId.includes(`fi-${fiPrefix}`);
                        });
                    }
                } else {
                    // Regression tests pattern: rt-f-TSV-001-xxx matches f-TSV-001
                    // Extract Feature ID: f-TSV-001 → TSV-001
                    const fMatch = parentId.match(/^f-([A-Z]+-\d+)/i);
                    if (fMatch) {
                        const fPrefix = fMatch[1];
                        relevantArtifacts = response.artifacts.filter(rt => {
                            const rtId = rt.id.replace(/\.md$/, '');
                            return rtId.includes(`f-${fPrefix}`);
                        });
                    }
                }

                setChildArtifacts(relevantArtifacts);
                // Auto-expand parent node
                setExpandedItems([`parent-${parentArtifact.id}`]);
            })
            .catch(err => {
                setError(err.message);
                showError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [parentArtifact, treeType, scopeId, showError]);

    // Build node data for click handlers
    const buildNodeData = useCallback((
        type: QATreeNodeData['type'],
        id: string,
        title: string,
        path: string,
        status?: string,
        project?: string
    ): QATreeNodeData => ({
        type,
        id,
        title,
        path,
        status,
        project,
    }), []);

    // Handle label click - opens full reader
    const handleLabelClick = useCallback((nodeData: QATreeNodeData, event: React.MouseEvent) => {
        event.stopPropagation();
        if (onNodeSelect) {
            onNodeSelect(nodeData);
        }
    }, [onNodeSelect]);

    // Handle status change (s-e009-007)
    const handleStatusChange = useCallback(async (
        path: string,
        _artifactType: string,
        currentStatus: string,
        newStatus: string
    ) => {
        // Optimistic update
        setStatusStates(prev => ({
            ...prev,
            [path]: { status: newStatus, loading: true },
        }));

        try {
            const result = await updateArtifactStatus(path, newStatus);

            if (result.success) {
                setStatusStates(prev => ({
                    ...prev,
                    [path]: { status: newStatus, loading: false },
                }));
                if (onStatusUpdate) {
                    onStatusUpdate();
                }
            } else {
                setStatusStates(prev => ({
                    ...prev,
                    [path]: { status: currentStatus, loading: false },
                }));
                showError(result.error || 'Failed to update status');
            }
        } catch (err) {
            setStatusStates(prev => ({
                ...prev,
                [path]: { status: currentStatus, loading: false },
            }));
            showError('Network error: Failed to update status');
        }
    }, [showError, onStatusUpdate]);

    // Get effective status (from local state or original)
    const getEffectiveStatus = useCallback((path: string, originalStatus?: string) => {
        return statusStates[path]?.status || originalStatus || '';
    }, [statusStates]);

    // Check if loading
    const isStatusLoading = useCallback((path: string) => {
        return statusStates[path]?.loading || false;
    }, [statusStates]);

    // Filter and sort children
    const visibleChildren = useMemo(() => {
        return filterAndSort(childArtifacts);
    }, [childArtifacts, filterAndSort]);

    // Loading state
    if (loading) {
        return (
            <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CircularProgress size={16} />
                    <Typography variant="body2" color="text.secondary">
                        Loading {treeType === 'fi' ? 'test cases' : 'regression tests'}...
                    </Typography>
                </Box>
                <Skeleton variant="rounded" height={32} sx={{ mb: 1 }} />
                <Skeleton variant="rounded" height={32} sx={{ mb: 1, ml: 3 }} />
                <Skeleton variant="rounded" height={32} sx={{ ml: 3 }} />
            </Box>
        );
    }

    // Error state
    if (error) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography variant="body2" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    // Clickable label wrapper
    const ClickableLabel = ({ nodeData, children }: { nodeData: QATreeNodeData; children: React.ReactNode }) => (
        <Box
            component="span"
            onClick={(e) => handleLabelClick(nodeData, e)}
            sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                flex: 1,
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
                borderRadius: 0.5,
                px: 0.5,
                mx: -0.5,
            }}
        >
            {children}
        </Box>
    );

    // Build parent node data
    const parentNodeData = buildNodeData(
        treeType === 'fi' ? 'feature-increment' : 'feature',
        parentArtifact.id,
        parentArtifact.title,
        parentArtifact.path,
        parentArtifact.status
    );

    const childTypeName = treeType === 'fi' ? 'test case' : 'regression test';

    return (
        <Box sx={{ p: 1 }}>
            <SimpleTreeView
                expandedItems={expandedItems}
                onExpandedItemsChange={(_, items) => setExpandedItems(items)}
                sx={{
                    '& .MuiTreeItem-content': {
                        borderRadius: 1,
                        '&:hover': {
                            bgcolor: '#f1f5f9',
                        },
                    },
                    '& .MuiTreeItem-label': {
                        fontSize: '0.875rem',
                    },
                }}
            >
                {/* Parent Node (FI or Feature) */}
                <TreeItem
                    itemId={`parent-${parentArtifact.id}`}
                    label={
                        <ClickableLabel nodeData={parentNodeData}>
                            <NodeLabel
                                icon={<ParentIcon sx={{ fontSize: 18, color: parentIconConfig.color }} />}
                                title={parentArtifact.title}
                                badge={`${visibleChildren.length} ${childTypeName}${visibleChildren.length !== 1 ? 's' : ''}`}
                                statusElement={
                                    parentArtifact.status && (
                                        <StatusDropdown
                                            currentStatus={getEffectiveStatus(parentArtifact.path, parentArtifact.status)}
                                            artifactType={treeType === 'fi' ? 'feature-increment' : 'feature'}
                                            onStatusChange={(newStatus) => handleStatusChange(
                                                parentArtifact.path,
                                                treeType === 'fi' ? 'feature-increment' : 'feature',
                                                getEffectiveStatus(parentArtifact.path, parentArtifact.status),
                                                newStatus
                                            )}
                                            loading={isStatusLoading(parentArtifact.path)}
                                            size="small"
                                        />
                                    )
                                }
                            />
                        </ClickableLabel>
                    }
                >
                    {/* Child Nodes (Test Cases or Regression Tests) */}
                    {visibleChildren.map((child) => {
                        const childNodeData = buildNodeData(
                            treeType === 'fi' ? 'test-case' : 'regression-test',
                            child.id,
                            child.title,
                            child.path,
                            child.status,
                            scopeId
                        );

                        return (
                            <TreeItem
                                key={child.id}
                                itemId={`child-${child.id}`}
                                label={
                                    <ClickableLabel nodeData={childNodeData}>
                                        <NodeLabel
                                            icon={<ChildIcon sx={{ fontSize: 18, color: childIconConfig.color }} />}
                                            title={child.title}
                                            statusElement={
                                                child.status && (
                                                    <StatusDropdown
                                                        currentStatus={getEffectiveStatus(child.path, child.status)}
                                                        artifactType={treeType === 'fi' ? 'test-case' : 'regression-test'}
                                                        onStatusChange={(newStatus) => handleStatusChange(
                                                            child.path,
                                                            treeType === 'fi' ? 'test-case' : 'regression-test',
                                                            getEffectiveStatus(child.path, child.status),
                                                            newStatus
                                                        )}
                                                        loading={isStatusLoading(child.path)}
                                                        size="small"
                                                    />
                                                )
                                            }
                                        />
                                    </ClickableLabel>
                                }
                            />
                        );
                    })}

                    {/* Empty state for children */}
                    {visibleChildren.length === 0 && (
                        <TreeItem
                            itemId="empty"
                            label={
                                <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic', py: 1 }}>
                                    No {childTypeName}s found
                                </Typography>
                            }
                        />
                    )}
                </TreeItem>
            </SimpleTreeView>
        </Box>
    );
}
