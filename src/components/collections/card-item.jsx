import { useTranslation } from 'react-i18next';
import { X, File, Pencil } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { cn } from '@/helpers/utils';
import { darken, lighten } from '@/helpers/colors';

import { Button } from '@/ui/button';
import { Tooltip } from '@/ui/tooltip-simple';
import { ConfirmPopover } from '@/components/system/confirm-popover';
import { Zelda } from '@/components/system/zelda';

import { EditCardDialog } from './edit-card-dialog';

export const CardItem = ({ className, collectionId, item, index, dark, bgColor, onRemove, onUpdate }) => {
    const { t } = useTranslation();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: item.id,
        data: { type: 'card', id: item.id, collectionId },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleRemove = () => onRemove?.(item);

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
            ref={setNodeRef}
            style={style}
            className={cn('relative group flex transition-all duration-150', {
                'opacity-50 z-50': isDragging,
            })}
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
                    'relative cursor-grab transition-all duration-150 rounded-sm select-none',
                    { 'cursor-grabbing shadow-lg': isDragging },
                    className,
                )}
                {...attributes}
                {...listeners}
            >
                <Zelda
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
