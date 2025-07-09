import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Save } from 'lucide-react';

import { styled } from '@/modules/common/helpers/utils';
import { Label } from '@/modules/shadcn/components/label';
import { Button } from '@/modules/shadcn/components/button';
import { Input } from '@/modules/shadcn/components/input';
import { Textarea } from '@/modules/shadcn/components/textarea';

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/modules/shadcn/components/dialog';

const Separator = styled('div', 'flex-1');

export const EditCardDialog = ({ item, children, onRemove, onUpdate }) => {
    const { t } = useTranslation();

    const [title, setTitle] = useState(item?.title);
    const [description, setDescription] = useState('');
    const [url, setUrl] = useState(item?.url);

    const canSubmit = title.trim() !== '';

    const handleUpdate = ev => {
        ev.preventDefault();
        if (!canSubmit) return;
        onUpdate?.({
            ...item,
            url,
            customTitle: title,
            customDescription: description,
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className='sm:max-w-md'>
                <form className='flex flex-col gap-8' onSubmit={handleUpdate}>
                    <DialogHeader>
                        <DialogTitle>{t('collections.dialogs.edit-card.title')}</DialogTitle>
                    </DialogHeader>

                    <div className='flex flex-row gap-4'>
                        <div className='block'>
                            <img className='block size-8' src={item?.favIconUrl} />
                        </div>

                        <div className='flex-1 flex flex-col gap-4'>
                            <div className='grid flex-1 gap-2'>
                                <Label htmlFor='card-title'>
                                    {t('collections.dialogs.edit-card.labels.title')}
                                </Label>
                                <Input
                                    id='card-title'
                                    name='card-title'
                                    autoComplete='off'
                                    value={title}
                                    onChange={ev => setTitle(ev.target.value)}
                                />
                            </div>
                            <div className='grid flex-1 gap-2'>
                                <Label htmlFor='card-description'>
                                    {t('collections.dialogs.edit-card.labels.description')}
                                </Label>
                                <Textarea
                                    id='card-description'
                                    name='card-description'
                                    autoComplete='off'
                                    value={description}
                                    onChange={ev => setDescription(ev.target.value)}
                                />
                            </div>
                            <div className='grid flex-1 gap-2'>
                                <Label htmlFor='card-url'>
                                    {t('collections.dialogs.edit-card.labels.url')}
                                </Label>
                                <Input
                                    id='card-url'
                                    name='card-url'
                                    autoComplete='off'
                                    dir='ltr'
                                    value={url}
                                    onChange={ev => setUrl(ev.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className='sm:justify-start rtl:flex-row'>
                        <DialogClose asChild>
                            <Button type='button' variant='secondary' onClick={onRemove}>
                                {t('collections.dialogs.edit-card.labels.remove')}
                            </Button>
                        </DialogClose>

                        <Separator />

                        <DialogClose asChild>
                            <Button type='button' variant='secondary'>
                                {t('collections.dialogs.edit-card.labels.cancel')}
                            </Button>
                        </DialogClose>

                        <DialogClose asChild>
                            <Button type='submit' disabled={!canSubmit}>
                                <Save /> {t('collections.dialogs.edit-card.labels.save')}
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
