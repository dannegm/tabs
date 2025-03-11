import { useDndMonitor, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { X, File } from 'lucide-react';

import { cn } from '@/helpers/utils';
import { Button } from '@/components/shadcn/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/shadcn/tooltip';

export const TabItem = ({ className, item }) => {
    const { setNodeRef, attributes, listeners, transform, isDragging } = useDraggable({
        id: `tab-item-${item?.id}`,
        data: {
            ...item,
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
        <div ref={setNodeRef} style={style} className={cn({ 'relative z-10': isDragging })}>
            <div
                className={cn(
                    'group flex flex-row gap-2 px-3 py-2 pr-1 items-center bg-white text-sm border border-neutral-200 rounded-sm',
                    'dark:bg-neutral-800 dark:border-neutral-600',
                    'cursor-grab touch-none transition-all duration-150',
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
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                className='invisible group-hover:visible'
                                size='icon-xs'
                                variant='ghost'
                                onClick={handleClose}
                            >
                                <X />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side='left'>
                            <p>Close tab</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
};
