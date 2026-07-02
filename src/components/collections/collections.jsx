import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Fuse from 'fuse.js';
import { useQueryState, parseAsString } from 'nuqs';

import { useCollections, useCollectionsActions } from '@/services/collections';
import { useListener } from '@/providers/bus-provider';
import { useModal } from '@/hooks/use-modal';
import { useSettings } from '@/hooks/use-settings';

import { sortBy } from '@/helpers/arrays';
import { newItem } from '@/helpers/mappers';
import { closeTabsCurrentWindow, getCurrentWindowTabs, openLink } from '@/helpers/chrome';

import { Button } from '@/ui/button';
import { ScrollArea } from '@/ui/scroll-area';

import { CollectionItem } from '@/components/collections/collection-item';

export const Collections = () => {
    const { t } = useTranslation();

    const collections = useCollections();
    const {
        addCollection,
        editCollection,
        toggleCollection,
        setCollectionBgColor,
        removeCollection,
        appendItems,
        addItem,
        updateItem,
        moveItem,
        removeItem,
        sortCollections,
        sortItems,
    } = useCollectionsActions();

    const [searchQuery] = useQueryState('q', parseAsString.withDefault(''));
    const [viewMode] = useSettings('viewMode', 'cards');

    const sortedCollections = sortBy(Object.values(collections), 'index', 'desc');
    const { open: openCreateCollection } = useModal('create-collection');

    const fuse = useMemo(() => {
        const allItems = sortedCollections.flatMap(c =>
            Object.values(c.items).map(item => ({ ...item, _collectionId: c.id })),
        );
        return new Fuse(allItems, {
            keys: ['title', 'customTitle', 'customDescription', 'url'],
            threshold: 0.4,
        });
    }, [collections]);

    const matchingItemIds = useMemo(() => {
        if (!searchQuery) return null;
        const results = fuse.search(searchQuery);
        return new Set(results.map(r => r.item.id));
    }, [fuse, searchQuery]);

    const getFilteredItems = collection => {
        if (!matchingItemIds) return collection.items;
        return Object.fromEntries(
            Object.entries(collection.items).filter(([id]) => matchingItemIds.has(id)),
        );
    };

    const visibleCollections = matchingItemIds
        ? sortedCollections.filter(c => Object.keys(getFilteredItems(c)).length > 0)
        : sortedCollections;

    useListener('collections:sort', useCallback(({ items }) => sortCollections({ items }), [sortCollections]));
    useListener('items:sort', useCallback(({ collectionId, items }) => sortItems({ collectionId, items }), [sortItems]));
    useListener('items:move', useCallback(({ id, from, to, index }) => moveItem({ id, originalCollectionId: from, targetCollectionId: to, index }), [moveItem]));
    useListener('tab:save', useCallback(({ collectionId, id, payload, index }) => addItem({ collectionId, id, payload, index }), [addItem]));

    const handleAddCollection = ({ name }) => addCollection({ name, expanded: true });

    const handleUpdateItem = (collectionId, item) =>
        updateItem({ collectionId, id: item?.id, payload: item });

    const handleRemoveItem = (collectionId, { id }) => removeItem({ collectionId, id });

    const handleOpenEverything = items => {
        items.forEach(item => openLink({ url: item?.url, target: 'blank' }));
    };

    const handleSaveHere = ({ id }) => {
        getCurrentWindowTabs(tabs => {
            appendItems({ collectionId: id, items: tabs.map(newItem) });
            closeTabsCurrentWindow();
        });
    };

    return (
        <ScrollArea
            data-layer='collections'
            className='flex-1 overflow-x-hidden flex flex-col'
            classNames={{ thumb: 'dark:bg-neutral-600' }}
            type='always'
        >
            {!sortedCollections.length && (
                <div className='flex-center flex-col gap-4 p-12 m-4 bg-rose-100 text-rose-400 dark:bg-rose-500/20 dark:text-rose-400/70 rounded-lg'>
                    <h2 className='text-xl'>{t('collections.empty')}</h2>

                    <Button
                        size='lg'
                        onClick={() => openCreateCollection({ onCreate: handleAddCollection })}
                    >
                        <Plus /> {t('collections.labels.add-collection')}
                    </Button>
                </div>
            )}

            <SortableContext
                items={visibleCollections.map(c => c.id)}
                strategy={verticalListSortingStrategy}
            >
                {visibleCollections.map(collection => (
                    <CollectionItem
                        {...collection}
                        key={collection.id}
                        items={getFilteredItems(collection)}
                        viewMode={viewMode}
                        onUpdateItem={handleUpdateItem}
                        onRemoveItem={handleRemoveItem}
                        onEdit={({ id, name }) => editCollection({ id, name })}
                        onToggleExpanded={({ id }) => toggleCollection({ id })}
                        onRemove={({ id }) => removeCollection({ id })}
                        onOpenEverything={handleOpenEverything}
                        onSaveHere={handleSaveHere}
                        onBgColorChange={({ id, bgColor }) => setCollectionBgColor({ id, bgColor })}
                    />
                ))}
            </SortableContext>
        </ScrollArea>
    );
};
