import { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid, Alert, Breadcrumbs, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import {
    getBusinessAnalysis,
    getBusinessAnalysisIncrements,
    Artifact,
} from '../api/artifacts';
import { ArtifactList } from './ArtifactList';
import { ArtifactReader } from './ArtifactReader';

// MVP hardcoded context
const PRODUCT_ID = 'teamspec-viewer';
const PROJECT_ID = 'teamspecviewermvp';

export function BADashboard() {
    const [baArtifacts, setBaArtifacts] = useState<Artifact[]>([]);
    const [baiArtifacts, setBaiArtifacts] = useState<Artifact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);

    useEffect(() => {
        Promise.all([
            getBusinessAnalysis(PRODUCT_ID),
            getBusinessAnalysisIncrements(PROJECT_ID),
        ])
            .then(([baData, baiData]) => {
                setBaArtifacts(baData.artifacts);
                setBaiArtifacts(baiData.artifacts);
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
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
                        Product: <strong>{PRODUCT_ID}</strong> &bull; Project: <strong>{PROJECT_ID}</strong>
                    </Typography>
                </Box>

                {/* Error Alert */}
                {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Artifact Grid */}
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <ArtifactList
                            title="Business Analysis"
                            artifacts={baArtifacts}
                            loading={loading}
                            onSelect={setSelectedArtifact}
                            icon="document"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <ArtifactList
                            title="Business Analysis Increments"
                            artifacts={baiArtifacts}
                            loading={loading}
                            onSelect={setSelectedArtifact}
                            icon="document"
                        />
                    </Grid>
                </Grid>

                {/* Artifact Reader Drawer */}
                <ArtifactReader
                    artifact={selectedArtifact}
                    onClose={() => setSelectedArtifact(null)}
                />
            </Container>
        </Box>
    );
}
