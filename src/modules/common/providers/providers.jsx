import { useDocumentTitle } from '@/modules/common/hooks/use-document-title';
import { Toaster } from '@/modules/shadcn/components/sonner';

export const Providers = ({ children }) => {
    useDocumentTitle('Tabs.');

    return (
        <>
            {children}
            <Toaster richColors />
        </>
    );
};
