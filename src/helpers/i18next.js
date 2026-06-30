import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '@/locales/en.json';
import es from '@/locales/es.json';
import zh from '@/locales/zh.json';
import hi from '@/locales/hi.json';
import ar from '@/locales/ar.json';
import fr from '@/locales/fr.json';
import pt from '@/locales/pt.json';
import ru from '@/locales/ru.json';
import bn from '@/locales/bn.json';
import ja from '@/locales/ja.json';
import de from '@/locales/de.json';
import it from '@/locales/it.json';
import ko from '@/locales/ko.json';

export const languages = {
    en: {
        en_name: 'English (US)',
        native_name: 'English (US)',
        flag: '🇺🇸',
        flag_code: 'US',
        direction: 'ltr',
    },
    es: {
        en_name: 'Spanish (MX)',
        native_name: 'Español (MX)',
        flag: '🇲🇽',
        flag_code: 'MX',
        direction: 'ltr',
    },
    zh: {
        en_name: 'Chinese (Mandarin)',
        native_name: '中文 (普通话)',
        flag: '🇨🇳',
        flag_code: 'CN',
        direction: 'ltr',
    },
    hi: {
        en_name: 'Hindi',
        native_name: 'हिन्दी',
        flag: '🇮🇳',
        flag_code: 'IN',
        direction: 'ltr',
    },
    ar: {
        en_name: 'Arabic',
        native_name: 'العربية',
        flag: '🇸🇦',
        flag_code: 'SA',
        direction: 'rtl',
    },
    fr: {
        en_name: 'French',
        native_name: 'Français',
        flag: '🇫🇷',
        flag_code: 'FR',
        direction: 'ltr',
    },
    pt: {
        en_name: 'Portuguese (Brazil)',
        native_name: 'Português (Brasil)',
        flag: '🇧🇷',
        flag_code: 'BR',
        direction: 'ltr',
    },
    ru: {
        en_name: 'Russian',
        native_name: 'Русский',
        flag: '🇷🇺',
        flag_code: 'RU',
        direction: 'ltr',
    },
    bn: {
        en_name: 'Bengali',
        native_name: 'বাংলা',
        flag: '🇧🇩',
        flag_code: 'BD',
        direction: 'ltr',
    },
    ja: {
        en_name: 'Japanese',
        native_name: '日本語',
        flag: '🇯🇵',
        flag_code: 'JP',
        direction: 'ltr',
    },
    de: {
        en_name: 'German',
        native_name: 'Deutsch',
        flag: '🇩🇪',
        flag_code: 'DE',
        direction: 'ltr',
    },
    it: {
        en_name: 'Italian',
        native_name: 'Italiano',
        flag: '🇮🇹',
        flag_code: 'IT',
        direction: 'ltr',
    },
    ko: {
        en_name: 'Korean',
        native_name: '한국어',
        flag: '🇰🇷',
        flag_code: 'KR',
        direction: 'ltr',
    },
};

export const getDefaultLangCode = () => (navigator.language || 'en').split('-')[0];

const resources = { en, es, zh, hi, ar, fr, pt, ru, bn, ja, de, it, ko };

i18n.use(initReactI18next).init({
    resources,
    fallbackLng: 'en',
});

export default i18n;
