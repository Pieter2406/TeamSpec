---
# === LLM Retrieval Metadata ===
artifact_kind: devplan
spec_version: "4.0"
template_version: "4.0.1"
title: "Status Update Feedback States"

# === Ownership ===
role_owner: DEV
artifact_type: Project Execution
canonicity: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "dp-e006-s006"
filename_pattern: "dp-e006-s006-status-update-feedback.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e006-006"
    optional: false

# === Search Optimization ===
keywords:
  - dev plan
  - loading state
  - error handling
  - toast notification
  - feedback
aliases:
  - feedback implementation
anti_keywords:
  - story
  - requirements
---

# Dev Plan: `dp-e006-s006-status-update-feedback`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-16

---

**Document Owner:** DEV (Developer)  
**Artifact Type:** Execution (Implementation Plan)  
**Lifecycle:** Sprint-bound, archived after story completion

---

## Metadata

| Field | Value |
|-------|-------|
| **Dev Plan ID** | dp-e006-s006 |
| **Story** | [s-e006-006](../stories/backlog/s-e006-006-status-update-feedback.md) |
| **Epic** | epic-TSV-006 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | DEV Agent |
| **Created** | 2026-01-16 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e006-006](../stories/backlog/s-e006-006-status-update-feedback.md) | Status Update Feedback States | [fi-TSV-006](../feature-increments/fi-TSV-006-inline-status-editing-mvp.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Implement comprehensive feedback for status update operations:
1. **Toast Provider** - Add MUI Snackbar provider at app root
2. **useToast Hook** - Create reusable hook for showing notifications
3. **Loading State** - Already prepared in StatusDropdown (loading prop)
4. **Success Animation** - Brief visual feedback on successful update
5. **Error Display** - Toast notification with error message

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `ToastProvider.tsx` | New | Context provider for toast notifications |
| `useToast.ts` | New | Hook for showing toasts |
| `App.tsx` | Modified | Wrap app with ToastProvider |
| `StatusDropdown.tsx` | Modified | Add success animation |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `frontend/src/contexts/ToastContext.tsx` | Create | Toast context and provider |
| `frontend/src/hooks/useToast.ts` | Create | Hook for toast operations |
| `frontend/src/App.tsx` | Modify | Add ToastProvider |
| `frontend/src/components/StatusDropdown.tsx` | Modify | Add success animation |

### 2.2 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| `@mui/material` (Snackbar, Alert) | Existing | Available |
| React Context API | Built-in | Available |

### 2.3 Toast Context Implementation

```typescript
// frontend/src/contexts/ToastContext.tsx

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

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

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

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
    
    const handleClose = useCallback(() => {
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
                {toast && (
                    <Alert
                        onClose={handleClose}
                        severity={toast.severity}
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {toast.message}
                    </Alert>
                )}
            </Snackbar>
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextValue => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export default ToastContext;
```

### 2.4 App.tsx Integration

```typescript
// frontend/src/App.tsx

import { ToastProvider } from './contexts/ToastContext';

function App() {
    return (
        <ToastProvider>
            {/* existing app content */}
        </ToastProvider>
    );
}
```

### 2.5 StatusDropdown Success Animation

```typescript
// Add to StatusDropdown.tsx

import { keyframes } from '@mui/system';

const successPulse = keyframes`
    0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }
    70% { box-shadow: 0 0 0 6px rgba(76, 175, 80, 0); }
    100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
`;

// Add successAnimation state
const [showSuccess, setShowSuccess] = useState(false);

// After successful status change
useEffect(() => {
    if (!loading && previousLoading) {
        setShowSuccess(true);
        const timer = setTimeout(() => setShowSuccess(false), 600);
        return () => clearTimeout(timer);
    }
}, [loading]);

// In Chip sx:
sx={{
    // ... existing styles
    animation: showSuccess ? `${successPulse} 0.6s ease-out` : 'none',
}}
```

### 2.6 Integration with Tree Components

```typescript
// In ArtifactTree.tsx and BATree.tsx

import { useToast } from '../contexts/ToastContext';

// Inside component:
const { showError } = useToast();

// In catch blocks:
catch (error) {
    setStatusStates(prev => ({
        ...prev,
        [path]: { status: currentStatus, loading: false },
    }));
    showError('Network error: Failed to update status');
}
```

---

## 3. Testing Strategy

### 3.1 Unit Tests

- [ ] ToastProvider renders children
- [ ] showError displays error toast
- [ ] showSuccess displays success toast
- [ ] Toast auto-dismisses after duration
- [ ] Toast closes on X click

### 3.2 Integration Tests

- [ ] Error from API triggers toast
- [ ] Success animation plays on status update

### 3.3 Manual Testing

- [ ] Error toast appears on API failure
- [ ] Toast dismisses after 5 seconds
- [ ] Toast dismisses on click
- [ ] Success pulse animation visible
- [ ] Loading spinner shows during API call

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Multiple toasts queuing | Low | Low | Only show one toast at a time (latest wins) |
| Animation performance | Low | Low | Use CSS animations, not JS |
| Context not available | Low | High | Clear error message if useToast outside provider |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | Loading spinner shows | `loading` prop on StatusDropdown |
| 2 | Success animation plays | CSS keyframes pulse animation |
| 3 | Error toast displays | `showError` from useToast |
| 4 | Toast auto-dismisses | Snackbar `autoHideDuration` |
| 5 | Toast manual dismiss | Alert `onClose` handler |

---

## 6. Checklist

### Pre-Implementation

- [x] Story requirements understood
- [x] Feature-Increment AS-IS/TO-BE reviewed
- [x] Technical approach approved
- [x] Dependencies identified (s-e006-002, 003)

### Implementation

- [ ] ToastContext created
- [ ] useToast hook created
- [ ] App.tsx wrapped with provider
- [ ] Success animation added
- [ ] Tree components integrated
- [ ] Unit tests written
- [ ] Code reviewed
- [ ] Tests passing

### Post-Implementation

- [ ] Integration tests passing
- [ ] Documentation updated (if needed)
- [ ] Ready for QA verification

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-16 | DEV Agent | Initial plan |
