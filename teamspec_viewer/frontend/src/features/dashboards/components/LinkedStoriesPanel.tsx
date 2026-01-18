import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Chip,
    Paper,
    CircularProgress,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { getLinkedStories, Artifact } from '@/api/artifacts';

interface LinkedStoriesPanelProps {
    fiId: string;
    projectId?: string;
    onStoryClick?: (story: Artifact) => void;
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
    Done: { bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', color: 'white' },
    'In Progress': { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' },
    Backlog: { bg: '#e2e8f0', color: '#475569' },
};

export function LinkedStoriesPanel({ fiId, projectId = 'teamspecviewermvp', onStoryClick }: LinkedStoriesPanelProps) {
    const [stories, setStories] = useState<Artifact[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getLinkedStories(fiId, projectId)
            .then((response) => {
                setStories(response.stories);
            })
            .catch(() => {
                setStories([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [fiId, projectId]);

    if (loading) {
        return (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
                <CircularProgress size={20} sx={{ color: '#667eea' }} />
            </Paper>
        );
    }

    return (
        <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            {/* Header */}
            <Box
                sx={{
                    p: 2,
                    borderBottom: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                }}
            >
                <AssignmentIcon sx={{ color: '#667eea', fontSize: 20 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b', flex: 1 }}>
                    Linked Stories
                </Typography>
                <Chip
                    label={stories.length}
                    size="small"
                    sx={{
                        bgcolor: stories.length > 0 ? '#667eea' : '#e2e8f0',
                        color: stories.length > 0 ? 'white' : '#64748b',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 22,
                    }}
                />
            </Box>

            {/* Empty state */}
            {stories.length === 0 && (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
                        No stories linked to this feature-increment
                    </Typography>
                </Box>
            )}

            {/* Stories list */}
            {stories.length > 0 && (
                <List sx={{ py: 0 }}>
                    {stories.map((story, index) => (
                        <ListItem
                            key={story.id}
                            disablePadding
                            sx={{
                                borderBottom: index < stories.length - 1 ? '1px solid #f1f5f9' : 'none',
                            }}
                        >
                            <ListItemButton
                                onClick={() => onStoryClick?.(story)}
                                sx={{ py: 1.5, px: 2 }}
                            >
                                <ListItemText
                                    primary={
                                        <Typography
                                            variant="body2"
                                            sx={{ fontWeight: 600, color: '#1e293b' }}
                                        >
                                            {story.title}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: '#64748b',
                                                fontFamily: 'monospace',
                                            }}
                                        >
                                            {story.id}
                                        </Typography>
                                    }
                                />
                                {story.status && (
                                    <Chip
                                        label={story.status}
                                        size="small"
                                        sx={{
                                            background: STATUS_COLORS[story.status]?.bg || '#e2e8f0',
                                            color: STATUS_COLORS[story.status]?.color || '#475569',
                                            fontWeight: 600,
                                            fontSize: '0.65rem',
                                            height: 20,
                                        }}
                                    />
                                )}
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            )}
        </Paper>
    );
}
