import { useEffect, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { FolderInput } from 'lucide-react';

import { reverse } from '@/helpers/arrays';
import { fromArray } from '@/helpers/objects';

import { useGroupsActions } from '@/store/tabs';

import { Button } from '@/components/shadcn/button';
import { Tooltip } from '@/components/shadcn/tooltip-simple';

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

export const ImportBookmarks = () => {
    const { importGroups } = useGroupsActions();
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
            console.error('URL:', url);
            console.error('Invalid URL:', error);
            return null;
        }
    };

    const proccessData = data => {
        const mappedData = reverse(data.lists)
            .map((item, index) => ({
                index,
                expanded: false,
                id: nanoid(),
                created_at: Date.now(),
                name: item.title,
                tabs: item.cards.map((card, idx) => {
                    const domain = getDomain(card.url);
                    return {
                        index: idx,
                        id: nanoid(),
                        created_at: Date.now(),
                        title: card.title,
                        url: card.url,
                        favIconUrl: `https://www.google.com/s2/favicons?domain=${domain}&sz=256`,
                    };
                }),
            }))
            .map(item => ({
                ...item,
                tabs: fromArray(item.tabs, 'id'),
            }));

        const proccessData = fromArray(mappedData, 'id');
        importGroups({ groups: proccessData });
    };

    const validateData = data => {
        console.log('validateData', data);
        const [validatedData, error] = getValidatedData(data);

        if (error) {
            console.log(error);
            alert('Archivo inválido');
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
            <Tooltip content='Import Bookmarks'>
                <Button
                    className='dark:text-neutral-50 dark:hover:bg-neutral-700'
                    size='icon'
                    variant='ghost'
                    onClick={handleOpen}
                >
                    <FolderInput />
                </Button>
            </Tooltip>
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
