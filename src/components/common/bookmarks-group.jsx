import { useDndMonitor, useDroppable } from '@dnd-kit/core';
import {
    X,
    ArrowUpRight,
    ChevronDown,
    ChevronRight,
    Download,
    SquarePen,
    Save,
} from 'lucide-react';

import { cn } from '@/helpers/utils';
import { Button } from '@/components/shadcn/button';
import { Tooltip } from '@/components/shadcn/tooltip-simple';
import { sanitizeItem } from '@/helpers/mappers';
import { Input } from '../shadcn/input';
import { useState } from 'react';

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
    onEdit,
}) => {
    const [editting, setEditting] = useState(false);
    const [newName, setNewName] = useState(name);

    const { setNodeRef, isOver } = useDroppable({
        id: `group-${id}`,
        data: {
            id,
            name,
            type: 'group',
        },
    });

    const handleEditCancel = () => {
        setEditting(false);
        setNewName(name);
    };

    const handleEditSave = ev => {
        ev.preventDefault();
        setEditting(false);
        onEdit?.({ id, name: newName });
    };

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
                    payload: sanitizeItem(item),
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

            <div className='flex flex-row items-center gap-2'>
                {!editting ? (
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
                            <Button
                                className='dark:hover:bg-neutral-700'
                                variant='secondary'
                                size='icon'
                                onClick={() => setEditting(true)}
                            >
                                <SquarePen />
                            </Button>
                        </Tooltip>
                    </div>
                ) : (
                    <form className='flex flex-row items-center gap-1' onSubmit={handleEditSave}>
                        <Input
                            className='min-w-96'
                            placeholder='Type a new group name...'
                            value={newName}
                            onChange={ev => setNewName(ev.target.value)}
                        />

                        <Tooltip content='Edit Collection'>
                            <Button
                                type='button'
                                className='dark:hover:bg-neutral-700'
                                variant='secondary'
                                size='icon'
                                onClick={handleEditCancel}
                            >
                                <X />
                            </Button>
                        </Tooltip>

                        <Tooltip content='Edit Collection'>
                            <Button
                                type='submit'
                                className='dark:hover:bg-neutral-700'
                                variant='secondary'
                            >
                                <Save /> Save
                            </Button>
                        </Tooltip>
                    </form>
                )}

                <div className='flex-1' />

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
