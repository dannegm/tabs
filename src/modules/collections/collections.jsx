import { nanoid } from 'nanoid';
import { Plus } from 'lucide-react';
import { reverse, sortBy } from '@/modules/common/helpers/arrays';

import { useCollections, useCollectionsActions } from '@/store/collections';

import { Button } from '@/modules/shadcn/components/button';
import { ScrollArea } from '@/modules/shadcn/components/scroll-area';

import { CreateCollectionDialog } from '@/modules/collections/components/create-collection-dialog';

import { CollectionItem } from '@/modules/collections/components/collection-item';

export const Collections = () => {
    const collections = useCollections();

    const {
        //* Collections
        addCollection,
        editCollection,
        toggleCollection,
        removeCollection,

        //* Items
        addItem,
        moveItem,
        removeItem,
    } = useCollectionsActions();

    const iterableCollections = reverse(Object.values(collections));

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
            chrome?.tabs?.create?.({ url: item?.url });
        });
    };

    const handleSaveHere = () => {
        chrome?.tabs?.query?.({ currentWindow: true }, tabs => {
            console.log(tabs);
        });
    };

    return (
        <ScrollArea
            data-layer='collections'
            className='flex-1 overflow-scroll flex flex-col'
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

            {sortBy(iterableCollections, 'index', 'desc').map(collection => {
                const iterableItems = Object.values(collection?.items) || [];
                return (
                    <CollectionItem
                        key={collection.id}
                        className='last:mb-16'
                        {...collection}
                        onAttachItem={handleAttachItem}
                        onRemoveItem={handleRemoveItem}
                        onMoveItem={payload => handleMoveItem(collection.id, payload)}
                        onEdit={handleEditCollection}
                        onToggleExpanded={handleToggleCollection}
                        onRemove={handleRemoveCollection}
                        onOpenEverything={handleOpenEverything}
                        onSaveHere={handleSaveHere}
                    />
                );
            })}
        </ScrollArea>
    );
};
