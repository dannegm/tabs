import { useEffect, useState } from 'react';
import { useCopyToClipboard } from '@uidotdev/usehooks';
import { toast } from 'sonner';

import { Copy, ExternalLink, Link2, VenetianMask } from 'lucide-react';

import { cn } from '@/modules/common/helpers/utils';
import { openLink } from '@/modules/common/helpers/chrome';

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
    ContextMenuSeparator,
} from '@/modules/shadcn/components/context-menu';

export const ContextualMenu = ({ url, children }) => {
    const [, copyToClipboard] = useCopyToClipboard();

    const handleCopy = () => {
        copyToClipboard(url);
        toast('Copied.', { description: url });
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={() => openLink({ url, target: 'blank' })}>
                    <Link2 />
                    Abrir en una pestaña nueva
                </ContextMenuItem>
                <ContextMenuItem onClick={() => openLink({ url, target: 'window' })}>
                    <ExternalLink />
                    Abrir en una ventana nueva
                </ContextMenuItem>
                <ContextMenuItem onClick={() => openLink({ url, target: 'incognito' })}>
                    <VenetianMask />
                    Abrir en una ventana de incógnito
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem onClick={handleCopy}>
                    <Copy />
                    Copiar dirección del enlace
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
};

export const Zelda = ({
    ref,
    className,
    href,
    withReferrer = false,
    onClick,
    children,
    ...props
}) => {
    const finalHref = withReferrer ? `${href}?referrer=extension:tabs` : href;
    const [modifier, setModifier] = useState(null);

    const handleClick = e => {
        if (onClick) onClick(e);
        if (e.defaultPrevented || !href) return;
        if (e.button !== 0) return;

        const actions = {
            metaKey: () => openLink({ url: finalHref, target: 'blank' }),
            ctrlKey: () => openLink({ url: finalHref, target: 'blank' }),
            shiftKey: () => openLink({ url: finalHref, target: 'window' }),
            altKey: () => openLink({ url: finalHref, target: 'download' }),
            default: () => openLink({ url: finalHref, target: 'self' }),
        };

        e.preventDefault();
        actions[modifier || 'default']?.();
    };

    const handleAuxClick = e => {
        if (onClick) onClick(e);
        if (e.defaultPrevented || !href) return;
        if (e.button === 1) {
            openLink({ url: finalHref, target: 'blank' });
        }
    };

    useEffect(() => {
        const handleKeyDown = e => {
            if (e.metaKey) setModifier('metaKey');
            else if (e.ctrlKey) setModifier('ctrlKey');
            else if (e.shiftKey) setModifier('shiftKey');
            else if (e.altKey) setModifier('altKey');
        };

        const handleKeyUp = () => setModifier(null);

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('blur', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('blur', handleKeyUp);
        };
    }, []);

    return (
        <ContextualMenu url={finalHref}>
            <span
                role='link'
                ref={ref}
                className={cn('cursor-pointer', className)}
                onClick={handleClick}
                onAuxClick={handleAuxClick}
                {...props}
            >
                {children}
            </span>
        </ContextualMenu>
    );
};
