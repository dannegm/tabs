import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useCollections } from '@/store/collections';
import { downloadBlob } from '@/modules/common/helpers/utils';
import { keyCase } from '@/modules/common/helpers/strings';

export const ExportSingleCollection = ({ collectionId, onSuccess, children }) => {
    const { t } = useTranslation();
    const collections = useCollections();

    const prepareData = collection => {
        const content = {
            version: 3,
            type: 'collection',
            collection: {
                title: collection.name,
                bgColor: collection?.bgColor,
                cards: Object.values(collection.items).map(item => ({
                    title: item.title,
                    url: item.url,
                    customTitle: item?.customTitle || '',
                    customDescription: item?.customDescription || '',
                    favIconUrl: item.favIconUrl,
                })),
            },
        };
        return JSON.stringify(content, null, 4);
    };

    const handleDownload = () => {
        const collection = collections[collectionId];
        const data = prepareData(collection);
        const blob = new Blob([data], { type: 'application/json' });
        const filename = `tabs-export-${keyCase(collection.name)}-${Date.now()}.json`;
        downloadBlob(blob, filename);

        toast.success(
            t('common.export.alerts.single-collection-exported', {
                name: collection.name,
            }),
        );
        onSuccess?.();
    };

    return <div onClick={handleDownload}>{children}</div>;
};
