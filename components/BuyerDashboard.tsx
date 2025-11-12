import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Marketplace from './Marketplace';
import Cart from './Cart';
import WishlistModal from './WishlistModal';
import OrderHistoryModal from './OrderHistoryModal';
import NotificationsPanel from './NotificationsPanel';
import BuyerProfile from './BuyerProfile';

interface BuyerDashboardProps {
    onLogout: () => void;
}

const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ onLogout }) => {
    const { t } = useTranslation();
    const [isCartOpen, setCartOpen] = useState(false);
    const [isWishlistOpen, setWishlistOpen] = useState(false);
    const [isOrdersOpen, setOrdersOpen] = useState(false);
    const [isNotificationsOpen, setNotificationsOpen] = useState(false);
    const [view, setView] = useState<'marketplace' | 'profile'>('marketplace');

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans">
            <Header 
                onCartClick={() => setCartOpen(true)}
                onWishlistClick={() => setWishlistOpen(true)}
                onOrdersClick={() => setOrdersOpen(true)}
                onNotificationsClick={() => setNotificationsOpen(true)}
                onProfileClick={() => setView(v => v === 'profile' ? 'marketplace' : 'profile')}
                onLogout={onLogout}
                title={t('dashboard.buyer.title')}
            />
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                {view === 'marketplace' ? <Marketplace /> : <BuyerProfile />}
            </main>
            <Cart isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
            <WishlistModal isOpen={isWishlistOpen} onClose={() => setWishlistOpen(false)} />
            <OrderHistoryModal isOpen={isOrdersOpen} onClose={() => setOrdersOpen(false)} />
            <NotificationsPanel isOpen={isNotificationsOpen} onClose={() => setNotificationsOpen(false)} />
        </div>
    );
};

export default BuyerDashboard;