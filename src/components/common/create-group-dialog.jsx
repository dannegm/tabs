import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

import { cn } from '@/helpers/utils';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/shadcn/dialog';
import { useState } from 'react';
import { Save } from 'lucide-react';

const getRandomName = () => {
    return uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        length: 2,
        separator: ' ',
        style: 'capital',
    });
};

export const CreateGroupDialog = ({ children, onCreate }) => {
    const [placeholder, setPlaceholder] = useState('');
    const [name, setName] = useState('');

    const handleReset = () => {
        setName('');
        setPlaceholder(getRandomName());
    };

    const handleCreate = ev => {
        ev.preventDefault();
        onCreate?.({ name });
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
                        <DialogTitle>Create Collection</DialogTitle>
                        <DialogDescription>
                            Enter the name of your new collection.
                        </DialogDescription>
                    </DialogHeader>

                    <div className='flex items-center space-x-2'>
                        <div className='grid flex-1 gap-2'>
                            <Label htmlFor='group-name' className='sr-only'>
                                Collection Name
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
                            <Button type='button' variant='secondary'>
                                Cancel
                            </Button>
                        </DialogClose>

                        <DialogClose asChild>
                            <Button type='submit'>
                                <Save /> Save
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
