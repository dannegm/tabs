import { Bolt, Plus, Search } from 'lucide-react';
import { cn } from '@/helpers/utils';

import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';

import { BookmarksGroup } from '@/components/common/bookmarks-group';
import { BookmarkItem } from '@/components/common/bookmark-item';
import { useState } from 'react';

export const Bookmarks = ({ className }) => {
    const [search, setSearch] = useState('');

    return (
        <section
            className={cn('w-full h-full flex flex-col border-l-8 border-l-rose-300', className)}
        >
            <div className='flex flex-row items-center h-12 p-4 border-b border-b-neutral-200'>
                <div className='flex-1'>
                    <h1 className='text-sm font-bold uppercase text-rose-600'>Tabs.</h1>
                </div>
                <div>
                    <Button size='icon-xs' variant='ghost'>
                        <Bolt />
                    </Button>
                </div>
            </div>

            <div className='flex flex-row items-center gap-2 h-16 p-4 border-b border-b-neutral-200'>
                <Input
                    className='w-96'
                    type='text'
                    placeholder='Type to filter'
                    startIcon={<Search />}
                    value={search}
                    onChange={ev => setSearch(ev.target.value)}
                    onClear={() => setSearch('')}
                />
                <div className='flex-1' />
                <Button size='sm'>
                    <Plus /> Add Collection
                </Button>
            </div>

            <div className='flex flex-col'>
                <BookmarksGroup>
                    <BookmarkItem />
                    <BookmarkItem />
                    <BookmarkItem />
                    <BookmarkItem />
                    <BookmarkItem />
                    <BookmarkItem />
                    <BookmarkItem />
                    <BookmarkItem />
                </BookmarksGroup>

                <BookmarksGroup>
                    <BookmarkItem />
                    <BookmarkItem />
                    <BookmarkItem />
                    <BookmarkItem />
                </BookmarksGroup>
            </div>
        </section>
    );
};
