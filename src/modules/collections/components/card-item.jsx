import { useRef } from 'react';
import { useDndMonitor, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { X, File } from 'lucide-react';

import { cn } from '@/modules/common/helpers/utils';

import { Button } from '@/modules/shadcn/components/button';
import { Tooltip } from '@/modules/shadcn/components/tooltip-simple';
import { ConfirmPopover } from '@/modules/common/components/confirm-popover';

export const CardItem = ({ className, item, onRemove }) => {
    const { setNodeRef, attributes, listeners, transform, isDragging } = useDraggable({
        id: `card-${item?.id}`,
        data: {
            ...item,
            type: 'card',
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
                <ConfirmPopover
                    title='Remove card'
                    description='This action is permanent and cannot be undone.'
                    align='end'
                    onAccept={handleRemove}
                >
                    <div>
                        <Tooltip content='Remove card'>
                            <Button
                                className='hidden group-hover:flex absolute z-20 top-2 right-2 dark:hover:bg-neutral-700'
                                size='icon-xs'
                                variant='ghost'
                            >
                                <X />
                            </Button>
                        </Tooltip>
                    </div>
                </ConfirmPopover>

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

                            <Tooltip side='top' content={item?.title}>
                                <span className='text-sm line-clamp-1'>{item?.title}</span>
                            </Tooltip>
                        </div>

                        <Tooltip content={item?.url}>
                            <div
                                className={cn(
                                    'px-2 py-1.5 bg-neutral-100 text-xs text-ellipsis truncate',
                                    'dark:bg-neutral-700',
                                )}
                            >
                                {item?.url}
                            </div>
                        </Tooltip>
                    </a>
                </div>
            </div>
        </div>
    );
};
