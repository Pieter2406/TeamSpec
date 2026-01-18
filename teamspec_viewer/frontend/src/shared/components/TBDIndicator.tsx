/**
 * TBDIndicator Component
 *
 * Displays a small warning indicator for artifacts containing {TBD} markers.
 * Shows warning triangle icon + "TBD" tag with accessible tooltip.
 *
 * Story: s-e008-001 (Warning tag + popover)
 * Epic: TSV-008 (Treeview TBD Indicators)
 * Feature-Increment: fi-TSV-008
 */

import { Box, Tooltip, Typography } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

// ============================================================================
// Constants
// ============================================================================

const TOOLTIP_TEXT = 'Contains literal {TBD} markers — this document needs review';
const ARIA_LABEL = 'Contains TBDs — needs review';

// ============================================================================
// Types
// ============================================================================

export interface TBDIndicatorProps {
    /** Show the indicator */
    show: boolean;
    /** Size variant */
    size?: 'small' | 'medium';
}

// ============================================================================
// Component
// ============================================================================

export function TBDIndicator({ show, size = 'small' }: TBDIndicatorProps) {
    if (!show) return null;

    const iconSize = size === 'small' ? 14 : 18;
    const fontSize = size === 'small' ? '0.65rem' : '0.75rem';

    return (
        <Tooltip
            title={TOOLTIP_TEXT}
            arrow
            placement="top"
            enterDelay={200}
        >
            <Box
                component="span"
                tabIndex={0}
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.25,
                    px: 0.5,
                    py: 0.125,
                    borderRadius: 0.5,
                    bgcolor: '#fff3cd',
                    color: '#856404',
                    cursor: 'default',
                    ml: 0.5,
                    '&:focus': {
                        outline: '2px solid',
                        outlineColor: '#ffc107',
                        outlineOffset: 1,
                    },
                    '&:focus-visible': {
                        outline: '2px solid',
                        outlineColor: '#ffc107',
                        outlineOffset: 1,
                    },
                }}
                role="status"
                aria-label={ARIA_LABEL}
            >
                <WarningAmberIcon sx={{ fontSize: iconSize }} />
                <Typography
                    component="span"
                    sx={{
                        fontSize,
                        fontWeight: 600,
                        lineHeight: 1,
                    }}
                >
                    TBD
                </Typography>
            </Box>
        </Tooltip>
    );
}
