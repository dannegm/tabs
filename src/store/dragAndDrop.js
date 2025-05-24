import { useDispatch, useSelector } from 'react-redux';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    draggingItem: {
        type: null,
    },
};

const dragAndDropSlice = createSlice({
    name: 'dragAndDrop',
    initialState,
    reducers: {
        setItemType: (state, action) => {
            const { type } = action.payload;
            state.draggingItem.type = type;
        },
        resetItemType: state => {
            state.draggingItem.type = null;
        },
    },
});

const { setItemType, resetItemType } = dragAndDropSlice.actions;

export default dragAndDropSlice.reducer;

export const useDradAndDrop = () => {
    return useSelector(state => state.dragAndDrop);
};

export const useDradAndDropActions = () => {
    const dispatch = useDispatch();

    return {
        setItemType: ({ type }) => dispatch(setItemType({ type })),
        resetItemType: () => dispatch(resetItemType()),
    };
};
