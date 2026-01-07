
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
    LayoutGridIcon, CloudSunIcon, MicroscopeIcon, ShovelIcon, 
    ChartSplineIcon, RotateCcwIcon, StethoscopeIcon, BotIcon, 
    ScanLineIcon, CowIcon, WalletIcon, HandshakeIcon, StoreIcon, 
    NewspaperIcon, LandmarkIcon, BriefcaseMedicalIcon, GraduationCapIcon,
    UserCircleIcon, InfoIcon, MicIcon
} from './icons';

type FeaturePath = 'dashboard' | 'pest-detector' | 'soil-analysis' | 'marketplace' | 'animal-husbandry' | 'crop-monitoring' | 'weather' | 'chatbot' | 'schemes' | 'ai-vet' | 'vet-connect' | 'expert-helpline' | 'profile' | 'about' | 'live-prices' | 'yield-predictor' | 'expense-tracker' | 'crop-rotation' | 'resource-sharing';

interface NavSection {
    title: string;
    items: {
        path: FeaturePath;
        labelKey: string;
        icon: React.FC<any>;
    }[];
}

const navSections: NavSection[] = [
    {
        title: 'Overview',
        items: [
            { path: 'dashboard', labelKey: 'dashboard.farmer.nav.dashboard', icon: LayoutGridIcon },
            { path: 'weather', labelKey: 'dashboard.farmer.nav.weather', icon: CloudSunIcon },
        ]
    },
    {
        title: 'AI & Smart Tools',
        items: [
            { path: 'pest-detector', labelKey: 'dashboard.farmer.nav.pestDetector', icon: MicroscopeIcon },
            { path: 'soil-analysis', labelKey: 'dashboard.farmer.nav.soilAnalysis', icon: ShovelIcon },
            { path: 'yield-predictor', labelKey: 'dashboard.farmer.nav.yieldPredictor', icon: ChartSplineIcon },
            { path: 'crop-rotation', labelKey: 'dashboard.farmer.nav.cropRotation', icon: RotateCcwIcon },
            { path: 'ai-vet', labelKey: 'dashboard.farmer.nav.aiVet', icon: StethoscopeIcon },
            { path: 'chatbot', labelKey: 'dashboard.farmer.nav.chatbot', icon: BotIcon },
        ]
    },
    {
        title: 'Farm Management',
        items: [
            { path: 'crop-monitoring', labelKey: 'dashboard.farmer.nav.cropMonitoring', icon: ScanLineIcon },
            { path: 'animal-husbandry', labelKey: 'dashboard.farmer.nav.animalHusbandry', icon: CowIcon },
            { path: 'expense-tracker', labelKey: 'dashboard.farmer.nav.expenseTracker', icon: WalletIcon },
            { path: 'resource-sharing', labelKey: 'dashboard.farmer.nav.resourceSharing', icon: HandshakeIcon },
        ]
    },
    {
        title: 'Market & Trade',
        items: [
            { path: 'marketplace', labelKey: 'dashboard.farmer.nav.marketplace', icon: StoreIcon },
            { path: 'live-prices', labelKey: 'dashboard.farmer.nav.livePrices', icon: NewspaperIcon },
        ]
    },
    {
        title: 'Services & Knowledge',
        items: [
            { path: 'schemes', labelKey: 'dashboard.farmer.nav.schemes', icon: LandmarkIcon },
            { path: 'vet-connect', labelKey: 'dashboard.farmer.nav.vetConnect', icon: BriefcaseMedicalIcon },
            { path: 'expert-helpline', labelKey: 'dashboard.farmer.nav.expertHelpline', icon: GraduationCapIcon },
        ]
    },
    {
        title: 'System',
        items: [
            { path: 'profile', labelKey: 'dashboard.farmer.nav.profile', icon: UserCircleIcon },
            { path: 'about', labelKey: 'dashboard.farmer.nav.about', icon: InfoIcon },
        ]
    }
];

const FarmerDashboard: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    
    // Extract current section from URL
    const currentPath = location.pathname.split('/').pop() || 'dashboard';

    const [isCartOpen, setCartOpen] = useState(false);
    const [isWishlistOpen, setWishlistOpen] = useState(false);
    const [isOrdersOpen, setOrdersOpen] = useState(false);
    const [isNotificationsOpen, setNotificationsOpen] = useState(false);
    const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);

    
    const currentTitle = useMemo(() => {
        for (const section of navSections) {
            const item = section.items.find(i => i.path === currentPath);
            if (item) {
                // Return translated key or fallback to the key itself if no translation found
                const translated = t(item.labelKey);
                return translated === item.labelKey ? item.labelKey : translated;
            }
        }
        return t('dashboard.farmer.title');
    }, [currentPath, t]);

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
                            <h3 className={`px-4 mb-3 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500`}>
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
                                                <div className="absolute inset-0 bg-gradient-to-r from-primary to-green-600 rounded-xl -z-10"></div>
                                            )}
                                            <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary'}`} />
                                            <span>{t(item.labelKey)}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
                
                <div className="p-4 border-t border-gray-200 dark:border-white/5">
                    <div className="flex items-center p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-green-700 flex items-center justify-center text-white font-bold mr-3 shadow-sm">
                            FM
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">Farmer Mode</p>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <p className="text-xs text-green-600 dark:text-green-400 truncate font-medium">Online</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
            
            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 relative bg-gray-50 dark:bg-black">
                <Header 
                    onCartClick={() => setCartOpen(true)}
                    onWishlistClick={() => setWishlistOpen(true)}
                    onOrdersClick={() => setOrdersOpen(true)}
                    onNotificationsClick={() => setNotificationsOpen(true)}
                    onProfileClick={() => navigate('profile')}
                    onLogout={handleLogout}
                    title={currentTitle}
                />
                
                {/* Scrollable Content Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth relative z-0">
                     <Outlet />
                </main>

                {/* Floating AI Voice Assistant Button */}
                <div className="absolute bottom-6 right-6 z-50">
                    <button 
                        onClick={() => setIsVoiceAssistantOpen(true)}
                        className="w-16 h-16 bg-gradient-to-r from-primary to-green-600 rounded-full shadow-xl flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 animate-bounce-slow relative group"
                        aria-label="Open Voice Assistant"
                    >
                        <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping"></div>
                        <MicIcon className="w-8 h-8 relative z-10" />
                        <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            Speak to Raitha Mitra
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

export default FarmerDashboard;
