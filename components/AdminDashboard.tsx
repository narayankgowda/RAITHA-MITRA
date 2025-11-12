import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import AdminPanel from './AdminPanel';
import AdminProfile from './AdminProfile';

interface AdminDashboardProps {
    onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const { t } = useTranslation();
    const [view, setView] = useState<'panel' | 'profile'>('panel');
    
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans">
            <Header 
                onLogout={onLogout}
                onProfileClick={() => setView(v => v === 'profile' ? 'panel' : 'profile')}
                title={t('dashboard.admin.title')}
            />
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                {view === 'panel' ? <AdminPanel /> : <AdminProfile />}
            </main>
        </div>
    );
};

export default AdminDashboard;