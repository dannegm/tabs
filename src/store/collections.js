import { fromArray } from '@/modules/common/helpers/objects';
import { createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

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
            return collections;
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

    //* Items
    appendItems,
    addItem,
    moveItem,
    removeItem,
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

        //* Items
        appendItems: ({ collectionId, items }) => dispatch(appendItems({ collectionId, items })),
        addItem: ({ collectionId, id, payload }) =>
            dispatch(addItem({ collectionId, id, payload })),
        moveItem: ({ id, originalCollectionId, targetCollectionId }) =>
            dispatch(moveItem({ id, originalCollectionId, targetCollectionId })),
        removeItem: ({ collectionId, id }) => dispatch(removeItem({ collectionId, id })),
    };
};
