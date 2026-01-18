import { useState } from 'react';
import { Box } from '@mui/material';
import { RoleProvider, useRole, ToastProvider } from '@/shared/contexts';
import { Header, RoleSelector } from '@/features/layout';
import { BADashboard } from '@/features/dashboards/ba';
import { FADashboard } from '@/features/dashboards/fa';
import { DEVDashboard } from '@/features/dashboards/dev';
import { SADashboard } from '@/features/dashboards/sa';
import { QADashboard } from '@/features/dashboards/qa';
import { SearchResults } from '@/features/search';
import { ProductPortfolio } from '@/features/product-portfolio';

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
                        {role === 'DEV' && <DEVDashboard />}
                        {role === 'SA' && <SADashboard />}
                        {role === 'QA' && <QADashboard />}
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
