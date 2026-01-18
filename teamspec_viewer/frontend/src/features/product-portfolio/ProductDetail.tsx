import { Box, Typography, Container, Chip, IconButton, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import { Product } from '@/api/artifacts';
import { ProjectsList } from './ProjectsList';

interface ProductDetailProps {
    product: Product;
    onBack: () => void;
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
    active: { bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', color: 'white' },
    deprecated: { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' },
    archived: { bg: '#94a3b8', color: 'white' },
};

export function ProductDetail({ product, onBack }: ProductDetailProps) {
    const statusStyle = STATUS_COLORS[product.status] || STATUS_COLORS.active;

    return (
        <Box sx={{ bgcolor: '#f8fafc', minHeight: 'calc(100vh - 64px)' }}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Back button */}
                <Box sx={{ mb: 3 }}>
                    <IconButton
                        onClick={onBack}
                        sx={{
                            bgcolor: 'white',
                            border: '1px solid #e2e8f0',
                            '&:hover': {
                                bgcolor: '#f8fafc',
                                borderColor: '#667eea',
                            },
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                </Box>

                {/* Product header */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        mb: 4,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                        <Box
                            sx={{
                                width: 72,
                                height: 72,
                                borderRadius: 3,
                                bgcolor: 'rgba(255,255,255,0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <FolderSpecialIcon sx={{ fontSize: 40 }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Chip
                                    label={product.prefix}
                                    size="small"
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        fontWeight: 700,
                                        fontFamily: 'monospace',
                                    }}
                                />
                                <Chip
                                    label={product.status.toUpperCase()}
                                    size="small"
                                    sx={{
                                        background: statusStyle.bg,
                                        color: statusStyle.color,
                                        fontWeight: 600,
                                        fontSize: '0.7rem',
                                    }}
                                />
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                                {product.name}
                            </Typography>
                            <Typography sx={{ opacity: 0.9 }}>
                                {product.description || 'No description available'}
                            </Typography>
                        </Box>
                    </Box>
                </Paper>

                {/* Projects list */}
                <ProjectsList productId={product.id} />
            </Container>
        </Box>
    );
}
