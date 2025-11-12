import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import PestDetector from './PestDetector';
import SoilAnalysis from './SoilAnalysis';
import Marketplace from './Marketplace';
import Cart from './Cart';
import WishlistModal from './WishlistModal';
import OrderHistoryModal from './OrderHistoryModal';
import MandiLocator from './MandiLocator';
import AnimalHusbandry from './AnimalHusbandry';
import GovernmentSchemes from './GovernmentSchemes';
import CropMonitoring from './CropMonitoring';
import Weather from './Weather';
import Chatbot from './Chatbot';
import AIVetAssistant from './AIVetAssistant';
import VetConnect from './VetConnect';
import NotificationsPanel from './NotificationsPanel';
import ExpertHelpline from './ExpertHelpline';
import FarmerProfile from './FarmerProfile';
import FarmerPortfolio from './FarmerPortfolio';
import DashboardHome from './DashboardHome';


import { 
    LeafIcon, FlaskConicalIcon, ShoppingCartIcon, MapPinIcon, 
    PawPrintIcon, ActivityIcon, SunIcon, BotIcon,
    HeartIcon, ShieldCheckIcon, HeadsetIcon, UserCircleIcon, GlobeIcon,
    LayoutGridIcon, ChevronLeftIcon, ChevronRightIcon
} from './icons';

interface FarmerDashboardProps {
    onLogout: () => void;
}

type Feature = 'dashboard' | 'pestDetector' | 'soilAnalysis' | 'marketplace' | 'mandiLocator' | 'animalHusbandry' | 'cropMonitoring' | 'weather' | 'chatbot' | 'schemes' | 'aiVet' | 'vetConnect' | 'expertHelpline' | 'profile' | 'portfolio';

const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ onLogout }) => {
    const { t } = useTranslation();
    const [activeFeature, setActiveFeature] = useState<Feature>('dashboard');
    const [isCartOpen, setCartOpen] = useState(false);
    const [isWishlistOpen, setWishlistOpen] = useState(false);
    const [isOrdersOpen, setOrdersOpen] = useState(false);
    const [isNotificationsOpen, setNotificationsOpen] = useState(false);
    
    const navRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    const checkScrollButtons = () => {
        if (navRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
            setShowLeftArrow(scrollLeft > 1);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    useEffect(() => {
        const navElement = navRef.current;
        if (navElement) {
            checkScrollButtons();
            navElement.addEventListener('scroll', checkScrollButtons);
            window.addEventListener('resize', checkScrollButtons);
            
            const timer = setTimeout(checkScrollButtons, 100);

            return () => {
                navElement.removeEventListener('scroll', checkScrollButtons);
                window.removeEventListener('resize', checkScrollButtons);
                clearTimeout(timer);
            };
        }
    }, []);
    
    useEffect(() => {
        if (navRef.current) {
            const activeButton = navRef.current.querySelector(`[data-feature-id="${activeFeature}"]`);
            if (activeButton) {
                activeButton.scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center',
                    block: 'nearest'
                });
            }
        }
    }, [activeFeature]);

    const handleScroll = (direction: 'left' | 'right') => {
        if (navRef.current) {
            const scrollAmount = navRef.current.clientWidth * 0.7;
            navRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const renderFeature = () => {
        switch (activeFeature) {
            case 'dashboard': return <DashboardHome onNavigate={setActiveFeature} />;
            case 'pestDetector': return <PestDetector />;
            case 'soilAnalysis': return <SoilAnalysis />;
            case 'marketplace': return <Marketplace />;
            case 'mandiLocator': return <MandiLocator />;
            case 'animalHusbandry': return <AnimalHusbandry />;
            case 'cropMonitoring': return <CropMonitoring />;
            case 'weather': return <Weather />;
            case 'chatbot': return <Chatbot />;
            case 'schemes': return <GovernmentSchemes />;
            case 'aiVet': return <AIVetAssistant />;
            case 'vetConnect': return <VetConnect />;
            case 'expertHelpline': return <ExpertHelpline />;
            case 'profile': return <FarmerProfile />;
            case 'portfolio': return <FarmerPortfolio />;
            default: return <DashboardHome onNavigate={setActiveFeature} />;
        }
    };
    
    const navItems = [
        { id: 'dashboard', label: t('dashboard.farmer.nav.dashboard'), icon: <LayoutGridIcon className="w-5 h-5" /> },
        { id: 'pestDetector', label: t('dashboard.farmer.nav.pestDetector'), icon: <LeafIcon className="w-5 h-5" /> },
        { id: 'soilAnalysis', label: t('dashboard.farmer.nav.soilAnalysis'), icon: <FlaskConicalIcon className="w-5 h-5" /> },
        { id: 'marketplace', label: t('dashboard.farmer.nav.marketplace'), icon: <ShoppingCartIcon className="w-5 h-5" /> },
        { id: 'mandiLocator', label: t('dashboard.farmer.nav.mandiLocator'), icon: <MapPinIcon className="w-5 h-5" /> },
        { id: 'animalHusbandry', label: t('dashboard.farmer.nav.animalHusbandry'), icon: <PawPrintIcon className="w-5 h-5" /> },
        { id: 'aiVet', label: t('dashboard.farmer.nav.aiVet'), icon: <HeartIcon className="w-5 h-5" /> },
        { id: 'vetConnect', label: t('dashboard.farmer.nav.vetConnect'), icon: <ShieldCheckIcon className="w-5 h-5" /> },
        { id: 'expertHelpline', label: t('dashboard.farmer.nav.expertHelpline'), icon: <HeadsetIcon className="w-5 h-5" /> },
        { id: 'cropMonitoring', label: t('dashboard.farmer.nav.cropMonitoring'), icon: <ActivityIcon className="w-5 h-5" /> },
        { id: 'weather', label: t('dashboard.farmer.nav.weather'), icon: <SunIcon className="w-5 h-5" /> },
        { id: 'schemes', label: t('dashboard.farmer.nav.schemes'), icon: <ShieldCheckIcon className="w-5 h-5" /> },
        { id: 'chatbot', label: t('dashboard.farmer.nav.chatbot'), icon: <BotIcon className="w-5 h-5" /> },
        { id: 'portfolio', label: t('dashboard.farmer.nav.portfolio'), icon: <GlobeIcon className="w-5 h-5" /> },
    ];

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans">
            <Header 
                onCartClick={() => setCartOpen(true)}
                onWishlistClick={() => setWishlistOpen(true)}
                onOrdersClick={() => setOrdersOpen(true)}
                onNotificationsClick={() => setNotificationsOpen(true)}
                onProfileClick={() => setActiveFeature('profile')}
                onLogout={onLogout}
                title={t('dashboard.farmer.title')}
            />
            
            <nav className="bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark sticky top-16 z-10">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
                    <div className="relative flex items-center">
                         <div ref={navRef} className="flex space-x-2 overflow-x-auto py-2 scrollbar-hide">
                            {navItems.map(item => (
                                <button
                                    key={item.id}
                                    data-feature-id={item.id}
                                    onClick={() => setActiveFeature(item.id as Feature)}
                                    className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                                        activeFeature === item.id
                                        ? 'bg-primary/10 text-primary dark:text-primary-light'
                                        : 'hover:bg-gray-100 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>
                        <div className={`absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-card-light dark:from-card-dark pointer-events-none transition-opacity ${showLeftArrow ? 'opacity-100' : 'opacity-0'}`}></div>
                        <div className={`absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-card-light dark:from-card-dark pointer-events-none transition-opacity ${showRightArrow ? 'opacity-100' : 'opacity-0'}`}></div>

                        <button 
                            onClick={() => handleScroll('left')}
                            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm rounded-full shadow-md hover:bg-gray-200 dark:hover:bg-slate-700 border border-border-light dark:border-border-dark transition-opacity ${showLeftArrow ? 'opacity-100' : 'opacity-0'}`}
                            aria-label="Scroll left"
                        >
                            <ChevronLeftIcon className="w-5 h-5" />
                        </button>
                         <button 
                            onClick={() => handleScroll('right')}
                            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm rounded-full shadow-md hover:bg-gray-200 dark:hover:bg-slate-700 border border-border-light dark:border-border-dark transition-opacity ${showRightArrow ? 'opacity-100' : 'opacity-0'}`}
                            aria-label="Scroll right"
                        >
                            <ChevronRightIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
                {renderFeature()}
            </main>
            
            <Cart isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
            <WishlistModal isOpen={isWishlistOpen} onClose={() => setWishlistOpen(false)} />
            <OrderHistoryModal isOpen={isOrdersOpen} onClose={() => setOrdersOpen(false)} />
            <NotificationsPanel isOpen={isNotificationsOpen} onClose={() => setNotificationsOpen(false)} />

            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
        </div>
    );
};

export default FarmerDashboard;