import { useTranslation } from 'react-i18next';

import { nanoid } from 'nanoid';
import { Plus } from 'lucide-react';

import { useCollections, useCollectionsActions } from '@/store/collections';

import { move, reverse, sortBy } from '@/modules/common/helpers/arrays';
import { newItem } from '@/modules/common/helpers/mappers';
import {
    closeTabsCurrentWindow,
    getCurrentWindowTabs,
    openLink,
} from '@/modules/common/helpers/chrome';

import { Button } from '@/modules/shadcn/components/button';
import { ScrollArea } from '@/modules/shadcn/components/scroll-area';

import { CreateCollectionDialog } from '@/modules/collections/components/create-collection-dialog';
import { CollectionItem } from '@/modules/collections/components/collection-item';

export const Collections = () => {
    const { t } = useTranslation();

    const collections = useCollections();

    const {
        //* Collections
        addCollection,
        editCollection,
        toggleCollection,
        setCollectionBgColor,
        removeCollection,
        sortCollections,

        //* Items
        appendItems,
        addItem,
        updateItem,
        moveItem,
        removeItem,
    } = useCollectionsActions();

    const iterableCollections = sortBy(Object.values(collections), 'index', 'desc');

    //* Collections
    const handleAddCollection = ({ name }) => {
        const payload = {
            name,
            id: nanoid(),
            expanded: true,
        };
        addCollection(payload);
    };

    const handleEditCollection = ({ id, name }) => {
        editCollection({ id, name });
    };

    const handleToggleCollection = ({ id }) => {
        toggleCollection({ id });
    };

    const handleSetCollectionBgColor = ({ id, bgColor }) => {
        setCollectionBgColor({ id, bgColor });
    };

    const handleRemoveCollection = ({ id }) => {
        removeCollection({ id });
    };

    const handleSortCollections = ({ active, over }) => {
        const oldIndex = iterableCollections.findIndex(item => item.id === active?.id);
        const newIndex = iterableCollections.findIndex(item => item.id === over?.id);
        const sortedItems = move(iterableCollections, oldIndex, newIndex).map(item => item.id);
        sortCollections({ items: reverse(sortedItems) });
    };

    //* Items
    const handleAttachItem = payload => {
        addItem(payload);
    };

    const handleMoveItem = payload => {
        moveItem({ ...payload });
    };

    const handleUpdateItem = (collectionId, item) => {
        updateItem({
            collectionId,
            id: item?.id,
            payload: item,
        });
    };

    const handleRemoveItem = (collectionId, { id }) => {
        removeItem({ collectionId, id });
    };

    //* Actions
    const handleOpenEverything = items => {
        items.forEach(item => {
            openLink({ url: item?.url, target: 'blank' });
        });
    };

    const handleSaveHere = ({ id }) => {
        getCurrentWindowTabs(tabs => {
            const items = tabs.map(newItem);
            appendItems({
                collectionId: id,
                items,
            });

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
            {!iterableCollections.length && (
                <div className='flex-center flex-col gap-4 p-12 m-4 bg-rose-100 text-rose-400 dark:bg-rose-500/20 dark:text-rose-400/70 rounded-lg'>
                    <h2 className='text-xl'>{t('collections.empty')}</h2>

                    <CreateCollectionDialog onCreate={handleAddCollection}>
                        <Button size='lg'>
                            <Plus /> {t('collections.labels.add-collection')}
                        </Button>
                    </CreateCollectionDialog>
                </div>
            )}

            {iterableCollections.map(collection => (
                <CollectionItem
                    {...collection}
                    key={collection.id}
                    onAttachItem={handleAttachItem}
                    onRemoveItem={handleRemoveItem}
                    onUpdateItem={handleUpdateItem}
                    onMoveItem={handleMoveItem}
                    onEdit={handleEditCollection}
                    onToggleExpanded={handleToggleCollection}
                    onRemove={handleRemoveCollection}
                    onOpenEverything={handleOpenEverything}
                    onSaveHere={handleSaveHere}
                    onSort={handleSortCollections}
                    onBgColorChange={handleSetCollectionBgColor}
                />
            ))}
        </ScrollArea>
    );
};
