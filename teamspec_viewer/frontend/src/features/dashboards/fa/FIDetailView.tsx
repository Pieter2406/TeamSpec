import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Paper,
    CircularProgress,
    Drawer,
    IconButton,
    Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { getFISections, Artifact } from '@/api/artifacts';
import { LinkedStoriesPanel } from '@/features/dashboards/components';
import { TbdHighlighter } from '@/shared/components';

interface FIDetailViewProps {
    artifact: Artifact | null;
    onClose: () => void;
    onStoryClick?: (story: Artifact) => void;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

export function FIDetailView({ artifact, onClose, onStoryClick }: FIDetailViewProps) {
    const [tabValue, setTabValue] = useState(0);
    const [asIsContent, setAsIsContent] = useState('');
    const [toBeContent, setToBeContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!artifact || artifact.type !== 'feature-increment') {
            setAsIsContent('');
            setToBeContent('');
            return;
        }

        // Extract FI ID from artifact id (e.g., "fi-TSV-001-ba-fa-role-dashboards" -> "fi-TSV-001")
        const fiId = artifact.id.match(/^fi-[A-Z]+-\d+/)?.[0] || artifact.id;

        setLoading(true);
        setError(null);

        getFISections(fiId)
            .then((data) => {
                setAsIsContent(data.asIs);
                setToBeContent(data.toBe);
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [artifact]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const renderMarkdown = (content: string) => {
        if (!content) {
            return (
                <Typography sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
                    No content available
                </Typography>
            );
        }

        return (
            <TbdHighlighter content={content}>
                {(processedHtml: string) => (
                    <Box
                        className="markdown-content"
                        dangerouslySetInnerHTML={{ __html: processedHtml }}
                        sx={{
                            '& h1, & h2, & h3, & h4': {
                                color: '#1e293b',
                                fontWeight: 600,
                                mt: 2,
                                mb: 1,
                            },
                            '& h3': { fontSize: '1.1rem' },
                            '& h4': { fontSize: '1rem' },
                            '& p': { color: '#475569', mb: 1.5, lineHeight: 1.7 },
                            '& ul, & ol': { pl: 2.5, mb: 1.5 },
                            '& li': { color: '#475569', mb: 0.5 },
                            '& table': {
                                width: '100%',
                                borderCollapse: 'collapse',
                                mb: 2,
                                '& th, & td': {
                                    border: '1px solid #e2e8f0',
                                    p: 1.5,
                                    textAlign: 'left',
                                },
                                '& th': { bgcolor: '#f8fafc', fontWeight: 600 },
                            },
                            '& code': {
                                bgcolor: '#f1f5f9',
                                px: 0.75,
                                py: 0.25,
                                borderRadius: 1,
                                fontFamily: 'monospace',
                                fontSize: '0.875rem',
                            },
                            '& strong': { fontWeight: 600, color: '#1e293b' },
                        }}
                    />
                )}
            </TbdHighlighter>
        );
    };

    // Only show for feature-increment types
    if (!artifact || artifact.type !== 'feature-increment') {
        return null;
    }

    const fiId = artifact.id.match(/^fi-[A-Z]+-\d+/)?.[0] || artifact.id;

    return (
        <Drawer
            anchor="right"
            open={!!artifact}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: { xs: '100%', md: '70%', lg: '60%' },
                    boxShadow: '-10px 0 40px rgba(0,0,0,0.1)',
                },
            }}
        >
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Box
                    sx={{
                        p: 3,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <IconButton
                            onClick={onClose}
                            sx={{
                                color: 'white',
                                bgcolor: 'rgba(255,255,255,0.1)',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                <CompareArrowsIcon sx={{ fontSize: 24, opacity: 0.9 }} />
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                    {artifact.title}
                                </Typography>
                            </Box>
                            <Typography
                                variant="body2"
                                sx={{ opacity: 0.8, fontFamily: 'monospace', fontSize: '0.8rem' }}
                            >
                                {artifact.path}
                            </Typography>
                            {artifact.status && (
                                <Chip
                                    label={artifact.status}
                                    size="small"
                                    sx={{
                                        mt: 1.5,
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        fontWeight: 600,
                                    }}
                                />
                            )}
                        </Box>
                    </Box>
                </Box>

                {/* Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'white' }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        sx={{
                            '& .MuiTab-root': {
                                fontWeight: 600,
                                textTransform: 'none',
                            },
                            '& .Mui-selected': {
                                color: '#667eea',
                            },
                            '& .MuiTabs-indicator': {
                                bgcolor: '#667eea',
                            },
                        }}
                    >
                        <Tab label="AS-IS (Current)" />
                        <Tab label="TO-BE (Proposed)" />
                    </Tabs>
                </Box>

                {/* Content */}
                <Box sx={{ flexGrow: 1, overflow: 'auto', bgcolor: '#fafbfc', p: 3 }}>
                    {loading && (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <CircularProgress sx={{ color: '#667eea' }} />
                        </Box>
                    )}

                    {error && (
                        <Paper elevation={0} sx={{ p: 3, bgcolor: '#fef2f2', borderRadius: 2 }}>
                            <Typography sx={{ color: '#dc2626' }}>{error}</Typography>
                        </Paper>
                    )}

                    {!loading && !error && (
                        <>
                            <TabPanel value={tabValue} index={0}>
                                <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                                    {renderMarkdown(asIsContent)}
                                </Paper>
                            </TabPanel>
                            <TabPanel value={tabValue} index={1}>
                                <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                                    {renderMarkdown(toBeContent)}
                                </Paper>
                            </TabPanel>

                            {/* Linked Stories */}
                            <Box sx={{ mt: 3 }}>
                                <LinkedStoriesPanel
                                    fiId={fiId}
                                    onStoryClick={onStoryClick}
                                />
                            </Box>
                        </>
                    )}
                </Box>
            </Box>
        </Drawer>
    );
}
