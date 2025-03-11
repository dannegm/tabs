import { useState } from 'react';
import { nanoid } from 'nanoid';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';
import { Bolt, Plus, Search, Trash2 } from 'lucide-react';

import { cn } from '@/helpers/utils';
import { reverse } from '@/helpers/arrays';

import { useGroups, useGroupsActions } from '@/store/tabs';
import { useSettings } from '@/hooks/use-settings';

import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { ScrollArea } from '@/components/shadcn/scroll-area';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/shadcn/tooltip';

import { DarkModeToggle } from '@/components/common/dark-mode-toggle';
import { DebugModeToggle } from '@/components/common/debug-mode-toggle';
import { ImportBookmarks } from '@/components/common/import-bookmarks';
import { JsonViewer } from '@/components/common/json-viewer';
import { BookmarksGroup } from '@/components/common/bookmarks-group';
import { BookmarkItem } from '@/components/common/bookmark-item';

const getRandomName = () => {
    return uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        length: 2,
        separator: ' ',
        style: 'capital',
    });
};

export const Bookmarks = ({ className }) => {
    const [debug] = useSettings('settings:debug', false);

    const groups = useGroups();
    const { addGroup, toggleGroup, removeGroup, addTab, moveTab, removeTab, clear } =
        useGroupsActions();

    const [search, setSearch] = useState('');
    const iterableGroups = reverse(Object.values(groups));

    const handleAddGroup = () => {
        const payload = {
            id: nanoid(),
            name: getRandomName(),
            expanded: true,
        };
        addGroup(payload);
    };

    const handleToggleGroup = ({ id }) => {
        toggleGroup({ id });
    };

    const handleRemoveGroup = ({ id }) => {
        removeGroup({ id });
    };

    const handleAttachTab = payload => {
        addTab(payload);
    };

    const handleMoveTab = (originalGroupId, payload) => {
        moveTab({ originalGroupId, ...payload });
    };

    const handleRemoveTab = (groupId, { id }) => {
        removeTab({ groupId, id });
    };

    const handleOpenEverything = tabs => {
        tabs.forEach(tab => {
            chrome?.tabs?.create?.({ url: tab?.url });
        });
    };

    const handleSaveHere = () => {
        chrome?.tabs?.query?.({ active: true, currentWindow: true }, tabs => {
            console.log(tabs);
        });
    };

    return (
        <section
            className={cn(
                'w-full h-full max-h-screen flex flex-col border-l-8 border-l-rose-300',
                'dark:bg-neutral-800 dark:text-neutral-50 dark:border-l-rose-500',
                className,
            )}
        >
            <div
                data-layer='header'
                className={cn(
                    'flex flex-row items-center h-12 p-4 border-b border-b-neutral-200',
                    'dark:border-b-neutral-700',
                )}
            >
                <div className='flex-1'>
                    <h1
                        className={cn(
                            'text-sm font-bold uppercase text-rose-600',
                            'dark:text-rose-400',
                        )}
                    >
                        Tabs.
                    </h1>
                </div>
                <div className='flex flex-row gap-1 items-center'>
                    <DebugModeToggle />

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className='dark:text-neutral-50 dark:hover:bg-neutral-700'
                                    size='icon'
                                    variant='ghost'
                                    onClick={clear}
                                >
                                    <Trash2 />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side='bottom'>
                                <p>Clear collections</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <ImportBookmarks />
                    <DarkModeToggle />

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className='dark:text-neutral-50 dark:hover:bg-neutral-700'
                                    size='icon'
                                    variant='ghost'
                                >
                                    <Bolt />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side='bottom'>
                                <p>Settings</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            <div
                data-layer='actions'
                className={cn(
                    'flex flex-row items-center gap-2 h-16 p-4 border-b border-b-neutral-200 shadow-sm',
                    'dark:border-b-neutral-700',
                )}
            >
                <Input
                    className='w-96 dark:border-neutral-600'
                    type='text'
                    placeholder='Type to filter'
                    startIcon={<Search />}
                    value={search}
                    onChange={ev => setSearch(ev.target.value)}
                    onClear={() => setSearch('')}
                />
                <div className='flex-1' />
                <Button size='sm' onClick={handleAddGroup}>
                    <Plus /> Add Collection
                </Button>
            </div>

            {debug && (
                <div
                    data-layer='state-debuger'
                    className={cn(
                        'p-4 border-b border-b-neutral-200 shadow-sm',
                        'dark:border-b-neutral-700',
                    )}
                >
                    <JsonViewer name='groups' data={groups} />
                </div>
            )}

            <ScrollArea
                data-layer='collections'
                className='flex-1 overflow-scroll flex flex-col'
                classNames={{ thumb: 'dark:bg-neutral-600' }}
                type='always'
            >
                {!iterableGroups.length && (
                    <div className='flex-center flex-col gap-4 p-16 m-4 bg-rose-200 text-rose-500 dark:bg-rose-500/40 dark:text-rose-400 rounded-lg'>
                        <h2 className='text-xl'>Let's start adding some new collection.</h2>

                        <Button size='lg' onClick={handleAddGroup}>
                            <Plus /> Add Collection
                        </Button>
                    </div>
                )}
                {iterableGroups.map(group => {
                    const iterableTabs = Object.values(group?.tabs) || [];
                    return (
                        <BookmarksGroup
                            key={group.id}
                            {...group}
                            className='last:mb-16'
                            empty={!iterableTabs.length}
                            expanded={group.expanded}
                            onAttach={handleAttachTab}
                            onMove={payload => handleMoveTab(group.id, payload)}
                            onRemove={handleRemoveGroup}
                            onOpenEverything={() => handleOpenEverything(iterableTabs)}
                            onSaveHere={handleSaveHere}
                            onToggleExpanded={handleToggleGroup}
                        >
                            {iterableTabs.map(tab => (
                                <BookmarkItem
                                    key={tab.id}
                                    item={tab}
                                    onRemove={item => handleRemoveTab(group.id, item)}
                                />
                            ))}
                        </BookmarksGroup>
                    );
                })}
            </ScrollArea>
        </section>
    );
};
