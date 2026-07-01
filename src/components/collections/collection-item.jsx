import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { useDndMonitor } from '@dnd-kit/core';

import { cn } from '@/helpers/utils';
import { isDark } from '@/helpers/colors';
import { useDarkMode } from '@/hooks/use-dark-mode';

import { CollectionHeader } from './collection-header';
import { CollectionCardList } from './collection-card-list';

export const CollectionItem = ({
    className,
    id,
    name,
    expanded,
    bgColor,
    items,
    onUpdateItem,
    onRemoveItem,
    onEdit,
    onToggleExpanded,
    onRemove,
    onOpenEverything,
    onSaveHere,
    onBgColorChange,
}) => {
    const [theme] = useDarkMode();
    const [internalBgColor] = useState(bgColor || 'transparent');
    const dark = internalBgColor === 'transparent' ? theme === 'dark' : isDark(internalBgColor);

    const [dragState, setDragState] = useState({
        type: null,
        isExternalDrop: false,
        isOverCardInThis: false,
    });

    useDndMonitor({
        onDragOver: ({ over, active }) => {
            const activeType = active?.data.current?.type;
            const overType = over?.data.current?.type;

            const isOverCollection = over?.id === id;
            const isOverCardInThis =
                overType === 'card' && over?.data.current?.collectionId === id;
            const isOverEndZone =
                overType === 'collection-end' && over?.data.current?.collectionId === id;

            if (!isOverCollection && !isOverCardInThis && !isOverEndZone) {
                setDragState({ type: null, isExternalDrop: false, isOverCardInThis: false });
                return;
            }

            const isExternalDrop =
                (activeType === 'card' && active.data.current?.collectionId !== id) ||
                activeType === 'tab';

            setDragState({ type: activeType, isExternalDrop, isOverCardInThis });
        },
        onDragEnd: () => setDragState({ type: null, isExternalDrop: false, isOverCardInThis: false }),
        onDragCancel: () => setDragState({ type: null, isExternalDrop: false, isOverCardInThis: false }),
    });

    const { attributes, listeners, setNodeRef, isDragging } = useSortable({
        id,
        data: { type: 'collection', id },
    });

    const style = {
        ...(isDragging ? { opacity: 0 } : {}),
        backgroundColor: internalBgColor !== 'transparent' ? internalBgColor : undefined,
    };

    const iterableItems = Object.values(items);

    return (
        <div
            ref={setNodeRef}
            style={style}
            data-layer='collection-item'
            className={cn(
                { dark },
                'relative flex flex-col gap-4 p-4 pl-8 rtl:pl-4 rtl:pr-8 bg-white text-neutral-950 border-b border-b-neutral-200 transition-all duration-150',
                'dark:bg-neutral-800 dark:border-b-neutral-700 dark:text-white',
                { 'translate-x-6 rtl:-translate-x-6': dragState.type === 'collection' },
                { 'opacity-50 z-50': isDragging },
                className,
            )}
        >
            <div
                className={cn(
                    'absolute top-0 -left-6 rtl:-right-6 rtl:left-auto w-0 h-full bg-strip-rose-200 dark:bg-strip-rose-600 inset-shadow-md transition-all duration-150',
                    { 'w-6': dragState.type === 'collection' },
                )}
            />

            <CollectionHeader
                id={id}
                name={name}
                expanded={expanded}
                bgColor={bgColor}
                itemCount={iterableItems.length}
                dark={dark}
                isDragging={isDragging}
                dragHandleListeners={listeners}
                dragHandleAttributes={attributes}
                onEdit={onEdit}
                onToggle={() => onToggleExpanded?.({ id })}
                onRemove={() => onRemove?.({ id })}
                onOpenEverything={() => onOpenEverything?.(iterableItems)}
                onSaveHere={() => onSaveHere?.({ id })}
                onBgColorChange={onBgColorChange}
            />

            <CollectionCardList
                collectionId={id}
                items={items}
                expanded={expanded}
                dark={dark}
                bgColor={internalBgColor}
                isDropTarget={dragState.isExternalDrop && !dragState.isOverCardInThis}
                onRemoveItem={item => onRemoveItem?.(id, item)}
                onUpdateItem={item => onUpdateItem?.(id, item)}
            />
        </div>
    );
};
