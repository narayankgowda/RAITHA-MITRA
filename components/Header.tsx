import React from 'react';
import { ShoppingCartIcon, HeartIcon, PackageIcon, BellIcon, LeafIcon, LogOutIcon, UserCircleIcon } from './icons';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useOrders } from '../hooks/useOrders';
import { useNotifications } from '../hooks/useNotifications';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';


interface HeaderProps {
    onCartClick?: () => void;
    onWishlistClick?: () => void;
    onOrdersClick?: () => void;
    onNotificationsClick?: () => void;
    onProfileClick?: () => void;
    onLogout?: () => void;
    title?: string;
}

const Header: React.FC<HeaderProps> = ({ onCartClick, onWishlistClick, onOrdersClick, onNotificationsClick, onProfileClick, onLogout, title = "Agri-AI Assistant" }) => {
    const { state: cartState } = useCart();
    const { state: wishlistState } = useWishlist();
    const { state: notificationState } = useNotifications();


    const cartItemCount = onCartClick ? cartState.items.reduce((acc, item) => acc + item.quantity, 0) : 0;
    const wishlistItemCount = onWishlistClick ? wishlistState.items.length : 0;
    const notificationCount = onNotificationsClick ? notificationState.notifications.length : 0;


    const TooltipButton: React.FC<{ 
        onClick?: () => void; 
        count?: number; 
        children: React.ReactNode; 
        tooltip: string; 
        'aria-label': string 
    }> = ({ onClick, count, children, tooltip, 'aria-label': ariaLabel }) => (
        <div className="relative flex items-center">
            <button 
                onClick={onClick} 
                className="group relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors" 
                aria-label={ariaLabel}
            >
                {children}
                {count !== undefined && count > 0 && (
                    <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                        {count}
                    </span>
                )}
                <div className="absolute top-full mt-2 whitespace-nowrap px-2 py-1 text-xs text-white bg-slate-800 dark:bg-slate-900 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    {tooltip}
                </div>
            </button>
        </div>
    );

    return (
        <header className="bg-card-light dark:bg-card-dark shadow-md sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <LeafIcon className="h-8 w-8 text-primary dark:text-primary-light" />
                        <h1 className="text-xl md:text-2xl font-bold ml-2">{title}</h1>
                    </div>
                    <div className="flex items-center space-x-1">
                        <ThemeSwitcher />
                        <LanguageSwitcher />
                         <div className="border-l border-border-light dark:border-border-dark h-6 mx-1"></div>
                        {onNotificationsClick && <TooltipButton onClick={onNotificationsClick} count={notificationCount} tooltip="Notifications" aria-label="View notifications">
                            <BellIcon className="h-6 w-6" />
                        </TooltipButton>}
                        {onWishlistClick && <TooltipButton onClick={onWishlistClick} count={wishlistItemCount} tooltip="Wishlist" aria-label="Wishlist">
                            <HeartIcon className="h-6 w-6" />
                        </TooltipButton>}
                         {onOrdersClick && <TooltipButton onClick={onOrdersClick} tooltip="My Orders" aria-label="My Orders">
                            <PackageIcon className="h-6 w-6" />
                        </TooltipButton>}
                        {onCartClick && <TooltipButton onClick={onCartClick} count={cartItemCount} tooltip="Shopping Cart" aria-label="Shopping Cart">
                            <ShoppingCartIcon className="h-6 w-6" />
                        </TooltipButton>}
                        {onProfileClick && (
                             <TooltipButton onClick={onProfileClick} tooltip="My Profile" aria-label="My Profile">
                                <UserCircleIcon className="h-6 w-6" />
                            </TooltipButton>
                        )}
                        {onLogout && (
                             <div className="border-l border-border-light dark:border-border-dark h-6 mx-1"></div>
                        )}
                        {onLogout && (
                            <TooltipButton onClick={onLogout} tooltip="Logout" aria-label="Logout">
                                <LogOutIcon className="h-6 w-6" />
                            </TooltipButton>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;