
import React, { useState, useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import NotificationsPanel from './NotificationsPanel';
import { useAuth } from '../hooks/useAuth';
import { Logo } from './Logo';

import { 
    BarChart2Icon, PackageSearchIcon, UsersIcon, 
    ClipboardListIcon, HeadphonesIcon, 
    SettingsIcon, ShieldCheckIcon, LogOutIcon, ActivityIcon,
    ServerIcon
} from './icons';

type AdminFeaturePath = 'analytics' | 'products' | 'users' | 'orders' | 'support' | 'settings';

interface NavSection {
    title: string;
    items: {
        path: AdminFeaturePath;
        label: string;
        icon: React.FC<any>;
    }[];
}

const navSections: NavSection[] = [
    {
        title: 'Platform Control',
        items: [
            { path: 'analytics', label: 'Mission Control', icon: BarChart2Icon },
            { path: 'products', label: 'Inventory', icon: PackageSearchIcon },
            { path: 'users', label: 'User Base', icon: UsersIcon },
            { path: 'orders', label: 'Global Orders', icon: ClipboardListIcon },
        ]
    },
    {
        title: 'Support',
        items: [
            { path: 'support', label: 'Helpdesk', icon: HeadphonesIcon },
        ]
    },
    {
        title: 'System',
        items: [
            { path: 'settings', label: 'Configuration', icon: SettingsIcon },
        ]
    }
];

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    
    const currentPath = location.pathname.split('/').pop() || 'analytics';
    const [isNotificationsOpen, setNotificationsOpen] = useState(false);

    const currentTitle = useMemo(() => {
        for (const section of navSections) {
            const item = section.items.find(i => i.path === currentPath);
            if (item) return item.label;
        }
        return 'Admin Portal';
    }, [currentPath]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-black text-text-light dark:text-text-dark font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-72 flex-shrink-0 bg-white dark:bg-[#111827] border-r border-gray-200 dark:border-white/10 flex flex-col hidden md:flex z-30 shadow-xl">
                <div className="h-20 flex items-center px-6 border-b border-gray-100 dark:border-white/5 bg-gradient-to-r from-gray-50 to-transparent dark:from-white/5">
                     <Logo showTagline={false} scale={1.1} />
                     <div className="ml-auto bg-primary/10 p-1.5 rounded-lg border border-primary/20">
                        <ShieldCheckIcon className="w-5 h-5 text-primary" />
                     </div>
                </div>
                
                <nav className="flex-grow overflow-y-auto p-4 space-y-8 custom-scrollbar">
                    {navSections.map((section, index) => (
                        <div key={index}>
                            <h3 className="px-4 mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                                {section.title}
                            </h3>
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = currentPath === item.path;
                                    return (
                                        <button
                                            key={item.path}
                                            onClick={() => navigate(item.path)}
                                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group relative ${
                                                isActive 
                                                ? 'text-white shadow-lg shadow-gray-900/30' 
                                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                                            }`}
                                        >
                                            {isActive && (
                                                <div className="absolute inset-0 bg-gray-900 dark:bg-primary rounded-xl -z-10"></div>
                                            )}
                                            <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`} />
                                            <span>{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
                
                <div className="p-6 border-t border-gray-100 dark:border-white/5 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 font-black shadow-inner">
                            AD
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">Admin User</p>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Active</p>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100 dark:border-red-900/30"
                    >
                        <LogOutIcon className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </aside>
            
            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 relative bg-gray-50 dark:bg-black">
                <Header 
                    onNotificationsClick={() => setNotificationsOpen(true)}
                    onLogout={handleLogout}
                    title={currentTitle}
                />
                
                <main className="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth relative z-0">
                     <Outlet />
                </main>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 bg-gray-900/80 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 pointer-events-none">
                    <div className="flex items-center gap-2">
                        <ActivityIcon className="w-4 h-4 text-green-400"/>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Sys Health: 99.9%</span>
                    </div>
                    <div className="w-px h-4 bg-white/20"></div>
                    <div className="flex items-center gap-2">
                        <ServerIcon className="w-4 h-4 text-blue-400"/>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Load: 24%</span>
                    </div>
                </div>
            </div>
            
            <NotificationsPanel isOpen={isNotificationsOpen} onClose={() => setNotificationsOpen(false)} />
        </div>
    );
};

export default AdminDashboard;
