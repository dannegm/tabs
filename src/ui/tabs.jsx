import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/helpers/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = ({ className, ...props }) => (
    <TabsPrimitive.List
        className={cn(
            'inline-flex items-center gap-0.5 rounded-md bg-neutral-100 dark:bg-neutral-700/60 p-0.5',
            className,
        )}
        {...props}
    />
);

const TabsTrigger = ({ className, ...props }) => (
    <TabsPrimitive.Trigger
        className={cn(
            'inline-flex items-center justify-center rounded text-neutral-500 dark:text-neutral-400',
            'transition-all disabled:pointer-events-none disabled:opacity-50',
            'data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800',
            'data-[state=active]:text-neutral-950 dark:data-[state=active]:text-neutral-50',
            'data-[state=active]:shadow-xs',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
            className,
        )}
        {...props}
    />
);

export { Tabs, TabsList, TabsTrigger };
