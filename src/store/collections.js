import { useDispatch, useSelector } from 'react-redux';
import { createSlice } from '@reduxjs/toolkit';
import { fromArray } from '@/modules/common/helpers/objects';

const initialState = {};

const collectionsSlice = createSlice({
    name: 'collections',
    initialState,
    reducers: {
        //* Collections
        addCollection: (state, action) => {
            const { id, name, expanded, items = {} } = action.payload;
            state[id] = {
                id,
                name,
                expanded,
                created_at: Date.now(),
                index: Object.keys(state).length,
                items,
            };
        },
        editCollection: (state, action) => {
            const { id, name } = action.payload;
            state[id].name = name;
        },
        setCollectionBgColor: (state, action) => {
            const { id, bgColor } = action.payload;
            console.log('setCollectionBgColor', id, bgColor);
            state[id].bgColor = bgColor === 'transparent' ? null : bgColor;
        },
        removeCollection: (state, action) => {
            const { id } = action.payload;
            delete state[id];
        },
        toggleCollection: (state, action) => {
            const { id } = action.payload;
            state[id].expanded = !state[id].expanded;
        },
        expandAllColections: state => {
            for (const id in state) {
                state[id].expanded = true;
            }
        },
        collapseAllColections: state => {
            for (const id in state) {
                state[id].expanded = false;
            }
        },
        clearCollections: () => {
            return {};
        },
        importCollection: (state, action) => {
            const { collections } = action.payload;
            return {
                ...state,
                ...collections,
            };
        },
        sortCollections: (state, action) => {
            const { items } = action.payload;

            items.forEach((id, index) => {
                if (state[id]) {
                    state[id].index = index;
                }
            });
        },

        //* Items
        appendItems: (state, action) => {
            const { collectionId, items = {} } = action.payload;
            const existingItems = state[collectionId].items;
            const currentIndex = Object.keys(state[collectionId].items).length;

            const mappedItems = items.map((item, index) => ({
                ...item,
                index: currentIndex + index,
            }));

            const appendedItems = fromArray(mappedItems, 'id');

            state[collectionId].items = {
                ...existingItems,
                ...appendedItems,
            };
        },
        addItem: (state, action) => {
            const { collectionId, id, payload } = action.payload;
            if (!state[collectionId]) return;
            state[collectionId].items[id] = {
                id,
                created_at: Date.now(),
                index: Object.keys(state[collectionId].items).length,
                ...payload,
            };
        },
        updateItem: (state, action) => {
            const { collectionId, id, payload } = action.payload;

            console.log(payload);

            if (!state[collectionId]) return;
            const originalPayload = state[collectionId].items[id];
            state[collectionId].items[id] = {
                ...originalPayload,
                ...payload,
            };
        },
        moveItem: (state, action) => {
            const { id, originalCollectionId, targetCollectionId, index } = action.payload;

            const originalCollection = state[originalCollectionId];
            const targetCollection = state[targetCollectionId];

            if (!originalCollection || !targetCollection || !originalCollection.items[id]) return;

            const item = originalCollection.items[id];
            delete originalCollection.items[id];

            const itemsArray = Object.entries(targetCollection.items).sort(
                (a, b) => a[1].index - b[1].index,
            );

            console.log('index', index);

            if (typeof index === 'number') {
                itemsArray.forEach(([key, value]) => {
                    if (value.index >= index) value.index++;
                });
                item.index = index;
            } else {
                item.index = itemsArray.length;
            }

            targetCollection.items[id] = item;
        },
        removeItem: (state, action) => {
            const { collectionId, id } = action.payload;
            if (state[collectionId]) {
                delete state[collectionId].items[id];
            }
        },
        sortItems: (state, action) => {
            const { collectionId, items } = action.payload;
            items.forEach((id, index) => {
                if (state[collectionId].items[id]) {
                    state[collectionId].items[id].index = index;
                }
            });
        },
    },
});

const {
    //* Collections
    addCollection,
    editCollection,
    setCollectionBgColor,
    removeCollection,
    toggleCollection,
    expandAllColections,
    collapseAllColections,
    clearCollections,
    importCollection,
    sortCollections,

    //* Items
    appendItems,
    addItem,
    updateItem,
    moveItem,
    removeItem,
    sortItems,
} = collectionsSlice.actions;

export default collectionsSlice.reducer;

export const useCollections = () => {
    return useSelector(state => state.collections);
};

export const useCollectionsActions = () => {
    const dispatch = useDispatch();

    return {
        //* Collections
        addCollection: ({ id, name, expanded, items = {} }) =>
            dispatch(addCollection({ id, name, expanded, items })),
        editCollection: ({ id, name }) => dispatch(editCollection({ id, name })),
        setCollectionBgColor: ({ id, bgColor }) => dispatch(setCollectionBgColor({ id, bgColor })),
        toggleCollection: ({ id }) => dispatch(toggleCollection({ id })),
        expandAllColections: () => dispatch(expandAllColections()),
        collapseAllColections: () => dispatch(collapseAllColections()),
        removeCollection: ({ id }) => dispatch(removeCollection({ id })),
        clearCollections: () => dispatch(clearCollections()),
        importCollection: ({ collections }) => dispatch(importCollection({ collections })),
        sortCollections: ({ items }) => dispatch(sortCollections({ items })),

        //* Items
        appendItems: ({ collectionId, items }) => dispatch(appendItems({ collectionId, items })),
        addItem: ({ collectionId, id, payload }) =>
            dispatch(addItem({ collectionId, id, payload })),
        updateItem: ({ collectionId, id, payload }) =>
            dispatch(updateItem({ collectionId, id, payload })),
        moveItem: ({ id, originalCollectionId, targetCollectionId, index }) =>
            dispatch(moveItem({ id, originalCollectionId, targetCollectionId, index })),
        removeItem: ({ collectionId, id }) => dispatch(removeItem({ collectionId, id })),
        sortItems: ({ collectionId, items }) => dispatch(sortItems({ collectionId, items })),
    };
};
