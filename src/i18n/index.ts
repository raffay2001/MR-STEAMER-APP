import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import ar from './locales/ar.json';

const KEY = 'APP_LANGUAGE';

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (cb: (lang: string) => void) => {
    try {
      const saved = await AsyncStorage.getItem(KEY);
      cb(saved || 'en');
    } catch {
      cb('en');
    }
  },
  init: () => {},
  cacheUserLanguage: async (lang: string) => {
    try { await AsyncStorage.setItem(KEY, lang); } catch {}
  },
};

i18n
  // @ts-ignore
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    compatibilityJSON: 'v4',
    interpolation: { escapeValue: false },
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
  });

export default i18n;
