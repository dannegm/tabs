import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    X,
    ArrowUpRight,
    ChevronDown,
    ChevronRight,
    ArrowDownLeft,
    Download,
    SquarePen,
    Save,
    GripVertical,
    Palette,
} from 'lucide-react';

import { useCollectionsActions } from '@/store/collections';

import { cn } from '@/modules/common/helpers/utils';
import { move, sortBy } from '@/modules/common/helpers/arrays';
import { isDark, darken, lighten } from '@/modules/common/helpers/colors';
import { fromJSON, toJSON } from '@/modules/common/helpers/objects';
import { sanitizeItem } from '@/modules/common/helpers/mappers';
import { closeTab } from '@/modules/common/helpers/chrome';

import { Button } from '@/modules/shadcn/components/button';
import { Tooltip } from '@/modules/shadcn/components/tooltip-simple';
import { Input } from '@/modules/shadcn/components/input';

import { ConfirmPopover } from '@/modules/common/components/confirm-popover';
import { CardItem } from '@/modules/collections/components/card-item';

import { useDradAndDrop, useDradAndDropActions } from '@/store/dragAndDrop';
import { ColorPicker } from '@/modules/shadcn/components/color-picker';
import { useDarkMode } from '@/modules/common/hooks/use-dark-mode';
import { ExportSingleCollection } from './export-single-collection';

export const CollectionItem = ({
    className,
    id,
    name,
    expanded,
    bgColor,
    items,
    onAttachItem,
    onUpdateItem,
    onRemoveItem,
    onMoveItem,
    onEdit,
    onToggleExpanded,
    onRemove,
    onOpenEverything,
    onSaveHere,
    onSort,
    onBgColorChange,
}) => {
    const { t } = useTranslation();
    const [theme] = useDarkMode();

    const { setItemType } = useDradAndDropActions();
    const { draggingItem } = useDradAndDrop();

    const [dragging, setDragging] = useState(false);
    const [dragOverCollection, setDragOverCollection] = useState(false);
    const [dragOverCard, setDragOverCard] = useState(false);
    const [dragOverTab, setDragOverTab] = useState(false);

    const [editting, setEditting] = useState(false);
    const [newName, setNewName] = useState(name);

    const [internalBgColor, setInternalBgColor] = useState(bgColor || 'transparent');
    const dark = internalBgColor === 'transparent' ? theme === 'dark' : isDark(internalBgColor);

    const $collection = useRef();

    const { sortItems } = useCollectionsActions();

    const iterableItems = sortBy(Object.values(items), 'index');

    const handleEditCancel = () => {
        setEditting(false);
        setNewName(name);
    };

    const handleEditSave = event => {
        event.preventDefault();
        setEditting(false);
        onEdit?.({ id, name: newName });
    };

    const handleToggle = () => {
        onToggleExpanded?.({ id });
    };

    const handleRemove = () => {
        onRemove?.({ id });
    };

    const handleOpenEverything = () => {
        onOpenEverything?.(iterableItems);
    };

    const handleSaveHere = () => {
        onSaveHere?.({ id });
    };

    // * DnD
    const handleDragOver = event => {
        event.preventDefault();
        if (draggingItem?.type === 'collection') {
            setDragOverCollection(true);
        }
        if (draggingItem?.type === 'card') {
            setDragOverCard(true);
        }
        if (draggingItem?.type === 'tab') {
            setDragOverTab(true);
        }
    };

    const handleDragLeave = () => {
        setDragOverCollection(false);
        setDragOverCard(false);
        setDragOverTab(false);
    };

    const handleDrop = event => {
        handleDragLeave();

        const transferedData = event.dataTransfer.getData('text/plain');
        const { data, type, collectionId } = fromJSON(transferedData);

        if (type === 'tab') {
            onAttachItem?.({
                collectionId: id,
                id: data.id,
                payload: sanitizeItem(data),
            });

            closeTab(data.id);
        }

        if (type === 'card') {
            onMoveItem?.({
                id: data?.id,
                targetCollectionId: id,
                originalCollectionId: collectionId,
            });
        }

        if (type === 'collection' && data?.id !== id) {
            onSort?.({
                active: data,
                over: { id },
            });
        }
    };

    const handleSortCard = ({ active, over }) => {
        handleDragLeave();

        const oldIndex = iterableItems.findIndex(item => item.id === active?.id);
        const newIndex = iterableItems.findIndex(item => item.id === over?.id);
        const sortedItems = move(iterableItems, oldIndex, newIndex).map(item => item?.id);
        sortItems({ collectionId: id, items: sortedItems });
    };

    const handleTransfer = ({ originalCollectionId, targetCollectionId, active, over }) => {
        handleDragLeave();

        const index = iterableItems.findIndex(item => item.id === over?.id);
        onMoveItem?.({
            index,
            id: active?.id,
            targetCollectionId: targetCollectionId,
            originalCollectionId: originalCollectionId,
        });
    };

    const handleDragStart = event => {
        setItemType({ type: 'collection' });
        setDragging(true);

        const data = toJSON({ type: 'collection', data: { id } });
        event.dataTransfer.setData('text/plain', data);
    };

    const handleDragEnd = () => {
        setDragging(false);
        $collection.current?.removeAttribute('draggable');
    };

    const handlePointerDown = () => {
        $collection.current?.setAttribute('draggable', 'true');
    };

    const handlePointerDownOnCollection = e => {
        if (e.target !== e.currentTarget.querySelector('.handle')) {
            $collection.current?.removeAttribute('draggable');
        }
    };

    const handleChangeBgColor = bgColor => {
        setInternalBgColor(bgColor || 'transparent');
        onBgColorChange?.({ id, bgColor });
    };

    return (
        <div
            ref={$collection}
            data-layer='collection-item'
            className={cn(
                { dark },
                'relative flex flex-col gap-4 p-4 pl-8 rtl:pl-4 rtl:pr-8 bg-white text-neutral-950 border-b border-b-neutral-200 transition-all duration-150',
                'dark:bg-neutral-800 dark:border-b-neutral-700 dark:text-white',
                { 'translate-x-6 rtl:-translate-x-6': dragOverCollection },
                className,
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onPointerDown={handlePointerDownOnCollection}
            style={{ backgroundColor: internalBgColor }}
        >
            <div
                className={cn(
                    'handle absolute top-0 bottom-0 left-0 rtl:right-0 rtl:left-auto w-6 flex-center pointer-events-auto cursor-grab hover:bg-neutral-100 dark:hover:bg-neutral-700/30',
                    { 'cursor-grabbing': dragging },
                )}
                onPointerDown={handlePointerDown}
            >
                <GripVertical className='size-4' />
            </div>

            <div
                className={cn(
                    'absolute top-0 -left-6 rtl:-right-6 rtl:left-auto w-0 h-full bg-strip-rose-200 dark:bg-strip-rose-600 inset-shadow-md transition-all duration-150',
                    {
                        'w-6': dragOverCollection,
                    },
                )}
            />

            <div
                data-layer='header'
                className='group flex flex-row rtl:flex-row-reverse items-center gap-2'
            >
                {!editting ? (
                    <div
                        data-layer='name'
                        className='flex flex-row rtl:flex-row-reverse items-center gap-1'
                    >
                        <Button
                            className={cn(
                                'text-base leading-1 dark:bg-neutral-700 rtl:flex-row-reverse',
                                {
                                    'text-neutral-950': !dark,
                                    'text-white': dark,
                                },
                            )}
                            variant='secondary'
                            style={{
                                backgroundColor: !dark
                                    ? darken(internalBgColor, 0.03)
                                    : lighten(internalBgColor, 0.1),
                            }}
                            onClick={handleToggle}
                        >
                            <span>{name}</span>
                            {expanded ? <ChevronDown /> : <ChevronRight />}
                        </Button>

                        <Tooltip content={t('collections.item.tooltips.edit-collection')}>
                            <Button
                                className='invisible group-hover:visible dark:hover:bg-neutral-700'
                                variant='ghost'
                                size='icon'
                                onClick={() => setEditting(true)}
                            >
                                <SquarePen />
                            </Button>
                        </Tooltip>
                    </div>
                ) : (
                    <form
                        data-layer='editor'
                        className='flex flex-row rtl:flex-row-reverse items-center gap-1'
                        onSubmit={handleEditSave}
                    >
                        <Input
                            className='min-w-96 dark:border-neutral-700 rtl:text-right'
                            placeholder={t('collections.item.placeholders.name')}
                            value={newName}
                            onChange={ev => setNewName(ev.target.value)}
                        />

                        <Button
                            type='button'
                            className='dark:bg-neutral-700'
                            variant='secondary'
                            size='icon'
                            onClick={handleEditCancel}
                        >
                            <X />
                        </Button>

                        <Button type='submit' className='dark:bg-neutral-700' variant='secondary'>
                            <Save /> {t('collections.item.labels.save')}
                        </Button>
                    </form>
                )}

                <div
                    data-layer='handler'
                    className='flex-1 h-8 rounded-sm'
                    onDoubleClick={handleToggle}
                />

                <div
                    data-layer='actions'
                    className={cn('flex flex-row rtl:flex-row-reverse gap-2', {
                        'text-neutral-950': !dark,
                        'text-white': dark,
                    })}
                >
                    <ColorPicker
                        color={internalBgColor}
                        onChange={setInternalBgColor}
                        onSelect={handleChangeBgColor}
                    >
                        {() => (
                            <Tooltip content={t('collections.item.tooltips.highlight-color')}>
                                <Button
                                    className='dark:hover:bg-neutral-700'
                                    size='icon-xs'
                                    variant='ghost'
                                >
                                    <Palette />
                                </Button>
                            </Tooltip>
                        )}
                    </ColorPicker>

                    <Tooltip content={t('collections.item.tooltips.open-tabs')}>
                        <Button
                            className='dark:hover:bg-neutral-700'
                            size='icon-xs'
                            variant='ghost'
                            onClick={handleOpenEverything}
                        >
                            <ArrowUpRight />
                        </Button>
                    </Tooltip>

                    <Tooltip content={t('collections.item.tooltips.save-to-collection')}>
                        <Button
                            className='dark:hover:bg-neutral-700'
                            size='icon-xs'
                            variant='ghost'
                            onClick={handleSaveHere}
                        >
                            <ArrowDownLeft />
                        </Button>
                    </Tooltip>

                    <ExportSingleCollection collectionId={id}>
                        <Tooltip content={t('collections.item.tooltips.export-collection')}>
                            <Button
                                className='dark:hover:bg-neutral-700'
                                size='icon-xs'
                                variant='ghost'
                            >
                                <Download />
                            </Button>
                        </Tooltip>
                    </ExportSingleCollection>

                    <ConfirmPopover
                        title={t('collections.dialogs.remove-collection.title')}
                        description={t('collections.dialogs.remove-collection.description')}
                        align='end'
                        onAccept={handleRemove}
                    >
                        <div>
                            <Tooltip content={t('collections.item.tooltips.delete-collection')}>
                                <Button
                                    className='dark:hover:bg-neutral-700'
                                    size='icon-xs'
                                    variant='ghost'
                                >
                                    <X />
                                </Button>
                            </Tooltip>
                        </div>
                    </ConfirmPopover>
                </div>
            </div>

            {expanded && (
                <div
                    data-layer='cards'
                    className='flex flex-row rtl:flex-row-reverse flex-wrap gap-4'
                >
                    <div
                        data-layer='target'
                        className={cn(
                            'hidden absolute inset-2 left-6 rtl:right-6 rtl:left-2 border-2 border-dashed border-rose-500 rounded-md pointer-events-none',
                            { block: dragOverCard || dragOverTab },
                        )}
                    />

                    {!iterableItems.length && (
                        <div
                            data-layer='empty'
                            className={cn(
                                'flex-center w-full h-28 bg-neutral-100 text-neutral-500 text-sm rounded-md select-none',
                                'dark:bg-neutral-700 dark:text-neutral-400',
                                'group-[.drag-over]/sortable:bg-rose-200 group-[.drag-over]/sortable:text-rose-500 group-[.drag-over]/sortable:dark:bg-rose-500/40 group-[.drag-over]/sortable:dark:text-rose-400',
                            )}
                        >
                            {t('collections.item.labels.drag-here')}
                        </div>
                    )}

                    {iterableItems.map((item, index) => (
                        <CardItem
                            key={item.id}
                            className={cn({
                                'opacity-60': false,
                            })}
                            dark={dark}
                            bgColor={internalBgColor}
                            collectionId={id}
                            item={item}
                            index={index}
                            onRemove={item => onRemoveItem?.(id, item)}
                            onUpdate={item => onUpdateItem?.(id, item)}
                            onSort={handleSortCard}
                            onTransfer={handleTransfer}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
