import { useRef } from 'react';
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

export const BookmarkItem = ({ className, item, onRemove }) => {
    const { setNodeRef, attributes, listeners, transform, isDragging } = useDraggable({
        id: `bookmark-item-${item?.id}`,
        data: {
            ...item,
            type: 'bookmark',
        },
    });

    const $anchor = useRef();

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    const handleRemove = () => {
        onRemove?.(item);
    };

    useDndMonitor({
        onDragMove: () => {
            $anchor.current?.removeAttribute?.('href');
        },
        onDragEnd: () => {
            setTimeout(() => {
                $anchor.current?.setAttribute?.('href', $anchor.current?.dataset?.href);
            }, 0);
        },
    });

    return (
        <div ref={setNodeRef} style={style}>
            <div className='relative group'>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                className='hidden group-hover:flex absolute z-20 top-2 right-2 dark:hover:bg-neutral-700'
                                size='icon-xs'
                                variant='ghost'
                                onClick={handleRemove}
                            >
                                <X />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Remove bookmark</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <div
                    className={cn(
                        'relative cursor-grab transition-all duration-150 rounded-sm select-none',
                        { 'cursor-grabbing shadow-md': isDragging },
                        className,
                    )}
                    {...listeners}
                    {...attributes}
                >
                    <a
                        ref={$anchor}
                        className={cn(
                            'flex flex-col w-52 bg-white border border-neutral-200 rounded-sm',
                            'dark:bg-neutral-800 dark:border-neutral-700',
                            className,
                        )}
                        href={item?.url}
                        data-href={item?.url}
                    >
                        <div className='flex flex-row gap-2 items-center justify-start h-16 px-4'>
                            {item?.favIconUrl ? (
                                <img className='size-6' src={item?.favIconUrl} />
                            ) : (
                                <File className='size-6' />
                            )}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className='text-sm line-clamp-1'>{item?.title}</span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{item?.title}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div
                                        className={cn(
                                            'px-2 py-1.5 bg-neutral-100 text-xs line-clamp-1',
                                            'dark:bg-neutral-700',
                                        )}
                                    >
                                        {item?.url}
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side='bottom'>
                                    <p>{item?.url}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </a>
                </div>
            </div>
        </div>
    );
};
