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
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { getProjectsForProduct, Project } from '@/api/artifacts';

interface ProjectsListProps {
    productId: string;
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
    active: { bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', color: 'white' },
    completed: { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' },
    archived: { bg: '#94a3b8', color: 'white' },
};

export function ProjectsList({ productId }: ProjectsListProps) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProjectsForProduct(productId)
            .then((response) => {
                setProjects(response.projects);
            })
            .catch(() => {
                setProjects([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [productId]);

    if (loading) {
        return (
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
                <CircularProgress size={24} sx={{ color: '#667eea' }} />
            </Paper>
        );
    }

    return (
        <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            {/* Header */}
            <Box
                sx={{
                    p: 2.5,
                    borderBottom: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <AccountTreeIcon sx={{ color: 'white', fontSize: 20 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        Targeting Projects
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Projects implementing changes to this product
                    </Typography>
                </Box>
                <Chip
                    label={projects.length}
                    size="small"
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        fontWeight: 600,
                    }}
                />
            </Box>

            {/* Empty state */}
            {projects.length === 0 && (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography sx={{ color: '#64748b', fontStyle: 'italic' }}>
                        No active projects targeting this product
                    </Typography>
                </Box>
            )}

            {/* Projects list */}
            {projects.length > 0 && (
                <List sx={{ py: 0 }}>
                    {projects.map((project, index) => (
                        <ListItem
                            key={project.id}
                            disablePadding
                            sx={{
                                borderBottom: index < projects.length - 1 ? '1px solid #f1f5f9' : 'none',
                            }}
                        >
                            <ListItemButton sx={{ py: 2, px: 3 }}>
                                <ListItemText
                                    primary={
                                        <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>
                                            {project.name}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: '#64748b',
                                                fontFamily: 'monospace',
                                                fontSize: '0.8rem',
                                            }}
                                        >
                                            {project.id} • {project.featureIncrementCount} feature increment{project.featureIncrementCount !== 1 ? 's' : ''}
                                        </Typography>
                                    }
                                />
                                <Chip
                                    label={project.status.toUpperCase()}
                                    size="small"
                                    sx={{
                                        background: STATUS_COLORS[project.status]?.bg || '#e2e8f0',
                                        color: STATUS_COLORS[project.status]?.color || '#475569',
                                        fontWeight: 600,
                                        fontSize: '0.7rem',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            )}
        </Paper>
    );
}
