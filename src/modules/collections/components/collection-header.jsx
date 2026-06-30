import { useState } from 'react';
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

import { cn } from '@/modules/common/helpers/utils';
import { isDark, darken, lighten } from '@/modules/common/helpers/colors';

import { Button } from '@/modules/shadcn/components/button';
import { Tooltip } from '@/modules/shadcn/components/tooltip-simple';
import { Input } from '@/modules/shadcn/components/input';
import { Badge } from '@/modules/shadcn/components/badge';
import { ColorPicker } from '@/modules/shadcn/components/color-picker';
import { ConfirmPopover } from '@/modules/common/components/confirm-popover';
import { ExportSingleCollection } from './export-single-collection';

export const CollectionHeader = ({
    id,
    name,
    expanded,
    bgColor,
    itemCount,
    dark,
    dragHandleListeners,
    dragHandleAttributes,
    isDragging,
    onEdit,
    onToggle,
    onRemove,
    onOpenEverything,
    onSaveHere,
    onBgColorChange,
}) => {
    const { t } = useTranslation();

    const [editting, setEditting] = useState(false);
    const [newName, setNewName] = useState(name);
    const [internalBgColor, setInternalBgColor] = useState(bgColor || 'transparent');

    const resolvedDark =
        internalBgColor === 'transparent' ? dark : isDark(internalBgColor);

    const handleEditCancel = () => {
        setEditting(false);
        setNewName(name);
    };

    const handleEditSave = event => {
        event.preventDefault();
        setEditting(false);
        onEdit?.({ id, name: newName });
    };

    const handleChangeBgColor = color => {
        setInternalBgColor(color || 'transparent');
        onBgColorChange?.({ id, bgColor: color });
    };

    return (
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
                                'text-neutral-950': !resolvedDark,
                                'text-white': resolvedDark,
                            },
                        )}
                        variant='secondary'
                        style={{
                            backgroundColor: !resolvedDark
                                ? darken(internalBgColor, 0.03)
                                : lighten(internalBgColor, 0.1),
                        }}
                        onClick={onToggle}
                    >
                        <span>{name}</span>
                        {expanded ? <ChevronDown /> : <ChevronRight />}
                    </Button>

                    <Tooltip content={t('collections.item.tooltips.edit-collection')}>
                        <Button
                            className={cn('invisible group-hover:visible dark:bg-neutral-700', {
                                'text-black hover:text-black': !resolvedDark,
                            })}
                            variant='ghost'
                            size='icon'
                            style={{
                                backgroundColor: !resolvedDark
                                    ? darken(internalBgColor, 0.03)
                                    : lighten(internalBgColor, 0.1),
                            }}
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
                        className={cn('min-w-96 dark:border-neutral-700 rtl:text-right', {
                            'text-black': !resolvedDark,
                        })}
                        placeholder={t('collections.item.placeholders.name')}
                        value={newName}
                        onChange={ev => setNewName(ev.target.value)}
                    />

                    <Button
                        type='button'
                        className={cn('dark:bg-neutral-700', { 'text-black': !resolvedDark })}
                        variant='secondary'
                        size='icon'
                        style={{
                            backgroundColor: !resolvedDark
                                ? darken(internalBgColor, 0.03)
                                : lighten(internalBgColor, 0.1),
                        }}
                        onClick={handleEditCancel}
                    >
                        <X />
                    </Button>

                    <Button
                        type='submit'
                        className={cn('dark:bg-neutral-700', { 'text-black': !resolvedDark })}
                        variant='secondary'
                        style={{
                            backgroundColor: !resolvedDark
                                ? darken(internalBgColor, 0.03)
                                : lighten(internalBgColor, 0.1),
                        }}
                    >
                        <Save /> {t('collections.item.labels.save')}
                    </Button>
                </form>
            )}

            <div
                data-layer='handler'
                className='flex-1 h-8 rounded-sm'
                onDoubleClick={onToggle}
            />

            <Badge size='xs'>
                {t('collections.labels.count-cards', { count: itemCount })}
            </Badge>

            <div
                data-layer='actions'
                className={cn('flex flex-row rtl:flex-row-reverse gap-2', {
                    'text-neutral-950': !resolvedDark,
                    'text-white': resolvedDark,
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
                        onClick={onOpenEverything}
                    >
                        <ArrowUpRight />
                    </Button>
                </Tooltip>

                <Tooltip content={t('collections.item.tooltips.save-to-collection')}>
                    <Button
                        className='dark:hover:bg-neutral-700'
                        size='icon-xs'
                        variant='ghost'
                        onClick={onSaveHere}
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
                    onAccept={onRemove}
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

            <div
                className={cn(
                    'handle absolute top-0 bottom-0 left-0 rtl:right-0 rtl:left-auto w-6 flex-center pointer-events-auto cursor-grab hover:bg-neutral-100 dark:hover:bg-neutral-700/30',
                    {
                        'cursor-grabbing': isDragging,
                        'hover:bg-white/10!': resolvedDark,
                        'text-black': !resolvedDark,
                    },
                )}
                {...dragHandleListeners}
                {...dragHandleAttributes}
            >
                <GripVertical className='size-4' />
            </div>
        </div>
    );
};
