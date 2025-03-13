import { useState } from 'react';
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

import { cn } from '@/modules/common/helpers/utils';
import { sortBy } from '@/modules/common/helpers/arrays';
import { sanitizeItem } from '@/modules/common/helpers/mappers';

import { Button } from '@/modules/shadcn/components/button';
import { Tooltip } from '@/modules/shadcn/components/tooltip-simple';
import { Input } from '@/modules/shadcn/components/input';

import { CardItem } from '@/modules/collections/components/card-item';
import { ConfirmDialog } from '@/modules/common/components/confirm-dialog';
import { ConfirmPopover } from '@/modules/common/components/confirm-popover';

export const CollectionItem = ({
    className,
    id,
    name,
    expanded,
    items,
    onAttachItem,
    onRemoveItem,
    onMoveItem,
    onEdit,
    onToggleExpanded,
    onRemove,
    onOpenEverything,
    onSaveHere,
}) => {
    const [editting, setEditting] = useState(false);
    const [newName, setNewName] = useState(name);

    const iterableItems = Object.values(items) || [];

    const { setNodeRef, isOver } = useDroppable({
        id: `collection-${id}`,
        data: {
            id,
            name,
            type: 'collection',
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

    const handleOpenEverything = () => {
        onOpenEverything?.(iterableItems);
    };

    const handleSaveHere = () => {
        onSaveHere?.({ id });
    };

    useDndMonitor({
        onDragEnd: event => {
            const self = event.over?.data?.current;
            const item = event.active?.data?.current;

            if (self?.id === id && item?.type === 'tab') {
                onAttachItem?.({
                    collectionId: id,
                    id: item?.id,
                    payload: sanitizeItem(item),
                });
            }

            if (self?.id !== id && item?.type === 'card') {
                onMoveItem?.({ id: item?.id, targetCollectionId: self?.id });
            }
        },
    });

    return (
        <div
            data-layer='collection-item'
            ref={setNodeRef}
            className={cn(
                'relative flex flex-col gap-4 p-4 border-b border-b-neutral-200',
                'dark:border-b-neutral-700',
                className,
            )}
        >
            <div
                data-layer='target'
                className={cn(
                    'hidden absolute inset-2 border-2 border-dashed border-rose-500 rounded-md pointer-events-none',
                    { block: isOver },
                )}
            />

            <div data-layer='header' className='group flex flex-row items-center gap-2'>
                {!editting ? (
                    <div data-layer='name' className='flex flex-row items-center gap-1'>
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
                                className='invisible group-hover:visible dark:hover:bg-neutral-700'
                                variant='ghost'
                                size='icon'
                                onClick={() => setEditting(true)}
                            >
                                <SquarePen />
                            </Button>
                        </Tooltip>
                    </div>
                ) : (
                    <form
                        data-layer='editor'
                        className='flex flex-row items-center gap-1'
                        onSubmit={handleEditSave}
                    >
                        <Input
                            className='min-w-96 dark:border-neutral-700'
                            placeholder='Type a new collection name...'
                            value={newName}
                            onChange={ev => setNewName(ev.target.value)}
                        />

                        <Button
                            type='button'
                            className='dark:bg-neutral-700'
                            variant='secondary'
                            size='icon'
                            onClick={handleEditCancel}
                        >
                            <X />
                        </Button>

                        <Button type='submit' className='dark:bg-neutral-700' variant='secondary'>
                            <Save /> Save
                        </Button>
                    </form>
                )}

                <div data-layer='handler' className='flex-1 h-6' />

                <div data-layer='actions' className='flex flex-row gap-2'>
                    <Tooltip content='Open tabs'>
                        <Button
                            className='dark:hover:bg-neutral-700'
                            size='icon-xs'
                            variant='ghost'
                            onClick={handleOpenEverything}
                        >
                            <ArrowUpRight />
                        </Button>
                    </Tooltip>

                    <Tooltip content='Save session to collection'>
                        <Button
                            className='dark:hover:bg-neutral-700'
                            size='icon-xs'
                            variant='ghost'
                            onClick={handleSaveHere}
                        >
                            <Download />
                        </Button>
                    </Tooltip>

                    <ConfirmPopover
                        title='Remove collection'
                        description='This action is permanent and cannot be undone.'
                        align='end'
                        onAccept={handleRemove}
                    >
                        <div>
                            <Tooltip content='Delete collection'>
                                <Button
                                    className='dark:hover:bg-neutral-700'
                                    size='icon-xs'
                                    variant='ghost'
                                >
                                    <X />
                                </Button>
                            </Tooltip>
                        </div>
                    </ConfirmPopover>
                </div>
            </div>

            {expanded && (
                <div data-layer='cards' className='flex flex-row flex-wrap gap-4'>
                    {!iterableItems.length && (
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

                    {sortBy(iterableItems, 'index').map(item => (
                        <CardItem
                            key={item.id}
                            item={item}
                            onRemove={item => onRemoveItem?.(id, item)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
