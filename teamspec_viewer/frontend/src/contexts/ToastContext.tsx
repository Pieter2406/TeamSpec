/**
 * Toast Context
 *
 * Context provider for toast notifications using MUI Snackbar.
 * Provides hooks for showing success, error, info, and warning toasts.
 *
 * Story: s-e006-006 (Status Update Feedback States)
 * Feature: f-TSV-008 (Inline Status Editing)
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

// ============================================================================
// Types
// ============================================================================

interface ToastMessage {
    id: string;
    message: string;
    severity: AlertColor;
    duration?: number;
}

interface ToastContextValue {
    showToast: (message: string, severity?: AlertColor, duration?: number) => void;
    showError: (message: string) => void;
    showSuccess: (message: string) => void;
    showInfo: (message: string) => void;
    showWarning: (message: string) => void;
}

// ============================================================================
// Context
// ============================================================================

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// ============================================================================
// Provider Component
// ============================================================================

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toast, setToast] = useState<ToastMessage | null>(null);

    const showToast = useCallback((
        message: string,
        severity: AlertColor = 'info',
        duration: number = 5000
    ) => {
        setToast({
            id: Date.now().toString(),
            message,
            severity,
            duration,
        });
    }, []);

    const showError = useCallback((message: string) => {
        showToast(message, 'error', 5000);
    }, [showToast]);

    const showSuccess = useCallback((message: string) => {
        showToast(message, 'success', 3000);
    }, [showToast]);

    const showInfo = useCallback((message: string) => {
        showToast(message, 'info', 4000);
    }, [showToast]);

    const showWarning = useCallback((message: string) => {
        showToast(message, 'warning', 4000);
    }, [showToast]);

    const handleClose = useCallback((_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setToast(null);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, showError, showSuccess, showInfo, showWarning }}>
            {children}
            <Snackbar
                open={!!toast}
                autoHideDuration={toast?.duration}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                {toast ? (
                    <Alert
                        onClose={handleClose}
                        severity={toast.severity}
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {toast.message}
                    </Alert>
                ) : undefined}
            </Snackbar>
        </ToastContext.Provider>
    );
};

// ============================================================================
// Hook
// ============================================================================

export const useToast = (): ToastContextValue => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export default ToastContext;
