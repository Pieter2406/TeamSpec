import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material';
import { RoleBadge } from './RoleBadge';

export function Header() {
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
                <Toolbar sx={{ py: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
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
                            }}
                        >
                            TS
                        </Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                letterSpacing: '-0.01em',
                                color: 'white',
                            }}
                        >
                            TeamSpec Viewer
                        </Typography>
                    </Box>
                    <RoleBadge />
                </Toolbar>
            </Container>
        </AppBar>
    );
}
