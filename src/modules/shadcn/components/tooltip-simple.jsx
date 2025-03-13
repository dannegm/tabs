import {
    Tooltip as TooltipPrimitive,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/modules/shadcn/components/tooltip';

export const Tooltip = ({ content, side = 'bottom', children }) => {
    return (
        <TooltipProvider>
            <TooltipPrimitive>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent side={side}>
                    <p>{content}</p>
                </TooltipContent>
            </TooltipPrimitive>
        </TooltipProvider>
    );
};
