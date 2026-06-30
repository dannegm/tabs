import { useTranslation } from 'react-i18next';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';

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
        </div>
    );
};
