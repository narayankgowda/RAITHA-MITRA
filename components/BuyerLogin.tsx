import React from 'react';
import { useTranslation } from 'react-i18next';

interface LoginProps {
  onLogin: () => void;
  onBack: () => void;
}

const BuyerLogin: React.FC<LoginProps> = ({ onLogin, onBack }) => {
  const { t } = useTranslation();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('https://storage.googleapis.com/aistudio-marketplace-public-test-assets/buyer_bg.jpg')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20">
        <button onClick={onBack} className="absolute top-4 left-4 text-white hover:text-blue-300 transition">&larr; {t('login.back')}</button>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">{t('login.buyer.title')}</h1>
          <p className="text-blue-200">{t('login.buyer.subtitle')}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-blue-200 text-sm font-bold mb-2" htmlFor="username">{t('login.usernameLabel')}</label>
            <input className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-blue-200/70 border border-white/30 focus:border-blue-400 focus:bg-white/30 focus:outline-none transition" id="username" type="text" placeholder="buyer_user" defaultValue="buyer_user" />
          </div>
          <div>
            <label className="block text-blue-200 text-sm font-bold mb-2" htmlFor="password">{t('login.passwordLabel')}</label>
            <input className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-blue-200/70 border border-white/30 focus:border-blue-400 focus:bg-white/30 focus:outline-none transition" id="password" type="password" placeholder="••••••••" defaultValue="password" />
          </div>
          <button type="submit" className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition shadow-lg">{t('login.loginButton')}</button>
        </form>
      </div>
    </div>
  );
};

export default BuyerLogin;
