import { DndContext } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

export const CollectionsSortableContext = ({ items, onDragEnd, children }) => {
    const handleDragEnd = event => {
        onDragEnd?.(event);
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
                {children}
            </SortableContext>
        </DndContext>
    );
};
