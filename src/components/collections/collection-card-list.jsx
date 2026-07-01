import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable, useDndMonitor } from '@dnd-kit/core';

import { cn } from '@/helpers/utils';
import { sortBy } from '@/helpers/arrays';

import { CardItem } from './card-item';

export const CollectionCardList = ({
    collectionId,
    items,
    expanded,
    dark,
    bgColor,
    isDropTarget,
    onRemoveItem,
    onUpdateItem,
}) => {
    const { t } = useTranslation();

    const [isDraggingExternalCard, setIsDraggingExternalCard] = useState(false);
    const [isOverThisCollection, setIsOverThisCollection] = useState(false);
    const [isOverCard, setIsOverCard] = useState(false);

    useDndMonitor({
        onDragStart: ({ active }) => {
            const isCard = active?.data.current?.type === 'card';
            const isExternal = active?.data.current?.collectionId !== collectionId;
            setIsDraggingExternalCard(isCard && isExternal);
        },
        onDragOver: ({ over }) => {
            const overType = over?.data.current?.type;
            const overCollId =
                overType === 'card' ? over?.data.current?.collectionId
                : overType === 'collection' ? over?.id
                : overType === 'collection-end' ? over?.data.current?.collectionId
                : null;
            setIsOverThisCollection(overCollId === collectionId);
            setIsOverCard(overType === 'card' && over?.data.current?.collectionId === collectionId);
        },
        onDragEnd: () => {
            setIsDraggingExternalCard(false);
            setIsOverThisCollection(false);
            setIsOverCard(false);
        },
        onDragCancel: () => {
            setIsDraggingExternalCard(false);
            setIsOverThisCollection(false);
            setIsOverCard(false);
        },
    });

    const { setNodeRef: setEndZoneRef, isOver: isEndZoneOver } = useDroppable({
        id: `${collectionId}--end`,
        data: { type: 'collection-end', collectionId },
    });

    if (!expanded) return null;

    const sortedItems = sortBy(Object.values(items), 'index');
    const itemIds = sortedItems.map(i => i.id);

    return (
        <div data-layer='cards' className='flex flex-row rtl:flex-row-reverse flex-wrap gap-4'>
            <div
                data-layer='target'
                className={cn(
                    'hidden absolute inset-2 left-6 rtl:right-6 rtl:left-2 border-2 border-dashed border-rose-500 rounded-md pointer-events-none',
                    { block: isDropTarget },
                )}
            />

            <SortableContext items={itemIds} strategy={rectSortingStrategy}>
                {!sortedItems.length && (
                    <div
                        data-layer='empty'
                        className={cn(
                            'flex-center w-full h-28 bg-neutral-100 text-neutral-500 text-sm rounded-md select-none',
                            'dark:bg-neutral-700 dark:text-neutral-400',
                        )}
                    >
                        {t('collections.item.labels.drag-here')}
                    </div>
                )}

                {sortedItems.map((item, index) => (
                    <CardItem
                        key={item.id}
                        dark={dark}
                        bgColor={bgColor}
                        collectionId={collectionId}
                        item={item}
                        index={index}
                        onRemove={item => onRemoveItem?.(item)}
                        onUpdate={item => onUpdateItem?.(item)}
                    />
                ))}
            </SortableContext>

            {isDraggingExternalCard && isOverThisCollection && !isOverCard && (
                <div
                    ref={setEndZoneRef}
                    className={cn(
                        'flex items-center justify-center w-52 h-[5.75rem] rounded-sm transition-all duration-150 select-none',
                        isEndZoneOver
                            ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-400'
                            : 'bg-rose-50 dark:bg-rose-500/10 text-rose-300 dark:text-rose-500/50',
                    )}
                >
                    <span className='text-xs font-medium'>+</span>
                </div>
            )}
        </div>
    );
};
