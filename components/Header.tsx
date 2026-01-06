
import React from 'react';
import { ShoppingCartIcon, HeartIcon, PackageIcon, BellIcon, LogOutIcon, UserCircleIcon, WifiOffIcon } from './icons';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useNotifications } from '../hooks/useNotifications';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';

interface HeaderProps {
    onCartClick?: () => void;
    onWishlistClick?: () => void;
    onOrdersClick?: () => void;
    onNotificationsClick?: () => void;
    onProfileClick?: () => void;
    onLogout?: () => void;
    title: string;
}

const Header: React.FC<HeaderProps> = ({ onCartClick, onWishlistClick, onOrdersClick, onNotificationsClick, onProfileClick, onLogout, title }) => {
    const { state: cartState } = useCart();
    const { state: wishlistState } = useWishlist();
    const { state: notificationState } = useNotifications();
    const isOnline = useNetworkStatus();

    const cartItemCount = onCartClick ? cartState.items.reduce((acc, item) => acc + item.quantity, 0) : 0;
    const wishlistItemCount = onWishlistClick ? wishlistState.items.length : 0;
    const notificationCount = onNotificationsClick ? notificationState.count : 0;

    const TooltipButton: React.FC<{ 
        onClick?: () => void; 
        count?: number; 
        children: React.ReactNode; 
        tooltip: string; 
        'aria-label': string 
    }> = ({ onClick, count, children, tooltip, 'aria-label': ariaLabel }) => (
        <button 
            onClick={onClick} 
            className="group relative p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-primary transition-all duration-200 active:scale-95" 
            aria-label={ariaLabel}
        >
            {children}
            {count !== undefined && count > 0 && (
                <span className="absolute top-1 right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
            )}
            <div className="absolute top-full right-0 mt-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                {tooltip}
            </div>
        </button>
    );

    return (
        <header className="sticky top-0 z-40 w-full glass shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <div className="flex flex-col justify-center">
                    <h1 className="text-xl md:text-2xl font-black tracking-tight text-gray-800 dark:text-white truncate bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                        {title}
                    </h1>
                    {!isOnline && (
                        <span className="flex items-center text-[10px] font-bold text-red-500 uppercase tracking-wider animate-pulse">
                            <WifiOffIcon className="w-3 h-3 mr-1" /> Offline Mode
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <div className="hidden md:flex items-center gap-2 bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-2xl border border-gray-200 dark:border-gray-700">
                        <ThemeSwitcher />
                        <LanguageSwitcher />
                    </div>
                    
                    <div className="flex items-center gap-1 md:pl-2">
                        {onNotificationsClick && <TooltipButton onClick={onNotificationsClick} count={notificationCount} tooltip="Notifications" aria-label="Notifications"><BellIcon className="h-6 w-6" /></TooltipButton>}
                        {onWishlistClick && <TooltipButton onClick={onWishlistClick} count={wishlistItemCount} tooltip="Wishlist" aria-label="Wishlist"><HeartIcon className="h-6 w-6" /></TooltipButton>}
                        {onOrdersClick && <TooltipButton onClick={onOrdersClick} tooltip="My Orders" aria-label="Orders"><PackageIcon className="h-6 w-6" /></TooltipButton>}
                        {onCartClick && <TooltipButton onClick={onCartClick} count={cartItemCount} tooltip="Cart" aria-label="Cart"><ShoppingCartIcon className="h-6 w-6" /></TooltipButton>}
                    </div>

                    <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-1 hidden md:block"></div>

                    <div className="flex items-center gap-2">
                        {onProfileClick && (
                             <button onClick={onProfileClick} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-green-300 p-[2px]">
                                    <div className="w-full h-full rounded-full bg-white dark:bg-black flex items-center justify-center">
                                        <UserCircleIcon className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                                    </div>
                                </div>
                            </button>
                        )}
                        {onLogout && (
                            <button onClick={onLogout} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors" title="Sign Out">
                                <LogOutIcon className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
