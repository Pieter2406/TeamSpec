/**
 * QADashboard Component
 *
 * QA Engineer role dashboard providing navigation to:
 * - Feature Increments → Test Cases (project scope)
 * - Features → Regression Tests (product scope)
 * - Bug Reports (flat list)
 *
 * Story: s-e009-004 (QA Dashboard)
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
    Chip,
    Badge,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    CircularProgress,
    Card,
    CardContent,
    CardActionArea,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import BugReportIcon from '@mui/icons-material/BugReport';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
    getFeatureIncrements,
    getFeatures,
    getBugReports,
    Artifact,
} from '../api/artifacts';
import { getArtifactIcon } from '../utils/artifactIcons';
import { QATree, QATreeNodeData } from './QATree';
import { ArtifactReader } from './ArtifactReader';
import { useArtifactFilter } from '../hooks/useArtifactFilter';
import { filterAndSortArtifacts } from '../utils/artifactSorting';
import { TBDIndicator } from './TBDIndicator';

// MVP hardcoded context
const PRODUCT_ID = 'teamspec-viewer';
const PROJECT_ID = 'teamspecviewermvp';

// ============================================================================
// Card Status Colors (Bug-009 fix: match FeatureCard pattern)
// ============================================================================

const CARD_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    active: { bg: '#dcfce7', text: '#166534' },
    draft: { bg: '#fef9c3', text: '#854d0e' },
    planned: { bg: '#e0e7ff', text: '#3730a3' },
    approved: { bg: '#d1fae5', text: '#065f46' },
    deprecated: { bg: '#fee2e2', text: '#991b1b' },
    done: { bg: '#d1fae5', text: '#065f46' },
    'in progress': { bg: '#dbeafe', text: '#1e40af' },
    default: { bg: '#f1f5f9', text: '#475569' },
};

function getCardStatusColor(status?: string) {
    const normalizedStatus = status?.toLowerCase() || 'default';
    return CARD_STATUS_COLORS[normalizedStatus] || CARD_STATUS_COLORS.default;
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
    const statusColor = getCardStatusColor(artifact.status);

    return (
        <Card
            sx={{
                mb: 1,
                borderRadius: 2,
                border: isExpanded ? '2px solid #f59e0b' : isSelected ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                boxShadow: isSelected
                    ? '0 4px 12px rgba(59, 130, 246, 0.25)'
                    : '0 1px 3px rgba(0, 0, 0, 0.1)',
                bgcolor: isExpanded ? 'rgba(245, 158, 11, 0.04)' : isSelected ? 'rgba(59, 130, 246, 0.04)' : 'white',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.2s ease',
                '&:hover': {
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    borderColor: '#f59e0b',
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
// Bug Reports Panel Component
// ============================================================================

interface BugReportsPanelProps {
    bugs: Artifact[];
    loading: boolean;
    onBugClick: (bug: Artifact) => void;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    Open: { bg: '#fee2e2', text: '#991b1b' },
    'In Progress': { bg: '#dbeafe', text: '#1e40af' },
    Resolved: { bg: '#dcfce7', text: '#166534' },
    Closed: { bg: '#f3f4f6', text: '#374151' },
};

function BugReportsPanel({ bugs, loading, onBugClick }: BugReportsPanelProps) {
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={32} />
            </Box>
        );
    }

    if (bugs.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center', color: '#94a3b8' }}>
                <Typography variant="body2">No bug reports found</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
            <List dense sx={{ py: 0 }}>
                {bugs.map((bug) => {
                    const statusStyle = STATUS_COLORS[bug.status || ''] || { bg: '#f3f4f6', text: '#374151' };
                    return (
                        <ListItem key={bug.id} disablePadding>
                            <ListItemButton onClick={() => onBugClick(bug)} sx={{ py: 1 }}>
                                <BugReportIcon sx={{ color: '#ef4444', mr: 1.5, fontSize: 20 }} />
                                <ListItemText
                                    primary={bug.title}
                                    secondary={bug.id}
                                    primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
                                    secondaryTypographyProps={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                                />
                                {bug.status && (
                                    <Chip
                                        label={bug.status}
                                        size="small"
                                        sx={{
                                            bgcolor: statusStyle.bg,
                                            color: statusStyle.text,
                                            fontWeight: 600,
                                            fontSize: '0.7rem',
                                        }}
                                    />
                                )}
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
}

// ============================================================================
// Main QADashboard Component
// ============================================================================

export function QADashboard() {
    // Tab state (0 = FI → Test Cases, 1 = Features → Regression Tests, 2 = Bug Reports)
    const [activeTab, setActiveTab] = useState(0);

    // Feature Increments state
    const [fiArtifacts, setFiArtifacts] = useState<Artifact[]>([]);
    const [loadingFI, setLoadingFI] = useState(true);
    const [selectedFIId, setSelectedFIId] = useState<string | null>(null);
    const [expandedFIId, setExpandedFIId] = useState<string | null>(null);

    // Features state
    const [features, setFeatures] = useState<Artifact[]>([]);
    const [loadingFeatures, setLoadingFeatures] = useState(true);
    const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);
    const [expandedFeatureId, setExpandedFeatureId] = useState<string | null>(null);

    // Bug reports state
    const [bugReports, setBugReports] = useState<Artifact[]>([]);
    const [loadingBugs, setLoadingBugs] = useState(true);

    const [error, setError] = useState<string | null>(null);
    const [readerArtifact, setReaderArtifact] = useState<Artifact | null>(null);

    // Filter state
    const { showCompleted, setShowCompleted } = useArtifactFilter({ role: 'QA' });

    // Icon configs
    const fiIconConfig = getArtifactIcon('feature-increment');
    const featureIconConfig = getArtifactIcon('feature');

    // Apply filtering and sorting
    const processedFI = useMemo(
        () => filterAndSortArtifacts(fiArtifacts, showCompleted),
        [fiArtifacts, showCompleted]
    );
    const processedFeatures = useMemo(
        () => filterAndSortArtifacts(features, showCompleted),
        [features, showCompleted]
    );

    // Open bugs count
    const openBugsCount = useMemo(
        () => bugReports.filter(bug => bug.status === 'Open' || bug.status === 'In Progress').length,
        [bugReports]
    );

    // Load data
    useEffect(() => {
        getFeatureIncrements(PROJECT_ID)
            .then(response => setFiArtifacts(response.artifacts))
            .catch(err => setError(err.message))
            .finally(() => setLoadingFI(false));

        getFeatures(PRODUCT_ID)
            .then(response => setFeatures(response.artifacts))
            .catch(err => setError(err.message))
            .finally(() => setLoadingFeatures(false));

        getBugReports(PROJECT_ID)
            .then(response => setBugReports(response.artifacts))
            .catch(err => setError(err.message))
            .finally(() => setLoadingBugs(false));
    }, []);

    // Handle FI card click
    const handleFIClick = useCallback((artifact: Artifact) => {
        if (expandedFIId === artifact.id) {
            setExpandedFIId(null);
            setSelectedFIId(null);
        } else {
            setSelectedFIId(artifact.id);
            setExpandedFIId(artifact.id);
        }
    }, [expandedFIId]);

    // Handle Feature card click
    const handleFeatureClick = useCallback((artifact: Artifact) => {
        if (expandedFeatureId === artifact.id) {
            setExpandedFeatureId(null);
            setSelectedFeatureId(null);
        } else {
            setSelectedFeatureId(artifact.id);
            setExpandedFeatureId(artifact.id);
        }
    }, [expandedFeatureId]);

    // Handle tree node selection
    const handleNodeSelect = useCallback((node: QATreeNodeData) => {
        const artifact: Artifact = {
            id: node.id,
            path: node.path,
            title: node.title,
            type: node.type,
            status: node.status,
        };
        setReaderArtifact(artifact);
    }, []);

    // Handle bug click
    const handleBugClick = useCallback((bug: Artifact) => {
        setReaderArtifact(bug);
    }, []);

    // Get selected artifacts for tree
    const selectedFI = processedFI.find(a => a.id === expandedFIId);
    const selectedFeature = processedFeatures.find(a => a.id === expandedFeatureId);

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
                        QA Dashboard
                    </Typography>
                </Breadcrumbs>

                {/* Page Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="h4"
                        sx={{ fontWeight: 800, color: '#1e293b', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                        <BugReportIcon sx={{ color: '#f59e0b', fontSize: 32 }} />
                        QA Dashboard
                        {openBugsCount > 0 && (
                            <Chip
                                label={`${openBugsCount} Open Bug${openBugsCount > 1 ? 's' : ''}`}
                                size="small"
                                color="error"
                                sx={{ ml: 2, fontWeight: 600 }}
                            />
                        )}
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

                {/* Tabs */}
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
                                    <fiIconConfig.icon sx={{ color: fiIconConfig.color }} />
                                    FI → Test Cases ({processedFI.length})
                                </Box>
                            }
                        />
                        <Tab
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <featureIconConfig.icon sx={{ color: featureIconConfig.color }} />
                                    Features → Regression ({processedFeatures.length})
                                </Box>
                            }
                        />
                        <Tab
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {openBugsCount > 0 ? (
                                        <Badge badgeContent={openBugsCount} color="error">
                                            <BugReportIcon sx={{ color: '#ef4444' }} />
                                        </Badge>
                                    ) : (
                                        <BugReportIcon sx={{ color: '#ef4444' }} />
                                    )}
                                    Bug Reports ({bugReports.length})
                                </Box>
                            }
                        />
                    </Tabs>
                </Paper>

                {/* Main Layout */}
                {activeTab === 2 ? (
                    // Bug Reports - Full Width
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
                            <BugReportIcon sx={{ color: '#ef4444' }} />
                            Bug Reports
                            <Chip
                                label="Project"
                                size="small"
                                color="secondary"
                                sx={{ fontWeight: 600, ml: 1 }}
                            />
                        </Typography>
                        <BugReportsPanel
                            bugs={bugReports}
                            loading={loadingBugs}
                            onBugClick={handleBugClick}
                        />
                    </Paper>
                ) : (
                    // FI → Test Cases or Features → Regression Tests
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
                                            <fiIconConfig.icon sx={{ color: fiIconConfig.color }} />
                                            Feature Increments
                                            <Chip label="Project" size="small" color="secondary" sx={{ fontWeight: 600 }} />
                                        </>
                                    ) : (
                                        <>
                                            <featureIconConfig.icon sx={{ color: featureIconConfig.color }} />
                                            Features
                                            <Chip label="Product" size="small" color="primary" sx={{ fontWeight: 600 }} />
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
                                                    Toggle to show or hide artifacts with completed states
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
                                        artifacts={processedFI}
                                        loading={loadingFI}
                                        selectedId={selectedFIId || undefined}
                                        expandedId={expandedFIId || undefined}
                                        onArtifactClick={handleFIClick}
                                        iconConfig={fiIconConfig}
                                        emptyMessage="No feature increments found"
                                    />
                                ) : (
                                    <ArtifactCardList
                                        artifacts={processedFeatures}
                                        loading={loadingFeatures}
                                        selectedId={selectedFeatureId || undefined}
                                        expandedId={expandedFeatureId || undefined}
                                        onArtifactClick={handleFeatureClick}
                                        iconConfig={featureIconConfig}
                                        emptyMessage="No features found"
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
                                    <AccountTreeIcon sx={{ color: '#f59e0b' }} />
                                    {activeTab === 0 ? 'FI → Test Cases' : 'Feature → Regression Tests'}
                                </Typography>

                                {activeTab === 0 ? (
                                    selectedFI ? (
                                        <QATree
                                            parentArtifact={selectedFI}
                                            treeType="fi"
                                            onNodeSelect={handleNodeSelect}
                                            showCompleted={showCompleted}
                                            scopeId={PROJECT_ID}
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
                                                Select a Feature Increment to view its Test Cases
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                Click a card on the left to expand its tree
                                            </Typography>
                                        </Box>
                                    )
                                ) : (
                                    selectedFeature ? (
                                        <QATree
                                            parentArtifact={selectedFeature}
                                            treeType="feature"
                                            onNodeSelect={handleNodeSelect}
                                            showCompleted={showCompleted}
                                            scopeId={PRODUCT_ID}
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
                                                Select a Feature to view its Regression Tests
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
                )}

                {/* Artifact Reader Drawer */}
                <ArtifactReader
                    artifact={readerArtifact}
                    onClose={() => setReaderArtifact(null)}
                />
            </Container>
        </Box>
    );
}
