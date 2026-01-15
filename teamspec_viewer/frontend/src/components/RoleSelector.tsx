import { Box, Typography, Paper, Avatar } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { useRole, Role } from '../contexts/RoleContext';

const AVAILABLE_ROLES: { id: Role; label: string; description: string; icon: typeof BusinessIcon; color: string }[] = [
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
                        gap: 4,
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        maxWidth: 800,
                    }}
                >
                    {AVAILABLE_ROLES.map((role) => {
                        const IconComponent = role.icon;
                        return (
                            <Paper
                                key={role.id}
                                className={`role-card role-card-${role.id.toLowerCase()}`}
                                sx={{
                                    p: 4,
                                    width: 320,
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
                                    sx={{
                                        width: 72,
                                        height: 72,
                                        bgcolor: role.color,
                                        mb: 3,
                                        boxShadow: `0 8px 24px ${role.color}40`,
                                    }}
                                >
                                    <IconComponent sx={{ fontSize: 36 }} />
                                </Avatar>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 700,
                                        mb: 1.5,
                                        color: 'text.primary',
                                    }}
                                >
                                    {role.label}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'text.secondary',
                                        lineHeight: 1.6,
                                        mb: 3,
                                    }}
                                >
                                    {role.description}
                                </Typography>
                                <Box
                                    sx={{
                                        mt: 'auto',
                                        py: 1.5,
                                        px: 4,
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
