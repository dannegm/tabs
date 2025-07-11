import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/modules/shadcn/components/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/modules/shadcn/components/popover';

export const ConfirmPopover = ({
    title,
    description,
    side = 'bottom',
    align = 'center',
    children,
    onAccept,
    onCancel,
}) => {
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);
    const handleAccept = () => {
        setOpen(false);
        onAccept?.();
    };
    const handleCancel = () => {
        setOpen(false);
        onCancel?.();
    };
    return (
        <Popover open={open}>
            <PopoverTrigger onClick={() => setOpen(true)} asChild>
                {children}
            </PopoverTrigger>

            <PopoverContent
                className='w-56 flex flex-col gap-4'
                side={side}
                align={align}
                onCloseAutoFocus={handleCancel}
                onEscapeKeyDown={handleCancel}
                onPointerDownOutside={handleCancel}
                onFocusOutside={handleCancel}
                onInteractOutside={handleCancel}
            >
                <div className='flex flex-col gap-1 text-sm'>
                    {title && <h1 className='font-bold'>{title}</h1>}
                    <p className='text-pretty'>{description}</p>
                </div>

                <div className='flex flex-row gap-2'>
                    <Button size='sm' variant='secondary' onClick={handleCancel}>
                        {t('common.confirm-popover.labels.cancel')}
                    </Button>
                    <Button size='sm' onClick={handleAccept}>
                        {t('common.confirm-popover.labels.accept')}
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
};
