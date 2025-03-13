import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { createStateSyncMiddleware, initMessageListener } from 'redux-state-sync';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import collectionsReducer from './collections';

const rootReducer = combineReducers({
    collections: collectionsReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['collections'],
};

const stateSyncConfig = {
    channel: 'channel:store',
    whitelist: ['collections'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(createStateSyncMiddleware(stateSyncConfig)),
});

export const persistor = persistStore(store);

initMessageListener(store);
