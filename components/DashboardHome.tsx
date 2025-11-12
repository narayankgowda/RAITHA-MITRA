import React from 'react';
import ProfileWidget from './ProfileWidget';
import WeatherWidget from './WeatherWidget';
import { LeafIcon, FlaskConicalIcon, PawPrintIcon, ShoppingCartIcon } from './icons';
import { useTranslation } from 'react-i18next';
import { mockFarmerData } from '../data/userData';

type Feature = 'pestDetector' | 'soilAnalysis' | 'marketplace' | 'mandiLocator' | 'animalHusbandry' | 'cropMonitoring' | 'weather' | 'chatbot' | 'schemes' | 'aiVet' | 'vetConnect' | 'expertHelpline' | 'profile' | 'portfolio';

interface DashboardHomeProps {
  onNavigate: (feature: Feature) => void;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const farmer = mockFarmerData;

  const QuickAction: React.FC<{ label: string; icon: React.ReactNode; onClick: () => void }> = ({ label, icon, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center p-4 bg-background-light dark:bg-slate-800/50 rounded-lg shadow-sm border border-border-light dark:border-border-dark text-center hover:bg-green-50 dark:hover:bg-slate-700 transition-all hover:shadow-md h-full">
      <div className="text-primary dark:text-primary-light mb-2">{icon}</div>
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold">Welcome back, {farmer.name.split(' ')[0]}!</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
            <ProfileWidget onNavigate={() => onNavigate('profile')} />
        </div>
        <div className="lg:col-span-1">
            <WeatherWidget onNavigate={() => onNavigate('weather')} />
        </div>
        <div className="lg:col-span-1 bg-card-light dark:bg-card-dark p-4 rounded-lg shadow-md border border-border-light dark:border-border-dark">
            <h3 className="font-bold text-lg mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4 h-[calc(100%-2.75rem)]">
                <QuickAction label={t('dashboard.farmer.nav.pestDetector')} icon={<LeafIcon className="w-8 h-8"/>} onClick={() => onNavigate('pestDetector')} />
                <QuickAction label={t('dashboard.farmer.nav.soilAnalysis')} icon={<FlaskConicalIcon className="w-8 h-8"/>} onClick={() => onNavigate('soilAnalysis')} />
                <QuickAction label={t('dashboard.farmer.nav.animalHusbandry')} icon={<PawPrintIcon className="w-8 h-8"/>} onClick={() => onNavigate('animalHusbandry')} />
                <QuickAction label={t('dashboard.farmer.nav.marketplace')} icon={<ShoppingCartIcon className="w-8 h-8"/>} onClick={() => onNavigate('marketplace')} />
            </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardHome;