import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window === 'undefined') return initialValue;
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            return initialValue;
        }
    });

    const setValue = value => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            localStorage.setItem(key, JSON.stringify(valueToStore));

            // Enviar mensaje a todas las pestañas
            const bc = new BroadcastChannel('local-storage');
            bc.postMessage({ key, value: valueToStore });
            bc.close();
        } catch (error) {}
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const bc = new BroadcastChannel('local-storage');
        const handleStorageChange = event => {
            if (event.key === key) {
                try {
                    const newValue = localStorage.getItem(key);
                    setStoredValue(newValue ? JSON.parse(newValue) : initialValue);
                } catch (error) {}
            }
        };

        const handleBroadcast = event => {
            if (event.data.key === key) {
                setStoredValue(event.data.value);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        bc.addEventListener('message', handleBroadcast);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            bc.removeEventListener('message', handleBroadcast);
            bc.close();
        };
    }, [key]);

    return [storedValue, setValue];
};
