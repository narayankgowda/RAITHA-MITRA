
import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../useTheme';
import { SunIcon, MoonIcon, PaletteIcon, ImageIcon, CheckCircleIcon } from './icons';
import { ColorTheme } from '../contexts/ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme, colorTheme, setColorTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'colors' | 'scenes'>('colors');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const colors: { id: ColorTheme; label: string; color: string }[] = [
      { id: 'green', label: 'Nature', color: '#16a34a' },
      { id: 'blue', label: 'Ocean', color: '#2563eb' },
      { id: 'orange', label: 'Harvest', color: '#ea580c' },
      { id: 'purple', label: 'Berry', color: '#9333ea' },
      { id: 'red', label: 'Earth', color: '#dc2626' },
      { id: 'teal', label: 'Forest', color: '#0d9488' },
      { id: 'pink', label: 'Flower', color: '#db2777' },
      { id: 'yellow', label: 'Sunshine', color: '#ca8a04' },
  ];

  const scenes: { id: ColorTheme; label: string; img: string; icon: string }[] = [
      { id: 'glass', label: 'Glass', img: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', icon: '💎' },
      { id: 'mountains', label: 'Peaks', img: 'url(https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=200)', icon: '🏔️' },
      { id: 'fields', label: 'Grass', img: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=200)', icon: '🌾' },
      { id: 'midnight', label: 'Night', img: 'url(https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=80&w=200)', icon: '✨' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full text-text-light/70 dark:text-text-dark/70 hover:bg-black/5 dark:hover:bg-white/10 hover:text-text-light dark:hover:text-text-dark transition-colors flex items-center justify-center relative group"
            aria-label="Theme Settings"
        >
            <PaletteIcon className="h-6 w-6" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></span>
        </button>

        {isOpen && (
            <div className="absolute right-0 mt-3 w-72 bg-card-light dark:bg-card-dark rounded-2xl shadow-2xl border border-border-light dark:border-border-dark p-0 z-50 animate-scaleIn overflow-hidden ring-1 ring-black/5">
                
                {/* Header / Mode Toggle */}
                <div className="p-4 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                    <span className="text-sm font-bold text-text-light dark:text-text-dark">Appearance</span>
                    <button 
                        onClick={toggleTheme}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-black rounded-full border border-gray-200 dark:border-gray-700 shadow-sm text-xs font-medium transition-transform active:scale-95"
                    >
                        {theme === 'dark' ? (
                            <><MoonIcon className="w-3.5 h-3.5 text-blue-400"/> Dark</>
                        ) : (
                            <><SunIcon className="w-3.5 h-3.5 text-yellow-500"/> Light</>
                        )}
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex p-1 m-3 bg-gray-100 dark:bg-slate-800 rounded-lg">
                    <button 
                        onClick={() => setActiveTab('colors')}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'colors' ? 'bg-white dark:bg-card-dark shadow text-primary' : 'text-gray-500'}`}
                    >
                        Basic Colors
                    </button>
                    <button 
                        onClick={() => setActiveTab('scenes')}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'scenes' ? 'bg-white dark:bg-card-dark shadow text-primary' : 'text-gray-500'}`}
                    >
                        Super Themes
                    </button>
                </div>

                <div className="p-4 pt-0 pb-5">
                    {activeTab === 'colors' ? (
                        <div className="grid grid-cols-4 gap-3">
                            {colors.map((c) => (
                                <button
                                    key={c.id}
                                    onClick={() => setColorTheme(c.id)}
                                    className={`w-10 h-10 rounded-full transition-transform hover:scale-110 flex items-center justify-center relative shadow-sm ${colorTheme === c.id ? 'ring-2 ring-offset-2 ring-primary dark:ring-offset-gray-900' : ''}`}
                                    style={{ backgroundColor: c.color }}
                                    title={c.label}
                                >
                                    {colorTheme === c.id && <CheckCircleIcon className="w-5 h-5 text-white drop-shadow-md"/>}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            {scenes.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => setColorTheme(s.id)}
                                    className={`relative h-16 rounded-xl overflow-hidden group transition-all ${colorTheme === s.id ? 'ring-2 ring-offset-2 ring-primary dark:ring-offset-gray-900' : 'opacity-80 hover:opacity-100'}`}
                                >
                                    <div 
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                        style={{ background: s.img, backgroundSize: 'cover' }}
                                    ></div>
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                        <span className="text-xl drop-shadow-md">{s.icon}</span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider drop-shadow-md mt-1">{s.label}</span>
                                    </div>
                                    {colorTheme === s.id && (
                                        <div className="absolute top-1 right-1 bg-primary rounded-full p-0.5">
                                            <CheckCircleIcon className="w-3 h-3 text-white"/>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};

export default ThemeSwitcher;
