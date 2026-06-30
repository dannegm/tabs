import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { nanoid } from 'nanoid';
import { fromArray } from '@/modules/common/helpers/objects';
import { chromeStorage } from '@/lib/chrome-storage';

const useCollectionsStore = create(
    chromeStorage((set, get) => ({
        collections: {},

        //* Collections
        addCollection: ({ name, expanded = true, bgColor, items = {} }) => {
            set(state => {
                const id = nanoid();
                return {
                    collections: {
                        ...state.collections,
                        [id]: {
                            id,
                            name,
                            expanded,
                            bgColor: bgColor || null,
                            created_at: Date.now(),
                            index: Object.keys(state.collections).length,
                            items,
                        },
                    },
                };
            });
        },

        editCollection: ({ id, name }) => {
            set(state => ({
                collections: {
                    ...state.collections,
                    [id]: { ...state.collections[id], name },
                },
            }));
        },

        setCollectionBgColor: ({ id, bgColor }) => {
            set(state => ({
                collections: {
                    ...state.collections,
                    [id]: {
                        ...state.collections[id],
                        bgColor: bgColor === 'transparent' ? null : bgColor,
                    },
                },
            }));
        },

        removeCollection: ({ id }) => {
            set(state => {
                const next = { ...state.collections };
                delete next[id];
                return { collections: next };
            });
        },

        toggleCollection: ({ id }) => {
            set(state => ({
                collections: {
                    ...state.collections,
                    [id]: {
                        ...state.collections[id],
                        expanded: !state.collections[id].expanded,
                    },
                },
            }));
        },

        expandAllCollections: () => {
            set(state => ({
                collections: Object.fromEntries(
                    Object.entries(state.collections).map(([id, col]) => [
                        id,
                        { ...col, expanded: true },
                    ]),
                ),
            }));
        },

        collapseAllCollections: () => {
            set(state => ({
                collections: Object.fromEntries(
                    Object.entries(state.collections).map(([id, col]) => [
                        id,
                        { ...col, expanded: false },
                    ]),
                ),
            }));
        },

        clearCollections: () => set({ collections: {} }),

        importCollections: ({ collections }) => {
            set(state => ({
                collections: { ...state.collections, ...collections },
            }));
        },

        sortCollections: ({ items }) => {
            set(state => {
                const next = { ...state.collections };
                items.forEach((id, index) => {
                    if (next[id]) next[id] = { ...next[id], index };
                });
                return { collections: next };
            });
        },

        //* Items
        appendItems: ({ collectionId, items = [] }) => {
            set(state => {
                const col = state.collections[collectionId];
                if (!col) return state;
                const currentIndex = Object.keys(col.items).length;
                const mapped = items.map((item, i) => ({ ...item, index: currentIndex + i }));
                const appended = fromArray(mapped, 'id');
                return {
                    collections: {
                        ...state.collections,
                        [collectionId]: { ...col, items: { ...col.items, ...appended } },
                    },
                };
            });
        },

        addItem: ({ collectionId, id, payload }) => {
            set(state => {
                const col = state.collections[collectionId];
                if (!col) return state;
                return {
                    collections: {
                        ...state.collections,
                        [collectionId]: {
                            ...col,
                            items: {
                                ...col.items,
                                [id]: {
                                    id,
                                    created_at: Date.now(),
                                    index: Object.keys(col.items).length,
                                    ...payload,
                                },
                            },
                        },
                    },
                };
            });
        },

        updateItem: ({ collectionId, id, payload }) => {
            set(state => {
                const col = state.collections[collectionId];
                if (!col) return state;
                return {
                    collections: {
                        ...state.collections,
                        [collectionId]: {
                            ...col,
                            items: {
                                ...col.items,
                                [id]: { ...col.items[id], ...payload },
                            },
                        },
                    },
                };
            });
        },

        moveItem: ({ id, originalCollectionId, targetCollectionId, index }) => {
            set(state => {
                const originalCol = state.collections[originalCollectionId];
                const targetCol = state.collections[targetCollectionId];
                if (!originalCol || !targetCol || !originalCol.items[id]) return state;

                const item = originalCol.items[id];
                const newOriginalItems = { ...originalCol.items };
                delete newOriginalItems[id];

                const newTargetItems = { ...targetCol.items };
                if (typeof index === 'number') {
                    Object.values(newTargetItems).forEach(i => {
                        if (i.index >= index) {
                            newTargetItems[i.id] = { ...i, index: i.index + 1 };
                        }
                    });
                    newTargetItems[id] = { ...item, index };
                } else {
                    newTargetItems[id] = {
                        ...item,
                        index: Object.keys(targetCol.items).length,
                    };
                }

                return {
                    collections: {
                        ...state.collections,
                        [originalCollectionId]: { ...originalCol, items: newOriginalItems },
                        [targetCollectionId]: { ...targetCol, items: newTargetItems },
                    },
                };
            });
        },

        removeItem: ({ collectionId, id }) => {
            set(state => {
                const col = state.collections[collectionId];
                if (!col) return state;
                const newItems = { ...col.items };
                delete newItems[id];
                return {
                    collections: {
                        ...state.collections,
                        [collectionId]: { ...col, items: newItems },
                    },
                };
            });
        },

        sortItems: ({ collectionId, items }) => {
            set(state => {
                const col = state.collections[collectionId];
                if (!col) return state;
                const newItems = { ...col.items };
                items.forEach((id, index) => {
                    if (newItems[id]) newItems[id] = { ...newItems[id], index };
                });
                return {
                    collections: {
                        ...state.collections,
                        [collectionId]: { ...col, items: newItems },
                    },
                };
            });
        },
    })),
);

export const useCollections = () => useCollectionsStore(state => state.collections);

export const useCollectionsActions = () =>
    useCollectionsStore(
        useShallow(state => ({
            addCollection: state.addCollection,
            editCollection: state.editCollection,
            setCollectionBgColor: state.setCollectionBgColor,
            toggleCollection: state.toggleCollection,
            expandAllCollections: state.expandAllCollections,
            collapseAllCollections: state.collapseAllCollections,
            removeCollection: state.removeCollection,
            clearCollections: state.clearCollections,
            importCollections: state.importCollections,
            sortCollections: state.sortCollections,
            appendItems: state.appendItems,
            addItem: state.addItem,
            updateItem: state.updateItem,
            moveItem: state.moveItem,
            removeItem: state.removeItem,
            sortItems: state.sortItems,
        })),
    );
