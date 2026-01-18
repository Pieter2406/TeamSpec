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
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { getFeatureIncrementsForFeature, Artifact } from '@/api/artifacts';

interface FeatureFIPanelProps {
    featureId: string;
    projectId?: string;
    onFIClick?: (fi: Artifact) => void;
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
    proposed: { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' },
    approved: { bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', color: 'white' },
    implemented: { bg: '#94a3b8', color: 'white' },
};

export function FeatureFIPanel({ featureId, projectId = 'teamspecviewermvp', onFIClick }: FeatureFIPanelProps) {
    const [increments, setIncrements] = useState<Artifact[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getFeatureIncrementsForFeature(featureId, projectId)
            .then((response) => {
                setIncrements(response.increments);
            })
            .catch(() => {
                setIncrements([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [featureId, projectId]);

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
                <ChangeCircleIcon sx={{ color: '#667eea', fontSize: 20 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b', flex: 1 }}>
                    Related Feature Increments
                </Typography>
                <Chip
                    label={increments.length}
                    size="small"
                    sx={{
                        bgcolor: increments.length > 0 ? '#667eea' : '#e2e8f0',
                        color: increments.length > 0 ? 'white' : '#64748b',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 22,
                    }}
                />
            </Box>

            {/* Empty state */}
            {increments.length === 0 && (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
                        No feature increments found for this feature
                    </Typography>
                </Box>
            )}

            {/* Increments list */}
            {increments.length > 0 && (
                <List sx={{ py: 0 }}>
                    {increments.map((fi, index) => (
                        <ListItem
                            key={fi.id}
                            disablePadding
                            sx={{
                                borderBottom: index < increments.length - 1 ? '1px solid #f1f5f9' : 'none',
                            }}
                        >
                            <ListItemButton
                                onClick={() => onFIClick?.(fi)}
                                sx={{ py: 1.5, px: 2 }}
                            >
                                <ListItemText
                                    primary={
                                        <Typography
                                            variant="body2"
                                            sx={{ fontWeight: 600, color: '#1e293b' }}
                                        >
                                            {fi.title}
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
                                            {fi.id}
                                        </Typography>
                                    }
                                />
                                {fi.status && (
                                    <Chip
                                        label={fi.status}
                                        size="small"
                                        sx={{
                                            background: STATUS_COLORS[fi.status.toLowerCase()]?.bg || '#e2e8f0',
                                            color: STATUS_COLORS[fi.status.toLowerCase()]?.color || '#475569',
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
