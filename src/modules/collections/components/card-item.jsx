import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, File, Pencil } from 'lucide-react';

import { cn } from '@/modules/common/helpers/utils';
import { darken, lighten } from '@/modules/common/helpers/colors';
import { fromJSON, toJSON } from '@/modules/common/helpers/objects';

import { Button } from '@/modules/shadcn/components/button';
import { Tooltip } from '@/modules/shadcn/components/tooltip-simple';
import { ConfirmPopover } from '@/modules/common/components/confirm-popover';
import { Zelda } from '@/modules/common/components/zelda';

import { useDradAndDrop, useDradAndDropActions } from '@/store/dragAndDrop';

import { EditCardDialog } from './edit-card-dialog';

export const CardItem = ({
    className,
    collectionId,
    item,
    index,
    dark,
    bgColor,
    onRemove,
    onUpdate,
    onSort,
    onTransfer,
}) => {
    const { t } = useTranslation();

    const { setItemType, resetItemType } = useDradAndDropActions();
    const { draggingItem } = useDradAndDrop();

    const [dragging, setDragging] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const $anchor = useRef();

    const handleRemove = () => {
        onRemove?.(item);
    };

    const handleDragStart = event => {
        event.stopPropagation();

        setItemType({ type: 'card' });
        setDragging(true);

        const data = toJSON({ type: 'card', collectionId, data: item });
        event.dataTransfer.setData('text/plain', data);
        $anchor.current?.removeAttribute?.('href');
    };

    const handleDragEnd = () => {
        resetItemType();
        setDragging(false);

        setTimeout(() => {
            $anchor.current?.setAttribute?.('href', $anchor.current?.dataset?.href);
        }, 0);
    };

    const handleDragOver = event => {
        if (draggingItem?.type === 'card') {
            event.preventDefault();
            setDragOver(true);
        }
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleDrop = event => {
        event.preventDefault();
        setDragOver(false);

        const targetCollectionId = collectionId;
        const transferedData = event.dataTransfer.getData('text/plain');
        const { data, type, collectionId: originalCollectionId } = fromJSON(transferedData);

        if (type === 'card') {
            event.stopPropagation();

            if (targetCollectionId === originalCollectionId) {
                onSort?.({
                    active: data,
                    over: item,
                });
            }

            if (targetCollectionId !== originalCollectionId) {
                onTransfer?.({
                    originalCollectionId,
                    targetCollectionId,
                    active: data,
                    over: item,
                });
            }
        }
    };

    const composedCustomContent = item?.customTitle + item?.customDescription;
    const tooltipContent = composedCustomContent ? (
        <p className='flex flex-col gap-1 items-start'>
            <b>{item?.customTitle}</b>
            {item?.customDescription && <span>{item?.customDescription}</span>}
        </p>
    ) : (
        <p>{item?.title}</p>
    );

    return (
        <div
            className={cn('relative group flex transition-all duration-150', {
                'translate-x-4': dragOver,
            })}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className='invisible group-hover:visible flex flex-row-reverse rtl:flex-row gap-1 absolute z-20 top-2 right-2 rtl:left-2 rtl:right-auto'>
                <ConfirmPopover
                    title={t('card.dialogs.remove-card.title')}
                    description={t('card.dialogs.remove-card.description')}
                    align={index === 0 ? 'start' : 'end'}
                    onAccept={handleRemove}
                >
                    <div>
                        <Tooltip content={t('card.item.tooltips.remove-card')}>
                            <Button
                                className={cn('dark:hover:bg-neutral-700', {
                                    'text-black': !dark,
                                })}
                                size='icon-xs'
                                variant='ghost'
                            >
                                <X />
                            </Button>
                        </Tooltip>
                    </div>
                </ConfirmPopover>

                <EditCardDialog item={item} onRemove={handleRemove} onUpdate={onUpdate}>
                    <div>
                        <Tooltip content={t('card.item.tooltips.edit-card')}>
                            <Button
                                className={cn('dark:hover:bg-neutral-700', {
                                    'text-black': !dark,
                                })}
                                size='icon-xs'
                                variant='ghost'
                            >
                                <Pencil />
                            </Button>
                        </Tooltip>
                    </div>
                </EditCardDialog>
            </div>

            <div
                className={cn(
                    'drag-over absolute h-full w-8 translate-x-0 transition-all duration-150 rounded-sm select-none bg-neutral-100/50 dark:bg-neutral-700/50',
                    { '-translate-x-4': dragOver },
                )}
            />

            <div
                className={cn(
                    'relative cursor-grab transition-all duration-150 rounded-sm select-none',
                    { 'cursor-grabbing shadow-lg opacity-50': dragging },
                    className,
                )}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                draggable
            >
                <Zelda
                    ref={$anchor}
                    className={cn(
                        'flex flex-col w-52 bg-white border border-neutral-200 rounded-sm overflow-hidden',
                        'dark:bg-neutral-800 dark:border-neutral-700',
                        { 'text-white': dark, 'text-neutral-950': !dark },
                        className,
                    )}
                    style={{
                        backgroundColor: bgColor === 'transparent' ? null : bgColor,
                    }}
                    href={item?.url}
                    data-href={item?.url}
                >
                    <div className='flex flex-row rtl:flex-row-reverse gap-2 items-center justify-start h-16 px-4'>
                        {item?.favIconUrl ? (
                            <img className='size-6' src={item?.favIconUrl} />
                        ) : (
                            <File className='size-6' />
                        )}

                        <Tooltip side='top' content={tooltipContent}>
                            <span className='text-sm line-clamp-1'>
                                {item?.customTitle || item?.title}
                            </span>
                        </Tooltip>
                    </div>

                    <Tooltip content={item?.url}>
                        <div
                            className={cn(
                                'px-2 py-1.5 bg-neutral-100 text-xs text-ellipsis truncate',
                                'dark:bg-neutral-700',
                            )}
                            style={{
                                backgroundColor: !dark
                                    ? darken(bgColor, 0.03)
                                    : lighten(bgColor, 0.1),
                            }}
                        >
                            {item?.url}
                        </div>
                    </Tooltip>
                </Zelda>
            </div>
        </div>
    );
};
