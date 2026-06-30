import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Flag from 'react-flagkit';

import { getDefaultLangCode, languages } from '@/helpers/i18next';
import { useSettings } from '@/hooks/use-settings';

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from '@/ui/dropdown-menu';

export const LangSelector = () => {
    const { i18n } = useTranslation();
    const [selectedLang, setSelectedLang] = useSettings('language', getDefaultLangCode());
    const [selectedDirection, setSelectedDirection] = useSettings('direction', 'ltr');

    const changeLanguage = lang => {
        i18n.changeLanguage(lang);

        const direction = languages[lang]?.direction || 'ltr';
        document.documentElement.dir = direction;
        setSelectedDirection(direction);
    };

    useEffect(() => {
        changeLanguage(selectedLang);
    }, [selectedLang]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm'>
                <Flag
                    className='flag border border-black/20'
                    country={languages[i18n.language]?.flag_code}
                    size={22}
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent align={selectedDirection === 'ltr' ? 'end' : 'start'}>
                <DropdownMenuRadioGroup value={selectedLang} onValueChange={setSelectedLang}>
                    {Object.entries(languages).map(([code, { flag_code, native_name }]) => (
                        <DropdownMenuRadioItem key={code} value={code}>
                            <Flag
                                className='flag border border-black/20'
                                country={flag_code}
                                size={20}
                            />
                            {native_name}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
