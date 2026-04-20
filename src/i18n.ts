import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en';
import ko from './locales/ko';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ko: { translation: ko },
    },
    lng: 'ko', // 기본 언어: 한국어
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React는 이미 XSS를 방어함
    },
  });

export default i18n;
