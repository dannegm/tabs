import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '@/modules/common/helpers/utils';

export const CollectionSortableItem = ({ item, children }) => {
    const { setNodeRef, attributes, listeners, transform, transition, isDragging, isOver } =
        useSortable({
            id: `collection-sortable-${item?.id}`,
            data: {
                ...item,
                type: 'collection',
            },
        });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            className={cn('group/sortable relative', {
                'drag-over': isOver,
            })}
            style={style}
            {...attributes}
        >
            <div
                ref={setNodeRef}
                {...listeners}
                className='absolute z-10 inset-0 pointer-events-none'
            >
                <div
                    className={cn(
                        'absolute top-0 bottom-0 w-6 flex-center pointer-events-auto cursor-grab hover:bg-neutral-100 dark:hover:bg-neutral-700/30',
                        { 'cursor-grabbing': isDragging },
                    )}
                >
                    <GripVertical className='size-4' />
                </div>
            </div>

            <div
                data-layer='target'
                className={cn(
                    'hidden absolute inset-2 left-6 border-2 border-dashed border-rose-500 rounded-md pointer-events-none',
                    { block: isOver },
                )}
            />

            {children}
        </div>
    );
};
