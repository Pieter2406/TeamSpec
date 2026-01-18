/**
 * QuickViewPanel Component
 * 
 * Right-side drawer for previewing artifact details on node click.
 * Shows excerpt and metadata, double-click opens full reader.
 * 
 * Story: s-e005-004 (Tree Node Interactions)
 * Dev Plan: dp-e005-s004
 */

import { useState, useEffect } from 'react';
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Chip,
    Divider,
    Skeleton,
    Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { TreeNodeData } from '@/shared/components';
import { getArtifactContent } from '@/api/artifacts';

// ============================================================================
// Constants
// ============================================================================

const DRAWER_WIDTH = 400;
const EXCERPT_MAX_LENGTH = 800;

// Status → Color mapping
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

// Type → Icon mapping
function getTypeIcon(type: TreeNodeData['type']) {
    switch (type) {
        case 'feature':
            return <FolderIcon sx={{ color: '#3b82f6' }} />;
        case 'feature-increment':
            return <DescriptionIcon sx={{ color: '#10b981' }} />;
        case 'epic':
            return <AccountTreeIcon sx={{ color: '#8b5cf6' }} />;
        case 'story':
            return <AssignmentIcon sx={{ color: '#f59e0b' }} />;
        default:
            return <DescriptionIcon sx={{ color: '#64748b' }} />;
    }
}

// Type → Display name
function getTypeLabel(type: TreeNodeData['type']) {
    switch (type) {
        case 'feature':
            return 'Feature';
        case 'feature-increment':
            return 'Feature Increment';
        case 'epic':
            return 'Epic';
        case 'story':
            return 'Story';
        default:
            return 'Artifact';
    }
}

// ============================================================================
// Props
// ============================================================================

interface QuickViewPanelProps {
    node: TreeNodeData | null;
    open: boolean;
    onClose: () => void;
    onOpenFull: (node: TreeNodeData) => void;
}

// ============================================================================
// Component
// ============================================================================

export function QuickViewPanel({
    node,
    open,
    onClose,
    onOpenFull,
}: QuickViewPanelProps) {
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch content when node changes
    useEffect(() => {
        if (!node || !open) {
            setContent('');
            return;
        }

        setLoading(true);
        setError(null);

        getArtifactContent(node.path)
            .then(response => {
                // Extract excerpt (first N characters after frontmatter)
                let text = response.content;

                // Remove YAML frontmatter
                const frontmatterMatch = text.match(/^---\n[\s\S]*?\n---\n/);
                if (frontmatterMatch) {
                    text = text.slice(frontmatterMatch[0].length);
                }

                // Truncate to excerpt length
                if (text.length > EXCERPT_MAX_LENGTH) {
                    text = text.slice(0, EXCERPT_MAX_LENGTH) + '...';
                }

                setContent(text.trim());
            })
            .catch(err => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [node, open]);

    if (!node) return null;

    const statusColor = getStatusColor(node.status);

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiDrawer-paper': {
                    width: DRAWER_WIDTH,
                    boxSizing: 'border-box',
                },
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    p: 2,
                    borderBottom: '1px solid #e2e8f0',
                    bgcolor: '#f8fafc',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    {/* Type Icon */}
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 1.5,
                            bgcolor: 'white',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        {getTypeIcon(node.type)}
                    </Box>

                    {/* Title and Meta */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 600,
                                color: '#1e293b',
                                lineHeight: 1.3,
                                mb: 0.5,
                            }}
                        >
                            {node.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Chip
                                label={getTypeLabel(node.type)}
                                size="small"
                                sx={{
                                    height: 20,
                                    fontSize: '0.65rem',
                                    fontWeight: 600,
                                    bgcolor: '#f1f5f9',
                                    color: '#64748b',
                                }}
                            />
                            {node.status && (
                                <Chip
                                    label={node.status}
                                    size="small"
                                    sx={{
                                        height: 20,
                                        fontSize: '0.65rem',
                                        fontWeight: 600,
                                        bgcolor: statusColor.bg,
                                        color: statusColor.text,
                                    }}
                                />
                            )}
                            {node.project && (
                                <Chip
                                    label={node.project}
                                    size="small"
                                    sx={{
                                        height: 20,
                                        fontSize: '0.65rem',
                                        fontWeight: 500,
                                        bgcolor: '#dbeafe',
                                        color: '#1e40af',
                                    }}
                                />
                            )}
                        </Box>
                    </Box>

                    {/* Close Button */}
                    <IconButton size="small" onClick={onClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                {/* ID */}
                <Typography
                    variant="caption"
                    sx={{
                        display: 'block',
                        mt: 1,
                        fontFamily: 'monospace',
                        color: '#94a3b8',
                        fontSize: '0.75rem',
                    }}
                >
                    {node.id}
                </Typography>
            </Box>

            {/* Content */}
            <Box sx={{ p: 2, flex: 1, overflowY: 'auto' }}>
                {loading ? (
                    <>
                        <Skeleton variant="text" width="100%" />
                        <Skeleton variant="text" width="100%" />
                        <Skeleton variant="text" width="80%" />
                        <Skeleton variant="text" width="100%" sx={{ mt: 2 }} />
                        <Skeleton variant="text" width="90%" />
                        <Skeleton variant="text" width="70%" />
                    </>
                ) : error ? (
                    <Typography variant="body2" color="error">
                        Failed to load content: {error}
                    </Typography>
                ) : (
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#475569',
                            whiteSpace: 'pre-wrap',
                            lineHeight: 1.6,
                            fontFamily: 'inherit',
                        }}
                    >
                        {content || 'No content available'}
                    </Typography>
                )}
            </Box>

            <Divider />

            {/* Footer */}
            <Box sx={{ p: 2 }}>
                <Button
                    fullWidth
                    variant="contained"
                    startIcon={<OpenInFullIcon />}
                    onClick={() => onOpenFull(node)}
                    sx={{
                        bgcolor: '#3b82f6',
                        '&:hover': { bgcolor: '#2563eb' },
                        textTransform: 'none',
                        fontWeight: 600,
                    }}
                >
                    Open Full View
                </Button>
                <Typography
                    variant="caption"
                    sx={{
                        display: 'block',
                        mt: 1,
                        textAlign: 'center',
                        color: '#94a3b8',
                    }}
                >
                    Double-click node to open directly
                </Typography>
            </Box>
        </Drawer>
    );
}
