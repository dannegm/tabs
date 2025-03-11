import { DndContext } from '@dnd-kit/core';

import { useDocumentTitle } from './hooks/use-document-title';
import { Main } from './layout/main';

export const App = () => {
    useDocumentTitle('Tabs.');
    return (
        <DndContext>
            <Main />
        </DndContext>
    );
};
