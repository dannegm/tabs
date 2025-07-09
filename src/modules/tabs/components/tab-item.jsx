import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCopyToClipboard } from '@uidotdev/usehooks';
import { toast } from 'sonner';

import { X, File, Volume2, VenetianMask, VolumeOff, Focus, Copy } from 'lucide-react';

import { cn } from '@/modules/common/helpers/utils';
import { closeTab, focusTab, muteTab, unmuteTab } from '@/modules/common/helpers/chrome';
import { toJSON } from '@/modules/common/helpers/objects';

import { Button } from '@/modules/shadcn/components/button';
import { Tooltip } from '@/modules/shadcn/components/tooltip-simple';

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
    ContextMenuSeparator,
} from '@/modules/shadcn/components/context-menu';

import { useDradAndDropActions } from '@/store/dragAndDrop';

const ContextualMenu = ({ item, children }) => {
    const { t } = useTranslation();

    const [, copyToClipboard] = useCopyToClipboard();

    const handleCopy = () => {
        copyToClipboard(item.url);
        toast(t('tabs.item.alerts.copy-link-success'), { description: item.url });
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={() => closeTab(item?.id)}>
                    <X />
                    {t('tabs.item.contextual.close-tab')}
                </ContextMenuItem>

                <ContextMenuItem onClick={() => focusTab(item)}>
                    <Focus />
                    {t('tabs.item.contextual.focus-tab')}
                </ContextMenuItem>

                <ContextMenuSeparator />

                {!item?.mutedInfo?.muted ? (
                    <ContextMenuItem onClick={() => muteTab(item)}>
                        <VolumeOff />
                        {t('tabs.item.contextual.mute-tab')}
                    </ContextMenuItem>
                ) : (
                    <ContextMenuItem onClick={() => unmuteTab(item)}>
                        <Volume2 />
                        {t('tabs.item.contextual.unmute-tab')}
                    </ContextMenuItem>
                )}

                <ContextMenuSeparator />

                <ContextMenuItem onClick={handleCopy}>
                    <Copy />
                    {t('tabs.item.contextual.copy-link')}
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
};

export const TabItem = ({ className, item }) => {
    const { t } = useTranslation();

    const { setItemType, resetItemType } = useDradAndDropActions();
    const [dragging, setDragging] = useState(false);

    const handleDoubleClick = () => {
        focusTab(item);
    };

    const handleClose = () => {
        closeTab(item?.id);
    };

    const handleDragStart = event => {
        setDragging(true);
        setItemType({ type: 'tab' });
        const data = toJSON({ type: 'tab', data: item });
        event.dataTransfer.setData('text/plain', data);
    };

    const handleDragEnd = () => {
        resetItemType();
        setDragging(false);
    };

    return (
        <ContextualMenu item={item}>
            <div data-layer='tab-item' className='relative group'>
                <Tooltip content='Close tab'>
                    <Button
                        className='hidden absolute right-2 top-1/2 transform -translate-y-1/2 group-hover:flex rtl:right-auto rtl:left-2'
                        size='icon-xs'
                        variant='secondary'
                        onClick={handleClose}
                    >
                        <X />
                    </Button>
                </Tooltip>

                <div
                    className={cn(
                        'flex flex-row rtl:flex-row-reverse gap-2 px-3 py-2 w-[calc(var(--sidebar-width)-2rem)] items-center bg-white text-neutral-800 text-sm border border-neutral-200 rounded-sm select-none',
                        'dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200',
                        'cursor-grab touch-none transition-all duration-150',
                        {
                            'bg-neutral-800 border-neutral-600 text-neutral-200 dark:bg-white dark:border-neutral-200 dark:text-neutral-800':
                                item?.incognito,
                        },
                        { 'cursor-grabbing shadow-md': dragging },
                        className,
                    )}
                    onDoubleClick={handleDoubleClick}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    draggable
                >
                    {item?.favIconUrl ? (
                        <img className='size-4' src={item.favIconUrl} />
                    ) : (
                        <File className='size-4' />
                    )}

                    <Tooltip content={item?.title} side='left'>
                        <span className='flex-1 line-clamp-1 text-ellipsis rtl:text-right'>
                            {item.title}
                        </span>
                    </Tooltip>

                    {item?.audible && !item?.mutedInfo?.muted && <Volume2 className='size-4' />}
                    {item?.audible && item?.mutedInfo?.muted && <VolumeOff className='size-4' />}

                    {item?.incognito && (
                        <Tooltip content={t('tabs.item.labels.incognito')}>
                            <VenetianMask className='size-4' />
                        </Tooltip>
                    )}
                </div>
            </div>
        </ContextualMenu>
    );
};
