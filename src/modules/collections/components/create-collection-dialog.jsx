import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Save } from 'lucide-react';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

import { styled } from '@/modules/common/helpers/utils';
import { Button } from '@/modules/shadcn/components/button';
import { Input } from '@/modules/shadcn/components/input';
import { Label } from '@/modules/shadcn/components/label';

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/modules/shadcn/components/dialog';

const Separator = styled('div', 'flex-1');

const getRandomName = () => {
    return uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        length: 2,
        separator: ' ',
        style: 'capital',
    });
};

export const CreateCollectionDialog = ({ children, onCreate }) => {
    const { t } = useTranslation();

    const [placeholder, setPlaceholder] = useState('');
    const [name, setName] = useState('');

    const canSubmit = name.trim() !== '';

    const handleReset = () => {
        setName('');
        setPlaceholder(getRandomName());
    };

    const handleCreate = ev => {
        ev.preventDefault();
        if (!canSubmit) return;
        onCreate?.({ name });
        handleReset();
    };

    const handleAutoGenerated = ev => {
        onCreate?.({ name: placeholder });
        handleReset();
    };

    return (
        <Dialog>
            <DialogTrigger onClick={handleReset} asChild>
                {children}
            </DialogTrigger>
            <DialogContent className='sm:max-w-md'>
                <form className='flex flex-col gap-2' onSubmit={handleCreate}>
                    <DialogHeader>
                        <DialogTitle>
                            {t('collections.dialogs.create-collection.title')}
                        </DialogTitle>
                        <DialogDescription>
                            {t('collections.dialogs.create-collection.description')}
                        </DialogDescription>
                    </DialogHeader>

                    <div className='flex items-center space-x-2'>
                        <div className='grid flex-1 gap-2'>
                            <Label htmlFor='group-name' className='sr-only'>
                                {t('collections.dialogs.create-collection.labels.name')}
                            </Label>
                            <Input
                                id='group-name'
                                name='group-name'
                                autoComplete='off'
                                placeholder={placeholder}
                                value={name}
                                onChange={ev => setName(ev.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter className='sm:justify-start'>
                        <DialogClose asChild>
                            <Button type='button' variant='secondary' onClick={handleAutoGenerated}>
                                {t('collections.dialogs.create-collection.labels.auto-name')}
                            </Button>
                        </DialogClose>

                        <Separator />

                        <DialogClose asChild>
                            <Button type='button' variant='secondary'>
                                {t('collections.dialogs.create-collection.labels.cancel')}
                            </Button>
                        </DialogClose>

                        <DialogClose asChild>
                            <Button type='submit' disabled={!canSubmit}>
                                <Save /> {t('collections.dialogs.create-collection.labels.save')}
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
