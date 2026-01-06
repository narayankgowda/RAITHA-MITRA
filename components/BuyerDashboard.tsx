
import React, { useState, useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import Cart from './Cart';
import WishlistModal from './WishlistModal';
import OrderHistoryModal from './OrderHistoryModal';
import NotificationsPanel from './NotificationsPanel';
import VoiceAssistantModal from './VoiceAssistantModal';
import { useAuth } from '../hooks/useAuth';
import { Logo } from './Logo';

import { 
    LayoutGridIcon, StoreIcon, ChartSplineIcon, 
    QrCodeIcon, ClipboardListIcon, UserCircleIcon, 
    InfoIcon, MicIcon, ShoppingCartIcon, TrendingUpIcon,
    PackageIcon, SearchIcon
} from './icons';

type BuyerFeaturePath = 'dashboard' | 'marketplace' | 'traceability' | 'orders' | 'profile' | 'about';

interface NavSection {
    title: string;
    items: {
        path: BuyerFeaturePath;
        label: string;
        icon: React.FC<any>;
    }[];
}

const navSections: NavSection[] = [
    {
        title: 'Discovery',
        items: [
            { path: 'dashboard', label: 'Overview', icon: LayoutGridIcon },
            { path: 'marketplace', label: 'Marketplace', icon: StoreIcon },
        ]
    },
    {
        title: 'Tools',
        items: [
            { path: 'traceability', label: 'Trace Source', icon: QrCodeIcon },
        ]
    },
    {
        title: 'Personal',
        items: [
            { path: 'orders', label: 'My Orders', icon: PackageIcon },
            { path: 'profile', label: 'My Profile', icon: UserCircleIcon },
        ]
    },
    {
        title: 'System',
        items: [
            { path: 'about', label: 'About Platform', icon: InfoIcon },
        ]
    }
];

const BuyerDashboard: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    
    const currentPath = location.pathname.split('/').pop() || 'dashboard';

    const [isCartOpen, setCartOpen] = useState(false);
    const [isWishlistOpen, setWishlistOpen] = useState(false);
    const [isOrdersOpen, setOrdersOpen] = useState(false);
    const [isNotificationsOpen, setNotificationsOpen] = useState(false);
    const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);

    const currentTitle = useMemo(() => {
        for (const section of navSections) {
            const item = section.items.find(i => i.path === currentPath);
            if (item) return item.label;
        }
        return 'Buyer Dashboard';
    }, [currentPath]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-black text-text-light dark:text-text-dark font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-72 flex-shrink-0 bg-white dark:bg-[#0b1120] border-r border-gray-200 dark:border-white/10 flex flex-col hidden md:flex z-30 shadow-lg">
                <div className="h-20 flex items-center px-6 border-b border-gray-100 dark:border-white/5">
                     <Logo scale={1.1} />
                </div>
                
                <nav className="flex-grow overflow-y-auto p-4 space-y-8 custom-scrollbar">
                    {navSections.map((section, index) => (
                        <div key={index}>
                            <h3 className="px-4 mb-3 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
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
                                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${
                                                isActive 
                                                ? 'text-white shadow-md shadow-primary/30' 
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 border-l-4 border-transparent'
                                            }`}
                                        >
                                            {isActive && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl -z-10"></div>
                                            )}
                                            <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'}`} />
                                            <span>{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
                
                <div className="p-4 border-t border-gray-200 dark:border-white/5">
                    <div className="flex items-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-white font-bold mr-3 shadow-sm">
                            BM
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">Buyer Account</p>
                            <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Premium Access</p>
                        </div>
                    </div>
                </div>
            </aside>
            
            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 relative bg-gray-50 dark:bg-black">
                <Header 
                    onCartClick={() => setCartOpen(true)}
                    onWishlistClick={() => setWishlistOpen(true)}
                    onOrdersClick={() => navigate('orders')}
                    onNotificationsClick={() => setNotificationsOpen(true)}
                    onProfileClick={() => navigate('profile')}
                    onLogout={handleLogout}
                    title={currentTitle}
                />
                
                <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth relative z-0">
                     <Outlet />
                </main>

                <div className="absolute bottom-6 right-6 z-50">
                    <button 
                        onClick={() => setIsVoiceAssistantOpen(true)}
                        className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-xl flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 animate-bounce-slow relative group"
                        aria-label="Open Voice Assistant"
                    >
                        <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping"></div>
                        <MicIcon className="w-8 h-8 relative z-10" />
                        <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            AI Sourcing Assistant
                        </span>
                    </button>
                </div>
            </div>
            
            <Cart isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
            <WishlistModal isOpen={isWishlistOpen} onClose={() => setWishlistOpen(false)} />
            <OrderHistoryModal isOpen={isOrdersOpen} onClose={() => setOrdersOpen(false)} />
            <NotificationsPanel isOpen={isNotificationsOpen} onClose={() => setNotificationsOpen(false)} />
            <VoiceAssistantModal isOpen={isVoiceAssistantOpen} onClose={() => setIsVoiceAssistantOpen(false)} />
        </div>
    );
};

export default BuyerDashboard;
