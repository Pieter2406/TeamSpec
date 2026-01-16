/**
 * BATree Component
 * 
 * Displays hierarchical BA artifact relationships using MUI TreeView:
 * BA → BAIs (Business Analysis Increments)
 * 
 * Simpler than ArtifactTree since BA hierarchy is only 2 levels deep.
 */

import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Skeleton, CircularProgress } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import {
    BARelationshipsResponse,
    BAIInfo,
    getBARelationships,
} from '../api/artifacts';
import { getArtifactIcon } from '../utils/artifactIcons';

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

// ============================================================================
// Status Colors
// ============================================================================

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    active: { bg: '#dcfce7', text: '#166534' },
    draft: { bg: '#fef9c3', text: '#854d0e' },
    planned: { bg: '#e0e7ff', text: '#3730a3' },
    deprecated: { bg: '#fee2e2', text: '#991b1b' },
    done: { bg: '#d1fae5', text: '#065f46' },
    default: { bg: '#f1f5f9', text: '#475569' },
};

function getStatusColor(status?: string) {
    const normalizedStatus = status?.toLowerCase() || 'default';
    return STATUS_COLORS[normalizedStatus] || STATUS_COLORS.default;
}

// ============================================================================
// Tree Node Label Component
// ============================================================================

interface NodeLabelProps {
    icon: React.ReactNode;
    title: string;
    status?: string;
    badge?: string;
}

function NodeLabel({ icon, title, status, badge }: NodeLabelProps) {
    const statusColor = getStatusColor(status);

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
            {status && (
                <Typography
                    variant="caption"
                    sx={{
                        px: 0.75,
                        py: 0.25,
                        borderRadius: 0.5,
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        bgcolor: statusColor.bg,
                        color: statusColor.text,
                    }}
                >
                    {status}
                </Typography>
            )}
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
        return (
            <TreeItem
                key={`bai-${bai.id}`}
                itemId={`bai-${bai.id}`}
                label={
                    <ClickableLabel nodeData={nodeData}>
                        <NodeLabel
                            icon={<BAIIcon sx={{ fontSize: 16, color: baiIconConfig.color }} />}
                            title={bai.title}
                            status={bai.status}
                            badge={bai.project}
                        />
                    </ClickableLabel>
                }
            />
        );
    };

    const baNodeData = buildNodeData('ba', ba.id, ba.title, ba.path, ba.status);

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
                                status={ba.status}
                                badge={`${baIncrements.length} BAIs`}
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
