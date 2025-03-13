import { nanoid } from 'nanoid';
import { Bolt, Plus, Trash2 } from 'lucide-react';

import { cn } from '@/modules/common/helpers/utils';

import { useCollectionsActions } from '@/store/collections';

import { DarkModeToggle } from '@/modules/main/components/dark-mode-toggle';
import { DebugModeToggle } from '@/modules/main/components/debug-mode-toggle';
import { SettingsMenu } from '@/modules/main/components/settings-menu';

import { CreateCollectionDialog } from '@/modules/collections/components/create-collection-dialog';

import { Button } from '@/modules/shadcn/components/button';
import { ConfirmPopover } from '@/modules/common/components/confirm-popover';
import { Tooltip } from '@/modules/shadcn/components/tooltip-simple';

export const Header = () => {
    const { addCollection } = useCollectionsActions();

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
