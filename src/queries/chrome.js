import { getAllTabs } from '@/helpers/chrome';

export const getAllTabsQuery = (opts = {}) => ({
    queryKey: ['chrome', 'tabs'],
    queryFn: () => new Promise(resolve => getAllTabs(resolve)),
    refetchOnWindowFocus: true,
    staleTime: 0,
    ...opts,
});
