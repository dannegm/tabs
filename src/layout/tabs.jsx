import { cn } from '@/helpers/utils';

import { TabItem } from '@/components/common/tab-item';
import { TabsGroup } from '@/components/common/tabs-group';
import { useEffect, useState } from 'react';
import { groupBy } from '@/helpers/arrays';

export const Tabs = ({ className }) => {
    const [groups, setGroups] = useState([]);

    const getChromeTabs = () => {
        chrome?.tabs?.query({}, tabs => {
            const groups = groupBy(tabs, item => item.windowId);
            console.log({ tabs, groups });
            setGroups(Object.entries(groups));
        });
    };

    useEffect(() => {
        getChromeTabs();

        chrome?.tabs?.onCreated.addListener(getChromeTabs);
        chrome?.tabs?.onUpdated.addListener(getChromeTabs);
        chrome?.tabs?.onRemoved.addListener(getChromeTabs);

        return () => {
            chrome?.tabs?.onCreated.removeListener(getChromeTabs);
            chrome?.tabs?.onUpdated.removeListener(getChromeTabs);
            chrome?.tabs?.onRemoved.removeListener(getChromeTabs);
        };
    }, []);

    return (
        <aside
            className={cn(
                'w-full h-full flex flex-col gap-4 border-l border-l-neutral-200',
                className,
            )}
        >
            <div className='flex flex-row items-center justify-between h-12 p-4 border-b border-b-neutral-200'>
                <div className='flex-1' />
                <div className='text-xs font-bold uppercase'>Open Tabs</div>
            </div>
            <div className='flex flex-col gap-4 px-4'>
                {groups.map(([id, tabs], index) => (
                    <TabsGroup key={id} id={id} index={index} tabs={tabs}>
                        {tabs.map(tab => (
                            <TabItem key={tab.id} item={tab} />
                        ))}
                    </TabsGroup>
                ))}
            </div>
        </aside>
    );
};
