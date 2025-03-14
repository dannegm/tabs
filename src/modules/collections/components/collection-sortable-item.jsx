import { cn } from '@/modules/common/helpers/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

export const CollectionSortableItem = ({ item, children }) => {
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: `collection-sortable-${item?.id}`,
        data: item,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div className='relative' style={style} {...attributes}>
            <div
                ref={setNodeRef}
                {...listeners}
                className='absolute z-10 inset-0 pointer-events-none'
            >
                <div
                    className={cn(
                        'absolute top-0 bottom-0 w-6 flex-center pointer-events-auto cursor-grab hover:bg-neutral-100 dark:hover:bg-neutral-700',
                        { 'cursor-grabbing': isDragging },
                    )}
                >
                    <GripVertical className='size-4' />
                </div>
            </div>
            {children}
        </div>
    );
};
