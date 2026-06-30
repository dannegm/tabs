import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/helpers/utils';
import { bindTabsEvents, getAllTabs, unbindTabsEvents } from '@/helpers/chrome';

const IS_DEV = process.env.NODE_ENV === 'development';
import { groupBy } from '@/helpers/arrays';

import { ScrollArea } from '@/ui/scroll-area';
import { TabsGroup } from '@/components/tabs/tabs-group';

export const Tabs = ({ className }) => {
    const { t } = useTranslation();

    const [groups, setGroups] = useState([]);

    const getChromeTabs = () => {
        getAllTabs(tabs => {
            const groups = groupBy(tabs, item => item.windowId);
            setGroups(Object.entries(groups));
        });
    };

    useEffect(() => {
        getChromeTabs();
        if (!IS_DEV) {
            bindTabsEvents(getChromeTabs);
        }

        return () => {
            if (!IS_DEV) unbindTabsEvents(getChromeTabs);
        };
    }, []);

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
