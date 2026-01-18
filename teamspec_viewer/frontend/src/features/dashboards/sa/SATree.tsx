/**
 * SATree Component
 *
 * Displays hierarchical SA artifact relationships using MUI TreeView:
 * SD → SDI (Solution Design → Increments)
 * TA → TAI (Technical Architecture → Increments)
 *
 * Story: s-e009-003 (SA Dashboard)
 * Feature: f-TSV-002 (Role-specific dashboards)
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography, Skeleton, CircularProgress } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import {
    getSDIncrements,
    getTAIncrements,
    Artifact,
    ScopedArtifactsResponse,
    updateArtifactStatus,
} from '@/api/artifacts';
import { getArtifactIcon } from '@/shared/utils';
import { StatusDropdown, TBDIndicator } from '@/shared/components';
import { useToast } from '@/shared/contexts';
import { isTerminalState, getStatePriority } from '@/shared/constants';

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

export interface SATreeNodeData {
    type: 'sd' | 'sdi' | 'ta' | 'tai';
    id: string;
    title: string;
    status?: string;
    path: string;
    project?: string;
}

interface SATreeProps {
    /** The parent artifact (SD or TA) */
    parentArtifact: Artifact;
    /** Type of tree: 'sd' for Solution Design, 'ta' for Technical Architecture */
    treeType: 'sd' | 'ta';
    /** Callback when a node is selected */
    onNodeSelect?: (node: SATreeNodeData) => void;
    /** Show completed/terminal artifacts. Defaults to true. */
    showCompleted?: boolean;
    /** Project ID to search for increments */
    projectId: string;
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
// Main SATree Component
// ============================================================================

export function SATree({
    parentArtifact,
    treeType,
    onNodeSelect,
    showCompleted = true,
    projectId,
    onStatusUpdate,
}: SATreeProps) {
    const [increments, setIncrements] = useState<Artifact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [statusStates, setStatusStates] = useState<NodeStatusState>({});
    const { showError } = useToast();

    // Get icon configurations based on tree type
    const parentIconConfig = getArtifactIcon(treeType === 'sd' ? 'solution-design' : 'technical-architecture');
    const ParentIcon = parentIconConfig.icon;
    const incrementIconConfig = getArtifactIcon(treeType === 'sd' ? 'sd-increment' : 'ta-increment');
    const IncrementIcon = incrementIconConfig.icon;

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

    // Fetch increments based on tree type
    useEffect(() => {
        if (!parentArtifact) return;

        setLoading(true);
        setError(null);

        const fetchIncrements = treeType === 'sd' ? getSDIncrements : getTAIncrements;

        fetchIncrements(projectId)
            .then((response: ScopedArtifactsResponse) => {
                // Filter increments that reference this parent artifact
                const parentId = parentArtifact.id.replace(/\.md$/, '');
                const relevantIncrements = response.artifacts.filter(inc => {
                    // Match by prefix pattern: sdi-TSV-001 matches sd-TSV-001
                    const incId = inc.id.replace(/\.md$/, '');
                    const parentPrefix = parentId.replace(/^(sd|ta)-/, '');
                    const incPrefix = incId.replace(/^(sdi|tai)-/, '');
                    return incPrefix.startsWith(parentPrefix.split('-').slice(0, 2).join('-'));
                });
                setIncrements(relevantIncrements);
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
    }, [parentArtifact, treeType, projectId, showError]);

    // Build node data for click handlers
    const buildNodeData = useCallback((
        type: SATreeNodeData['type'],
        id: string,
        title: string,
        path: string,
        status?: string,
        project?: string
    ): SATreeNodeData => ({
        type,
        id,
        title,
        path,
        status,
        project,
    }), []);

    // Handle label click - opens full reader
    const handleLabelClick = useCallback((nodeData: SATreeNodeData, event: React.MouseEvent) => {
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

    // Filter and sort increments
    const visibleIncrements = useMemo(() => {
        return filterAndSort(increments);
    }, [increments, filterAndSort]);

    // Loading state
    if (loading) {
        return (
            <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CircularProgress size={16} />
                    <Typography variant="body2" color="text.secondary">
                        Loading increments...
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
    const ClickableLabel = ({ nodeData, children }: { nodeData: SATreeNodeData; children: React.ReactNode }) => (
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
        treeType,
        parentArtifact.id,
        parentArtifact.title,
        parentArtifact.path,
        parentArtifact.status
    );

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
                {/* Parent Node (SD or TA) */}
                <TreeItem
                    itemId={`parent-${parentArtifact.id}`}
                    label={
                        <ClickableLabel nodeData={parentNodeData}>
                            <NodeLabel
                                icon={<ParentIcon sx={{ fontSize: 18, color: parentIconConfig.color }} />}
                                title={parentArtifact.title}
                                badge={`${visibleIncrements.length} increment${visibleIncrements.length !== 1 ? 's' : ''}`}
                                statusElement={
                                    parentArtifact.status && (
                                        <StatusDropdown
                                            currentStatus={getEffectiveStatus(parentArtifact.path, parentArtifact.status)}
                                            artifactType={treeType}
                                            onStatusChange={(newStatus) => handleStatusChange(
                                                parentArtifact.path,
                                                treeType,
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
                    {/* Increment Nodes */}
                    {visibleIncrements.map((inc) => {
                        const incNodeData = buildNodeData(
                            treeType === 'sd' ? 'sdi' : 'tai',
                            inc.id,
                            inc.title,
                            inc.path,
                            inc.status,
                            projectId
                        );

                        return (
                            <TreeItem
                                key={inc.id}
                                itemId={`inc-${inc.id}`}
                                label={
                                    <ClickableLabel nodeData={incNodeData}>
                                        <NodeLabel
                                            icon={<IncrementIcon sx={{ fontSize: 18, color: incrementIconConfig.color }} />}
                                            title={inc.title}
                                            badge={projectId}
                                            statusElement={
                                                inc.status && (
                                                    <StatusDropdown
                                                        currentStatus={getEffectiveStatus(inc.path, inc.status)}
                                                        artifactType={treeType === 'sd' ? 'sdi' : 'tai'}
                                                        onStatusChange={(newStatus) => handleStatusChange(
                                                            inc.path,
                                                            treeType === 'sd' ? 'sdi' : 'tai',
                                                            getEffectiveStatus(inc.path, inc.status),
                                                            newStatus
                                                        )}
                                                        loading={isStatusLoading(inc.path)}
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

                    {/* Empty state for increments */}
                    {visibleIncrements.length === 0 && (
                        <TreeItem
                            itemId="empty"
                            label={
                                <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic', py: 1 }}>
                                    No increments found
                                </Typography>
                            }
                        />
                    )}
                </TreeItem>
            </SimpleTreeView>
        </Box>
    );
}
