import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { createStateSyncMiddleware, initMessageListener } from 'redux-state-sync';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import tabsReducer from './tabs';

const rootReducer = combineReducers({
    tabs: tabsReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['tabs'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(createStateSyncMiddleware({})),
});

export const persistor = persistStore(store);

initMessageListener(store);
