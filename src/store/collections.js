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
        removeCollection: (state, action) => {
            const { id } = action.payload;
            delete state[id];
        },
        toggleCollection: (state, action) => {
            const { id } = action.payload;
            state[id].expanded = !state[id].expanded;
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
            const { id, originalCollectionId, targetCollectionId } = action.payload;

            const originalCollection = state[originalCollectionId];
            const targetCollection = state[targetCollectionId];

            if (!originalCollection || !targetCollection || !originalCollection.items[id]) return;

            const item = originalCollection.items[id];

            delete originalCollection.items[id];
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
    removeCollection,
    toggleCollection,
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
        toggleCollection: ({ id }) => dispatch(toggleCollection({ id })),
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
        moveItem: ({ id, originalCollectionId, targetCollectionId }) =>
            dispatch(moveItem({ id, originalCollectionId, targetCollectionId })),
        removeItem: ({ collectionId, id }) => dispatch(removeItem({ collectionId, id })),
        sortItems: ({ collectionId, items }) => dispatch(sortItems({ collectionId, items })),
    };
};
