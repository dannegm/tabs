import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

export const CollectionsSortableContext = ({ items, children }) => {
    const mappedItems = items.map(item => ({
        ...item,
        id: `collection-sortable-${item?.id}`,
        _id: item?.id,
    }));
    return (
        <SortableContext items={mappedItems} strategy={verticalListSortingStrategy}>
            {children}
        </SortableContext>
    );
};
