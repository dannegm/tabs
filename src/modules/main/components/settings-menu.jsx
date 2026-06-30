import { useTranslation } from 'react-i18next';

import { BadgeInfo, FolderInput, FolderOutput, PackagePlus, Trash2 } from 'lucide-react';

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
import { Changelog } from '@/modules/main/components//changelogs';

export const SettingsMenu = ({ children, side = 'bottom', align = 'end' }) => {
    const { t } = useTranslation();
    const { clearCollections } = useCollectionsActions();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

            <DropdownMenuContent className='w-56' side={side} align={align}>
                <DropdownMenuLabel>{t('settings.collections.title')}</DropdownMenuLabel>

                <DropdownMenuSeparator />

                <ExportCollection>
                    <DropdownMenuItem>
                        <FolderOutput />
                        {t('settings.collections.items.export')}
                    </DropdownMenuItem>
                </ExportCollection>

                <ImportCollection>
                    <DropdownMenuItem>
                        <FolderInput />
                        {t('settings.collections.items.import')}
                    </DropdownMenuItem>
                </ImportCollection>

                <ConfirmDialog
                    title={t('settings.dialogs.clear-collections.title')}
                    description={t('settings.dialogs.clear-collections.description')}
                    onAccept={clearCollections}
                >
                    <DropdownMenuItem>
                        <Trash2 />
                        {t('settings.collections.items.clear')}
                    </DropdownMenuItem>
                </ConfirmDialog>

                <DropdownMenuSeparator />

                <Changelog>
                    <DropdownMenuItem>
                        <PackagePlus />
                        {t('settings.main.items.changelogs')}
                    </DropdownMenuItem>
                </Changelog>

                <AboutDialog>
                    <DropdownMenuItem>
                        <BadgeInfo />
                        {t('settings.main.items.about')}
                        <span
                            className={cn(
                                'font-bold uppercase text-rose-600',
                                'dark:text-rose-400',
                            )}
                        >
                            {t('settings.main.items.tabs')}
                        </span>
                    </DropdownMenuItem>
                </AboutDialog>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
