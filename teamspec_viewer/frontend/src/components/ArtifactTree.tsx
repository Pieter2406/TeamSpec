/**
 * ArtifactTree Component
 *
 * Displays hierarchical artifact relationships using MUI TreeView:
 * Feature → FIs → Epics → Stories
 *
 * Story: s-e005-002 (Artifact Tree Component)
 * Updated: s-e006-004 (ArtifactTree Status Integration)
 * Feature: f-TSV-008 (Inline Status Editing)
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography, Skeleton, CircularProgress } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import {
    FeatureRelationshipsResponse,
    FIInfo,
    EpicInfo,
    StoryInfo,
    getFeatureRelationships,
    updateArtifactStatus,
} from '../api/artifacts';
import { getArtifactIcon } from '../utils/artifactIcons';
import { StatusDropdown } from './StatusDropdown';
import { TBDIndicator } from './TBDIndicator';
import { useToast } from '../contexts/ToastContext';
import { isTerminalState, getStatePriority } from '../constants/stateOrdering';

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
    /** Show completed/terminal artifacts. Defaults to true. */
    showCompleted?: boolean;
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
// Main ArtifactTree Component
// ============================================================================

export function ArtifactTree({
    featureId,
    onNodeSelect,
    showCompleted = true,
}: ArtifactTreeProps) {
    const [relationships, setRelationships] = useState<FeatureRelationshipsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [statusStates, setStatusStates] = useState<NodeStatusState>({});
    const { showError } = useToast();

    // Filter and sort helper
    const filterAndSort = useCallback(<T extends { status?: string; title: string }>(
        items: T[]
    ): T[] => {
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

    // Filter and sort FIs (must be before early returns to satisfy Rules of Hooks)
    const visibleFIs = useMemo(() => {
        if (!relationships) return [];
        return filterAndSort(relationships.featureIncrements);
    }, [relationships, filterAndSort]);

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

    const { feature } = relationships;

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
        const effectiveStatus = getEffectiveStatus(story.path, story.status);

        return (
            <TreeItem
                key={`story-${story.id}`}
                itemId={`story-${story.id}`}
                label={
                    <ClickableLabel nodeData={nodeData}>
                        <NodeLabel
                            icon={<IconComponent sx={{ fontSize: 16, color: iconConfig.color }} />}
                            title={story.title}
                            hasTBD={story.hasTBD}
                            statusElement={
                                effectiveStatus && (
                                    <StatusDropdown
                                        artifactType="story"
                                        currentStatus={effectiveStatus}
                                        onStatusChange={(newStatus) => handleStatusChange(
                                            story.path,
                                            'story',
                                            effectiveStatus,
                                            newStatus
                                        )}
                                        loading={isStatusLoading(story.path)}
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

    // Render Epic TreeItem
    const renderEpic = (epic: EpicInfo, fiProject: string) => {
        const nodeData = buildNodeData('epic', epic.id, epic.title, epic.path, epic.status, fiProject);
        const iconConfig = getArtifactIcon('epic');
        const IconComponent = iconConfig.icon;
        const effectiveStatus = getEffectiveStatus(epic.path, epic.status);
        const visibleStories = filterAndSort(epic.stories);

        return (
            <TreeItem
                key={`epic-${epic.id}`}
                itemId={`epic-${epic.id}`}
                label={
                    <ClickableLabel nodeData={nodeData}>
                        <NodeLabel
                            icon={<IconComponent sx={{ fontSize: 16, color: iconConfig.color }} />}
                            title={epic.title}
                            badge={`${visibleStories.length} stories`}
                            hasTBD={epic.hasTBD}
                            statusElement={
                                effectiveStatus && (
                                    <StatusDropdown
                                        artifactType="epic"
                                        currentStatus={effectiveStatus}
                                        onStatusChange={(newStatus) => handleStatusChange(
                                            epic.path,
                                            'epic',
                                            effectiveStatus,
                                            newStatus
                                        )}
                                        loading={isStatusLoading(epic.path)}
                                        size="small"
                                    />
                                )
                            }
                        />
                    </ClickableLabel>
                }
            >
                {visibleStories.length > 0 ? (
                    visibleStories.map(story => renderStory(story, fiProject))
                ) : (
                    <TreeItem
                        itemId={`${epic.id}-empty-stories`}
                        label={
                            <Typography variant="body2" color="text.secondary" fontStyle="italic" sx={{ py: 0.5 }}>
                                {showCompleted ? 'No stories' : 'No active stories'}
                            </Typography>
                        }
                    />
                )}
            </TreeItem>
        );
    };

    // Render FI TreeItem
    const renderFI = (fi: FIInfo) => {
        const nodeData = buildNodeData('feature-increment', fi.id, fi.title, fi.path, fi.status, fi.project);
        const iconConfig = getArtifactIcon('feature-increment');
        const IconComponent = iconConfig.icon;
        const effectiveStatus = getEffectiveStatus(fi.path, fi.status);

        return (
            <TreeItem
                key={`fi-${fi.id}`}
                itemId={`fi-${fi.id}`}
                label={
                    <ClickableLabel nodeData={nodeData}>
                        <NodeLabel
                            icon={<IconComponent sx={{ fontSize: 16, color: iconConfig.color }} />}
                            title={fi.title}
                            badge={fi.project}
                            hasTBD={fi.hasTBD}
                            statusElement={
                                effectiveStatus && (
                                    <StatusDropdown
                                        artifactType="feature-increment"
                                        currentStatus={effectiveStatus}
                                        onStatusChange={(newStatus) => handleStatusChange(
                                            fi.path,
                                            'feature-increment',
                                            effectiveStatus,
                                            newStatus
                                        )}
                                        loading={isStatusLoading(fi.path)}
                                        size="small"
                                    />
                                )
                            }
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
    const featureEffectiveStatus = getEffectiveStatus(feature.path, feature.status);

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
                                badge={`${visibleFIs.length} FIs`}
                                hasTBD={feature.hasTBD}
                                statusElement={
                                    featureEffectiveStatus && (
                                        <StatusDropdown
                                            artifactType="feature"
                                            currentStatus={featureEffectiveStatus}
                                            onStatusChange={(newStatus) => handleStatusChange(
                                                feature.path,
                                                'feature',
                                                featureEffectiveStatus,
                                                newStatus
                                            )}
                                            loading={isStatusLoading(feature.path)}
                                            size="small"
                                        />
                                    )
                                }
                            />
                        </ClickableLabel>
                    }
                >
                    {visibleFIs.length > 0 ? (
                        visibleFIs.map(renderFI)
                    ) : (
                        <TreeItem
                            itemId={`${feature.id}-empty-fis`}
                            label={
                                <Typography variant="body2" color="text.secondary" fontStyle="italic" sx={{ py: 0.5 }}>
                                    {showCompleted ? 'No feature-increments' : 'No active feature-increments'}
                                </Typography>
                            }
                        />
                    )}
                </TreeItem>
            </SimpleTreeView>
        </Box>
    );
}
