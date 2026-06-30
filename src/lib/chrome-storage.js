const IS_DEV = process.env.NODE_ENV === 'development';
const STORAGE_KEY = 'collections';

const read = async () => {
    if (IS_DEV) {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    }
    const result = await chrome.storage.local.get(STORAGE_KEY);
    return result[STORAGE_KEY] ?? null;
};

const write = async value => {
    if (IS_DEV) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
            const bc = new BroadcastChannel('collections');
            bc.postMessage(value);
            bc.close();
        } catch {}
        return;
    }
    await chrome.storage.local.set({ [STORAGE_KEY]: value });
};

const onChange = callback => {
    if (IS_DEV) {
        const bc = new BroadcastChannel('collections');
        const handler = event => callback(event.data);
        bc.addEventListener('message', handler);
        return () => bc.close();
    }
    const listener = (changes, area) => {
        if (area === 'local' && changes[STORAGE_KEY]) {
            callback(changes[STORAGE_KEY].newValue);
        }
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
};

export const chromeStorage = config => (set, get, api) => {
    const persistSet = async (partial, replace) => {
        set(partial, replace);
        await write(get().collections);
    };

    const store = config(persistSet, get, api);

    read().then(stored => {
        if (stored !== null) {
            set({ collections: stored });
        }
    });

    const unsubscribe = onChange(collections => {
        set({ collections });
    });

    const originalDestroy = api.destroy;
    api.destroy = () => {
        unsubscribe();
        originalDestroy?.();
    };

    return store;
};
