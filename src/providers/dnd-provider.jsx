import { useCallback } from 'react';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import { move, reverse, sortBy } from '@/helpers/arrays';
import { sanitizeItem } from '@/helpers/mappers';
import { closeTab } from '@/helpers/chrome';
import { useCollections } from '@/services/collections';
import { useEvents } from '@/providers/bus-provider';

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

            if (activeType === 'tab') {
                const collIdByType = {
                    card: over.data.current.collectionId,
                    collection: over.id,
                };
                const targetCollId = collIdByType[overType] ?? null;

                if (targetCollId) {
                    const tabData = active.data.current.item;
                    emit('tab:save', {
                        collectionId: targetCollId,
                        id: String(tabData.id),
                        payload: sanitizeItem(tabData),
                    });
                    closeTab(tabData.id);
                }
            }
        },
        [emit, sortedCollections, collections],
    );

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            {children}
        </DndContext>
    );
};
