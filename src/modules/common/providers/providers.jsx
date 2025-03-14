import { useDocumentTitle } from '@/modules/common/hooks/use-document-title';
import { StoreProvider } from './store-provider';
import { DndProvider } from './dnd-provider';

export const Providers = ({ children }) => {
    useDocumentTitle('Tabs.');

    return (
        <StoreProvider>
            <DndProvider>{children}</DndProvider>
        </StoreProvider>
    );
};
