import { useState } from 'react';
import { nanoid } from 'nanoid';
import { formatDate } from 'date-fns';
import { ChevronDown, ChevronRight, Download, X } from 'lucide-react';

import { cn } from '@/helpers/utils';
import { fromArray } from '@/helpers/objects';
import { useGroupsActions } from '@/store/tabs';

import { Button } from '@/components/shadcn/button';
import { Separator } from '@/components/shadcn/separator';
import { Tooltip } from '@/components/shadcn/tooltip-simple';

export const TabsGroup = ({ className, id, index, tabs, children }) => {
    const { addGroup } = useGroupsActions();

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
        const tabsCollection = fromArray(tabs, 'id');

        addGroup({
            id: groupId,
            name: dateLabel,
            expanded: true,
            tabs: tabsCollection,
        });

        closeTabsByWindow(+id);
    };

    return (
        <div className={cn('flex flex-col gap-4 rounded-sm', className)}>
            <div className='flex flex-row items-center justify-between'>
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

            {open && <div className='flex flex-col gap-2'>{children}</div>}

            {!tabs.length && <div className='text-sm'>No tabs</div>}

            <Separator className='dark:bg-neutral-700' />
        </div>
    );
};
