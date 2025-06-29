import React from 'react';
import { FaGlobe } from 'react-icons/fa';
import { useLanguage, languages } from '../context/LanguageContext';

const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="language-selector fixed top-20 right-4 z-10">
      <div className="bg-white shadow-md rounded-lg p-2">
        <div className="flex items-center gap-2 mb-2">
          <FaGlobe className="text-blueColor" />
          <span className="text-sm font-medium">{t.languageSelector}</span>
        </div>
        <div className="flex flex-col gap-1">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`text-left px-3 py-1 rounded-md text-sm ${
                language === lang.code ? 'bg-blueColor text-white' : 'hover:bg-blue-50'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;