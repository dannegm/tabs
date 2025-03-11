import { useEffect, useState } from 'react';
import { cn } from '@/helpers/utils';

import { groupBy } from '@/helpers/arrays';

import { TabItem } from '@/components/common/tab-item';
import { TabsGroup } from '@/components/common/tabs-group';

const sampleTabs = [
    {
        id: 1,
        title: 'Google',
        url: 'https://www.google.com/',
        favIconUrl: 'https://www.google.com/s2/favicons?domain=google.com&sz=256',
    },
    {
        id: 2,
        title: 'Inicio / X',
        url: 'https://x.com/home',
        favIconUrl: 'https://www.google.com/s2/favicons?domain=x.com&sz=256',
    },
    {
        id: 3,
        title: 'Youtube',
        url: 'https://www.youtube.com/',
        favIconUrl: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=256',
    },
];

export const Tabs = ({ className }) => {
    const [groups, setGroups] = useState([]);

    const getChromeTabs = () => {
        chrome?.tabs?.query({}, tabs => {
            const filteredTabs = tabs.filter(tab => !tab?.url?.includes('://newtab'));
            const groups = groupBy(filteredTabs, item => item.windowId);
            console.log({ tabs });
            setGroups(Object.entries(groups));
        });
    };

    useEffect(() => {
        getChromeTabs();

        chrome?.tabs?.onCreated.addListener(getChromeTabs);
        chrome?.tabs?.onUpdated.addListener(getChromeTabs);
        chrome?.tabs?.onRemoved.addListener(getChromeTabs);
        chrome?.tabs?.onAttached.addListener(getChromeTabs);
        chrome?.tabs?.onDetached.addListener(getChromeTabs);
        chrome?.tabs?.onMoved.addListener(getChromeTabs);
        chrome?.tabs?.onActivated.addListener(getChromeTabs);
        chrome?.tabs?.onHighlighted.addListener(getChromeTabs);
        chrome?.tabs?.onReplaced.addListener(getChromeTabs);
        chrome?.tabs?.onZoomChange.addListener(getChromeTabs);

        return () => {
            chrome?.tabs?.onCreated.removeListener(getChromeTabs);
            chrome?.tabs?.onUpdated.removeListener(getChromeTabs);
            chrome?.tabs?.onRemoved.removeListener(getChromeTabs);
            chrome?.tabs?.onAttached.removeListener(getChromeTabs);
            chrome?.tabs?.onDetached.removeListener(getChromeTabs);
            chrome?.tabs?.onMoved.removeListener(getChromeTabs);
            chrome?.tabs?.onActivated.removeListener(getChromeTabs);
            chrome?.tabs?.onHighlighted.removeListener(getChromeTabs);
            chrome?.tabs?.onReplaced.removeListener(getChromeTabs);
            chrome?.tabs?.onZoomChange.removeListener(getChromeTabs);
        };
    }, []);

    return (
        <aside
            className={cn(
                'w-full h-full flex flex-col gap-4 border-l border-l-neutral-200',
                'dark:bg-neutral-800 dark:text-neutral-50 dark:border-l-neutral-700',
                className,
            )}
        >
            <div
                className={cn(
                    'flex flex-row items-center justify-between h-12 p-4 border-b border-b-neutral-200',
                    'dark:border-b-neutral-600',
                )}
            >
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

                {!Boolean(groups.length) && (
                    <TabsGroup index={0} tabs={sampleTabs}>
                        {sampleTabs.map(tab => (
                            <TabItem key={`sample-tab-${tab.id}`} item={tab} />
                        ))}
                    </TabsGroup>
                )}
            </div>
        </aside>
    );
};
