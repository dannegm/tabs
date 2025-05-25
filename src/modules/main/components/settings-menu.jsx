import { useState } from 'react';
import { BadgeInfo, FolderInput, FolderOutput, Trash2 } from 'lucide-react';

import { cn } from '@/modules/common/helpers/utils';
import { useCollectionsActions } from '@/store/collections';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/modules/shadcn/components/dropdown-menu';

import { ConfirmDialog } from '@/modules/common/components/confirm-dialog';

import { ImportCollection } from '@/modules/collections/components/import-collection';
import { ExportCollection } from '@/modules/collections/components/export-collection';
import { AboutDialog } from '@/modules/main/components/about-dialog';

export const SettingsMenu = ({ children, side = 'bottom', align = 'end' }) => {
    const [open, setOpen] = useState(false);

    const { clearCollections } = useCollectionsActions();

    const handleClose = () => {
        setOpen(false);
    };

    const handleClearCollection = () => {
        clearCollections();
        handleClose();
    };

    return (
        <DropdownMenu open={open}>
            <DropdownMenuTrigger onClick={() => setOpen(true)} asChild>
                {children}
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className='w-56'
                side={side}
                align={align}
                onCloseAutoFocus={handleClose}
                onEscapeKeyDown={handleClose}
                onPointerDownOutside={handleClose}
                onFocusOutside={handleClose}
                onInteractOutside={handleClose}
            >
                <DropdownMenuLabel>Collections</DropdownMenuLabel>

                <DropdownMenuSeparator />

                <ExportCollection onSuccess={handleClose}>
                    <DropdownMenuItem>
                        <FolderOutput />
                        Export collections
                    </DropdownMenuItem>
                </ExportCollection>

                <ImportCollection onError={handleClose} onSuccess={handleClose}>
                    <DropdownMenuItem>
                        <FolderInput />
                        Import collections
                    </DropdownMenuItem>
                </ImportCollection>

                <ConfirmDialog
                    title='Clear collections'
                    description='Are you sure you want to delete all collections? This action is permanent and cannot be undone.'
                    onCancel={handleClose}
                    onAccept={handleClearCollection}
                >
                    <DropdownMenuItem>
                        <Trash2 />
                        Clear collections
                    </DropdownMenuItem>
                </ConfirmDialog>

                <DropdownMenuSeparator />

                <AboutDialog>
                    <DropdownMenuItem>
                        <BadgeInfo />
                        About{' '}
                        <span
                            className={cn(
                                'font-bold uppercase text-rose-600',
                                'dark:text-rose-400',
                            )}
                        >
                            Tabs.
                        </span>
                    </DropdownMenuItem>
                </AboutDialog>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
