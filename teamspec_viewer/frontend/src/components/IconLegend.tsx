/**
 * IconLegend Component
 * 
 * Displays a modal showing all artifact type icons with descriptions.
 * Helps users understand the meaning of different icon types in the UI.
 * 
 * Story: s-e005-006 (Artifact Type Icons and Legend)
 * Dev Plan: dp-e005-s006
 */

import { Dialog, DialogTitle, DialogContent, Box, Typography, IconButton, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getArtifactsByCategory, getCategoryLabel, CATEGORY_COLORS } from '../utils/artifactIcons';

interface IconLegendProps {
    open: boolean;
    onClose: () => void;
}

export function IconLegend({ open, onClose }: IconLegendProps) {
    const artifactsByCategory = getArtifactsByCategory();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            aria-labelledby="icon-legend-title"
        >
            <DialogTitle id="icon-legend-title" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" component="span">
                    Artifact Type Icons
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ color: 'text.secondary' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    TeamSpec uses these icons to identify different artifact types. Related artifacts share similar colors.
                </Typography>

                {Array.from(artifactsByCategory.entries()).map(([category, artifacts]) => (
                    <Box key={category} sx={{ mb: 3 }}>
                        {/* Category Header */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                mb: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 4,
                                    height: 20,
                                    bgcolor: CATEGORY_COLORS[category],
                                    borderRadius: 1,
                                }}
                            />
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 600,
                                    color: CATEGORY_COLORS[category],
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.5,
                                }}
                            >
                                {getCategoryLabel(category)}
                            </Typography>
                        </Box>

                        {/* Artifact Icons */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pl: 2 }}>
                            {artifacts.map(({ type, config }) => {
                                const IconComponent = config.icon;
                                return (
                                    <Box
                                        key={type}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                        }}
                                    >
                                        {/* Icon */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 32,
                                                height: 32,
                                                borderRadius: 1,
                                                bgcolor: `${config.color}15`,
                                                flexShrink: 0,
                                            }}
                                        >
                                            <IconComponent
                                                sx={{
                                                    fontSize: 18,
                                                    color: config.color,
                                                }}
                                            />
                                        </Box>

                                        {/* Label and Description */}
                                        <Box sx={{ flex: 1 }}>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: 'text.primary',
                                                    mb: 0.25,
                                                }}
                                            >
                                                {config.label}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: 'text.secondary',
                                                    display: 'block',
                                                }}
                                            >
                                                {config.description}
                                            </Typography>
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>

                        {/* Divider between categories (except last) */}
                        {category !== 'qa' && <Divider sx={{ mt: 2 }} />}
                    </Box>
                ))}
            </DialogContent>
        </Dialog>
    );
}
