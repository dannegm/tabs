const IS_DEV = process.env.NODE_ENV === 'development';
const MIGRATION_KEY = 'migration:v2';
const LEGACY_KEY = 'persist:root';

export const runMigration = async () => {
    if (IS_DEV) return;

    const done = await chrome.storage.local.get(MIGRATION_KEY);
    if (done[MIGRATION_KEY]) return;

    const legacy = localStorage.getItem(LEGACY_KEY);
    if (!legacy) {
        await chrome.storage.local.set({ [MIGRATION_KEY]: true });
        return;
    }

    try {
        const root = JSON.parse(legacy);
        const collections = JSON.parse(root.collections);
        await chrome.storage.local.set({ collections, [MIGRATION_KEY]: true });
        localStorage.removeItem(LEGACY_KEY);
    } catch {
        await chrome.storage.local.set({ [MIGRATION_KEY]: true });
    }
};
