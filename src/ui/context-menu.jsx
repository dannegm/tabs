import * as React from 'react';
import { ContextMenu } from '@base-ui/react';
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react';

import { cn } from '@/helpers/utils';

function ContextMenuRoot({ ...props }) {
    return <ContextMenu.Root data-slot='context-menu' {...props} />;
}

function ContextMenuTrigger({ asChild, children, ...props }) {
    if (asChild && React.isValidElement(children)) {
        return (
            <ContextMenu.Trigger
                data-slot='context-menu-trigger'
                nativeButton={false}
                render={(renderProps) => {
                    const { nativeButton: _, ...safeProps } = renderProps;
                    return React.cloneElement(children, safeProps);
                }}
                {...props}
            />
        );
    }
    return <ContextMenu.Trigger data-slot='context-menu-trigger' {...props}>{children}</ContextMenu.Trigger>;
}

function ContextMenuGroup({ ...props }) {
    return <ContextMenu.Group data-slot='context-menu-group' {...props} />;
}

function ContextMenuPortal({ ...props }) {
    return <ContextMenu.Portal data-slot='context-menu-portal' {...props} />;
}

function ContextMenuSub({ ...props }) {
    return <ContextMenu.SubmenuRoot data-slot='context-menu-sub' {...props} />;
}

function ContextMenuRadioGroup({ ...props }) {
    return <ContextMenu.RadioGroup data-slot='context-menu-radio-group' {...props} />;
}

function ContextMenuSubTrigger({ className, inset, children, ...props }) {
    return (
        <ContextMenu.SubmenuTrigger
            data-slot='context-menu-sub-trigger'
            data-inset={inset}
            className={cn(
                "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[open]:bg-accent data-[open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                className,
            )}
            {...props}
        >
            {children}
            <ChevronRightIcon className='ml-auto' />
        </ContextMenu.SubmenuTrigger>
    );
}

function ContextMenuSubContent({ className, ...props }) {
    return (
        <ContextMenu.Portal>
            <ContextMenu.Positioner>
                <ContextMenu.Popup
                    data-slot='context-menu-sub-content'
                    className={cn(
                        'bg-popover text-popover-foreground z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-lg',
                        'transition-all data-[starting-style]:opacity-0 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:scale-95',
                        className,
                    )}
                    {...props}
                />
            </ContextMenu.Positioner>
        </ContextMenu.Portal>
    );
}

function ContextMenuContent({ className, ...props }) {
    return (
        <ContextMenu.Portal>
            <ContextMenu.Positioner>
                <ContextMenu.Popup
                    data-slot='context-menu-content'
                    className={cn(
                        'bg-popover text-popover-foreground z-50 min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md',
                        'transition-all data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
                        className,
                    )}
                    {...props}
                />
            </ContextMenu.Positioner>
        </ContextMenu.Portal>
    );
}

function ContextMenuItem({ className, inset, variant = 'default', ...props }) {
    return (
        <ContextMenu.Item
            data-slot='context-menu-item'
            data-inset={inset}
            data-variant={variant}
            className={cn(
                "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:data-[highlighted]:bg-destructive/10 dark:data-[variant=destructive]:data-[highlighted]:bg-destructive/20 data-[variant=destructive]:data-[highlighted]:text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex rtl:flex-row-reverse cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                className,
            )}
            {...props}
        />
    );
}

function ContextMenuCheckboxItem({ className, children, checked, onCheckedChange, ...props }) {
    return (
        <ContextMenu.CheckboxItem
            data-slot='context-menu-checkbox-item'
            className={cn(
                "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                className,
            )}
            checked={checked}
            onCheckedChange={onCheckedChange}
            {...props}
        >
            <span className='pointer-events-none absolute left-2 flex size-3.5 items-center justify-center'>
                <ContextMenu.CheckboxItemIndicator>
                    <CheckIcon className='size-4' />
                </ContextMenu.CheckboxItemIndicator>
            </span>
            {children}
        </ContextMenu.CheckboxItem>
    );
}

function ContextMenuRadioItem({ className, children, ...props }) {
    return (
        <ContextMenu.RadioItem
            data-slot='context-menu-radio-item'
            className={cn(
                "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                className,
            )}
            {...props}
        >
            <span className='pointer-events-none absolute left-2 flex size-3.5 items-center justify-center'>
                <ContextMenu.RadioItemIndicator>
                    <CircleIcon className='size-2 fill-current' />
                </ContextMenu.RadioItemIndicator>
            </span>
            {children}
        </ContextMenu.RadioItem>
    );
}

function ContextMenuLabel({ className, inset, ...props }) {
    return (
        <div
            data-slot='context-menu-label'
            data-inset={inset}
            className={cn('text-foreground px-2 py-1.5 text-sm font-medium data-[inset]:pl-8', className)}
            {...props}
        />
    );
}

function ContextMenuSeparator({ className, ...props }) {
    return (
        <ContextMenu.Separator
            data-slot='context-menu-separator'
            className={cn('bg-border -mx-1 my-1 h-px', className)}
            {...props}
        />
    );
}

function ContextMenuShortcut({ className, ...props }) {
    return (
        <span
            data-slot='context-menu-shortcut'
            className={cn('text-muted-foreground ml-auto text-xs tracking-widest', className)}
            {...props}
        />
    );
}

export {
    ContextMenuRoot as ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuCheckboxItem,
    ContextMenuRadioItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuGroup,
    ContextMenuPortal,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuRadioGroup,
};
