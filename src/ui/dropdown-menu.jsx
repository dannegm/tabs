import * as React from 'react';
import { Menu } from '@base-ui/react';
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react';

import { cn } from '@/helpers/utils';

function DropdownMenu({ ...props }) {
    return <Menu.Root data-slot='dropdown-menu' {...props} />;
}

function DropdownMenuPortal({ ...props }) {
    return <Menu.Portal data-slot='dropdown-menu-portal' {...props} />;
}

function DropdownMenuTrigger({ asChild, children, ...props }) {
    if (asChild && React.isValidElement(children)) {
        return (
            <Menu.Trigger
                data-slot='dropdown-menu-trigger'
                nativeButton={false}
                render={(renderProps) => {
                    const { nativeButton: _, ...safeProps } = renderProps;
                    return React.cloneElement(children, safeProps);
                }}
                {...props}
            />
        );
    }
    return <Menu.Trigger data-slot='dropdown-menu-trigger' {...props}>{children}</Menu.Trigger>;
}

function DropdownMenuContent({ className, sideOffset = 4, ...props }) {
    return (
        <Menu.Portal>
            <Menu.Positioner sideOffset={sideOffset}>
                <Menu.Popup
                    data-slot='dropdown-menu-content'
                    className={cn(
                        'bg-popover text-popover-foreground z-50 max-h-(--available-height) min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md',
                        'transition-all data-[starting-style]:opacity-0 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:scale-95',
                        className,
                    )}
                    {...props}
                />
            </Menu.Positioner>
        </Menu.Portal>
    );
}

function DropdownMenuGroup({ ...props }) {
    return <Menu.Group data-slot='dropdown-menu-group' {...props} />;
}

function DropdownMenuItem({ className, inset, variant = 'default', ...props }) {
    return (
        <Menu.Item
            data-slot='dropdown-menu-item'
            data-inset={inset}
            data-variant={variant}
            className={cn(
                "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:data-[highlighted]:bg-destructive/10 dark:data-[variant=destructive]:data-[highlighted]:bg-destructive/20 data-[variant=destructive]:data-[highlighted]:text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex rtl:flex-row-reverse cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                className,
            )}
            {...props}
        />
    );
}

function DropdownMenuCheckboxItem({ className, children, checked, onCheckedChange, ...props }) {
    return (
        <Menu.CheckboxItem
            data-slot='dropdown-menu-checkbox-item'
            className={cn(
                "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                className,
            )}
            checked={checked}
            onCheckedChange={onCheckedChange}
            {...props}
        >
            <span className='pointer-events-none absolute left-2 flex size-3.5 items-center justify-center'>
                <Menu.CheckboxItemIndicator>
                    <CheckIcon className='size-4' />
                </Menu.CheckboxItemIndicator>
            </span>
            {children}
        </Menu.CheckboxItem>
    );
}

function DropdownMenuRadioGroup({ ...props }) {
    return <Menu.RadioGroup data-slot='dropdown-menu-radio-group' {...props} />;
}

function DropdownMenuRadioItem({ className, children, ...props }) {
    return (
        <Menu.RadioItem
            data-slot='dropdown-menu-radio-item'
            className={cn(
                "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex flex-row rtl:flex-row-reverse cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 rtl:pl-2 rtl:pr-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                className,
            )}
            {...props}
        >
            <span className='pointer-events-none absolute left-2 rtl:right-2 rtl:left-auto flex size-3.5 items-center justify-center'>
                <Menu.RadioItemIndicator>
                    <CircleIcon className='size-2 fill-current' />
                </Menu.RadioItemIndicator>
            </span>
            {children}
        </Menu.RadioItem>
    );
}

function DropdownMenuLabel({ className, inset, ...props }) {
    return (
        <div
            data-slot='dropdown-menu-label'
            data-inset={inset}
            className={cn(
                'px-2 py-1.5 text-sm font-medium data-[inset]:pl-8 rtl:data-[inset]:pl-2 rtl:data-[inset]:pr-8 rtl:text-right',
                className,
            )}
            {...props}
        />
    );
}

function DropdownMenuSeparator({ className, ...props }) {
    return (
        <Menu.Separator
            data-slot='dropdown-menu-separator'
            className={cn('bg-border -mx-1 my-1 h-px', className)}
            {...props}
        />
    );
}

function DropdownMenuShortcut({ className, ...props }) {
    return (
        <span
            data-slot='dropdown-menu-shortcut'
            className={cn('text-muted-foreground ml-auto text-xs tracking-widest', className)}
            {...props}
        />
    );
}

function DropdownMenuSub({ ...props }) {
    return <Menu.SubmenuRoot data-slot='dropdown-menu-sub' {...props} />;
}

function DropdownMenuSubTrigger({ className, inset, children, ...props }) {
    return (
        <Menu.SubmenuTrigger
            data-slot='dropdown-menu-sub-trigger'
            data-inset={inset}
            className={cn(
                'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[open]:bg-accent data-[open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8',
                className,
            )}
            {...props}
        >
            {children}
            <ChevronRightIcon className='ml-auto size-4' />
        </Menu.SubmenuTrigger>
    );
}

function DropdownMenuSubContent({ className, ...props }) {
    return (
        <Menu.Portal>
            <Menu.Positioner>
                <Menu.Popup
                    data-slot='dropdown-menu-sub-content'
                    className={cn(
                        'bg-popover text-popover-foreground z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-lg',
                        'transition-all data-[starting-style]:opacity-0 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:scale-95',
                        className,
                    )}
                    {...props}
                />
            </Menu.Positioner>
        </Menu.Portal>
    );
}

export {
    DropdownMenu,
    DropdownMenuPortal,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
};
