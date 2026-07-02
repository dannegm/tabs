import { LayoutGrid, List, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useQueryState, parseAsString } from 'nuqs';

import { cn } from '@/helpers/utils';
import { useSettings } from '@/hooks/use-settings';
import { useCollectionsActions } from '@/services/collections';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/ui/tabs';

export const Toolbar = () => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useQueryState('q', parseAsString.withDefault(''));
    const [viewMode, setViewMode] = useSettings('viewMode', 'cards');
    const { expandAllCollections, collapseAllCollections } = useCollectionsActions();

    return (
        <div
            data-layer='toolbar'
            className={cn(
                'flex flex-row items-center gap-2 h-10 px-4 pl-8 rtl:pl-4 rtl:pr-8 border-b border-b-neutral-200',
                'dark:border-b-neutral-700',
            )}
        >
            <div className='flex-1'>
                <Input
                    className='h-7 text-xs'
                    startIcon={<Search />}
                    placeholder={t('toolbar.search.placeholder')}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value || null)}
                    onClear={searchQuery ? () => setSearchQuery(null) : undefined}
                />
            </div>

            <Button
                className='dark:text-neutral-200 dark:hover:bg-neutral-700'
                size='xs'
                variant='ghost'
                onClick={expandAllCollections}
            >
                {t('header.labels.expand')}
            </Button>
            <Button
                className='dark:text-neutral-200 dark:hover:bg-neutral-700'
                size='xs'
                variant='ghost'
                onClick={collapseAllCollections}
            >
                {t('header.labels.collapse')}
            </Button>

            <Tabs value={viewMode} onValueChange={setViewMode}>
                <TabsList>
                    <TabsTrigger value='cards' className='size-6 [&_svg]:size-[0.875rem]!'>
                        <LayoutGrid />
                    </TabsTrigger>
                    <TabsTrigger value='list' className='size-6 [&_svg]:size-[0.875rem]!'>
                        <List />
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    );
};
