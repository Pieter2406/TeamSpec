import { Box, Typography, Paper, Avatar } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CodeIcon from '@mui/icons-material/Code';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import BugReportIcon from '@mui/icons-material/BugReport';
import { useRole } from '@/shared/contexts';

type ActiveRole = 'BA' | 'FA' | 'DEV' | 'SA' | 'QA';

const AVAILABLE_ROLES: { id: ActiveRole; label: string; description: string; icon: typeof BusinessIcon; color: string }[] = [
    {
        id: 'BA',
        label: 'Business Analyst',
        description: 'Review business analysis documents, requirements, and BA increments for your projects',
        icon: BusinessIcon,
        color: '#667eea',
    },
    {
        id: 'FA',
        label: 'Functional Analyst',
        description: 'Navigate features, feature-increments, epics, and user stories to manage specifications',
        icon: AccountTreeIcon,
        color: '#f5576c',
    },
    {
        id: 'DEV',
        label: 'Developer',
        description: 'Access dev-plans, stories, and technical architecture documents for implementation',
        icon: CodeIcon,
        color: '#10b981',
    },
    {
        id: 'SA',
        label: 'Solution Architect',
        description: 'Review solution designs, technical architectures, and their increments',
        icon: ArchitectureIcon,
        color: '#8b5cf6',
    },
    {
        id: 'QA',
        label: 'QA Engineer',
        description: 'Manage test cases, regression tests, and bug reports for quality assurance',
        icon: BugReportIcon,
        color: '#f59e0b',
    },
];

export function RoleSelector() {
    const { setRole } = useRole();

    return (
        <Box className="role-selector-bg">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    gap: 5,
                    p: 4,
                }}
            >
                {/* Logo / Brand */}
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography
                        className="brand-text"
                        sx={{
                            fontSize: { xs: '2.5rem', md: '3.5rem' },
                            fontWeight: 800,
                            letterSpacing: '-0.02em',
                            mb: 1,
                        }}
                    >
                        TeamSpec Viewer
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'text.secondary',
                            fontWeight: 400,
                            maxWidth: 500,
                            mx: 'auto',
                        }}
                    >
                        Your product requirements, beautifully organized
                    </Typography>
                </Box>

                {/* Role Selection Prompt */}
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                    }}
                >
                    Choose your role to get started
                </Typography>

                {/* Role Cards */}
                <Box
                    sx={{
                        display: 'flex',
                        gap: 3,
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        maxWidth: 1200,
                    }}
                >
                    {AVAILABLE_ROLES.map((role) => {
                        const IconComponent = role.icon;
                        return (
                            <Paper
                                key={role.id}
                                className={`role-card role-card-${role.id.toLowerCase()}`}
                                data-testid={`role-card-${role.id}`}
                                sx={{
                                    p: 3,
                                    width: 220,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                }}
                                onClick={() => setRole(role.id)}
                                elevation={0}
                            >
                                <Avatar
                                    data-testid={`icon-${role.id}`}
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        bgcolor: role.color,
                                        mb: 2,
                                        boxShadow: `0 8px 24px ${role.color}40`,
                                    }}
                                >
                                    <IconComponent sx={{ fontSize: 28 }} />
                                </Avatar>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        mb: 1,
                                        color: 'text.primary',
                                    }}
                                >
                                    {role.label}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'text.secondary',
                                        lineHeight: 1.5,
                                        mb: 2,
                                        fontSize: '0.8rem',
                                    }}
                                >
                                    {role.description}
                                </Typography>
                                <Box
                                    sx={{
                                        mt: 'auto',
                                        py: 1,
                                        px: 3,
                                        borderRadius: 3,
                                        background: `linear-gradient(135deg, ${role.color} 0%, ${role.color}cc 100%)`,
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '0.95rem',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                        },
                                    }}
                                >
                                    Enter as {role.id}
                                </Box>
                            </Paper>
                        );
                    })}
                </Box>

                {/* Footer hint */}
                <Typography
                    variant="body2"
                    sx={{
                        color: 'text.disabled',
                        mt: 4,
                    }}
                >
                    You can switch roles anytime from the header
                </Typography>
            </Box>
        </Box>
    );
}
