/**
 * DEVTree Component
 *
 * Displays hierarchical DEV artifact relationships using MUI TreeView:
 * Epic → Stories → Dev Plans
 *
 * Story: s-e009-002 (DEV Dashboard)
 * Feature: f-TSV-002 (Role-specific dashboards)
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography, Skeleton, CircularProgress } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import {
    getStories,
    getDevPlans,
    Artifact,
    ArtifactsResponse,
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

export interface DEVTreeNodeData {
    type: 'epic' | 'story' | 'dev-plan';
    id: string;
    title: string;
    status?: string;
    path: string;
    project?: string;
}

interface StoryWithDevPlans extends Artifact {
    devPlans: Artifact[];
}

interface DEVTreeProps {
    /** The epic artifact to show stories and dev plans for */
    epicArtifact: Artifact;
    /** Callback when a node is selected */
    onNodeSelect?: (node: DEVTreeNodeData) => void;
    /** Show completed/terminal artifacts. Defaults to true. */
    showCompleted?: boolean;
    /** Project ID to search for stories and dev plans */
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
                width: '100%', // Fill the label width for proper flex alignment
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
// Main DEVTree Component
// ============================================================================

export function DEVTree({
    epicArtifact,
    onNodeSelect,
    showCompleted = true,
    projectId,
    onStatusUpdate,
}: DEVTreeProps) {
    const [storiesWithDevPlans, setStoriesWithDevPlans] = useState<StoryWithDevPlans[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [statusStates, setStatusStates] = useState<NodeStatusState>({});
    const { showError } = useToast();

    // Get icon configurations
    const epicIconConfig = getArtifactIcon('epic');
    const EpicIcon = epicIconConfig.icon;
    const storyIconConfig = getArtifactIcon('story');
    const StoryIcon = storyIconConfig.icon;
    const devPlanIconConfig = getArtifactIcon('dev-plan');
    const DevPlanIcon = devPlanIconConfig.icon;

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

    // Extract epic number from epic ID (e.g., "epic-TSV-009-dev-dashboard" → "009")
    const getEpicNumber = useCallback((epicId: string): string | null => {
        const match = epicId.replace(/\.md$/, '').match(/epic-[A-Z]+-(\d+)/i);
        return match ? match[1] : null;
    }, []);

    // Extract story's epic number from story ID (e.g., "s-e009-002-..." → "009")
    const getStoryEpicNumber = useCallback((storyId: string): string | null => {
        const match = storyId.replace(/\.md$/, '').match(/^s-e(\d+)-/i);
        return match ? match[1] : null;
    }, []);

    // Extract story numbers for dev plan matching (e.g., "s-e009-002" → { epicNum: "009", storyNum: "002" })
    const getStoryNumbers = useCallback((storyId: string): { epicNum: string; storyNum: string } | null => {
        const match = storyId.replace(/\.md$/, '').match(/^s-e(\d+)-(\d+)/i);
        return match ? { epicNum: match[1], storyNum: match[2] } : null;
    }, []);

    // Fetch stories and dev plans for the epic
    useEffect(() => {
        if (!epicArtifact) return;

        setLoading(true);
        setError(null);

        const epicNum = getEpicNumber(epicArtifact.id);
        if (!epicNum) {
            setError('Could not parse epic number from: ' + epicArtifact.id);
            setLoading(false);
            return;
        }

        // Fetch both stories and dev plans in parallel
        Promise.all([
            getStories(projectId),
            getDevPlans(projectId)
        ])
            .then(([storiesResponse, devPlansResponse]: [ArtifactsResponse, ScopedArtifactsResponse]) => {
                // Filter stories that belong to this epic
                const epicStories = storiesResponse.artifacts.filter(story => {
                    const storyEpicNum = getStoryEpicNumber(story.id);
                    return storyEpicNum === epicNum;
                });

                // Deduplicate stories by ID, preferring 'done' folder over others
                const storyMap = new Map<string, Artifact>();
                epicStories.forEach(story => {
                    const existing = storyMap.get(story.id);
                    if (!existing) {
                        storyMap.set(story.id, story);
                    } else {
                        // Prefer story from 'done' folder
                        const existingIsDone = existing.path.includes('/done/');
                        const currentIsDone = story.path.includes('/done/');
                        if (currentIsDone && !existingIsDone) {
                            storyMap.set(story.id, story);
                        }
                    }
                });
                const uniqueStories = Array.from(storyMap.values());

                // Match dev plans to stories
                const storiesWithPlans: StoryWithDevPlans[] = uniqueStories.map(story => {
                    const storyNums = getStoryNumbers(story.id);
                    let matchingDevPlans: Artifact[] = [];

                    if (storyNums) {
                        // Match dev plans with pattern dp-eXXX-sYYY
                        const dpPattern = new RegExp(`^dp-e${storyNums.epicNum}-s${storyNums.storyNum}`, 'i');
                        matchingDevPlans = devPlansResponse.artifacts.filter(dp =>
                            dpPattern.test(dp.id.replace(/\.md$/, ''))
                        );
                    }

                    return {
                        ...story,
                        devPlans: matchingDevPlans,
                    };
                });

                setStoriesWithDevPlans(storiesWithPlans);
                // Auto-expand epic node
                setExpandedItems([`epic-${epicArtifact.id}`]);
            })
            .catch(err => {
                setError(err.message);
                showError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [epicArtifact, projectId, getEpicNumber, getStoryEpicNumber, getStoryNumbers]);

    // Build node data for click handlers
    const buildNodeData = useCallback((
        type: DEVTreeNodeData['type'],
        id: string,
        title: string,
        path: string,
        status?: string,
        project?: string
    ): DEVTreeNodeData => ({
        type,
        id,
        title,
        path,
        status,
        project,
    }), []);

    // Handle label click - opens full reader
    const handleLabelClick = useCallback((nodeData: DEVTreeNodeData, event: React.MouseEvent) => {
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
                // Trigger parent refresh
                if (onStatusUpdate) {
                    onStatusUpdate();
                }
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
    }, [showError, onStatusUpdate]);

    // Get effective status (from local state or original)
    const getEffectiveStatus = useCallback((path: string, originalStatus?: string) => {
        return statusStates[path]?.status || originalStatus || '';
    }, [statusStates]);

    // Check if loading
    const isStatusLoading = useCallback((path: string) => {
        return statusStates[path]?.loading || false;
    }, [statusStates]);

    // Filter and sort stories (keeping dev plans)
    const visibleStories = useMemo(() => {
        const filtered = showCompleted
            ? storiesWithDevPlans
            : storiesWithDevPlans.filter(s => !isTerminalState(s.status || ''));
        return [...filtered].sort((a, b) => {
            const priorityA = getStatePriority(a.status || '');
            const priorityB = getStatePriority(b.status || '');
            if (priorityA !== priorityB) return priorityA - priorityB;
            return a.title.localeCompare(b.title);
        });
    }, [storiesWithDevPlans, showCompleted]);

    // Count total stories and dev plans
    const totalDevPlans = useMemo(() => {
        return visibleStories.reduce((sum, s) => sum + s.devPlans.length, 0);
    }, [visibleStories]);

    // Loading state
    if (loading) {
        return (
            <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CircularProgress size={16} />
                    <Typography variant="body2" color="text.secondary">
                        Loading stories and dev plans...
                    </Typography>
                </Box>
                <Skeleton variant="rounded" height={32} sx={{ mb: 1 }} />
                <Skeleton variant="rounded" height={32} sx={{ mb: 1, ml: 3 }} />
                <Skeleton variant="rounded" height={32} sx={{ mb: 1, ml: 6 }} />
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
    const ClickableLabel = ({ nodeData, children }: { nodeData: DEVTreeNodeData; children: React.ReactNode }) => (
        <Box
            onClick={(e) => handleLabelClick(nodeData, e)}
            sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                flex: 1,
                '&:hover': { textDecoration: 'underline' },
            }}
        >
            {children}
        </Box>
    );

    // Build epic node data
    const epicNodeData = buildNodeData(
        'epic',
        epicArtifact.id,
        epicArtifact.title,
        epicArtifact.path,
        epicArtifact.status
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
                {/* Epic Node */}
                <TreeItem
                    itemId={`epic-${epicArtifact.id}`}
                    label={
                        <ClickableLabel nodeData={epicNodeData}>
                            <NodeLabel
                                icon={<EpicIcon sx={{ fontSize: 18, color: epicIconConfig.color }} />}
                                title={epicArtifact.title}
                                badge={`${visibleStories.length} stories, ${totalDevPlans} dev plans`}
                                statusElement={
                                    epicArtifact.status && (
                                        <StatusDropdown
                                            currentStatus={getEffectiveStatus(epicArtifact.path, epicArtifact.status)}
                                            artifactType="epic"
                                            onStatusChange={(newStatus) => handleStatusChange(
                                                epicArtifact.path,
                                                'epic',
                                                getEffectiveStatus(epicArtifact.path, epicArtifact.status),
                                                newStatus
                                            )}
                                            loading={isStatusLoading(epicArtifact.path)}
                                            size="small"
                                        />
                                    )
                                }
                            />
                        </ClickableLabel>
                    }
                >
                    {/* Story Nodes */}
                    {visibleStories.map((story) => {
                        const storyNodeData = buildNodeData(
                            'story',
                            story.id,
                            story.title,
                            story.path,
                            story.status,
                            projectId
                        );

                        const visibleDevPlans = filterAndSort(story.devPlans);

                        return (
                            <TreeItem
                                key={story.id}
                                itemId={`story-${story.id}`}
                                label={
                                    <ClickableLabel nodeData={storyNodeData}>
                                        <NodeLabel
                                            icon={<StoryIcon sx={{ fontSize: 18, color: storyIconConfig.color }} />}
                                            title={story.title}
                                            badge={visibleDevPlans.length > 0 ? `${visibleDevPlans.length} dev plan${visibleDevPlans.length !== 1 ? 's' : ''}` : undefined}
                                            hasTBD={story.hasTBD}
                                            statusElement={
                                                story.status && (
                                                    <StatusDropdown
                                                        currentStatus={getEffectiveStatus(story.path, story.status)}
                                                        artifactType="story"
                                                        onStatusChange={(newStatus) => handleStatusChange(
                                                            story.path,
                                                            'story',
                                                            getEffectiveStatus(story.path, story.status),
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
                            >
                                {/* Dev Plan Nodes */}
                                {visibleDevPlans.map((dp) => {
                                    const dpNodeData = buildNodeData(
                                        'dev-plan',
                                        dp.id,
                                        dp.title,
                                        dp.path,
                                        dp.status,
                                        projectId
                                    );

                                    return (
                                        <TreeItem
                                            key={dp.id}
                                            itemId={`dp-${dp.id}`}
                                            label={
                                                <ClickableLabel nodeData={dpNodeData}>
                                                    <NodeLabel
                                                        icon={<DevPlanIcon sx={{ fontSize: 18, color: devPlanIconConfig.color }} />}
                                                        title={dp.title}
                                                        hasTBD={dp.hasTBD}
                                                        statusElement={
                                                            dp.status && (
                                                                <StatusDropdown
                                                                    currentStatus={getEffectiveStatus(dp.path, dp.status)}
                                                                    artifactType="dev-plan"
                                                                    onStatusChange={(newStatus) => handleStatusChange(
                                                                        dp.path,
                                                                        'dev-plan',
                                                                        getEffectiveStatus(dp.path, dp.status),
                                                                        newStatus
                                                                    )}
                                                                    loading={isStatusLoading(dp.path)}
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

                                {/* Empty state for dev plans */}
                                {visibleDevPlans.length === 0 && (
                                    <TreeItem
                                        itemId={`${story.id}-empty-dp`}
                                        label={
                                            <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic', py: 1 }}>
                                                No dev plans for this story
                                            </Typography>
                                        }
                                    />
                                )}
                            </TreeItem>
                        );
                    })}

                    {/* Empty state for stories */}
                    {visibleStories.length === 0 && (
                        <TreeItem
                            itemId="empty-stories"
                            label={
                                <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic', py: 1 }}>
                                    {showCompleted ? 'No stories found for this epic' : 'No active stories for this epic'}
                                </Typography>
                            }
                        />
                    )}
                </TreeItem>
            </SimpleTreeView>
        </Box>
    );
}
