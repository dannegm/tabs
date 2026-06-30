import { useDocumentTitle } from '@/hooks/use-document-title';
import { Toaster } from '@/ui/sonner';
import { BusProvider } from '@/providers/bus-provider';
import { DndProvider } from '@/providers/dnd-provider';

export const Providers = ({ children }) => {
    useDocumentTitle('Tabs.');

    return (
        <BusProvider>
            <DndProvider>
                {children}
                <Toaster richColors />
            </DndProvider>
        </BusProvider>
    );
};
