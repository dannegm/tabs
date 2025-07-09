import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '@/modules/common/locales/en.json';
import es from '@/modules/common/locales/es.json';
import zh from '@/modules/common/locales/zh.json';
import hi from '@/modules/common/locales/hi.json';
import ar from '@/modules/common/locales/ar.json';
import fr from '@/modules/common/locales/fr.json';
import pt from '@/modules/common/locales/pt.json';
import ru from '@/modules/common/locales/ru.json';
import bn from '@/modules/common/locales/bn.json';
import ja from '@/modules/common/locales/ja.json';
import de from '@/modules/common/locales/de.json';
import it from '@/modules/common/locales/it.json';
import ko from '@/modules/common/locales/ko.json';

export const languages = {
    en: {
        en_name: 'English (US)',
        native_name: 'English (US)',
        flag: '🇺🇸',
        direction: 'ltr',
    },
    es: {
        en_name: 'Spanish (MX)',
        native_name: 'Español (MX)',
        flag: '🇲🇽',
        direction: 'ltr',
    },
    zh: {
        en_name: 'Chinese (Mandarin)',
        native_name: '中文 (普通话)',
        flag: '🇨🇳',
        direction: 'ltr',
    },
    hi: {
        en_name: 'Hindi',
        native_name: 'हिन्दी',
        flag: '🇮🇳',
        direction: 'ltr',
    },
    ar: {
        en_name: 'Arabic',
        native_name: 'العربية',
        flag: '🇸🇦',
        direction: 'rtl',
    },
    fr: {
        en_name: 'French',
        native_name: 'Français',
        flag: '🇫🇷',
        direction: 'ltr',
    },
    pt: {
        en_name: 'Portuguese (Brazil)',
        native_name: 'Português (Brasil)',
        flag: '🇧🇷',
        direction: 'ltr',
    },
    ru: {
        en_name: 'Russian',
        native_name: 'Русский',
        flag: '🇷🇺',
        direction: 'ltr',
    },
    bn: {
        en_name: 'Bengali',
        native_name: 'বাংলা',
        flag: '🇧🇩',
        direction: 'ltr',
    },
    ja: {
        en_name: 'Japanese',
        native_name: '日本語',
        flag: '🇯🇵',
        direction: 'ltr',
    },
    de: {
        en_name: 'German',
        native_name: 'Deutsch',
        flag: '🇩🇪',
        direction: 'ltr',
    },
    it: {
        en_name: 'Italian',
        native_name: 'Italiano',
        flag: '🇮🇹',
        direction: 'ltr',
    },
    ko: {
        en_name: 'Korean',
        native_name: '한국어',
        flag: '🇰🇷',
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
