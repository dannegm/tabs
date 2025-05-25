import { use, useState } from 'react';
import { X, File, Volume2, VenetianMask } from 'lucide-react';

import { cn } from '@/modules/common/helpers/utils';
import { closeTab, focusTab } from '@/modules/common/helpers/chrome';

import { Button } from '@/modules/shadcn/components/button';
import { Tooltip } from '@/modules/shadcn/components/tooltip-simple';
import { toJSON } from '@/modules/common/helpers/objects';

import { useDradAndDropActions } from '@/store/dragAndDrop';

export const TabItem = ({ className, item }) => {
    const { setItemType, resetItemType } = useDradAndDropActions();
    const [dragging, setDragging] = useState(false);

    const handleDoubleClick = () => {
        console.log(item);
        focusTab(item);
    };

    const handleClose = () => {
        closeTab(item?.id);
    };

    const handleDragStart = event => {
        setDragging(true);
        setItemType({ type: 'tab' });
        const data = toJSON({ type: 'tab', data: item });
        event.dataTransfer.setData('text/plain', data);
    };

    const handleDragEnd = () => {
        resetItemType();
        setDragging(false);
    };

    return (
        <div data-layer='tab-item' className='relative group'>
            <Tooltip content='Close tab'>
                <Button
                    className='hidden absolute right-2 top-1/2 transform -translate-y-1/2 group-hover:flex'
                    size='icon-xs'
                    variant='secondary'
                    onClick={handleClose}
                >
                    <X />
                </Button>
            </Tooltip>

            <div
                className={cn(
                    'flex flex-row gap-2 px-3 py-2 w-[calc(var(--sidebar-width)-2rem)] items-center bg-white text-neutral-800 text-sm border border-neutral-200 rounded-sm select-none',
                    'dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200',
                    'cursor-grab touch-none transition-all duration-150',
                    {
                        'bg-neutral-800 border-neutral-600 text-neutral-200 dark:bg-white dark:border-neutral-200 dark:text-neutral-800':
                            item?.incognito,
                    },
                    { 'cursor-grabbing shadow-md': dragging },
                    className,
                )}
                onDoubleClick={handleDoubleClick}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                draggable
            >
                {item?.favIconUrl ? (
                    <img className='size-4' src={item.favIconUrl} />
                ) : (
                    <File className='size-4' />
                )}

                <Tooltip content={item?.title} side='left'>
                    <span className='flex-1 line-clamp-1 text-ellipsis'>{item.title}</span>
                </Tooltip>

                {item?.audible && <Volume2 className='size-4' />}
                {item?.incognito && (
                    <Tooltip content='Incognito'>
                        <VenetianMask className='size-4' />
                    </Tooltip>
                )}
            </div>
        </div>
    );
};
