import { useEffect } from 'react';
import { useSettings } from './use-settings';

export const useDarkMode = () => {
    const getSystemTheme = () =>
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    const [theme, setTheme] = useSettings('theme', null);

    useEffect(() => {
        if (theme === null) setTheme(getSystemTheme());
    }, []);

    const toggle = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

    return [theme, toggle];
};
