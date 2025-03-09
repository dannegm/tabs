import { useState } from 'react';
import { ArrowUpRight, ChevronDown, ChevronRight, Download, Ellipsis } from 'lucide-react';

import { cn } from '@/helpers/utils';
import { Button } from '@/components/shadcn/button';

export const BookmarksGroup = ({ className, children }) => {
    const [open, setOpen] = useState(true);

    const handleToggle = () => {
        setOpen(!open);
    };

    return (
        <div className={cn('border-b border-b-neutral-200', className)}>
            <div className='flex flex-row items-center justify-between p-4'>
                <div className='text-base'>
                    <Button variant='secondary' onClick={handleToggle}>
                        <span>Grupo de bookmarks</span>
                        {open ? <ChevronDown /> : <ChevronRight />}
                    </Button>
                </div>
                <div className='flex flex-row gap-2'>
                    <Button size='icon-xs' variant='ghost'>
                        <ArrowUpRight />
                    </Button>
                    <Button size='icon-xs' variant='ghost'>
                        <Download />
                    </Button>
                    <Button size='icon-xs' variant='ghost'>
                        <Ellipsis />
                    </Button>
                </div>
            </div>

            {open && <div className='flex flex-row flex-wrap gap-4 p-4'>{children}</div>}
        </div>
    );
};
