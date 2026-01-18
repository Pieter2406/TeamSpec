import { Chip, Box, IconButton, Tooltip } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import BusinessIcon from '@mui/icons-material/Business';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CodeIcon from '@mui/icons-material/Code';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import BugReportIcon from '@mui/icons-material/BugReport';
import { useRole } from '@/shared/contexts';

const ROLE_CONFIG: Record<string, { label: string; icon: typeof BusinessIcon; bgColor: string }> = {
    BA: {
        label: 'Business Analyst',
        icon: BusinessIcon,
        bgColor: 'rgba(255,255,255,0.2)',
    },
    FA: {
        label: 'Functional Analyst',
        icon: AccountTreeIcon,
        bgColor: 'rgba(255,255,255,0.2)',
    },
    DEV: {
        label: 'Developer',
        icon: CodeIcon,
        bgColor: 'rgba(255,255,255,0.2)',
    },
    SA: {
        label: 'Solution Architect',
        icon: ArchitectureIcon,
        bgColor: 'rgba(255,255,255,0.2)',
    },
    QA: {
        label: 'QA Engineer',
        icon: BugReportIcon,
        bgColor: 'rgba(255,255,255,0.2)',
    },
};

export function RoleBadge() {
    const { role, clearRole } = useRole();

    if (!role) return null;

    const config = ROLE_CONFIG[role];
    const IconComponent = config.icon;

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
                icon={<IconComponent sx={{ color: 'white !important' }} />}
                label={config.label}
                sx={{
                    bgcolor: config.bgColor,
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    py: 2.5,
                    px: 1,
                    '& .MuiChip-icon': {
                        color: 'white',
                    },
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                }}
            />
            <Tooltip title="Switch Role">
                <IconButton
                    size="small"
                    onClick={clearRole}
                    aria-label="switch role"
                    sx={{
                        color: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                        '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.2)',
                        },
                    }}
                >
                    <SwapHorizIcon />
                </IconButton>
            </Tooltip>
        </Box>
    );
}
