import { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid, CircularProgress, Alert } from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { getProducts, Product } from '@/api/artifacts';
import { ProductCard } from './ProductCard';
import { ProductDetail } from './ProductDetail';

export function ProductPortfolio() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        getProducts()
            .then((response) => {
                setProducts(response.products);
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (selectedProduct) {
        return (
            <ProductDetail
                product={selectedProduct}
                onBack={() => setSelectedProduct(null)}
            />
        );
    }

    return (
        <Box sx={{ bgcolor: '#f8fafc', minHeight: 'calc(100vh - 64px)' }}>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <BusinessCenterIcon sx={{ color: 'white', fontSize: 28 }} />
                        </Box>
                        <Box>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 800,
                                    color: '#1e293b',
                                }}
                            >
                                Product Portfolio
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                Browse and manage your TeamSpec products
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Loading */}
                {loading && (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <CircularProgress sx={{ color: '#667eea' }} />
                    </Box>
                )}

                {/* Error */}
                {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Empty state */}
                {!loading && !error && products.length === 0 && (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 8,
                            bgcolor: 'white',
                            borderRadius: 3,
                            border: '1px solid #e2e8f0',
                        }}
                    >
                        <BusinessCenterIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                            No products found
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                            Create a product using <code>ts:po product</code>
                        </Typography>
                    </Box>
                )}

                {/* Product Grid */}
                {!loading && !error && products.length > 0 && (
                    <Grid container spacing={3}>
                        {products.map((product) => (
                            <Grid item xs={12} sm={6} md={4} key={product.id}>
                                <ProductCard
                                    product={product}
                                    onClick={setSelectedProduct}
                                />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
}
