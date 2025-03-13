import ReactJson from 'react-json-view';
import { cn } from '@/modules/common/helpers/utils';
import { ScrollArea } from '@/modules/shadcn/components/scroll-area';

const REACT_JSON_THEME = 'ocean';

export const JsonViewer = ({ className, name = 'root', data = {}, expanded }) => {
    return (
        <ScrollArea
            className={cn(
                'block max-w-full max-h-[40vh] overflow-scroll p-4 pb-3 bg-slate-800 rounded-md',
                '[&_.react-json-view]:bg-slate-800! [&_.react-json-view]:text-[0.778rem]',
                className,
            )}
            type='always'
        >
            <ReactJson name={name} src={data} theme={REACT_JSON_THEME} collapsed={!expanded} />
        </ScrollArea>
    );
};
