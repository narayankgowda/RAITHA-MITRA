import React from 'react';
import { useTranslation } from 'react-i18next';
import { TractorIcon, StoreIcon, SettingsIcon } from './icons';

interface LandingPageProps {
  onSelectRole: (role: 'farmer' | 'buyer' | 'admin') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSelectRole }) => {
  const { t } = useTranslation();

  const RoleCard: React.FC<{
    role: 'farmer' | 'buyer' | 'admin';
    title: string;
    description: string;
    icon: React.ReactNode;
    imageUrl: string;
    buttonClass: string;
    buttonText: string;
  }> = ({ role, title, description, icon, imageUrl, buttonClass, buttonText }) => (
    <div 
        className="relative rounded-lg overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-105 group bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-60 transition-all duration-300"></div>
      <div className="relative p-8 md:p-12 flex flex-col items-center justify-center text-center h-full min-h-[350px]">
        <div className={`mb-4 text-5xl md:text-6xl text-white`}>{icon}</div>
        <h2 className={`text-3xl md:text-4xl font-extrabold text-white mb-2`}>{title}</h2>
        <p className={`text-white text-opacity-90 mb-6 max-w-xs`}>{description}</p>
        <button
          onClick={() => onSelectRole(role)}
          className={`px-8 py-3 font-bold rounded-lg shadow-lg transform transition-transform duration-200 group-hover:scale-110 ${buttonClass}`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-black text-gray-800 dark:text-white">{t('landing.title')}</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">{t('landing.subtitle')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        <RoleCard
          role="farmer"
          title={t('landing.farmer.title')}
          description={t('landing.farmer.description')}
          icon={<TractorIcon />}
          imageUrl="https://storage.googleapis.com/aistudio-marketplace-public-test-assets/farmer_bg.jpg"
          buttonClass="bg-white text-green-700 hover:bg-green-100"
          buttonText={t('landing.farmer.button')}
        />
        <RoleCard
          role="buyer"
          title={t('landing.buyer.title')}
          description={t('landing.buyer.description')}
          icon={<StoreIcon />}
          imageUrl="https://storage.googleapis.com/aistudio-marketplace-public-test-assets/buyer_bg.jpg"
          buttonClass="bg-white text-blue-700 hover:bg-blue-100"
          buttonText={t('landing.buyer.button')}
        />
        <RoleCard
          role="admin"
          title={t('landing.admin.title')}
          description={t('landing.admin.description')}
          icon={<SettingsIcon />}
          imageUrl="https://storage.googleapis.com/aistudio-marketplace-public-test-assets/admin_bg.jpg"
          buttonClass="bg-white text-slate-800 hover:bg-slate-200"
          buttonText={t('landing.admin.button')}
        />
      </div>
    </div>
  );
};

export default LandingPage;
