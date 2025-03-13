import { useState } from 'react';
import { nanoid } from 'nanoid';
import { formatDate } from 'date-fns';
import { ChevronDown, ChevronRight, Download, X } from 'lucide-react';

import { cn } from '@/modules/common/helpers/utils';
import { newItem } from '@/modules/common/helpers/mappers';
import { fromArray } from '@/modules/common/helpers/objects';
import { useCollectionsActions } from '@/store/collections';

import { Button } from '@/modules/shadcn/components/button';
import { Separator } from '@/modules/shadcn/components/separator';
import { Tooltip } from '@/modules/shadcn/components/tooltip-simple';
import { TabItem } from './tab-item';

export const TabsGroup = ({ className, id, index, tabs }) => {
    const { addCollection } = useCollectionsActions();

    const [open, setOpen] = useState(true);

    const handleToggle = () => {
        setOpen(!open);
    };

    const handleClose = () => {
        chrome?.windows?.remove?.(+id);
    };

    const closeTabsByWindow = windowId => {
        chrome?.tabs?.query?.({ windowId }, tabs => {
            const currentTabId = tabs.find(tab => tab.active).id;
            tabs.forEach(tab => {
                if (tab.id !== currentTabId) {
                    chrome?.tabs?.remove?.(tab.id);
                }
            });
        });
    };

    const handleSaveSession = () => {
        const groupId = nanoid();
        const dateLabel = formatDate(new Date(), "MMM d, ''yy 'at' HH:mm");
        const mappedTabs = tabs.map(newItem);
        const tabsCollection = fromArray(mappedTabs, 'id');

        addCollection({
            id: groupId,
            name: dateLabel,
            expanded: true,
            items: tabsCollection,
        });

        closeTabsByWindow(+id);
    };

    return (
        <div data-layer='tabs-group' className={cn('flex flex-col gap-4 rounded-sm', className)}>
            <div data-layer='header' className='flex flex-row items-center justify-between'>
                <div className='flex flex-row items-center gap-1'>
                    <Button
                        className='leading-1 dark:bg-neutral-700'
                        variant='secondary'
                        size='xs'
                        onClick={handleToggle}
                    >
                        <span>Window {index + 1}</span>
                        {open ? <ChevronDown /> : <ChevronRight />}
                    </Button>
                </div>
                <div className='flex flex-row items-center gap-1'>
                    <Tooltip content='Save session'>
                        <Button
                            className='dark:hover:bg-neutral-700'
                            size='icon-xs'
                            variant='ghost'
                            onClick={handleSaveSession}
                        >
                            <Download />
                        </Button>
                    </Tooltip>
                    <Tooltip content='Close window'>
                        <Button
                            className='dark:hover:bg-neutral-700'
                            size='icon-xs'
                            variant='ghost'
                            onClick={handleClose}
                        >
                            <X />
                        </Button>
                    </Tooltip>
                </div>
            </div>

            {!tabs.length && <div className='text-sm'>No tabs</div>}

            {open && (
                <div data-layer='items' className='flex flex-col gap-2'>
                    {tabs.map(tab => (
                        <TabItem key={tab.id} item={tab} />
                    ))}
                </div>
            )}

            <Separator className='dark:bg-neutral-700' />
        </div>
    );
};
