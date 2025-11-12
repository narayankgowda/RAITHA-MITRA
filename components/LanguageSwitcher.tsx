import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'es', name: 'Español' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' },
  ];

  const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <div className="relative">
      <select
        value={i18n.language}
        onChange={changeLanguage}
        className="appearance-none bg-transparent py-2 pl-3 pr-8 text-sm font-medium text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary-light focus:outline-none"
        aria-label="Select language"
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code} className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;