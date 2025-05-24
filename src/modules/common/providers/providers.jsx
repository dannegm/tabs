import { useDocumentTitle } from '@/modules/common/hooks/use-document-title';
import { StoreProvider } from './store-provider';

import { Toaster } from '@/modules/shadcn/components/sonner';

export const Providers = ({ children }) => {
    useDocumentTitle('Tabs.');

    return (
        <StoreProvider>
            {children}
            <Toaster />
        </StoreProvider>
    );
};
