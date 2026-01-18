import { Box, Chip, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface SearchFiltersProps {
    type: string;
    role: string;
    onTypeChange: (type: string) => void;
    onRoleChange: (role: string) => void;
    onClear: () => void;
}

const ARTIFACT_TYPES = [
    { value: 'all', label: 'All Types' },
    { value: 'feature', label: 'Features' },
    { value: 'feature-increment', label: 'Feature Increments' },
    { value: 'epic', label: 'Epics' },
    { value: 'story', label: 'Stories' },
    { value: 'business-analysis', label: 'Business Analysis' },
    { value: 'dev-plan', label: 'Dev Plans' },
];

const ROLES = [
    { value: 'all', label: 'All Roles' },
    { value: 'BA', label: 'BA' },
    { value: 'FA', label: 'FA' },
    { value: 'DEV', label: 'DEV' },
    { value: 'QA', label: 'QA' },
];

export function SearchFilters({
    type,
    role,
    onTypeChange,
    onRoleChange,
    onClear,
}: SearchFiltersProps) {
    const hasFilters = type !== 'all' || role !== 'all';

    return (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Type</InputLabel>
                <Select
                    value={type}
                    label="Type"
                    onChange={(e: SelectChangeEvent) => onTypeChange(e.target.value)}
                >
                    {ARTIFACT_TYPES.map((t) => (
                        <MenuItem key={t.value} value={t.value}>
                            {t.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Role</InputLabel>
                <Select
                    value={role}
                    label="Role"
                    onChange={(e: SelectChangeEvent) => onRoleChange(e.target.value)}
                >
                    {ROLES.map((r) => (
                        <MenuItem key={r.value} value={r.value}>
                            {r.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {hasFilters && (
                <Chip
                    label="Clear filters"
                    variant="outlined"
                    size="small"
                    onClick={onClear}
                    sx={{
                        borderColor: '#667eea',
                        color: '#667eea',
                        '&:hover': {
                            bgcolor: 'rgba(102, 126, 234, 0.1)',
                        },
                    }}
                />
            )}
        </Box>
    );
}
