import { X, File, Pencil } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { useTranslation } from 'react-i18next';

import { cn } from '@/helpers/utils';
import { Button } from '@/ui/button';
import { Tooltip } from '@/ui/tooltip-simple';
import { ConfirmPopover } from '@/components/system/confirm-popover';
import { Zelda } from '@/components/system/zelda';
import { useModal } from '@/hooks/use-modal';

const getHostname = url => {
    try {
        return new URL(url).hostname;
    } catch {
        return url;
    }
};

export const ListItem = ({ className, collectionId, item, index, dark, bgColor, onRemove, onUpdate }) => {
    const { t } = useTranslation();

    const { attributes, listeners, setNodeRef, isDragging } = useSortable({
        id: item.id,
        data: { type: 'card', id: item.id, collectionId },
    });

    const { open: openEditCard } = useModal('edit-card');
    const handleRemove = () => onRemove?.(item);
    const title = item?.customTitle || item?.title;

    return (
        <div
            ref={setNodeRef}
            className={cn(
                { dark },
                'group relative flex flex-row items-center h-10',
                'border border-neutral-200 dark:border-neutral-700 rounded-sm',
                'bg-white dark:bg-neutral-800',
                { 'text-white': dark, 'text-neutral-950': !dark },
                { 'opacity-0 pointer-events-none': isDragging },
                className,
            )}
            style={{ backgroundColor: bgColor && bgColor !== 'transparent' ? bgColor : undefined }}
        >
            <div
                className='flex-1 flex flex-row rtl:flex-row-reverse items-center gap-3 min-w-0 h-full px-3 cursor-grab active:cursor-grabbing select-none'
                {...attributes}
                {...listeners}
            >
                <div className='flex-none pointer-events-none'>
                    {item?.favIconUrl ? (
                        <img className='size-4' src={item.favIconUrl} />
                    ) : (
                        <File className='size-4 opacity-50' />
                    )}
                </div>

                <Zelda className='flex-1 min-w-0' href={item?.url}>
                    <Tooltip content={title}>
                        <span className='text-sm truncate block w-full'>{title}</span>
                    </Tooltip>
                </Zelda>

                <span className='pointer-events-none flex-none text-xs truncate max-w-32 opacity-70'>
                    {getHostname(item?.url)}
                </span>
            </div>

            <div className='flex-none flex flex-row-reverse rtl:flex-row gap-1 pr-2 rtl:pl-2 rtl:pr-0'>
                <ConfirmPopover
                    title={t('card.dialogs.remove-card.title')}
                    description={t('card.dialogs.remove-card.description')}
                    align={index === 0 ? 'start' : 'end'}
                    onAccept={handleRemove}
                >
                    <div>
                        <Tooltip content={t('card.item.tooltips.remove-card')}>
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

                <div onClick={() => openEditCard({ item, onRemove: handleRemove, onUpdate })}>
                    <Tooltip content={t('card.item.tooltips.edit-card')}>
                        <Button
                            className='dark:hover:bg-neutral-700'
                            size='icon-xs'
                            variant='ghost'
                        >
                            <Pencil />
                        </Button>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};
