import { useEffect, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { useCollectionsActions } from '@/store/collections';

import { reverse } from '@/modules/common/helpers/arrays';
import { fromArray } from '@/modules/common/helpers/objects';

const cardSchema = z.object({
    title: z.string(),
    url: z.string(),
});

const listSchema = z.object({
    title: z.string(),
    cards: z.array(cardSchema),
    bgColor: z.string().nullable().optional(),
});

const jsonSchema = z.object({
    version: z.literal(3),
    lists: z.array(listSchema),
});

const allowedTypes = ['application/json'].join(',');

export const getValidatedCollectionData = data => {
    try {
        const validatedData = listSchema.parse(data);
        return [validatedData, null];
    } catch (error) {
        return [null, error.errors];
    }
};

export const getValidatedTobbyData = data => {
    try {
        const validatedData = jsonSchema.parse(data);
        return [validatedData, null];
    } catch (error) {
        return [null, error.errors];
    }
};

const validateCollectionData = data => {
    const [validatedData, error] = getValidatedCollectionData(data);
    return validatedData && !error;
};

const validateTobyData = data => {
    const [validatedData, error] = getValidatedTobbyData(data);
    return validatedData && !error;
};

const getDomain = url => {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.hostname;
    } catch (error) {
        return null;
    }
};

const mapItem = (item, idx) => {
    const domain = getDomain(item.url);
    return {
        index: idx,
        id: nanoid(),
        created_at: Date.now(),
        title: item.title,
        url: item.url,
        customTitle: item?.customTitle || '',
        customDescription: item?.customDescription || '',
        favIconUrl:
            item?.favIconUrl || `https://www.google.com/s2/favicons?domain=${domain}&sz=256`,
    };
};

export const ImportCollection = ({ children, onError, onSuccess }) => {
    const { t } = useTranslation();

    const { importCollection, addCollection } = useCollectionsActions();
    const $picker = useRef();
    const [file, setFile] = useState();

    const handleOpen = () => {
        setFile(null);
        $picker.current.click();
    };

    const proccessTobyData = data => {
        const mappedData = reverse(data.lists)
            .map((collection, index) => ({
                index,
                id: nanoid(),
                name: collection.title,
                created_at: Date.now(),
                expanded: true,
                bgColor: collection?.bgColor || null,
                items: collection.cards.map(mapItem),
            }))
            .map(collection => ({
                ...collection,
                items: fromArray(collection.items, 'id'),
            }));

        const proccessData = fromArray(mappedData, 'id');
        importCollection({ collections: proccessData });

        toast.success(
            t('common.import.alerts.all-collections-imported', {
                count: mappedData.length,
            }),
        );
        onSuccess?.();
    };

    const proccessCollectionData = ({ collection }) => {
        const items = collection.cards.map(mapItem);
        const collectionData = {
            id: nanoid(),
            name: collection.title,
            expanded: true,
            bgColor: collection.bgColor || null,
            items: fromArray(items, 'id'),
        };
        addCollection(collectionData);

        toast.success(
            t('common.import.alerts.single-collection-imported', {
                name: collection.title,
            }),
        );
        onSuccess?.();
    };

    const processUnknownData = () => {
        toast.error(t('common.import.alerts.unsupported'));
        onError?.('Unsupported file format');
    };

    const inferImportType = data => {
        if (data?.type === 'collection' && validateCollectionData(data?.collection)) {
            return 'collection';
        }

        if (validateTobyData(data)) {
            return 'toby';
        }

        return 'unknown';
    };

    const processData = data => {
        const processors = {
            collection: proccessCollectionData,
            toby: proccessTobyData,
            unknown: processUnknownData,
        };

        const type = inferImportType(data);
        const processor = processors[type];
        processor?.(data);
    };

    useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const data = JSON.parse(reader.result);
                processData(data);
            };
            reader.readAsText(file);
        }
    }, [file]);

    return (
        <>
            <div onClick={handleOpen}>{children}</div>
            <input
                ref={$picker}
                className='hidden'
                type='file'
                accept={allowedTypes}
                onClick={() => setFile(null)}
                onChange={ev => setFile(ev.target.files[0])}
            />
        </>
    );
};
