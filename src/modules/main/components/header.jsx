import { nanoid } from 'nanoid';
import { Bolt, Plus } from 'lucide-react';

import { useCollections, useCollectionsActions } from '@/store/collections';

import { cn, styled } from '@/modules/common/helpers/utils';

import { DarkModeToggle } from '@/modules/main/components/dark-mode-toggle';
import { DebugModeToggle } from '@/modules/main/components/debug-mode-toggle';
import { SettingsMenu } from '@/modules/main/components/settings-menu';

import { Button } from '@/modules/shadcn/components/button';
import { Tooltip } from '@/modules/shadcn/components/tooltip-simple';

import { CreateCollectionDialog } from '@/modules/collections/components/create-collection-dialog';

const Separator = styled('div', 'flex-none h-4 w-px bg-neutral-200 dark:bg-neutral-700');

export const Header = () => {
    const collections = useCollections();
    const collectionsCount = Object.keys(collections).length;
    const { addCollection, expandAllColections, collapseAllColections } = useCollectionsActions();

    const handleAddCollection = ({ name }) => {
        const payload = {
            name,
            id: nanoid(),
            expanded: true,
        };
        addCollection(payload);
    };

    return (
        <div
            data-layer='header'
            className={cn(
                'flex flex-row items-center h-12 p-4 pl-8 border-b border-b-neutral-200',
                'dark:border-b-neutral-700',
            )}
        >
            <div data-layer='logo' className='flex-1 flex flex-row items-center gap-2'>
                <h1
                    className={cn(
                        'text-sm font-bold uppercase text-rose-600',
                        'dark:text-rose-400',
                    )}
                >
                    Tabs.
                </h1>
                <Separator />
                <p className='text-xs'>
                    {collectionsCount === 1 ? `1 collection` : `${collectionsCount} collections`}{' '}
                </p>
            </div>

            <div data-layer='toolbar' className='flex flex-row gap-1 items-center'>
                <Button
                    className='dark:text-neutral-200 dark:hover:bg-neutral-700'
                    size='sm'
                    variant='ghost'
                    onClick={expandAllColections}
                >
                    Expand
                </Button>
                <Button
                    className='dark:text-neutral-200 dark:hover:bg-neutral-700'
                    size='sm'
                    variant='ghost'
                    onClick={collapseAllColections}
                >
                    Collapse
                </Button>

                <DebugModeToggle />
                <DarkModeToggle />

                <SettingsMenu>
                    <div>
                        <Tooltip content='Settings'>
                            <Button
                                className='dark:text-neutral-50 dark:hover:bg-neutral-700'
                                size='icon'
                                variant='ghost'
                            >
                                <Bolt />
                            </Button>
                        </Tooltip>
                    </div>
                </SettingsMenu>

                <CreateCollectionDialog onCreate={handleAddCollection}>
                    <Button size='sm'>
                        <Plus /> Add Collection
                    </Button>
                </CreateCollectionDialog>
            </div>
        </div>
    );
};
