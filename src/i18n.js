import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import globalIT from './locales/it/global.json'; 
import mineralIT from './locales/it/mineral.json'; 
import crystalSystemIT from './locales/it/crystalSystem.json'; 
import mineralClassIT from './locales/it/mineralClass.json'; 

i18n
  .use(initReactI18next)
  .init({
    resources: {
      it: {
        translation: {
        ...globalIT,
        ...mineralIT,
        ...crystalSystemIT,
        ...mineralClassIT
        }
      }
    },
    lng: 'it',
    defaultNS: 'translation',
    fallbackLng: 'it',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;