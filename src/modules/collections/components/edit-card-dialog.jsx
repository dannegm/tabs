import { useState } from 'react';
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
                        <DialogTitle>Edit Card</DialogTitle>
                    </DialogHeader>

                    <div className='flex flex-row gap-4'>
                        <div className='block'>
                            <img className='block size-8' src={item?.favIconUrl} />
                        </div>

                        <div className='flex-1 flex flex-col gap-4'>
                            <div className='grid flex-1 gap-2'>
                                <Label htmlFor='card-title'>Title</Label>
                                <Input
                                    id='card-title'
                                    name='card-title'
                                    autoComplete='off'
                                    value={title}
                                    onChange={ev => setTitle(ev.target.value)}
                                />
                            </div>
                            <div className='grid flex-1 gap-2'>
                                <Label htmlFor='card-description'>Description</Label>
                                <Textarea
                                    id='card-description'
                                    name='card-description'
                                    autoComplete='off'
                                    value={description}
                                    onChange={ev => setDescription(ev.target.value)}
                                />
                            </div>
                            <div className='grid flex-1 gap-2'>
                                <Label htmlFor='card-url'>URL</Label>
                                <Input
                                    id='card-url'
                                    name='card-url'
                                    autoComplete='off'
                                    value={url}
                                    onChange={ev => setUrl(ev.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className='sm:justify-start'>
                        <DialogClose asChild>
                            <Button type='button' variant='secondary' onClick={onRemove}>
                                Remove
                            </Button>
                        </DialogClose>

                        <Separator />

                        <DialogClose asChild>
                            <Button type='button' variant='secondary'>
                                Cancel
                            </Button>
                        </DialogClose>

                        <DialogClose asChild>
                            <Button type='submit' disabled={!canSubmit}>
                                <Save /> Save
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
