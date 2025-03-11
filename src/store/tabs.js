import { createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

const initialState = {};

const tabsSlice = createSlice({
    name: 'tabs',
    initialState,
    reducers: {
        addGroup: (state, action) => {
            const { id, name, tabs = {} } = action.payload;
            state[id] = {
                id,
                name,
                created_at: Date.now(),
                index: Object.keys(state).length,
                tabs,
            };
        },
        removeGroup: (state, action) => {
            const { id } = action.payload;
            delete state[id];
        },
        addTab: (state, action) => {
            const { groupId, id, payload } = action.payload;
            if (!state[groupId]) return;
            state[groupId].tabs[id] = {
                id,
                created_at: Date.now(),
                index: Object.keys(state[groupId].tabs).length,
                ...payload,
            };
        },
        moveTab: (state, action) => {
            const { id, originalGroupId, targetGroupId } = action.payload;

            const originalGroup = state[originalGroupId];
            const targetGroup = state[targetGroupId];

            if (!originalGroup || !targetGroup || !originalGroup.tabs[id]) return;

            const tab = originalGroup.tabs[id];

            delete originalGroup.tabs[id];
            targetGroup.tabs[id] = tab;
        },
        removeTab: (state, action) => {
            const { groupId, id } = action.payload;
            if (state[groupId]) {
                delete state[groupId].tabs[id];
            }
        },
        clear: () => {
            return {};
        },
    },
});

const { addGroup, removeGroup, addTab, moveTab, removeTab, clear } = tabsSlice.actions;

export default tabsSlice.reducer;

export const useGroups = () => {
    return useSelector(state => state.tabs);
};

export const useGroupsActions = () => {
    const dispatch = useDispatch();

    return {
        addGroup: ({ id, name, tabs = {} }) => dispatch(addGroup({ id, name, tabs })),
        removeGroup: id => dispatch(removeGroup(id)),
        addTab: ({ groupId, id, payload }) => dispatch(addTab({ groupId, id, payload })),
        moveTab: ({ id, originalGroupId, targetGroupId }) =>
            dispatch(moveTab({ id, originalGroupId, targetGroupId })),
        removeTab: ({ groupId, id }) => dispatch(removeTab({ groupId, id })),
        clear: () => dispatch(clear()),
    };
};
