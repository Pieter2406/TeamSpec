import { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid, Alert, Breadcrumbs, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import {
    getFeatures,
    getFeatureIncrements,
    getEpics,
    getStories,
    Artifact,
} from '../api/artifacts';
import { ArtifactList } from './ArtifactList';
import { ArtifactReader } from './ArtifactReader';

// MVP hardcoded context
const PRODUCT_ID = 'teamspec-viewer';
const PROJECT_ID = 'teamspecviewermvp';

export function FADashboard() {
    const [features, setFeatures] = useState<Artifact[]>([]);
    const [featureIncrements, setFeatureIncrements] = useState<Artifact[]>([]);
    const [epics, setEpics] = useState<Artifact[]>([]);
    const [stories, setStories] = useState<Artifact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);

    useEffect(() => {
        Promise.all([
            getFeatures(PRODUCT_ID),
            getFeatureIncrements(PROJECT_ID),
            getEpics(PROJECT_ID),
            getStories(PROJECT_ID),
        ])
            .then(([featuresData, fiData, epicsData, storiesData]) => {
                setFeatures(featuresData.artifacts);
                setFeatureIncrements(fiData.artifacts);
                setEpics(epicsData.artifacts);
                setStories(storiesData.artifacts);
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
                    <Grid size={{ xs: 12, md: 6 }}>
                        <ArtifactList
                            title="Features"
                            artifacts={features}
                            loading={loading}
                            onSelect={setSelectedArtifact}
                            icon="folder"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <ArtifactList
                            title="Feature Increments"
                            artifacts={featureIncrements}
                            loading={loading}
                            onSelect={setSelectedArtifact}
                            icon="document"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <ArtifactList
                            title="Epics"
                            artifacts={epics}
                            loading={loading}
                            onSelect={setSelectedArtifact}
                            icon="folder"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <ArtifactList
                            title="Stories"
                            artifacts={stories}
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
