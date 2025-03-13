import { cn } from '@/modules/common/helpers/utils';
import { useSettings } from '@/modules/common/hooks/use-settings';
import { useCollections } from '@/store/collections';
import { JsonViewer } from '@/modules/common/components/json-viewer';

export const Debugger = () => {
    const [debug] = useSettings('settings:debug', false);
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
