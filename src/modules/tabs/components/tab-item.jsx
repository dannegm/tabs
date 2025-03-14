import { useDndMonitor, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { X, File, Volume2, VenetianMask } from 'lucide-react';

import { cn } from '@/modules/common/helpers/utils';
import { sanitizeItem } from '@/modules/common/helpers/mappers';
import { closeTab } from '@/modules/common/helpers/chrome';

import { Button } from '@/modules/shadcn/components/button';
import { Tooltip } from '@/modules/shadcn/components/tooltip-simple';

export const TabItem = ({ className, windowId, item }) => {
    const { setNodeRef, attributes, listeners, transform, isDragging } = useDraggable({
        id: `tab-item-${windowId}-${item?.id}`,
        data: {
            ...sanitizeItem(item),
            type: 'tab',
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    const handleClose = () => {
        closeTab(item?.id);
    };

    useDndMonitor({
        onDragEnd: event => {
            const { active, over } = event;
            const activeData = active?.data?.current;
            const overData = over?.data?.current;

            const tabSameEntity = activeData?.id === item?.id;
            const activeIsTab = activeData?.type === 'tab';
            const overIsCollection = overData?.type === 'collection';

            if (tabSameEntity && activeIsTab && overIsCollection) {
                handleClose();
            }
        },
    });

    return (
        <div data-layer='tab-item' ref={setNodeRef} style={style}>
            <div className='relative group'>
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
                        'flex flex-row gap-2 px-3 py-2 items-center bg-white text-neutral-800 text-sm border border-neutral-200 rounded-sm select-none',
                        'dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200',
                        'cursor-grab touch-none transition-all duration-150',
                        {
                            'bg-neutral-800 border-neutral-600 text-neutral-200 dark:bg-white dark:border-neutral-200 dark:text-neutral-800':
                                item?.incognito,
                        },
                        { 'cursor-grabbing shadow-md': isDragging },
                        className,
                    )}
                    {...listeners}
                    {...attributes}
                >
                    {item?.favIconUrl ? (
                        <img className='size-4' src={item.favIconUrl} />
                    ) : (
                        <File className='size-4' />
                    )}

                    <span className='flex-1 line-clamp-1'>{item.title}</span>

                    {item?.audible && <Volume2 className='size-4' />}
                    {item?.incognito && (
                        <Tooltip content='Incognito'>
                            <VenetianMask className='size-4' />
                        </Tooltip>
                    )}
                </div>
            </div>
        </div>
    );
};
