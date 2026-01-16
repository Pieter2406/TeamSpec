/**
 * FeatureCard Component
 * 
 * Displays a single feature as an elevated card with:
 * - Feature title and status badge
 * - FI count indicator
 * - Click handler for expansion/selection
 * 
 * Story: s-e005-001 (Feature Card Layout)
 * Dev Plan: dp-e005-s001
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
import { Artifact, getFeatureFICounts } from '../api/artifacts';
import { getArtifactIcon } from '../utils/artifactIcons';

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

interface FeatureCardProps {
    feature: Artifact;
    isSelected?: boolean;
    isExpanded?: boolean;
    fiCount?: number;
    onClick?: () => void;
}

export function FeatureCard({
    feature,
    isSelected = false,
    isExpanded = false,
    fiCount,
    onClick,
}: FeatureCardProps) {
    const statusColor = getStatusColor(feature.status);
    
    // Get icon configurations
    const featureIconConfig = getArtifactIcon('feature');
    const FeatureIcon = featureIconConfig.icon;
    const fiIconConfig = getArtifactIcon('feature-increment');
    const FIIcon = fiIconConfig.icon;

    return (
        <Card
            sx={{
                borderRadius: 2,
                border: isSelected ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                boxShadow: isSelected
                    ? '0 4px 12px rgba(59, 130, 246, 0.25)'
                    : '0 1px 3px rgba(0, 0, 0, 0.1)',
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

                        {/* Feature Icon */}
                        <Box
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 1.5,
                                bgcolor: `${featureIconConfig.color}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            <FeatureIcon sx={{ color: featureIconConfig.color, fontSize: 20 }} />
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
                                    {feature.title}
                                </Typography>

                                {/* Status Badge */}
                                {feature.status && (
                                    <Chip
                                        label={feature.status}
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

                            {/* ID and FI Count Row */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: '#94a3b8',
                                        fontFamily: 'monospace',
                                        fontSize: '0.75rem',
                                    }}
                                >
                                    {feature.id}
                                </Typography>

                                {/* FI Count Badge */}
                                {fiCount !== undefined && fiCount > 0 && (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            color: fiIconConfig.color,
                                        }}
                                    >
                                        <FIIcon sx={{ fontSize: 14 }} />
                                        <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                                            {fiCount} FI{fiCount !== 1 ? 's' : ''}
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
// FeatureCardList - Container for feature cards with FI count loading
// ============================================================================

interface FeatureCardListProps {
    features: Artifact[];
    loading?: boolean;
    selectedFeatureId?: string;
    expandedFeatureId?: string;
    onFeatureClick?: (feature: Artifact) => void;
}

export function FeatureCardList({
    features,
    loading = false,
    selectedFeatureId,
    expandedFeatureId,
    onFeatureClick,
}: FeatureCardListProps) {
    const [fiCounts, setFiCounts] = useState<Record<string, number>>({});
    const [countsLoading, setCountsLoading] = useState(true);

    // Fetch FI counts for all features
    useEffect(() => {
        if (features.length === 0) {
            setCountsLoading(false);
            return;
        }

        const featureIds = features.map(f => f.id);
        getFeatureFICounts(featureIds)
            .then(response => {
                setFiCounts(response.counts);
            })
            .catch(err => {
                console.error('Failed to fetch FI counts:', err);
            })
            .finally(() => {
                setCountsLoading(false);
            });
    }, [features]);

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

    if (features.length === 0) {
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
                <Typography variant="body2">No features found</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {features.map(feature => (
                <FeatureCard
                    key={feature.id}
                    feature={feature}
                    isSelected={selectedFeatureId === feature.id}
                    isExpanded={expandedFeatureId === feature.id}
                    fiCount={countsLoading ? undefined : fiCounts[feature.id]}
                    onClick={() => onFeatureClick?.(feature)}
                />
            ))}
        </Box>
    );
}
