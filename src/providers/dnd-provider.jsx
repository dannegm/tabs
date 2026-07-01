import { useCallback } from 'react';
import {
    DndContext,
    DragOverlay,
    useDndContext,
    closestCenter,
    pointerWithin,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { GripVertical, File } from 'lucide-react';

import { cn } from '@/helpers/utils';
import { move, reverse, sortBy } from '@/helpers/arrays';
import { sanitizeItem } from '@/helpers/mappers';
import { closeTab } from '@/helpers/chrome';
import { useCollections } from '@/services/collections';
import { useEvents } from '@/providers/bus-provider';

const CollectionDragGhost = ({ collection }) => {
    if (!collection) return null;
    const bgColor = collection.bgColor || 'transparent';

    return (
        <div
            className={cn(
                'relative flex items-center gap-2 p-4 pl-8',
                'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white',
                'border border-neutral-200 dark:border-neutral-700',
                'shadow-2xl opacity-90 rounded-sm cursor-grabbing select-none',
            )}
            style={{
                backgroundColor: bgColor !== 'transparent' ? bgColor : undefined,
                minWidth: '20rem',
            }}
        >
            <div className='absolute top-0 left-0 w-1.5 h-full bg-rose-300 dark:bg-rose-500 rounded-l-sm' />
            <GripVertical className='size-4 opacity-40' />
            <span className='font-medium text-sm truncate'>{collection.name}</span>
        </div>
    );
};

const CardDragGhost = ({ item }) => {
    if (!item) return null;
    return (
        <div className='flex flex-col w-52 bg-white border border-neutral-200 rounded-sm overflow-hidden shadow-2xl opacity-90 cursor-grabbing select-none'>
            <div className='flex flex-row gap-2 items-center h-16 px-4'>
                {item?.favIconUrl ? (
                    <img className='size-6' src={item.favIconUrl} />
                ) : (
                    <File className='size-6 text-neutral-400' />
                )}
                <span className='text-sm line-clamp-1 text-neutral-950'>
                    {item?.customTitle || item?.title}
                </span>
            </div>
            <div className='px-2 py-1.5 bg-neutral-100 text-xs text-ellipsis truncate text-neutral-500'>
                {item?.url}
            </div>
        </div>
    );
};

const TabDragGhost = ({ item }) => {
    if (!item) return null;
    return (
        <div
            className={cn(
                'flex flex-row gap-2 px-3 py-2 items-center text-sm rounded-sm select-none',
                'bg-white border border-neutral-200 text-neutral-800',
                'dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200',
                'shadow-xl opacity-90 cursor-grabbing',
                item?.incognito &&
                    'bg-neutral-800 border-neutral-600 text-neutral-200 dark:bg-white dark:border-neutral-200 dark:text-neutral-800',
            )}
            style={{ width: 'calc(var(--sidebar-width) - 2rem)' }}
        >
            {item?.favIconUrl ? (
                <img className='size-4 shrink-0' src={item.favIconUrl} />
            ) : (
                <File className='size-4 shrink-0' />
            )}
            <span className='flex-1 line-clamp-1 text-ellipsis'>{item?.title}</span>
        </div>
    );
};

const ActiveDragOverlay = ({ collections }) => {
    const { active } = useDndContext();
    if (!active) return null;

    const type = active.data.current?.type;

    if (type === 'collection') {
        return (
            <DragOverlay adjustScale={false} dropAnimation={null}>
                <CollectionDragGhost collection={collections[active.id]} />
            </DragOverlay>
        );
    }

    if (type === 'card') {
        const { collectionId, id } = active.data.current;
        const item = collections[collectionId]?.items?.[id];
        return (
            <DragOverlay adjustScale={false} dropAnimation={null}>
                <CardDragGhost item={item} />
            </DragOverlay>
        );
    }

    if (type === 'tab') {
        return (
            <DragOverlay adjustScale={false} dropAnimation={null}>
                <TabDragGhost item={active.data.current?.item} />
            </DragOverlay>
        );
    }

    return null;
};

const cardAwareCollisionDetection = (args) => {
    const activeType = args.active.data.current?.type;

    if (activeType === 'tab') {
        // Tabs must land physically inside a droppable — no fallback,
        // so releasing over the tabs panel yields over=null and cancels cleanly.
        return pointerWithin(args);
    }

    if (activeType === 'card') {
        const pointerCollisions = pointerWithin(args);
        if (pointerCollisions.length > 0) return pointerCollisions;

        // Fall back to closestCenter against non-card droppables (collections, end-zones)
        return closestCenter({
            ...args,
            droppableContainers: args.droppableContainers.filter(
                c => c.data.current?.type !== 'card',
            ),
        });
    }

    return closestCenter(args);
};

export const DndProvider = ({ children }) => {
    const { emit } = useEvents();
    const collections = useCollections();

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const sortedCollections = sortBy(Object.values(collections), 'index', 'desc');

    const handleDragEnd = useCallback(
        ({ active, over }) => {
            if (!over || !active || active.id === over.id) return;

            const activeType = active.data.current?.type;
            const overType = over.data.current?.type;

            if (activeType === 'collection' && overType === 'collection') {
                const oldIndex = sortedCollections.findIndex(c => c.id === active.id);
                const newIndex = sortedCollections.findIndex(c => c.id === over.id);
                if (oldIndex === -1 || newIndex === -1) return;
                const sorted = move(sortedCollections, oldIndex, newIndex).map(c => c.id);
                emit('collections:sort', { items: reverse(sorted) });
                return;
            }

            if (activeType === 'card' && overType === 'card') {
                const { collectionId: activeCollId } = active.data.current;
                const { collectionId: overCollId } = over.data.current;

                if (activeCollId === overCollId) {
                    const collItems = sortBy(
                        Object.values(collections[activeCollId]?.items || {}),
                        'index',
                    );
                    const oldIndex = collItems.findIndex(i => i.id === active.id);
                    const newIndex = collItems.findIndex(i => i.id === over.id);
                    if (oldIndex === -1 || newIndex === -1) return;
                    const sorted = move(collItems, oldIndex, newIndex).map(i => i.id);
                    emit('items:sort', { collectionId: activeCollId, items: sorted });
                } else {
                    const targetItems = sortBy(
                        Object.values(collections[overCollId]?.items || {}),
                        'index',
                    );
                    const index = targetItems.findIndex(i => i.id === over.id);
                    emit('items:move', {
                        id: active.id,
                        from: activeCollId,
                        to: overCollId,
                        index: index !== -1 ? index : undefined,
                    });
                }
                return;
            }

            if (activeType === 'card' && overType === 'collection') {
                const { collectionId: activeCollId } = active.data.current;
                if (activeCollId !== over.id) {
                    emit('items:move', { id: active.id, from: activeCollId, to: over.id });
                }
                return;
            }

            if (activeType === 'card' && overType === 'collection-end') {
                const { collectionId: activeCollId } = active.data.current;
                const { collectionId: targetCollId } = over.data.current;
                if (activeCollId !== targetCollId) {
                    emit('items:move', { id: active.id, from: activeCollId, to: targetCollId });
                }
                return;
            }

            if (activeType === 'tab') {
                const tabData = active.data.current.item;

                if (overType === 'card') {
                    const { collectionId: targetCollId } = over.data.current;
                    const targetItems = sortBy(
                        Object.values(collections[targetCollId]?.items || {}),
                        'index',
                    );
                    const index = targetItems.findIndex(i => i.id === over.id);
                    emit('tab:save', {
                        collectionId: targetCollId,
                        id: String(tabData.id),
                        payload: sanitizeItem(tabData),
                        index: index !== -1 ? index : undefined,
                    });
                    closeTab(tabData.id);
                    return;
                }

                if (overType === 'collection' || overType === 'collection-end') {
                    const targetCollId =
                        overType === 'collection' ? over.id : over.data.current.collectionId;
                    emit('tab:save', {
                        collectionId: targetCollId,
                        id: String(tabData.id),
                        payload: sanitizeItem(tabData),
                    });
                    closeTab(tabData.id);
                    return;
                }
            }
        },
        [emit, sortedCollections, collections],
    );

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={cardAwareCollisionDetection}
            onDragEnd={handleDragEnd}
            autoScroll={{
                threshold: { x: 0, y: 0.08 },
                acceleration: 6,
            }}
        >
            <ActiveDragOverlay collections={collections} />
            {children}
        </DndContext>
    );
};
