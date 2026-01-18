/**
 * BACard Component
 * 
 * Displays a single BA document as an elevated card with:
 * - BA title and status badge
 * - BAI count indicator
 * - Click handler for expansion/selection
 * 
 * Mirrors FeatureCard but for Business Analysis artifacts.
 */

import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardActionArea,
    Typography,
    Box,
    Chip,
    Skeleton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Artifact, getBABAICounts } from '@/api/artifacts';
import { getArtifactIcon } from '@/shared/utils';

// Status → Color mapping
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

interface BACardProps {
    ba: Artifact;
    isSelected?: boolean;
    isExpanded?: boolean;
    baiCount?: number;
    onClick?: () => void;
}

export function BACard({
    ba,
    isSelected = false,
    isExpanded = false,
    baiCount,
    onClick,
}: BACardProps) {
    const statusColor = getStatusColor(ba.status);

    // Get icon configurations
    const baIconConfig = getArtifactIcon('business-analysis');
    const BAIcon = baIconConfig.icon;
    const baiIconConfig = getArtifactIcon('ba-increment');
    const BAIIcon = baiIconConfig.icon;

    return (
        <Card
            sx={{
                borderRadius: 2,
                border: isSelected ? `2px solid ${baIconConfig.color}` : '1px solid #e2e8f0',
                boxShadow: isSelected
                    ? `0 4px 12px ${baIconConfig.color}40`
                    : '0 1px 3px rgba(0, 0, 0, 0.1)',
                bgcolor: isSelected ? `${baIconConfig.color}08` : 'white',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.2s ease',
                '&:hover': {
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    borderColor: '#cbd5e1',
                },
            }}
        >
            <CardActionArea onClick={onClick}>
                <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                        {/* Expand/Collapse Icon */}
                        <Box sx={{ color: '#64748b', mt: 0.25 }}>
                            {isExpanded ? (
                                <ExpandMoreIcon sx={{ fontSize: 20 }} />
                            ) : (
                                <ChevronRightIcon sx={{ fontSize: 20 }} />
                            )}
                        </Box>

                        {/* BA Icon */}
                        <Box
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 1.5,
                                bgcolor: `${baIconConfig.color}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            <BAIcon sx={{ color: baIconConfig.color, fontSize: 20 }} />
                        </Box>

                        {/* Content */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            {/* Title Row */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 600,
                                        color: '#1e293b',
                                        lineHeight: 1.3,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {ba.title}
                                </Typography>

                                {/* Status Badge */}
                                {ba.status && (
                                    <Chip
                                        label={ba.status}
                                        size="small"
                                        sx={{
                                            height: 20,
                                            fontSize: '0.7rem',
                                            fontWeight: 600,
                                            bgcolor: statusColor.bg,
                                            color: statusColor.text,
                                            borderRadius: 1,
                                        }}
                                    />
                                )}
                            </Box>

                            {/* ID and BAI Count Row */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: '#94a3b8',
                                        fontFamily: 'monospace',
                                        fontSize: '0.75rem',
                                    }}
                                >
                                    {ba.id}
                                </Typography>

                                {/* BAI Count Badge */}
                                {baiCount !== undefined && baiCount > 0 && (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            color: baiIconConfig.color,
                                        }}
                                    >
                                        <BAIIcon sx={{ fontSize: 14 }} />
                                        <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                                            {baiCount} BAI{baiCount !== 1 ? 's' : ''}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

// ============================================================================
// BACardList - Container for BA cards with BAI count loading
// ============================================================================

interface BACardListProps {
    baArtifacts: Artifact[];
    loading?: boolean;
    selectedBAId?: string;
    expandedBAId?: string;
    onBAClick?: (ba: Artifact) => void;
}

export function BACardList({
    baArtifacts,
    loading = false,
    selectedBAId,
    expandedBAId,
    onBAClick,
}: BACardListProps) {
    const [baiCounts, setBaiCounts] = useState<Record<string, number>>({});
    const [countsLoading, setCountsLoading] = useState(true);

    // Fetch BAI counts for all BA documents
    useEffect(() => {
        if (baArtifacts.length === 0) {
            setCountsLoading(false);
            return;
        }

        const baIds = baArtifacts.map(ba => ba.id);
        getBABAICounts(baIds)
            .then(response => {
                setBaiCounts(response.counts);
            })
            .catch(err => {
                console.error('Failed to fetch BAI counts:', err);
            })
            .finally(() => {
                setCountsLoading(false);
            });
    }, [baArtifacts]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[1, 2, 3].map(i => (
                    <Skeleton
                        key={i}
                        variant="rounded"
                        height={80}
                        sx={{ borderRadius: 2 }}
                    />
                ))}
            </Box>
        );
    }

    if (baArtifacts.length === 0) {
        return (
            <Box
                sx={{
                    p: 4,
                    textAlign: 'center',
                    color: '#94a3b8',
                    bgcolor: '#f8fafc',
                    borderRadius: 2,
                    border: '1px dashed #e2e8f0',
                }}
            >
                <Typography variant="body2">No business analysis documents found</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {baArtifacts.map(ba => (
                <BACard
                    key={ba.id}
                    ba={ba}
                    isSelected={selectedBAId === ba.id}
                    isExpanded={expandedBAId === ba.id}
                    baiCount={countsLoading ? undefined : baiCounts[ba.id]}
                    onClick={() => onBAClick?.(ba)}
                />
            ))}
        </Box>
    );
}
