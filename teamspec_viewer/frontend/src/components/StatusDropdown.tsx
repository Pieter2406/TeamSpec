/**
 * StatusDropdown Component
 *
 * Reusable dropdown component for editing artifact status inline.
 * Renders as a clickable colored chip that opens a menu with valid status options.
 *
 * Story: s-e006-002 (Status Dropdown Component)
 * Feature: f-TSV-008 (Inline Status Editing)
 */

import React, { useState, useCallback } from 'react';
import { Chip, Menu, MenuItem, CircularProgress, ListItemIcon } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { ArtifactType } from '../utils/artifactIcons';
import { getStatusOptions, getStatusColor, StatusConfig } from '../utils/statusOptions';

export interface StatusDropdownProps {
    /** The artifact type (determines valid status options) */
    artifactType: ArtifactType | string;
    /** Current status value */
    currentStatus: string;
    /** Callback when status is changed */
    onStatusChange: (newStatus: string) => void;
    /** Whether the dropdown is disabled */
    disabled?: boolean;
    /** Whether an async operation is in progress */
    loading?: boolean;
    /** Size variant */
    size?: 'small' | 'medium';
}

export const StatusDropdown: React.FC<StatusDropdownProps> = ({
    artifactType,
    currentStatus,
    onStatusChange,
    disabled = false,
    loading = false,
    size = 'small',
}) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);

    const statusOptions = getStatusOptions(artifactType);
    const currentColor = getStatusColor(artifactType, currentStatus);

    const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation(); // Prevent tree node expansion
        if (!disabled && !loading) {
            setAnchorEl(event.currentTarget);
        }
    }, [disabled, loading]);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleSelect = useCallback((status: string) => {
        setAnchorEl(null);
        if (status !== currentStatus) {
            onStatusChange(status);
        }
    }, [currentStatus, onStatusChange]);

    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
        if (event.key === 'Escape') {
            handleClose();
        }
    }, [handleClose]);

    // If no valid options, render read-only chip
    if (statusOptions.length === 0) {
        return (
            <Chip
                label={currentStatus}
                size={size}
                sx={{
                    backgroundColor: currentColor,
                    color: '#fff',
                    fontWeight: 500,
                    fontSize: '0.65rem',
                }}
            />
        );
    }

    return (
        <>
            <Chip
                label={loading ? '' : currentStatus}
                size={size}
                onClick={handleClick}
                icon={loading ? <CircularProgress size={12} color="inherit" /> : undefined}
                sx={{
                    backgroundColor: loading ? `${currentColor}80` : currentColor,
                    color: '#fff',
                    fontWeight: 500,
                    fontSize: '0.65rem',
                    cursor: disabled || loading ? 'default' : 'pointer',
                    opacity: disabled ? 0.5 : 1,
                    minWidth: loading ? 70 : undefined,
                    '&:hover': {
                        backgroundColor: disabled || loading ? currentColor : `${currentColor}cc`,
                    },
                }}
            />
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()} // Prevent click propagation
                MenuListProps={{
                    'aria-labelledby': 'status-dropdown',
                    dense: true,
                }}
            >
                {statusOptions.map((option: StatusConfig) => (
                    <MenuItem
                        key={option.value}
                        selected={option.value === currentStatus}
                        onClick={() => handleSelect(option.value)}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 24 }}>
                            {option.value === currentStatus && (
                                <CheckIcon fontSize="small" sx={{ color: option.color }} />
                            )}
                        </ListItemIcon>
                        <Chip
                            label={option.label}
                            size="small"
                            sx={{
                                backgroundColor: option.color,
                                color: '#fff',
                                fontWeight: 500,
                                fontSize: '0.7rem',
                            }}
                        />
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default StatusDropdown;
