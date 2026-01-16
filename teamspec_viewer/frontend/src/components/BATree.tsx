/**
 * BATree Component
 *
 * Displays hierarchical BA artifact relationships using MUI TreeView:
 * BA → BAIs (Business Analysis Increments)
 *
 * Simpler than ArtifactTree since BA hierarchy is only 2 levels deep.
 *
 * Updated: s-e006-005 (BATree Status Integration)
 * Feature: f-TSV-008 (Inline Status Editing)
 */

import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Skeleton, CircularProgress } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import {
    BARelationshipsResponse,
    BAIInfo,
    getBARelationships,
    updateArtifactStatus,
} from '../api/artifacts';
import { getArtifactIcon } from '../utils/artifactIcons';
import { StatusDropdown } from './StatusDropdown';
import { useToast } from '../contexts/ToastContext';

// ============================================================================
// Types
// ============================================================================

export interface BATreeNodeData {
    type: 'ba' | 'bai';
    id: string;
    title: string;
    status?: string;
    path: string;
    project?: string;
}

interface BATreeProps {
    baId: string;
    onNodeSelect?: (node: BATreeNodeData) => void;
}

interface NodeStatusState {
    [path: string]: {
        status: string;
        loading: boolean;
    };
}

// ============================================================================
// Tree Node Label Component
// ============================================================================

interface NodeLabelProps {
    icon: React.ReactNode;
    title: string;
    badge?: string;
    statusElement?: React.ReactNode;
}

function NodeLabel({ icon, title, badge, statusElement }: NodeLabelProps) {
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
// Main BATree Component
// ============================================================================

export function BATree({
    baId,
    onNodeSelect,
}: BATreeProps) {
    const [relationships, setRelationships] = useState<BARelationshipsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [statusStates, setStatusStates] = useState<NodeStatusState>({});
    const { showError } = useToast();

    // Get icon configurations
    const baIconConfig = getArtifactIcon('business-analysis');
    const BAIcon = baIconConfig.icon;
    const baiIconConfig = getArtifactIcon('ba-increment');
    const BAIIcon = baiIconConfig.icon;

    // Fetch relationship tree
    useEffect(() => {
        if (!baId) return;

        setLoading(true);
        setError(null);

        getBARelationships(baId)
            .then(data => {
                setRelationships(data);
                // Auto-expand BA node
                setExpandedItems([`ba-${data.ba.id}`]);
            })
            .catch(err => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [baId]);

    // Build node data for click handlers
    const buildNodeData = useCallback((
        type: BATreeNodeData['type'],
        id: string,
        title: string,
        path: string,
        status?: string,
        project?: string
    ): BATreeNodeData => ({
        type,
        id,
        title,
        path,
        status,
        project,
    }), []);

    // Handle label click - opens full reader
    const handleLabelClick = useCallback((nodeData: BATreeNodeData, event: React.MouseEvent) => {
        // Prevent tree expand/collapse when clicking the label
        event.stopPropagation();
        if (onNodeSelect) {
            onNodeSelect(nodeData);
        }
    }, [onNodeSelect]);

    // Handle status change
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
            } else {
                // Rollback on error
                setStatusStates(prev => ({
                    ...prev,
                    [path]: { status: currentStatus, loading: false },
                }));
                showError(result.error || 'Failed to update status');
            }
        } catch (err) {
            // Rollback on network error
            setStatusStates(prev => ({
                ...prev,
                [path]: { status: currentStatus, loading: false },
            }));
            showError('Network error: Failed to update status');
        }
    }, [showError]);

    // Get effective status (from local state or original)
    const getEffectiveStatus = useCallback((path: string, originalStatus?: string) => {
        return statusStates[path]?.status || originalStatus || '';
    }, [statusStates]);

    // Check if loading
    const isStatusLoading = useCallback((path: string) => {
        return statusStates[path]?.loading || false;
    }, [statusStates]);

    // Loading state
    if (loading) {
        return (
            <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CircularProgress size={16} />
                    <Typography variant="body2" color="text.secondary">
                        Loading relationships...
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

    // No relationships
    if (!relationships) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                    Select a BA document to view relationships
                </Typography>
            </Box>
        );
    }

    const { ba, baIncrements } = relationships;

    // Clickable label wrapper
    const ClickableLabel = ({ nodeData, children }: { nodeData: BATreeNodeData; children: React.ReactNode }) => (
        <Box
            onClick={(e) => handleLabelClick(nodeData, e)}
            sx={{
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
            }}
        >
            {children}
        </Box>
    );

    // Render BAI TreeItem
    const renderBAI = (bai: BAIInfo) => {
        const nodeData = buildNodeData('bai', bai.id, bai.title, bai.path, bai.status, bai.project);
        const effectiveStatus = getEffectiveStatus(bai.path, bai.status);

        return (
            <TreeItem
                key={`bai-${bai.id}`}
                itemId={`bai-${bai.id}`}
                label={
                    <ClickableLabel nodeData={nodeData}>
                        <NodeLabel
                            icon={<BAIIcon sx={{ fontSize: 16, color: baiIconConfig.color }} />}
                            title={bai.title}
                            badge={bai.project}
                            statusElement={
                                effectiveStatus && (
                                    <StatusDropdown
                                        artifactType="ba-increment"
                                        currentStatus={effectiveStatus}
                                        onStatusChange={(newStatus) => handleStatusChange(
                                            bai.path,
                                            'ba-increment',
                                            effectiveStatus,
                                            newStatus
                                        )}
                                        loading={isStatusLoading(bai.path)}
                                        size="small"
                                    />
                                )
                            }
                        />
                    </ClickableLabel>
                }
            />
        );
    };

    const baNodeData = buildNodeData('ba', ba.id, ba.title, ba.path, ba.status);
    const baEffectiveStatus = getEffectiveStatus(ba.path, ba.status);

    return (
        <Box sx={{ p: 1 }}>
            <SimpleTreeView
                expandedItems={expandedItems}
                onExpandedItemsChange={(_event, itemIds) => setExpandedItems(itemIds)}
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
                {/* BA Root Node */}
                <TreeItem
                    itemId={`ba-${ba.id}`}
                    label={
                        <ClickableLabel nodeData={baNodeData}>
                            <NodeLabel
                                icon={<BAIcon sx={{ fontSize: 18, color: baIconConfig.color }} />}
                                title={ba.title}
                                badge={`${baIncrements.length} BAIs`}
                                statusElement={
                                    baEffectiveStatus && (
                                        <StatusDropdown
                                            artifactType="business-analysis"
                                            currentStatus={baEffectiveStatus}
                                            onStatusChange={(newStatus) => handleStatusChange(
                                                ba.path,
                                                'business-analysis',
                                                baEffectiveStatus,
                                                newStatus
                                            )}
                                            loading={isStatusLoading(ba.path)}
                                            size="small"
                                        />
                                    )
                                }
                            />
                        </ClickableLabel>
                    }
                >
                    {baIncrements.map(renderBAI)}
                </TreeItem>
            </SimpleTreeView>
        </Box>
    );
}
