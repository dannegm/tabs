import { useLocalStorage } from './use-local-storage';

const DEFAULT_KEY = 'tabs:collections';

export const useTabsCollection = (storageKey = DEFAULT_KEY) => {
    const [groups, setGroups] = useLocalStorage(storageKey, {});

    const addGroup = ({ id, name, tabs = {} }) => {
        setGroups(prev => ({
            ...prev,
            [id]: { id, name, created_at: Date.now(), index: Object.keys(prev).length, tabs },
        }));
    };

    const removeGroup = ({ id }) => {
        setGroups(prev => {
            const newGroups = { ...prev };
            delete newGroups[id];
            return newGroups;
        });
    };

    const moveTab = ({ id, originalGroupId, targetGroupId }) => {
        setGroups(prev => {
            if (!prev[originalGroupId] || !prev[targetGroupId] || !prev[originalGroupId].tabs[id])
                return prev;
            const tab = prev[originalGroupId].tabs[id];
            const newGroups = { ...prev };
            delete newGroups[originalGroupId].tabs[id];
            newGroups[targetGroupId].tabs[id] = tab;
            return newGroups;
        });
    };

    const addTab = ({ groupId, id, payload }) => {
        setGroups(prev => {
            if (!prev[groupId]) return prev;
            return {
                ...prev,
                [groupId]: {
                    ...prev[groupId],
                    tabs: {
                        ...prev[groupId].tabs,
                        [id]: {
                            id,
                            created_at: Date.now(),
                            index: Object.keys(prev[groupId].tabs).length,
                            ...payload,
                        },
                    },
                },
            };
        });
    };

    const removeTab = ({ groupId, id }) => {
        setGroups(prev => {
            if (!prev[groupId] || !prev[groupId].tabs[id]) return prev;
            const newTabs = { ...prev[groupId].tabs };
            delete newTabs[id];
            return { ...prev, [groupId]: { ...prev[groupId], tabs: newTabs } };
        });
    };

    const clear = () => setGroups({});

    return { groups, addGroup, removeGroup, moveTab, addTab, removeTab, clear };
};
