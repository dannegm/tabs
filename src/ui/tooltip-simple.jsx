import {
    Tooltip as TooltipPrimitive,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/ui/tooltip';

export const Tooltip = ({ content, side = 'bottom', children }) => {
    return (
        <TooltipProvider>
            <TooltipPrimitive>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent side={side}>{content}</TooltipContent>
            </TooltipPrimitive>
        </TooltipProvider>
    );
};
