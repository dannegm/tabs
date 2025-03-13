import { useEffect, useState } from 'react';
import { cn } from '@/modules/common/helpers/utils';

import { groupBy } from '@/modules/common/helpers/arrays';

import { TabsGroup } from '@/modules/tabs/components/tabs-group';

const IS_DEV = process.env.NODE_ENV === 'development';

const sampleTabs = [
    {
        id: 1,
        title: 'Google',
        url: 'https://www.google.com/',
        favIconUrl: 'https://www.google.com/s2/favicons?domain=google.com&sz=256',
        incognito: true,
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
        audible: true,
    },
];

export const Tabs = ({ className }) => {
    const [groups, setGroups] = useState([]);

    const getChromeTabs = () => {
        chrome?.tabs?.query({}, tabs => {
            const filteredTabs = tabs.filter(tab => !tab?.url?.includes('://newtab'));
            const groups = groupBy(filteredTabs, item => item.windowId);
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

                {IS_DEV && <TabsGroup id={0} index={0} tabs={sampleTabs} />}
            </div>
        </aside>
    );
};
