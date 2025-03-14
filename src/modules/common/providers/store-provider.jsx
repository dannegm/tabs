import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from '@/store/store';

export const StoreProvider = ({ children }) => {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>{children}</PersistGate>
        </Provider>
    );
};
