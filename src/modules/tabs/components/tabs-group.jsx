import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { nanoid } from 'nanoid';
import { formatDate } from 'date-fns';
import { ChevronDown, ChevronRight, Download, Focus, X } from 'lucide-react';

import { useCollectionsActions } from '@/store/collections';

import { cn } from '@/modules/common/helpers/utils';
import { closeTabsByWindow, closeWindow, focusWindow } from '@/modules/common/helpers/chrome';
import { newItem } from '@/modules/common/helpers/mappers';
import { fromArray } from '@/modules/common/helpers/objects';

import { Button } from '@/modules/shadcn/components/button';
import { Separator } from '@/modules/shadcn/components/separator';
import { Tooltip } from '@/modules/shadcn/components/tooltip-simple';

import { TabItem } from './tab-item';

export const TabsGroup = ({ className, id, index, tabs }) => {
    const { t } = useTranslation();

    const { addCollection } = useCollectionsActions();

    const [open, setOpen] = useState(true);

    const handleFocus = () => {
        focusWindow(id);
    };

    const handleToggle = () => {
        setOpen(!open);
    };

    const handleClose = () => {
        closeWindow(id);
    };

    const handleSaveSession = () => {
        const groupId = nanoid();
        const dateLabel = formatDate(new Date(), "MMM d, ''yy 'at' HH:mm");
        const mappedTabs = tabs.map(newItem);
        const tabsCollection = fromArray(mappedTabs, 'id');

        addCollection({
            id: groupId,
            name: dateLabel,
            expanded: true,
            items: tabsCollection,
        });

        closeTabsByWindow(+id);
    };

    return (
        <div data-layer='tabs-group' className={cn('flex flex-col gap-4 rounded-sm', className)}>
            <div data-layer='header' className='flex flex-row rtl:flex-row-reverse items-center justify-between'>
                <div className='flex flex-row items-center gap-1'>
                    <Button
                        className='leading-1 dark:bg-neutral-700 rtl:flex-row-reverse'
                        variant='secondary'
                        size='xs'
                        onClick={handleToggle}
                    >
                        <span>{t('tabs.group.labels.window-name', { number: index + 1 })}</span>
                        {open ? <ChevronDown /> : <ChevronRight />}
                    </Button>
                </div>

                <div className='flex flex-row rtl:flex-row-reverse items-center gap-1'>
                    <Tooltip content={t('tabs.group.labels.show-window')}>
                        <Button
                            className='dark:hover:bg-neutral-700'
                            size='icon-xs'
                            variant='ghost'
                            onClick={handleFocus}
                        >
                            <Focus />
                        </Button>
                    </Tooltip>
                    <Tooltip content={t('tabs.group.labels.save-session')}>
                        <Button
                            className='dark:hover:bg-neutral-700'
                            size='icon-xs'
                            variant='ghost'
                            onClick={handleSaveSession}
                        >
                            <Download />
                        </Button>
                    </Tooltip>
                    <Tooltip content={t('tabs.group.labels.close-window')}>
                        <Button
                            className='dark:hover:bg-neutral-700'
                            size='icon-xs'
                            variant='ghost'
                            onClick={handleClose}
                        >
                            <X />
                        </Button>
                    </Tooltip>
                </div>
            </div>

            {!tabs.length && <div className='text-sm'>{t('tabs.group.labels.no-tabs')}</div>}

            {open && (
                <div data-layer='items' className='flex flex-col gap-2'>
                    {tabs.map(tab => (
                        <TabItem key={tab.id} windowId={id} item={tab} />
                    ))}
                </div>
            )}

            <Separator className='dark:bg-neutral-700' />
        </div>
    );
};
