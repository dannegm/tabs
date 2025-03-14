import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';

export const CollectionSortableContext = ({ collectionId, items, children }) => {
    const mappedItems = items.map(item => ({
        ...item,
        id: `card-item-${collectionId}-${item?.id}`,
        _id: item?.id,
    }));
    return (
        <SortableContext items={mappedItems} strategy={horizontalListSortingStrategy}>
            {children}
        </SortableContext>
    );
};
