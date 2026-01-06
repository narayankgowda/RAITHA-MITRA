
import React from 'react';

interface LogoProps {
    className?: string;
    showTagline?: boolean;
    scale?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = "", showTagline = true, scale = 1 }) => {
    // REPLACE THIS URL WITH YOUR ACTUAL LOGO IMAGE URL
    const logoUrl = "https://raw.githubusercontent.com/Chethanrc/photo/48a230cc396ff562ca7f13aa723d12c893d06a0b/2.jpg"; 

    return (
        <div className={`flex items-center gap-3 ${className}`} style={{ transform: `scale(${scale})`, transformOrigin: 'left center' }}>
            <div className="relative w-12 h-12 flex-shrink-0">
                <img 
                    src={logoUrl} 
                    alt="Raitha Mitra Logo" 
                    className="w-full h-full object-contain drop-shadow-sm"
                />
            </div>
            <div className="flex flex-col">
                <h1 className="text-2xl font-extrabold tracking-tight leading-none text-gray-900 dark:text-white">
                    Raitha<span className="text-primary">Mitra</span>
                </h1>
                {showTagline && (
                    <span className="text-[0.65rem] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-tight mt-0.5">
                        Agri-Tech Platform
                    </span>
                )}
            </div>
        </div>
    );
};
