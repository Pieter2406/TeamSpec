import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Container, Grid, Alert, Breadcrumbs, Link, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import {
    getBusinessAnalysis,
    Artifact,
} from '../api/artifacts';
import { getArtifactIcon } from '../utils/artifactIcons';
import { BACardList } from './BACard';
import { BATree, BATreeNodeData } from './BATree';
import { ArtifactReader } from './ArtifactReader';

// MVP hardcoded context
const PRODUCT_ID = 'teamspec-viewer';

export function BADashboard() {
    // Get icon configurations
    const baIconConfig = getArtifactIcon('business-analysis');
    const BAIcon = baIconConfig.icon;
    const [baArtifacts, setBaArtifacts] = useState<Artifact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // BA selection state
    const [selectedBAId, setSelectedBAId] = useState<string | null>(null);
    const [expandedBAId, setExpandedBAId] = useState<string | null>(null);

    // Full reader state
    const [readerArtifact, setReaderArtifact] = useState<Artifact | null>(null);

    // Load BA documents
    useEffect(() => {
        getBusinessAnalysis(PRODUCT_ID)
            .then(response => {
                setBaArtifacts(response.artifacts);
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Handle BA card click
    const handleBAClick = useCallback((ba: Artifact) => {
        if (expandedBAId === ba.id) {
            // Toggle off - collapse tree
            setExpandedBAId(null);
            setSelectedBAId(null);
        } else {
            // Expand tree for this BA
            setSelectedBAId(ba.id);
            setExpandedBAId(ba.id);
        }
    }, [expandedBAId]);

    // Handle tree node click - open full reader directly
    const handleNodeSelect = useCallback((node: BATreeNodeData) => {
        // Build artifact from node
        const artifact: Artifact = {
            id: node.id,
            path: node.path,
            title: node.title,
            type: node.type === 'ba' ? 'business-analysis' : 'business-analysis-increment',
            status: node.status,
        };
        setReaderArtifact(artifact);
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
                        BA Dashboard
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
                        Business Analysis Dashboard
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

                {/* Main Layout: BA Documents + Tree */}
                <Grid container spacing={3}>
                    {/* Left Column: BA Cards */}
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
                                <BAIcon sx={{ color: baIconConfig.color }} />
                                Business Analysis
                            </Typography>
                            <BACardList
                                baArtifacts={baArtifacts}
                                loading={loading}
                                selectedBAId={selectedBAId || undefined}
                                expandedBAId={expandedBAId || undefined}
                                onBAClick={handleBAClick}
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
                                <AccountTreeIcon sx={{ color: baIconConfig.color }} />
                                Artifact Relationships
                            </Typography>

                            {expandedBAId ? (
                                <BATree
                                    baId={expandedBAId}
                                    onNodeSelect={handleNodeSelect}
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
                                        Select a BA document to view its increments
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                                        Click a BA card on the left to expand its tree
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                </Grid>

                {/* Artifact Reader Drawer */}
                <ArtifactReader
                    artifact={readerArtifact}
                    onClose={() => setReaderArtifact(null)}
                />
            </Container>
        </Box>
    );
}
