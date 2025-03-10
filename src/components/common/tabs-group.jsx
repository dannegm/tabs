import { useState } from 'react';
import { ChevronDown, ChevronRight, Download, X } from 'lucide-react';

import { cn } from '@/helpers/utils';
import { Button } from '@/components/shadcn/button';
import { Separator } from '@/components/shadcn/separator';

export const TabsGroup = ({ className, id, index, children }) => {
    const [open, setOpen] = useState(true);

    const handleToggle = () => {
        setOpen(!open);
    };

    const handleClose = () => {
        chrome?.windows?.remove?.(+id);
    };

    return (
        <div className={cn('flex flex-col gap-4 rounded-sm', className)}>
            <div className='flex flex-row items-center justify-between'>
                <div className='flex flex-row items-center gap-1'>
                    <Button
                        className='leading-1'
                        variant='secondary'
                        size='xs'
                        onClick={handleToggle}
                    >
                        <span>Window {index + 1}</span>
                        {open ? <ChevronDown /> : <ChevronRight />}
                    </Button>
                </div>
                <div className='flex flex-row items-center gap-1'>
                    <Button size='icon-xs' variant='ghost'>
                        <Download />
                    </Button>
                    <Button size='icon-xs' variant='ghost' onClick={handleClose}>
                        <X />
                    </Button>
                </div>
            </div>

            {open && <div className='flex flex-col gap-2'>{children}</div>}

            <Separator />
        </div>
    );
};
