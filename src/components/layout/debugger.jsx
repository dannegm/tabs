import { cn } from '@/helpers/utils';
import { useSettings } from '@/hooks/use-settings';
import { useCollections } from '@/services/collections';
import { JsonViewer } from '@/components/system/json-viewer';

export const Debugger = () => {
    const [debug] = useSettings('debug', false);
    const collections = useCollections();

    if (!debug) return null;

    return (
        <div
            data-layer='debuger'
            className={cn(
                'p-4 border-b border-b-neutral-200 shadow-sm',
                'dark:border-b-neutral-700',
            )}
        >
            <JsonViewer name='collections' data={collections} />
        </div>
    );
};
