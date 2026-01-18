import { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography, Container, Grid, Alert, Breadcrumbs, Link, Paper, FormControlLabel, Checkbox, Tooltip } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import {
    getFeatures,
    Artifact,
} from '@/api/artifacts';
import { FeatureCardList } from './FeatureCard';
import { ArtifactTree, TreeNodeData } from '@/shared/components';
import { ArtifactReader } from '@/features/dashboards/components';
import { FIDetailView } from './FIDetailView';
import { useArtifactFilter, filterAndSortArtifacts } from '@/shared';

// MVP hardcoded context
const PRODUCT_ID = 'teamspec-viewer';

export function FADashboard() {
    const [features, setFeatures] = useState<Artifact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Feature selection state
    const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);
    const [expandedFeatureId, setExpandedFeatureId] = useState<string | null>(null);

    // Full reader state
    const [readerArtifact, setReaderArtifact] = useState<Artifact | null>(null);
    const [fiDetailArtifact, setFiDetailArtifact] = useState<Artifact | null>(null);

    // Filter state with localStorage persistence
    const { showCompleted, setShowCompleted } = useArtifactFilter({ role: 'FA' });

    // Apply filtering and sorting to features
    const processedFeatures = useMemo(
        () => filterAndSortArtifacts(features, showCompleted),
        [features, showCompleted]
    );

    // Load features
    const [refreshKey, setRefreshKey] = useState(0);
    useEffect(() => {
        getFeatures(PRODUCT_ID)
            .then(response => {
                setFeatures(response.artifacts);
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [refreshKey]);

    // Refresh callback for status updates
    const handleStatusUpdate = useCallback(() => {
        setRefreshKey(prev => prev + 1);
    }, []);

    // Handle feature card click
    const handleFeatureClick = useCallback((feature: Artifact) => {
        if (expandedFeatureId === feature.id) {
            // Toggle off - collapse tree
            setExpandedFeatureId(null);
            setSelectedFeatureId(null);
        } else {
            // Expand tree for this feature
            setSelectedFeatureId(feature.id);
            setExpandedFeatureId(feature.id);
        }
    }, [expandedFeatureId]);

    // Handle tree node click - open full reader directly
    const handleNodeSelect = useCallback((node: TreeNodeData) => {
        // Build artifact from node
        const artifact: Artifact = {
            id: node.id,
            path: node.path,
            title: node.title,
            type: node.type,
            status: node.status,
        };

        // Open appropriate viewer
        if (node.type === 'feature-increment') {
            setFiDetailArtifact(artifact);
        } else {
            setReaderArtifact(artifact);
        }
    }, []);

    // Handle story click from FI detail view
    const handleStoryClick = useCallback((story: Artifact) => {
        setFiDetailArtifact(null);
        setReaderArtifact(story);
    }, []);

    return (
        <Box sx={{ bgcolor: '#f8fafc', minHeight: 'calc(100vh - 64px)' }}>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Breadcrumbs */}
                <Breadcrumbs sx={{ mb: 3 }}>
                    <Link
                        color="inherit"
                        href="#"
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                        <HomeIcon sx={{ fontSize: 18 }} />
                        Home
                    </Link>
                    <Typography color="text.primary" fontWeight={600}>
                        FA Dashboard
                    </Typography>
                </Breadcrumbs>

                {/* Page Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 800,
                            color: '#1e293b',
                            mb: 1,
                        }}
                    >
                        Functional Analysis Dashboard
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b' }}>
                        Product: <strong>{PRODUCT_ID}</strong> &bull; Use-Case Centric View
                    </Typography>
                </Box>

                {/* Error Alert */}
                {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Main Layout: Features + Tree */}
                <Grid container spacing={3}>
                    {/* Left Column: Feature Cards */}
                    <Grid item xs={12} md={5} lg={4}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                border: '1px solid #e2e8f0',
                                bgcolor: 'white',
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    color: '#1e293b',
                                    mb: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <AccountTreeIcon sx={{ color: '#3b82f6' }} />
                                Features
                            </Typography>

                            {/* Filter Toggle */}
                            <Box sx={{ mb: 2 }}>
                                <Tooltip
                                    title={
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                Show Completed Artifacts
                                            </Typography>
                                            <Typography variant="body2">
                                                Toggle to show or hide artifacts with completed states:
                                            </Typography>
                                            <Box component="ul" sx={{ m: 0, pl: 2, mt: 0.5, fontSize: '0.85rem' }}>
                                                <li>Done — Completed and closed</li>
                                                <li>Retired — No longer in use</li>
                                                <li>Deferred — Moved to later release</li>
                                                <li>Out-of-Scope — Explicitly excluded</li>
                                                <li>Archived — Historical reference</li>
                                            </Box>
                                        </Box>
                                    }
                                    placement="right"
                                    arrow
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={showCompleted}
                                                onChange={(e) => setShowCompleted(e.target.checked)}
                                                size="small"
                                            />
                                        }
                                        label={
                                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                                Show Completed ({features.length - processedFeatures.length} hidden)
                                            </Typography>
                                        }
                                    />
                                </Tooltip>
                            </Box>

                            <FeatureCardList
                                features={processedFeatures}
                                loading={loading}
                                selectedFeatureId={selectedFeatureId || undefined}
                                expandedFeatureId={expandedFeatureId || undefined}
                                onFeatureClick={handleFeatureClick}
                            />
                        </Paper>
                    </Grid>

                    {/* Right Column: Artifact Tree */}
                    <Grid item xs={12} md={7} lg={8}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                border: '1px solid #e2e8f0',
                                bgcolor: 'white',
                                minHeight: 400,
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    color: '#1e293b',
                                    mb: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <AccountTreeIcon sx={{ color: '#8b5cf6' }} />
                                Artifact Relationships
                            </Typography>

                            {expandedFeatureId ? (
                                <ArtifactTree
                                    featureId={expandedFeatureId}
                                    onNodeSelect={handleNodeSelect}
                                    showCompleted={showCompleted}
                                    onStatusUpdate={handleStatusUpdate}
                                />
                            ) : (
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
                                    <AccountTreeIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                                    <Typography variant="body1">
                                        Select a feature to view its artifact relationships
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                                        Click a feature card on the left to expand its tree
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                </Grid>

                {/* Artifact Reader Drawer (for non-FI artifacts) */}
                <ArtifactReader
                    artifact={readerArtifact}
                    onClose={() => setReaderArtifact(null)}
                />

                {/* FI Detail View (for feature increments with AS-IS/TO-BE tabs) */}
                <FIDetailView
                    artifact={fiDetailArtifact}
                    onClose={() => setFiDetailArtifact(null)}
                    onStoryClick={handleStoryClick}
                />
            </Container>
        </Box>
    );
}
