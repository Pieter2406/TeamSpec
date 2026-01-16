import { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Chip,
    Paper,
    CircularProgress,
    Alert,
    Container,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { searchArtifacts, SearchResult, Artifact } from '../api/artifacts';
import { SearchFilters } from './SearchFilters';
import { ArtifactReader } from './ArtifactReader';
import { getArtifactIcon, ArtifactType } from '../utils/artifactIcons';

interface SearchResultsProps {
    query: string;
    onClose: () => void;
}

export function SearchResults({ query, onClose: _onClose }: SearchResultsProps) {
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [typeFilter, setTypeFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');
    const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);

    const performSearch = useCallback(async () => {
        if (!query || query.length < 2) return;

        setLoading(true);
        setError(null);

        try {
            const filters: { type?: string; role?: string } = {};
            if (typeFilter !== 'all') filters.type = typeFilter;
            if (roleFilter !== 'all') filters.role = roleFilter;

            const response = await searchArtifacts(query, filters);
            setResults(response.results);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Search failed');
        } finally {
            setLoading(false);
        }
    }, [query, typeFilter, roleFilter]);

    useEffect(() => {
        performSearch();
    }, [performSearch]);

    const handleResultClick = (result: SearchResult) => {
        setSelectedArtifact({
            id: result.id,
            path: result.path,
            title: result.title,
            type: result.type,
        });
    };

    const clearFilters = () => {
        setTypeFilter('all');
        setRoleFilter('all');
    };

    return (
        <Box sx={{ bgcolor: '#f8fafc', minHeight: 'calc(100vh - 64px)' }}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <SearchIcon sx={{ fontSize: 32, color: '#667eea' }} />
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
                            Search Results
                        </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: '#64748b', mb: 3 }}>
                        Showing results for "<strong>{query}</strong>" ({results.length} found)
                    </Typography>

                    {/* Filters */}
                    <SearchFilters
                        type={typeFilter}
                        role={roleFilter}
                        onTypeChange={setTypeFilter}
                        onRoleChange={setRoleFilter}
                        onClear={clearFilters}
                    />
                </Box>

                {/* Loading */}
                {loading && (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <CircularProgress sx={{ color: '#667eea' }} />
                    </Box>
                )}

                {/* Error */}
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* Results */}
                {!loading && !error && results.length === 0 && (
                    <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                        <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                            No results found
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                            Try adjusting your search query or filters
                        </Typography>
                    </Paper>
                )}

                {!loading && !error && results.length > 0 && (
                    <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                        <List sx={{ py: 0 }}>
                            {results.map((result, index) => {
                                const artifactType = result.type as ArtifactType;
                                const iconConfig = getArtifactIcon(artifactType);
                                const IconComponent = iconConfig.icon;
                                return (
                                    <ListItem
                                        key={result.id}
                                        disablePadding
                                        sx={{
                                            borderBottom: index < results.length - 1 ? '1px solid #f1f5f9' : 'none',
                                        }}
                                    >
                                        <ListItemButton
                                            onClick={() => handleResultClick(result)}
                                            sx={{ py: 2.5, px: 3 }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 1.5,
                                                    bgcolor: `${iconConfig.color}15`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                    mr: 2,
                                                }}
                                            >
                                                <IconComponent sx={{ fontSize: 20, color: iconConfig.color }} />
                                            </Box>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                                                        <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>
                                                            {result.title}
                                                        </Typography>
                                                        <Chip
                                                            label={result.type}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: `${iconConfig.color}20`,
                                                                color: iconConfig.color,
                                                                fontWeight: 600,
                                                                fontSize: '0.7rem',
                                                            }}
                                                        />
                                                        {result.role && result.role !== 'unknown' && (
                                                            <Chip
                                                                label={result.role}
                                                                size="small"
                                                                variant="outlined"
                                                                sx={{
                                                                    fontSize: '0.7rem',
                                                                    fontWeight: 500,
                                                                }}
                                                            />
                                                        )}
                                                    </Box>
                                                }
                                                secondary={
                                                    <Box>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: '#64748b',
                                                                fontFamily: 'monospace',
                                                                fontSize: '0.75rem',
                                                                mb: 0.5,
                                                            }}
                                                        >
                                                            {result.path}
                                                        </Typography>
                                                        {result.snippet && (
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    color: '#475569',
                                                                    fontSize: '0.85rem',
                                                                    lineHeight: 1.5,
                                                                }}
                                                            >
                                                                {result.snippet}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                }
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Paper>
                )}

                {/* Artifact Reader */}
                <ArtifactReader
                    artifact={selectedArtifact}
                    onClose={() => setSelectedArtifact(null)}
                />
            </Container>
        </Box>
    );
}
