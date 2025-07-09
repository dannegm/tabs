import { useEffect, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import { z } from 'zod';

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
});

const jsonSchema = z.object({
    version: z.literal(3),
    lists: z.array(listSchema),
});

export const getValidatedData = data => {
    try {
        const validatedData = jsonSchema.parse(data);
        return [validatedData, null];
    } catch (error) {
        return [null, error.errors];
    }
};

const allowedTypes = ['application/json'].join(',');

export const ImportCollection = ({ children, onError, onSuccess }) => {
    const { importCollection } = useCollectionsActions();
    const $picker = useRef();
    const [file, setFile] = useState();

    const handleOpen = () => {
        setFile(null);
        $picker.current.click();
    };

    const getDomain = url => {
        try {
            const parsedUrl = new URL(url);
            return parsedUrl.hostname;
        } catch (error) {
            return null;
        }
    };

    const proccessData = data => {
        const mappedData = reverse(data.lists)
            .map((collection, index) => ({
                index,
                id: nanoid(),
                name: collection.title,
                created_at: Date.now(),
                expanded: true,
                items: collection.cards.map((card, idx) => {
                    const domain = getDomain(card.url);
                    return {
                        index: idx,
                        id: nanoid(),
                        created_at: Date.now(),
                        title: card.title,
                        url: card.url,
                        customTitle: card?.customTitle || '',
                        customDescription: card?.customDescription || '',
                        bgColor: card?.bgColor || null,
                        favIconUrl:
                            card?.favIconUrl ||
                            `https://www.google.com/s2/favicons?domain=${domain}&sz=256`,
                    };
                }),
            }))
            .map(collection => ({
                ...collection,
                items: fromArray(collection.items, 'id'),
            }));

        const proccessData = fromArray(mappedData, 'id');
        importCollection({ collections: proccessData });
        onSuccess?.();
    };

    const validateData = data => {
        const [validatedData, error] = getValidatedData(data);

        if (error) {
            onError?.(error);
            return;
        }

        proccessData(validatedData);
    };

    useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const data = JSON.parse(reader.result);
                validateData(data);
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
