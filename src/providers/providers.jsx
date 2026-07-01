import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/tanstack-router';

import { useDocumentTitle } from '@/hooks/use-document-title';
import { Toaster } from '@/ui/sonner';
import { BusProvider } from '@/providers/bus-provider';
import { DndProvider } from '@/providers/dnd-provider';

const queryClient = new QueryClient();

export const Providers = ({ children }) => {
    useDocumentTitle('Tabs.');

    return (
        <QueryClientProvider client={queryClient}>
            <NuqsAdapter>
                <BusProvider>
                    <DndProvider>
                        {children}
                        <Toaster richColors />
                    </DndProvider>
                </BusProvider>
            </NuqsAdapter>
        </QueryClientProvider>
    );
};
