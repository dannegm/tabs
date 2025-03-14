import { nanoid } from 'nanoid';
import { useDndMonitor } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';

import { useCollections, useCollectionsActions } from '@/store/collections';

import { reverse, sortBy } from '@/modules/common/helpers/arrays';
import { newItem } from '@/modules/common/helpers/mappers';
import {
    closeTabsCurrentWindow,
    createTab,
    getCurrentWindowTabs,
} from '@/modules/common/helpers/chrome';

import { Button } from '@/modules/shadcn/components/button';
import { ScrollArea } from '@/modules/shadcn/components/scroll-area';

import { CreateCollectionDialog } from '@/modules/collections/components/create-collection-dialog';
import { CollectionItem } from '@/modules/collections/components/collection-item';

import { CollectionsSortableContext } from './components/collections-sortable-contex';
import { CollectionSortableItem } from './components/collection-sortable-item';

export const Collections = () => {
    const collections = useCollections();

    const {
        //* Collections
        addCollection,
        editCollection,
        toggleCollection,
        removeCollection,
        sortCollections,

        //* Items
        appendItems,
        addItem,
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

    const handleRemoveCollection = ({ id }) => {
        removeCollection({ id });
    };

    //* Items
    const handleAttachItem = payload => {
        addItem(payload);
    };

    const handleMoveItem = (originalCollectionId, payload) => {
        moveItem({ originalCollectionId, ...payload });
    };

    const handleRemoveItem = (collectionId, { id }) => {
        removeItem({ collectionId, id });
    };

    //* Actions
    const handleOpenEverything = items => {
        items.forEach(item => {
            createTab({ url: item?.url });
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

    //* Sortable
    useDndMonitor({
        onDragEnd: event => {
            const { active, over } = event;
            const activeData = active?.data?.current;
            const overData = over?.data?.current;

            const areDifferent = active?.id !== over?.id;
            const areSortables = overData?.sortable && activeData?.sortable;

            if (areDifferent && areSortables) {
                const oldIndex = iterableCollections.findIndex(item => item.id === activeData?.id);
                const newIndex = iterableCollections.findIndex(item => item.id === overData?.id);
                const sortedItems = arrayMove(iterableCollections, oldIndex, newIndex).map(
                    item => item.id,
                );
                sortCollections({ items: reverse(sortedItems) });
            }
        },
    });

    return (
        <ScrollArea
            data-layer='collections'
            className='flex-1 overflow-scroll overflow-x-hidden overflow-y-scroll flex flex-col'
            classNames={{ thumb: 'dark:bg-neutral-600' }}
            type='always'
        >
            {!iterableCollections.length && (
                <div className='flex-center flex-col gap-4 p-12 m-4 bg-rose-100 text-rose-400 dark:bg-rose-500/20 dark:text-rose-400/70 rounded-lg'>
                    <h2 className='text-xl'>Let's start adding some new collection.</h2>

                    <CreateCollectionDialog onCreate={handleAddCollection}>
                        <Button size='lg'>
                            <Plus /> Add Collection
                        </Button>
                    </CreateCollectionDialog>
                </div>
            )}

            <CollectionsSortableContext items={iterableCollections}>
                {iterableCollections.map(collection => (
                    <CollectionSortableItem key={collection.id} item={collection}>
                        <CollectionItem
                            {...collection}
                            key={collection.id}
                            onAttachItem={handleAttachItem}
                            onRemoveItem={handleRemoveItem}
                            onMoveItem={payload => handleMoveItem(collection.id, payload)}
                            onEdit={handleEditCollection}
                            onToggleExpanded={handleToggleCollection}
                            onRemove={handleRemoveCollection}
                            onOpenEverything={handleOpenEverything}
                            onSaveHere={handleSaveHere}
                        />
                    </CollectionSortableItem>
                ))}
            </CollectionsSortableContext>
        </ScrollArea>
    );
};
