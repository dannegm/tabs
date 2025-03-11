import { useEffect, useState } from 'react';

export const useSettings = (settingKey, defaultValue) => {
    const [setting, setSetting] = useState(() => {
        if (typeof window === 'undefined') return defaultValue;
        try {
            const stored = localStorage.getItem(settingKey);
            return stored ? JSON.parse(stored) : defaultValue;
        } catch {
            return defaultValue;
        }
    });

    const setValue = value => {
        try {
            const valueToStore = value instanceof Function ? value(setting) : value;
            localStorage.setItem(settingKey, JSON.stringify(valueToStore));

            const bc = new BroadcastChannel('settings');
            bc.postMessage({ key: settingKey, value: valueToStore });
            bc.close();

            setSetting(valueToStore);
        } catch {}
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const bc = new BroadcastChannel('settings');

        const handleStorageChange = event => {
            if (event.key === settingKey) {
                try {
                    setSetting(event.newValue ? JSON.parse(event.newValue) : defaultValue);
                } catch {}
            }
        };

        const handleBroadcast = event => {
            if (event.data.key === settingKey) {
                setSetting(event.data.value);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        bc.addEventListener('message', handleBroadcast);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            bc.removeEventListener('message', handleBroadcast);
            bc.close();
        };
    }, [settingKey, defaultValue]);

    return [setting, setValue];
};
