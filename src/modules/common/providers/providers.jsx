import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { DndContext } from '@dnd-kit/core';

import { store, persistor } from '@/store/store';
import { useDocumentTitle } from '@/modules/common/hooks/use-document-title';

export const Providers = ({ children }) => {
    useDocumentTitle('Tabs.');
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <DndContext>{children}</DndContext>
            </PersistGate>
        </Provider>
    );
};
