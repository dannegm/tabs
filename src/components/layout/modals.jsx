import { AboutDialog } from '@/components/layout/about-dialog';
import { Changelog } from '@/components/layout/changelogs';
import { ConfirmDialog } from '@/components/system/confirm-dialog';
import { CreateCollectionDialog } from '@/components/collections/create-collection-dialog';
import { EditCardDialog } from '@/components/collections/edit-card-dialog';

export const Modals = () => (
    <>
        <AboutDialog />
        <Changelog />
        <ConfirmDialog />
        <CreateCollectionDialog />
        <EditCardDialog />
    </>
);
