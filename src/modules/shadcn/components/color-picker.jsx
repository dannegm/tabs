import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/modules/shadcn/components/popover';
import { Button } from './button';

function ColorPicker({ color, children, onChange, onSelect }) {
    const { t } = useTranslation();

    const $target = React.useRef();
    const [open, setOpen] = React.useState(false);
    const [initialColor, setInitialColor] = React.useState(color || 'transparent');
    const [internalColor, setInternalColor] = React.useState(color || 'transparent');

    const handleOpenChange = open => {
        setOpen(open);

        if (!open) {
            onSelect?.(initialColor);
            onChange?.(initialColor);
        }
    };

    const handleReset = () => {
        setOpen(false);
        setInternalColor('transparent');
        onSelect?.('transparent');
        onChange?.('transparent');
    };

    const handleConfirm = () => {
        setOpen(false);
        setInitialColor(internalColor);
        onSelect?.(internalColor);
        onChange?.(internalColor);
    };

    React.useEffect(() => {
        if (internalColor === '#NaNNaNNaN') {
            setInternalColor('transparent');
            onSelect?.('transparent');
        } else {
            onSelect?.(internalColor);
        }
    }, [internalColor]);

    React.useLayoutEffect(() => {
        const popperElement = document.querySelector('[data-radix-popper-content-wrapper]');

        if ($target.current && popperElement) {
            const { top, left } = $target.current.getBoundingClientRect();
            popperElement.style.transform = `translate(${left}px, ${top}px)`;
        }
    }, []);

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <div ref={$target}>{children(color)}</div>
            </PopoverTrigger>
            <PopoverContent align='end' className='w-auto p-2 flex flex-col gap-4'>
                <HexColorPicker color={internalColor} onChange={setInternalColor} />
                <div className='flex flex-row gap-2 items-center justify-end'>
                    <Button variant='outline' onClick={handleReset}>
                        {t('common.color-picker.labels.reset')}
                    </Button>
                    <Button onClick={handleConfirm}>
                        {t('common.color-picker.labels.confirm')}
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
ColorPicker.displayName = 'ColorPicker';

export { ColorPicker };
