/**
 * DEVDashboard Component
 *
 * Developer role dashboard providing navigation to:
 * - Epics → Stories → Dev Plans (hierarchical tree view)
 * - Technical Architecture (TA) → TA Increments (TAI)
 *
 * Story: s-e009-002 (DEV Dashboard)
 * Feature: f-TSV-002 (Role-specific dashboards)
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box,
    Typography,
    Container,
    Grid,
    Alert,
    Breadcrumbs,
    Link,
    Paper,
    FormControlLabel,
    Checkbox,
    Tooltip,
    Tabs,
    Tab,
    Card,
    CardContent,
    CardActionArea,
    Chip,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
    getEpics,
    getTechnicalArchitecture,
    Artifact,
} from '../api/artifacts';
import { getArtifactIcon } from '../utils/artifactIcons';
import { DEVTree, DEVTreeNodeData } from './DEVTree';
import { SATree, SATreeNodeData } from './SATree';
import { ArtifactReader } from './ArtifactReader';
import { useArtifactFilter } from '../hooks/useArtifactFilter';
import { filterAndSortArtifacts } from '../utils/artifactSorting';
import { TBDIndicator } from './TBDIndicator';

// MVP hardcoded context
const PRODUCT_ID = 'teamspec-viewer';
const PROJECT_ID = 'teamspecviewermvp';

// ============================================================================
// Status Colors (Bug-009 fix: match FeatureCard pattern)
// ============================================================================

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    active: { bg: '#dcfce7', text: '#166534' },
    draft: { bg: '#fef9c3', text: '#854d0e' },
    planned: { bg: '#e0e7ff', text: '#3730a3' },
    deprecated: { bg: '#fee2e2', text: '#991b1b' },
    done: { bg: '#d1fae5', text: '#065f46' },
    'in progress': { bg: '#dbeafe', text: '#1e40af' },
    default: { bg: '#f1f5f9', text: '#475569' },
};

function getStatusColor(status?: string) {
    const normalizedStatus = status?.toLowerCase() || 'default';
    return STATUS_COLORS[normalizedStatus] || STATUS_COLORS.default;
}

// ============================================================================
// Artifact Card Component (Bug-009 fix: match FeatureCard pattern)
// ============================================================================

interface ArtifactCardProps {
    artifact: Artifact;
    isSelected: boolean;
    isExpanded: boolean;
    onClick: () => void;
    iconConfig: { icon: React.ElementType; color: string };
}

function ArtifactCard({ artifact, isSelected, isExpanded, onClick, iconConfig }: ArtifactCardProps) {
    const Icon = iconConfig.icon;
    const statusColor = getStatusColor(artifact.status);

    return (
        <Card
            sx={{
                mb: 1,
                borderRadius: 2,
                border: isExpanded ? '2px solid #10b981' : isSelected ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                boxShadow: isSelected
                    ? '0 4px 12px rgba(59, 130, 246, 0.25)'
                    : '0 1px 3px rgba(0, 0, 0, 0.1)',
                bgcolor: isExpanded ? 'rgba(16, 185, 129, 0.04)' : isSelected ? 'rgba(59, 130, 246, 0.04)' : 'white',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.2s ease',
                '&:hover': {
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    borderColor: '#10b981',
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

                        {/* Colored Icon Background */}
                        <Box
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 1.5,
                                bgcolor: `${iconConfig.color}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            <Icon sx={{ color: iconConfig.color, fontSize: 20 }} />
                        </Box>

                        {/* Content */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            {/* Title Row with Status and TBD */}
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
                                    {artifact.title}
                                </Typography>
                                <TBDIndicator show={artifact.hasTBD ?? false} size="small" />
                                {artifact.status && (
                                    <Chip
                                        label={artifact.status}
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

                            {/* ID Row */}
                            <Typography
                                variant="caption"
                                sx={{
                                    color: '#94a3b8',
                                    fontFamily: 'monospace',
                                    fontSize: '0.75rem',
                                }}
                            >
                                {artifact.id}
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

// ============================================================================
// Artifact Card List Component
// ============================================================================

interface ArtifactCardListProps {
    artifacts: Artifact[];
    loading: boolean;
    selectedId?: string;
    expandedId?: string;
    onArtifactClick: (artifact: Artifact) => void;
    iconConfig: { icon: React.ElementType; color: string };
    emptyMessage: string;
}

function ArtifactCardList({
    artifacts,
    loading,
    selectedId,
    expandedId,
    onArtifactClick,
    iconConfig,
    emptyMessage,
}: ArtifactCardListProps) {
    if (loading) {
        return (
            <Box sx={{ p: 2 }}>
                {[1, 2, 3].map((i) => (
                    <Paper
                        key={i}
                        elevation={0}
                        sx={{
                            p: 2,
                            mb: 1,
                            border: '1px solid #e2e8f0',
                            borderRadius: 2,
                            bgcolor: '#f8fafc',
                            height: 64,
                        }}
                    />
                ))}
            </Box>
        );
    }

    if (artifacts.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center', color: '#94a3b8' }}>
                <Typography variant="body2">{emptyMessage}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {artifacts.map((artifact) => (
                <ArtifactCard
                    key={artifact.id}
                    artifact={artifact}
                    isSelected={selectedId === artifact.id}
                    isExpanded={expandedId === artifact.id}
                    onClick={() => onArtifactClick(artifact)}
                    iconConfig={iconConfig}
                />
            ))}
        </Box>
    );
}

// ============================================================================
// Main DEVDashboard Component
// ============================================================================

export function DEVDashboard() {
    // Tab state (0 = Epics & Dev Plans, 1 = Technical Architecture)
    const [activeTab, setActiveTab] = useState(0);

    // Epics state
    const [epics, setEpics] = useState<Artifact[]>([]);
    const [loadingEpics, setLoadingEpics] = useState(true);
    const [selectedEpicId, setSelectedEpicId] = useState<string | null>(null);
    const [expandedEpicId, setExpandedEpicId] = useState<string | null>(null);

    // Technical Architecture state
    const [taArtifacts, setTaArtifacts] = useState<Artifact[]>([]);
    const [loadingTA, setLoadingTA] = useState(true);
    const [selectedTAId, setSelectedTAId] = useState<string | null>(null);
    const [expandedTAId, setExpandedTAId] = useState<string | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [readerArtifact, setReaderArtifact] = useState<Artifact | null>(null);

    // Filter state
    const { showCompleted, setShowCompleted } = useArtifactFilter({ role: 'DEV' });

    // Icon configs
    const epicIconConfig = getArtifactIcon('epic');
    const taIconConfig = getArtifactIcon('technical-architecture');

    // Apply filtering and sorting
    const processedEpics = useMemo(
        () => filterAndSortArtifacts(epics, showCompleted),
        [epics, showCompleted]
    );
    const processedTA = useMemo(
        () => filterAndSortArtifacts(taArtifacts, showCompleted),
        [taArtifacts, showCompleted]
    );

    // Load data
    useEffect(() => {
        getEpics(PROJECT_ID)
            .then(response => setEpics(response.artifacts))
            .catch(err => setError(err.message))
            .finally(() => setLoadingEpics(false));

        getTechnicalArchitecture(PRODUCT_ID)
            .then(response => setTaArtifacts(response.artifacts))
            .catch(err => setError(err.message))
            .finally(() => setLoadingTA(false));
    }, []);

    // Handle Epic card click
    const handleEpicClick = useCallback((artifact: Artifact) => {
        if (expandedEpicId === artifact.id) {
            setExpandedEpicId(null);
            setSelectedEpicId(null);
        } else {
            setSelectedEpicId(artifact.id);
            setExpandedEpicId(artifact.id);
        }
    }, [expandedEpicId]);

    // Handle TA card click
    const handleTAClick = useCallback((artifact: Artifact) => {
        if (expandedTAId === artifact.id) {
            setExpandedTAId(null);
            setSelectedTAId(null);
        } else {
            setSelectedTAId(artifact.id);
            setExpandedTAId(artifact.id);
        }
    }, [expandedTAId]);

    // Handle DEV tree node selection
    const handleDevNodeSelect = useCallback((node: DEVTreeNodeData) => {
        const artifact: Artifact = {
            id: node.id,
            path: node.path,
            title: node.title,
            type: node.type,
            status: node.status,
        };
        setReaderArtifact(artifact);
    }, []);

    // Handle SA tree node selection
    const handleSANodeSelect = useCallback((node: SATreeNodeData) => {
        const artifact: Artifact = {
            id: node.id,
            path: node.path,
            title: node.title,
            type: node.type,
            status: node.status,
        };
        setReaderArtifact(artifact);
    }, []);

    // Get selected artifacts for tree
    const selectedEpic = processedEpics.find(a => a.id === expandedEpicId);
    const selectedTA = processedTA.find(a => a.id === expandedTAId);

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
                        DEV Dashboard
                    </Typography>
                </Breadcrumbs>

                {/* Page Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="h4"
                        sx={{ fontWeight: 800, color: '#1e293b', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                        <CodeIcon sx={{ color: '#10b981', fontSize: 32 }} />
                        Developer Dashboard
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

                {/* Tabs for Epics vs TA */}
                <Paper elevation={0} sx={{ mb: 3, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                    <Tabs
                        value={activeTab}
                        onChange={(_, newValue) => setActiveTab(newValue)}
                        sx={{
                            '& .MuiTab-root': { fontWeight: 600 },
                            borderBottom: '1px solid #e2e8f0',
                        }}
                    >
                        <Tab
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <epicIconConfig.icon sx={{ color: epicIconConfig.color }} />
                                    Epics & Dev Plans ({processedEpics.length})
                                </Box>
                            }
                        />
                        <Tab
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <taIconConfig.icon sx={{ color: taIconConfig.color }} />
                                    Technical Architecture ({processedTA.length})
                                </Box>
                            }
                        />
                    </Tabs>
                </Paper>

                {/* Main Layout */}
                <Grid container spacing={3}>
                    {/* Left Column: Artifact Cards */}
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
                                {activeTab === 0 ? (
                                    <>
                                        <epicIconConfig.icon sx={{ color: epicIconConfig.color }} />
                                        Epics
                                    </>
                                ) : (
                                    <>
                                        <taIconConfig.icon sx={{ color: taIconConfig.color }} />
                                        Technical Architecture
                                    </>
                                )}
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
                                                Toggle to show or hide artifacts with completed states (Done, Archived, etc.)
                                            </Typography>
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
                                                Show Completed
                                            </Typography>
                                        }
                                    />
                                </Tooltip>
                            </Box>

                            {activeTab === 0 ? (
                                <ArtifactCardList
                                    artifacts={processedEpics}
                                    loading={loadingEpics}
                                    selectedId={selectedEpicId || undefined}
                                    expandedId={expandedEpicId || undefined}
                                    onArtifactClick={handleEpicClick}
                                    iconConfig={epicIconConfig}
                                    emptyMessage="No epics found"
                                />
                            ) : (
                                <ArtifactCardList
                                    artifacts={processedTA}
                                    loading={loadingTA}
                                    selectedId={selectedTAId || undefined}
                                    expandedId={expandedTAId || undefined}
                                    onArtifactClick={handleTAClick}
                                    iconConfig={taIconConfig}
                                    emptyMessage="No technical architecture documents found"
                                />
                            )}
                        </Paper>
                    </Grid>

                    {/* Right Column: Tree View */}
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
                                <AccountTreeIcon sx={{ color: '#10b981' }} />
                                {activeTab === 0 ? 'Epic → Stories → Dev Plans' : 'TA → TAI Relationships'}
                            </Typography>

                            {activeTab === 0 ? (
                                selectedEpic ? (
                                    <DEVTree
                                        epicArtifact={selectedEpic}
                                        onNodeSelect={handleDevNodeSelect}
                                        showCompleted={showCompleted}
                                        projectId={PROJECT_ID}
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
                                            Select an Epic to view its Stories and Dev Plans
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                            Click an epic card on the left to expand its tree
                                        </Typography>
                                    </Box>
                                )
                            ) : (
                                selectedTA ? (
                                    <SATree
                                        parentArtifact={selectedTA}
                                        treeType="ta"
                                        onNodeSelect={handleSANodeSelect}
                                        showCompleted={showCompleted}
                                        projectId={PROJECT_ID}
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
                                            Select a Technical Architecture doc to view its increments
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                            Click a card on the left to expand its tree
                                        </Typography>
                                    </Box>
                                )
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
