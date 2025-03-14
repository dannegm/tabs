import { useState } from 'react';
import { useDndMonitor, useDroppable } from '@dnd-kit/core';
import { arrayMove, useSortable } from '@dnd-kit/sortable';

import {
    X,
    ArrowUpRight,
    ChevronDown,
    ChevronRight,
    Download,
    SquarePen,
    Save,
} from 'lucide-react';

import { cn, match } from '@/modules/common/helpers/utils';
import { sortBy } from '@/modules/common/helpers/arrays';
import { sanitizeItem } from '@/modules/common/helpers/mappers';

import { Button } from '@/modules/shadcn/components/button';
import { Tooltip } from '@/modules/shadcn/components/tooltip-simple';
import { Input } from '@/modules/shadcn/components/input';

import { CardItem } from '@/modules/collections/components/card-item';
import { ConfirmPopover } from '@/modules/common/components/confirm-popover';
import { CollectionSortableContext } from './collection-sortable-context';
import { useCollectionsActions } from '@/store/collections';

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

    const { sortItems } = useCollectionsActions();

    const iterableItems = sortBy(Object.values(items), 'index');

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

    //* DnD
    const matchers = {
        attach: {
            matcher: ({ activeData, overData }) => {
                const isSameCollection = overData?.id === id;
                const activeIsTab = activeData?.type === 'tab';
                const overNotCard = overData?.type !== 'card';
                return isSameCollection && activeIsTab && overNotCard;
            },
            handler: ({ activeData }) => {
                onAttachItem?.({
                    collectionId: id,
                    id: activeData?.id,
                    payload: sanitizeItem(activeData),
                });
            },
        },
        move: {
            matcher: ({ activeData, overData }) => {
                const isOtherCollection = overData?.id !== id;
                const activeIsCard = activeData?.type === 'card';
                const overNotCard = overData?.type !== 'card';
                return isOtherCollection && activeIsCard && overNotCard;
            },
            handler: ({ activeData, overData }) => {
                onMoveItem?.({ id: activeData?.id, targetCollectionId: overData?.id });
            },
        },
        sort: {
            matcher: ({ active, over, activeData, overData }) => {
                console.log('sort matcher', { active, over, activeData, overData });
                const areDifferent = active?.id !== over?.id;
                const areCards = activeData?.type === 'card' && overData?.type === 'card';
                return areDifferent && areCards;
            },
            handler: ({ activeData, overData }) => {
                const oldIndex = iterableItems.findIndex(item => item.id === activeData?.id);
                const newIndex = iterableItems.findIndex(item => item.id === overData?.id);
                const sortedItems = arrayMove(iterableItems, oldIndex, newIndex).map(
                    item => item?.id,
                );
                sortItems({ collectionId: id, items: sortedItems });
            },
        },
    };

    useDndMonitor({
        onDragEnd: event => {
            const { active, over } = event;
            const activeData = active?.data?.current;
            const overData = over?.data?.current;

            match({ active, over, activeData, overData })
                .when(matchers.attach.matcher, matchers.attach.handler)
                .when(matchers.move.matcher, matchers.move.handler)
                .when(matchers.sort.matcher, matchers.sort.handler)
                .run();
        },
    });

    return (
        <div
            data-layer='collection-item'
            className={cn(
                'relative flex flex-col gap-4 p-4 pl-8 border-b border-b-neutral-200',
                'dark:border-b-neutral-700',
                className,
            )}
        >
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
                                'group-[.drag-over]/sortable:bg-rose-200 group-[.drag-over]/sortable:text-rose-500 group-[.drag-over]/sortable:dark:bg-rose-500/40 group-[.drag-over]/sortable:dark:text-rose-400',
                            )}
                        >
                            Drag tabs here.
                        </div>
                    )}

                    <CollectionSortableContext collectionId={id} items={iterableItems}>
                        {iterableItems.map((item, index) => (
                            <CardItem
                                key={item.id}
                                collectionId={id}
                                item={item}
                                index={index}
                                onRemove={item => onRemoveItem?.(id, item)}
                            />
                        ))}
                    </CollectionSortableContext>
                </div>
            )}
        </div>
    );
};
