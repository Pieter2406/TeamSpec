import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Chip,
    Typography,
    Box,
    CircularProgress,
    Paper,
    Badge,
} from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import DescriptionIcon from '@mui/icons-material/Description';
import { Artifact } from '../api/artifacts';

interface ArtifactListProps {
    title: string;
    artifacts: Artifact[];
    loading?: boolean;
    error?: string;
    onSelect: (artifact: Artifact) => void;
    emptyMessage?: string;
    icon?: 'folder' | 'document';
}

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
    Approved: { bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', color: 'white' },
    Proposed: { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' },
    Draft: { bg: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', color: '#7c3d0a' },
    Done: { bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', color: 'white' },
    'In Progress': { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' },
    Backlog: { bg: '#e2e8f0', color: '#475569' },
};

export function ArtifactList({
    title,
    artifacts,
    loading,
    error,
    onSelect,
    emptyMessage = 'No artifacts found',
    icon = 'folder',
}: ArtifactListProps) {
    const IconComponent = icon === 'folder' ? FolderOpenIcon : DescriptionIcon;

    if (loading) {
        return (
            <Paper className="artifact-section" elevation={0}>
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <CircularProgress size={32} sx={{ color: '#667eea' }} />
                </Box>
            </Paper>
        );
    }

    if (error) {
        return (
            <Paper className="artifact-section" elevation={0}>
                <Box sx={{ p: 3 }}>
                    <Typography color="error">{error}</Typography>
                </Box>
            </Paper>
        );
    }

    return (
        <Paper className="artifact-section" elevation={0}>
            <Box className="artifact-section-header" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                    <IconComponent sx={{ color: 'white', fontSize: 20 }} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        {title}
                    </Typography>
                </Box>
                <Badge
                    badgeContent={artifacts.length}
                    sx={{
                        '& .MuiBadge-badge': {
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontWeight: 600,
                        },
                    }}
                />
            </Box>

            {artifacts.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                        {emptyMessage}
                    </Typography>
                </Box>
            ) : (
                <List sx={{ py: 0 }}>
                    {artifacts.map((artifact, index) => (
                        <ListItem
                            key={artifact.id}
                            disablePadding
                            className="artifact-item"
                            sx={{
                                borderBottom: index < artifacts.length - 1 ? '1px solid #f1f5f9' : 'none',
                            }}
                        >
                            <ListItemButton
                                onClick={() => onSelect(artifact)}
                                sx={{ py: 2, px: 3 }}
                            >
                                <ListItemText
                                    primary={
                                        <Typography
                                            sx={{
                                                fontWeight: 600,
                                                color: '#1e293b',
                                                fontSize: '0.95rem',
                                            }}
                                        >
                                            {artifact.title}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: '#64748b',
                                                fontFamily: 'monospace',
                                                fontSize: '0.8rem',
                                                mt: 0.5,
                                            }}
                                        >
                                            {artifact.id}
                                        </Typography>
                                    }
                                />
                                {artifact.status && (
                                    <Chip
                                        label={artifact.status}
                                        size="small"
                                        sx={{
                                            background: STATUS_STYLES[artifact.status]?.bg || '#e2e8f0',
                                            color: STATUS_STYLES[artifact.status]?.color || '#475569',
                                            fontWeight: 600,
                                            fontSize: '0.75rem',
                                            border: 'none',
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
