import { useDndMonitor, useDroppable } from '@dnd-kit/core';
import {
    X,
    ArrowUpRight,
    ChevronDown,
    ChevronRight,
    Download,
    Ellipsis,
    SquarePen,
} from 'lucide-react';

import { cn } from '@/helpers/utils';
import { Button } from '@/components/shadcn/button';
import { Tooltip } from '@/components/shadcn/tooltip-simple';

export const BookmarksGroup = ({
    className,
    id,
    name,
    expanded,
    empty,
    children,
    onAttach,
    onMove,
    onOpenEverything,
    onSaveHere,
    onRemove,
    onToggleExpanded,
}) => {
    const { setNodeRef, isOver } = useDroppable({
        id: `group-${id}`,
        data: {
            id,
            name,
            type: 'group',
        },
    });

    const handleToggle = () => {
        onToggleExpanded?.({ id });
    };

    const handleRemove = () => {
        onRemove?.({ id });
    };

    useDndMonitor({
        onDragEnd: event => {
            const self = event.over?.data?.current;
            const item = event.active?.data?.current;

            if (self?.id === id && item?.type === 'tab') {
                onAttach?.({
                    groupId: id,
                    id: item?.id,
                    payload: item,
                });
            }

            if (self?.id !== id && item?.type === 'bookmark') {
                onMove?.({ id: item?.id, targetGroupId: self?.id });
            }
        },
    });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                'relative flex flex-col gap-4 p-4 border-b border-b-neutral-200',
                'dark:border-b-neutral-700',
                className,
            )}
        >
            <div
                className={cn(
                    'hidden absolute inset-2 border-2 border-dashed border-rose-500 rounded-md pointer-events-none',
                    { block: isOver },
                )}
            />

            <div className='flex flex-row items-center justify-between'>
                <div className='flex flex-row items-center gap-1'>
                    <Button
                        className='text-base leading-1 dark:bg-neutral-700'
                        variant='secondary'
                        onClick={handleToggle}
                    >
                        <span>{name}</span>
                        {expanded ? <ChevronDown /> : <ChevronRight />}
                    </Button>

                    <Tooltip content='Edit Collection'>
                        <Button className='dark:hover:bg-neutral-700' variant='secondary'>
                            <SquarePen />
                        </Button>
                    </Tooltip>
                </div>

                <div className='flex flex-row gap-2'>
                    <Tooltip content='Open tabs'>
                        <Button
                            className='dark:hover:bg-neutral-700'
                            size='icon-xs'
                            variant='ghost'
                            onClick={onOpenEverything}
                        >
                            <ArrowUpRight />
                        </Button>
                    </Tooltip>

                    <Tooltip content='Save session to collection'>
                        <Button
                            className='dark:hover:bg-neutral-700'
                            size='icon-xs'
                            variant='ghost'
                            onClick={onSaveHere}
                        >
                            <Download />
                        </Button>
                    </Tooltip>

                    <Tooltip content='Delete collection'>
                        <Button
                            className='dark:hover:bg-neutral-700'
                            size='icon-xs'
                            variant='ghost'
                            onClick={handleRemove}
                        >
                            <X />
                        </Button>
                    </Tooltip>
                </div>
            </div>

            {expanded && (
                <div className='flex flex-row flex-wrap gap-4'>
                    {!empty ? (
                        children
                    ) : (
                        <div
                            className={cn(
                                'flex-center w-full h-28 bg-neutral-100 text-neutral-500 text-sm rounded-md',
                                'dark:bg-neutral-700 dark:text-neutral-400',
                                {
                                    'bg-rose-200 text-rose-500 dark:bg-rose-500/40 dark:text-rose-400 ':
                                        isOver,
                                },
                            )}
                        >
                            Drag tabs here.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
