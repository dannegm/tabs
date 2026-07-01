import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { cn } from '@/helpers/utils';
import { groupBy } from '@/helpers/arrays';
import { bindTabsEvents, unbindTabsEvents } from '@/helpers/chrome';
import { getAllTabsQuery } from '@/queries/chrome';

import { ScrollArea } from '@/ui/scroll-area';
import { TabsGroup } from '@/components/tabs/tabs-group';

const IS_DEV = process.env.NODE_ENV === 'development';

export const Tabs = ({ className }) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const { data: rawTabs = [] } = useQuery(getAllTabsQuery());
    const groups = Object.entries(groupBy(rawTabs, item => item.windowId));

    const refetchTabs = useCallback(
        () => queryClient.invalidateQueries({ queryKey: ['chrome', 'tabs'] }),
        [queryClient],
    );

    useEffect(() => {
        if (!IS_DEV) {
            bindTabsEvents(refetchTabs);
            return () => unbindTabsEvents(refetchTabs);
        }
    }, [refetchTabs]);

    return (
        <aside
            data-layer='tabs'
            className={cn(
                'w-full h-full flex flex-col border-l border-l-neutral-200 rtl:border-l-0 rtl:border-r rtl:border-r-neutral-200',
                'dark:bg-neutral-800 dark:text-neutral-50 dark:border-l-neutral-700 rtl:dark:border-r-neutral-700',
                className,
            )}
        >
            <div
                data-layer='header'
                className={cn(
                    'flex flex-row items-center justify-between h-12 p-4 border-b border-b-neutral-200',
                    'dark:border-b-neutral-600',
                )}
            >
                <div className='flex-1' />
                <div className='text-xs font-bold uppercase'>{t('tabs.title')}</div>
            </div>

            <ScrollArea className='flex-1 max-h-[calc(100vh-3rem)]'>
                <div data-layer='tabs-groups' className='flex flex-col gap-4 m-4'>
                    {groups.map(([id, tabs], index) => (
                        <TabsGroup key={id} id={id} index={index} tabs={tabs} />
                    ))}
                </div>
            </ScrollArea>
        </aside>
    );
};

export default Tabs;
