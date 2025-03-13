import { useDndMonitor, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { X, File, Volume2, VenetianMask } from 'lucide-react';

import { cn } from '@/helpers/utils';
import { Button } from '@/components/shadcn/button';
import { Tooltip } from '@/components/shadcn/tooltip-simple';

const sanitizeItem = item => ({
    id: item.id,
    title: item.title,
    url: item.url,
    favIconUrl: item.favIconUrl,
});

export const TabItem = ({ className, item }) => {
    const { setNodeRef, attributes, listeners, transform, isDragging } = useDraggable({
        id: `tab-item-${item?.id}`,
        data: {
            ...sanitizeItem(item),
            type: 'tab',
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    const handleClose = () => {
        chrome?.tabs?.remove?.(item?.id);
    };

    useDndMonitor({
        onDragEnd: event => {
            const self = event.active?.data?.current;
            const target = event.over?.data?.current;

            if (self?.id === item?.id && self?.type === 'tab' && target?.type === 'group') {
                handleClose();
            }
        },
    });

    return (
        <div ref={setNodeRef} style={style}>
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
