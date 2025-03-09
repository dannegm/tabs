import { cn } from '@/helpers/utils';

import { TabItem } from '@/components/common/tab-item';
import { TabsGroup } from '@/components/common/tabs-group';

export const Tabs = ({ className }) => {
    return (
        <aside
            className={cn(
                'w-full h-full flex flex-col gap-4 border-l border-l-neutral-200',
                className,
            )}
        >
            <div className='flex flex-row items-center justify-between h-12 p-4 border-b border-b-neutral-200'>
                <div className='flex-1' />
                <div className='text-xs font-bold uppercase'>Open Tabs</div>
            </div>
            <div className='flex flex-col gap-4 px-4'>
                <TabsGroup>
                    <TabItem />
                    <TabItem />
                    <TabItem />
                    <TabItem />
                    <TabItem />
                </TabsGroup>

                <TabsGroup>
                    <TabItem />
                    <TabItem />
                    <TabItem />
                    <TabItem />
                    <TabItem />
                </TabsGroup>
            </div>
        </aside>
    );
};
