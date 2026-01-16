/**
 * ArtifactTree Component
 * 
 * Displays hierarchical artifact relationships using MUI TreeView:
 * Feature → FIs → Epics → Stories
 * 
 * Story: s-e005-002 (Artifact Tree Component)
 * Dev Plan: dp-e005-s002
 */

import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Skeleton, CircularProgress } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import {
    FeatureRelationshipsResponse,
    FIInfo,
    EpicInfo,
    StoryInfo,
    getFeatureRelationships,
} from '../api/artifacts';
import { getArtifactIcon } from '../utils/artifactIcons';

// ============================================================================
// Types
// ============================================================================

export interface TreeNodeData {
    type: 'feature' | 'feature-increment' | 'epic' | 'story';
    id: string;
    title: string;
    status?: string;
    path: string;
    project?: string;
}

interface ArtifactTreeProps {
    featureId: string;
    onNodeSelect?: (node: TreeNodeData) => void;
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
    'in progress': { bg: '#dbeafe', text: '#1e40af' },
    ready: { bg: '#cffafe', text: '#0e7490' },
    refining: { bg: '#fef3c7', text: '#92400e' },
    backlog: { bg: '#f1f5f9', text: '#475569' },
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
// Main ArtifactTree Component
// ============================================================================

export function ArtifactTree({
    featureId,
    onNodeSelect,
}: ArtifactTreeProps) {
    const [relationships, setRelationships] = useState<FeatureRelationshipsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    // Fetch relationship tree
    useEffect(() => {
        if (!featureId) return;

        setLoading(true);
        setError(null);

        getFeatureRelationships(featureId)
            .then(data => {
                setRelationships(data);
                // Auto-expand feature node
                setExpandedItems([`feature-${data.feature.id}`]);
            })
            .catch(err => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [featureId]);

    // Build node data for click handlers
    const buildNodeData = useCallback((
        type: TreeNodeData['type'],
        id: string,
        title: string,
        path: string,
        status?: string,
        project?: string
    ): TreeNodeData => ({
        type,
        id,
        title,
        path,
        status,
        project,
    }), []);

    // Handle label click - opens full reader
    const handleLabelClick = useCallback((nodeData: TreeNodeData, event: React.MouseEvent) => {
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
                <Skeleton variant="rounded" height={32} sx={{ mb: 1, ml: 3 }} />
                <Skeleton variant="rounded" height={32} sx={{ ml: 6 }} />
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
                    Select a feature to view relationships
                </Typography>
            </Box>
        );
    }

    const { feature, featureIncrements } = relationships;

    // Clickable label wrapper
    const ClickableLabel = ({ nodeData, children }: { nodeData: TreeNodeData; children: React.ReactNode }) => (
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

    // Render Story TreeItem
    const renderStory = (story: StoryInfo, fiProject: string) => {
        const nodeData = buildNodeData('story', story.id, story.title, story.path, story.status, fiProject);
        const iconConfig = getArtifactIcon('story');
        const IconComponent = iconConfig.icon;
        return (
            <TreeItem
                key={`story-${story.id}`}
                itemId={`story-${story.id}`}
                label={
                    <ClickableLabel nodeData={nodeData}>
                        <NodeLabel
                            icon={<IconComponent sx={{ fontSize: 16, color: iconConfig.color }} />}
                            title={story.title}
                            status={story.status}
                        />
                    </ClickableLabel>
                }
            />
        );
    };

    // Render Epic TreeItem
    const renderEpic = (epic: EpicInfo, fiProject: string) => {
        const nodeData = buildNodeData('epic', epic.id, epic.title, epic.path, epic.status, fiProject);
        const iconConfig = getArtifactIcon('epic');
        const IconComponent = iconConfig.icon;
        return (
            <TreeItem
                key={`epic-${epic.id}`}
                itemId={`epic-${epic.id}`}
                label={
                    <ClickableLabel nodeData={nodeData}>
                        <NodeLabel
                            icon={<IconComponent sx={{ fontSize: 16, color: iconConfig.color }} />}
                            title={epic.title}
                            status={epic.status}
                            badge={`${epic.stories.length} stories`}
                        />
                    </ClickableLabel>
                }
            >
                {epic.stories.map(story => renderStory(story, fiProject))}
            </TreeItem>
        );
    };

    // Render FI TreeItem
    const renderFI = (fi: FIInfo) => {
        const nodeData = buildNodeData('feature-increment', fi.id, fi.title, fi.path, fi.status, fi.project);
        const iconConfig = getArtifactIcon('feature-increment');
        const IconComponent = iconConfig.icon;
        return (
            <TreeItem
                key={`fi-${fi.id}`}
                itemId={`fi-${fi.id}`}
                label={
                    <ClickableLabel nodeData={nodeData}>
                        <NodeLabel
                            icon={<IconComponent sx={{ fontSize: 16, color: iconConfig.color }} />}
                            title={fi.title}
                            status={fi.status}
                            badge={fi.project}
                        />
                    </ClickableLabel>
                }
            >
                {fi.epic && renderEpic(fi.epic, fi.project)}
            </TreeItem>
        );
    };

    const featureNodeData = buildNodeData('feature', feature.id, feature.title, feature.path, feature.status);
    const featureIconConfig = getArtifactIcon('feature');
    const FeatureIcon = featureIconConfig.icon;

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
                {/* Feature Root Node */}
                <TreeItem
                    itemId={`feature-${feature.id}`}
                    label={
                        <ClickableLabel nodeData={featureNodeData}>
                            <NodeLabel
                                icon={<FeatureIcon sx={{ fontSize: 18, color: featureIconConfig.color }} />}
                                title={feature.title}
                                status={feature.status}
                                badge={`${featureIncrements.length} FIs`}
                            />
                        </ClickableLabel>
                    }
                >
                    {featureIncrements.map(renderFI)}
                </TreeItem>
            </SimpleTreeView>
        </Box>
    );
}
