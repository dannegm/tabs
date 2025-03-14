import { useEffect, useState } from 'react';

import { cn } from '@/modules/common/helpers/utils';
import { bindTabsEvents, getAllTabs, unbindTabsEvents } from '@/modules/common/helpers/chrome';
import { groupBy } from '@/modules/common/helpers/arrays';

import { TabsGroup } from '@/modules/tabs/components/tabs-group';

export const Tabs = ({ className }) => {
    const [groups, setGroups] = useState([]);

    const getChromeTabs = () => {
        getAllTabs(tabs => {
            const groups = groupBy(tabs, item => item.windowId);
            setGroups(Object.entries(groups));
        });
    };

    useEffect(() => {
        getChromeTabs();
        bindTabsEvents(getChromeTabs);

        return () => {
            unbindTabsEvents(getChromeTabs);
        };
    }, []);

    return (
        <aside
            data-layer='tabs'
            className={cn(
                'w-full h-full flex flex-col gap-4 border-l border-l-neutral-200',
                'dark:bg-neutral-800 dark:text-neutral-50 dark:border-l-neutral-700',
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
                <div className='text-xs font-bold uppercase'>Open Tabs</div>
            </div>

            <div data-layer='tabs-groups' className='flex flex-col gap-4 px-4'>
                {groups.map(([id, tabs], index) => (
                    <TabsGroup key={id} id={id} index={index} tabs={tabs} />
                ))}
            </div>
        </aside>
    );
};

export default Tabs;
