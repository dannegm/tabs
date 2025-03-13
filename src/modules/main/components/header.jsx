import { nanoid } from 'nanoid';
import { Bolt, Plus, Trash2 } from 'lucide-react';

import { cn } from '@/modules/common/helpers/utils';

import { useCollectionsActions } from '@/store/collections';

import { Button } from '@/modules/shadcn/components/button';
import { Tooltip } from '@/modules/shadcn/components/tooltip-simple';

import { DarkModeToggle } from '@/modules/common/components/dark-mode-toggle';
import { DebugModeToggle } from '@/modules/common/components/debug-mode-toggle';

import { ImportCollectionButton } from '@/modules/collections/components/import-collection-button';
import { CreateCollectionDialog } from '@/modules/collections/components/create-collection-dialog';

export const Header = () => {
    const { addCollection, clearCollections } = useCollectionsActions();

    const handleAddCollection = ({ name }) => {
        const payload = {
            name,
            id: nanoid(),
            expanded: true,
        };
        addCollection(payload);
    };

    const handleClearCollections = () => {
        clearCollections();
    };

    return (
        <div
            data-layer='header'
            className={cn(
                'flex flex-row items-center h-12 p-4 border-b border-b-neutral-200',
                'dark:border-b-neutral-700',
            )}
        >
            <div data-layer='logo' className='flex-1'>
                <h1
                    className={cn(
                        'text-sm font-bold uppercase text-rose-600',
                        'dark:text-rose-400',
                    )}
                >
                    Tabs.
                </h1>
            </div>

            <div data-layer='toolbar' className='flex flex-row gap-1 items-center'>
                <DebugModeToggle />

                <Tooltip content='clearCollections collections'>
                    <Button
                        className='dark:text-neutral-50 dark:hover:bg-neutral-700'
                        size='icon'
                        variant='ghost'
                        onClick={handleClearCollections}
                    >
                        <Trash2 />
                    </Button>
                </Tooltip>

                <ImportCollectionButton />
                <DarkModeToggle />

                <Tooltip content='Settings'>
                    <Button
                        className='dark:text-neutral-50 dark:hover:bg-neutral-700'
                        size='icon'
                        variant='ghost'
                    >
                        <Bolt />
                    </Button>
                </Tooltip>

                <CreateCollectionDialog onCreate={handleAddCollection}>
                    <Button size='sm'>
                        <Plus /> Add Collection
                    </Button>
                </CreateCollectionDialog>
            </div>
        </div>
    );
};
