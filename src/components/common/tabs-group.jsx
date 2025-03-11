import { useState } from 'react';
import { nanoid } from 'nanoid';
import { formatDate } from 'date-fns';
import { ChevronDown, ChevronRight, Download, X } from 'lucide-react';

import { cn } from '@/helpers/utils';
import { fromArray } from '@/helpers/objects';
import { useGroupsActions } from '@/store/tabs';

import { Button } from '@/components/shadcn/button';
import { Separator } from '@/components/shadcn/separator';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/shadcn/tooltip';

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
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className='dark:hover:bg-neutral-700'
                                    size='icon-xs'
                                    variant='ghost'
                                    onClick={handleSaveSession}
                                >
                                    <Download />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side='bottom'>
                                <p>Save session</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className='dark:hover:bg-neutral-700'
                                    size='icon-xs'
                                    variant='ghost'
                                    onClick={handleClose}
                                >
                                    <X />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side='bottom'>
                                <p>Close window</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            {open && <div className='flex flex-col gap-2'>{children}</div>}

            <Separator className='dark:bg-neutral-700' />
        </div>
    );
};
