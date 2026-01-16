import { useState } from 'react';
import { Box } from '@mui/material';
import { RoleProvider, useRole } from './contexts/RoleContext';
import { ToastProvider } from './contexts/ToastContext';
import { RoleSelector } from './components/RoleSelector';
import { Header } from './components/Header';
import { BADashboard } from './components/BADashboard';
import { FADashboard } from './components/FADashboard';
import { SearchResults } from './components/SearchResults';
import { ProductPortfolio } from './components/ProductPortfolio';

type ViewType = 'dashboard' | 'search' | 'portfolio';

function AppContent() {
    const { role } = useRole();
    const [currentView, setCurrentView] = useState<ViewType>('dashboard');
    const [searchQuery, setSearchQuery] = useState('');

    if (!role) {
        return <RoleSelector />;
    }

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentView('search');
    };

    const handleHomeClick = () => {
        setCurrentView('dashboard');
        setSearchQuery('');
    };

    const renderView = () => {
        switch (currentView) {
            case 'search':
                return (
                    <SearchResults
                        query={searchQuery}
                        onClose={() => setCurrentView('dashboard')}
                    />
                );
            case 'portfolio':
                return <ProductPortfolio />;
            case 'dashboard':
            default:
                return (
                    <>
                        {role === 'BA' && <BADashboard />}
                        {role === 'FA' && <FADashboard />}
                    </>
                );
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header
                onSearch={handleSearch}
                onHomeClick={currentView !== 'dashboard' ? handleHomeClick : undefined}
            />
            <Box component="main" sx={{ flexGrow: 1 }}>
                {renderView()}
            </Box>
        </Box>
    );
}

function App() {
    return (
        <ToastProvider>
            <RoleProvider>
                <AppContent />
            </RoleProvider>
        </ToastProvider>
    );
}

export default App;
