import { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Container, IconButton, Tooltip } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { RoleBadge } from './RoleBadge';
import { SearchBar } from './SearchBar';
import { IconLegend } from './IconLegend';

interface HeaderProps {
    onSearch?: (query: string) => void;
    onHomeClick?: () => void;
}

export function Header({ onSearch, onHomeClick }: HeaderProps) {
    const [legendOpen, setLegendOpen] = useState(false);

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderBottom: 'none',
            }}
        >
            <Container maxWidth="xl">
                <Toolbar sx={{ py: 1, gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {onHomeClick && (
                            <IconButton
                                onClick={onHomeClick}
                                sx={{
                                    color: 'white',
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                                }}
                            >
                                <HomeIcon />
                            </IconButton>
                        )}
                        <Box
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 2,
                                background: 'rgba(255,255,255,0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '1rem',
                                color: 'white',
                                cursor: onHomeClick ? 'pointer' : 'default',
                            }}
                            onClick={onHomeClick}
                        >
                            TS
                        </Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                letterSpacing: '-0.01em',
                                color: 'white',
                                cursor: onHomeClick ? 'pointer' : 'default',
                            }}
                            onClick={onHomeClick}
                        >
                            TeamSpec Viewer
                        </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                        {onSearch && <SearchBar onSearch={onSearch} />}
                    </Box>
                    <Tooltip title="Artifact Types">
                        <IconButton
                            onClick={() => setLegendOpen(true)}
                            sx={{
                                color: 'white',
                                bgcolor: 'rgba(255,255,255,0.1)',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                            }}
                        >
                            <HelpOutlineIcon />
                        </IconButton>
                    </Tooltip>
                    <RoleBadge />
                </Toolbar>
            </Container>
            <IconLegend open={legendOpen} onClose={() => setLegendOpen(false)} />
        </AppBar>
    );
}
