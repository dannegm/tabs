import { lazy, Suspense } from 'react';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import { cn } from '@/modules/common/helpers/utils';
import { move, reverse, sortBy } from '@/modules/common/helpers/arrays';
import { sanitizeItem } from '@/modules/common/helpers/mappers';
import { closeTab } from '@/modules/common/helpers/chrome';

import { useDarkMode } from '@/modules/common/hooks/use-dark-mode';
import { useCollections, useCollectionsActions } from '@/store/collections';
import { Providers } from '@/modules/common/providers/providers';
import { Loader } from '@/modules/common/components/loader';

const Tabs = lazy(() => import('@/modules/tabs/tabs'));
const Main = lazy(() => import('@/modules/main/main'));

export const App = () => {
    const [theme] = useDarkMode();
    const collections = useCollections();
    const { sortCollections, sortItems, moveItem, addItem } = useCollectionsActions();

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const sortedCollections = sortBy(Object.values(collections), 'index', 'desc');

    const handleDragEnd = ({ active, over }) => {
        if (!over || !active || active.id === over.id) return;

        const activeType = active.data.current?.type;
        const overType = over.data.current?.type;

        if (activeType === 'collection' && overType === 'collection') {
            const oldIndex = sortedCollections.findIndex(c => c.id === active.id);
            const newIndex = sortedCollections.findIndex(c => c.id === over.id);
            if (oldIndex === -1 || newIndex === -1) return;
            const sorted = move(sortedCollections, oldIndex, newIndex).map(c => c.id);
            sortCollections({ items: reverse(sorted) });
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
                sortItems({ collectionId: activeCollId, items: sorted });
            } else {
                const targetItems = sortBy(
                    Object.values(collections[overCollId]?.items || {}),
                    'index',
                );
                const index = targetItems.findIndex(i => i.id === over.id);
                moveItem({
                    id: active.id,
                    originalCollectionId: activeCollId,
                    targetCollectionId: overCollId,
                    index: index !== -1 ? index : undefined,
                });
            }
            return;
        }

        if (activeType === 'card' && overType === 'collection') {
            const { collectionId: activeCollId } = active.data.current;
            if (activeCollId !== over.id) {
                moveItem({
                    id: active.id,
                    originalCollectionId: activeCollId,
                    targetCollectionId: over.id,
                });
            }
            return;
        }

        if (activeType === 'tab') {
            const targetCollId =
                overType === 'card'
                    ? over.data.current.collectionId
                    : overType === 'collection'
                      ? over.id
                      : null;

            if (targetCollId) {
                const tabData = active.data.current.item;
                addItem({
                    collectionId: targetCollId,
                    id: String(tabData.id),
                    payload: sanitizeItem(tabData),
                });
                closeTab(tabData.id);
            }
        }
    };

    return (
        <Providers>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <Suspense fallback={<Loader />}>
                    <main
                        className={cn(
                            theme,
                            'grid grid-cols-[1fr_var(--sidebar-width)] grid-rows-[1fr] [grid-template-areas:"main_side"] w-full h-screen overflow-hidden',
                        )}
                    >
                        <Main className='[grid-area:main]' />
                        <Tabs className='[grid-area:side]' />
                    </main>
                </Suspense>
            </DndContext>
        </Providers>
    );
};
