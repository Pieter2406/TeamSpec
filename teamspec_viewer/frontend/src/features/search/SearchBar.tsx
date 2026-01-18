import { useState, useCallback } from 'react';
import { TextField, InputAdornment, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = 'Search artifacts...' }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

    const handleChange = useCallback((value: string) => {
        setQuery(value);

        // Debounce
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        const timer = setTimeout(() => {
            if (value.trim().length >= 2) {
                onSearch(value.trim());
            }
        }, 300);

        setDebounceTimer(timer);
    }, [debounceTimer, onSearch]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim().length >= 2) {
            onSearch(query.trim());
        }
    };

    const handleClear = () => {
        setQuery('');
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: '100%', maxWidth: 400 }}
        >
            <TextField
                value={query}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={placeholder}
                size="small"
                fullWidth
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                        </InputAdornment>
                    ),
                    endAdornment: query ? (
                        <InputAdornment position="end">
                            <IconButton
                                size="small"
                                onClick={handleClear}
                                sx={{ color: 'rgba(255,255,255,0.7)' }}
                            >
                                <ClearIcon fontSize="small" />
                            </IconButton>
                        </InputAdornment>
                    ) : null,
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(255,255,255,0.1)',
                        borderRadius: 2,
                        '& fieldset': {
                            borderColor: 'rgba(255,255,255,0.2)',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(255,255,255,0.4)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'rgba(255,255,255,0.6)',
                        },
                    },
                    '& .MuiInputBase-input': {
                        color: 'white',
                        '&::placeholder': {
                            color: 'rgba(255,255,255,0.6)',
                            opacity: 1,
                        },
                    },
                }}
            />
        </Box>
    );
}
