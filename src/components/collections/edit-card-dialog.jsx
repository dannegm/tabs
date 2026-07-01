import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Save } from 'lucide-react';

import { styled } from '@/helpers/utils';
import { useModal } from '@/hooks/use-modal';
import { Label } from '@/ui/label';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Textarea } from '@/ui/textarea';

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/ui/dialog';

const Separator = styled('div', 'flex-1');

export const EditCardDialog = () => {
    const { t } = useTranslation();
    const { isOpen, close, props } = useModal('edit-card');
    const { item, onRemove, onUpdate } = props;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [url, setUrl] = useState('');

    const canSubmit = title.trim() !== '';

    useEffect(() => {
        if (isOpen && item) {
            setTitle(item.title ?? '');
            setUrl(item.url ?? '');
            setDescription('');
        }
    }, [isOpen, item?.id]);

    const handleUpdate = ev => {
        ev.preventDefault();
        if (!canSubmit) return;
        onUpdate?.({
            ...item,
            url,
            customTitle: title,
            customDescription: description,
        });
        close();
    };

    const handleRemove = () => {
        onRemove?.();
        close();
    };

    return (
        <Dialog open={isOpen} onOpenChange={v => !v && close()}>
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
                        <Button type='button' variant='secondary' onClick={handleRemove}>
                            {t('collections.dialogs.edit-card.labels.remove')}
                        </Button>

                        <Separator />

                        <Button type='button' variant='secondary' onClick={close}>
                            {t('collections.dialogs.edit-card.labels.cancel')}
                        </Button>

                        <Button type='submit' disabled={!canSubmit}>
                            <Save /> {t('collections.dialogs.edit-card.labels.save')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
