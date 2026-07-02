import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDndMonitor } from '@dnd-kit/core';

import { sortBy } from '@/helpers/arrays';

import { ListItem } from './list-item';

const DragLine = () => (
    <div className='h-0.5 mx-8 bg-rose-400 dark:bg-rose-500 rounded-full pointer-events-none' />
);

export const CollectionList = ({
    collectionId,
    items,
    expanded,
    dark,
    bgColor,
    onRemoveItem,
    onUpdateItem,
}) => {
    const { t } = useTranslation();

    // undefined = not over this collection
    // null = drop at end (after all items)
    // string = drop before the item with this id
    const [insertBeforeId, setInsertBeforeId] = useState(undefined);
    const [isDraggingCard, setIsDraggingCard] = useState(false);

    const sortedItems = sortBy(Object.values(items), 'index');
    const itemIds = sortedItems.map(i => i.id);

    useDndMonitor({
        onDragStart: ({ active }) => {
            setIsDraggingCard(active?.data.current?.type === 'card');
        },
        onDragOver: ({ over, active }) => {
            if (active?.data.current?.type !== 'card') {
                setInsertBeforeId(undefined);
                return;
            }

            const overType = over?.data.current?.type;
            const overCollId =
                overType === 'card'
                    ? over?.data.current?.collectionId
                    : overType === 'collection'
                      ? over?.id
                      : null;

            if (overCollId !== collectionId) {
                setInsertBeforeId(undefined);
                return;
            }

            if (overType === 'collection') {
                setInsertBeforeId(null);
                return;
            }

            if (overType === 'card') {
                const activeIdx = sortedItems.findIndex(i => i.id === active?.id);
                const overIdx = sortedItems.findIndex(i => i.id === over?.id);

                if (activeIdx === overIdx) {
                    setInsertBeforeId(undefined);
                } else if (activeIdx === -1) {
                    // External card → line before over item
                    setInsertBeforeId(over.id);
                } else if (activeIdx < overIdx) {
                    // Moving down → line after over item
                    setInsertBeforeId(sortedItems[overIdx + 1]?.id ?? null);
                } else {
                    // Moving up → line before over item
                    setInsertBeforeId(over.id);
                }
            }
        },
        onDragEnd: () => {
            setInsertBeforeId(undefined);
            setIsDraggingCard(false);
        },
        onDragCancel: () => {
            setInsertBeforeId(undefined);
            setIsDraggingCard(false);
        },
    });

    if (!expanded) return null;

    return (
        <div data-layer='list' className='flex flex-col gap-1.5 pb-2'>
            <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                {!sortedItems.length && (
                    <div className='flex items-center h-10 text-xs opacity-50 select-none'>
                        {t('collections.item.labels.drag-here')}
                    </div>
                )}

                {sortedItems.map((item, index) => (
                    <div key={item.id}>
                        {isDraggingCard && insertBeforeId === item.id && <DragLine />}
                        <ListItem
                            collectionId={collectionId}
                            item={item}
                            index={index}
                            dark={dark}
                            bgColor={bgColor}
                            onRemove={item => onRemoveItem?.(item)}
                            onUpdate={item => onUpdateItem?.(item)}
                        />
                    </div>
                ))}

                {isDraggingCard && insertBeforeId === null && <DragLine />}
            </SortableContext>
        </div>
    );
};
