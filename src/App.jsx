import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { DndContext } from '@dnd-kit/core';

import { store, persistor } from './store/store';
import { useDocumentTitle } from './hooks/use-document-title';
import { Main } from './layout/main';

export const App = () => {
    useDocumentTitle('Tabs.');
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <DndContext>
                    <Main />
                </DndContext>
            </PersistGate>
        </Provider>
    );
};
