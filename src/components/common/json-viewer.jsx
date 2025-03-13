import ReactJson from 'react-json-view';
import { cn } from '@/helpers/utils';
import { ScrollArea } from '../shadcn/scroll-area';

const REACT_JSON_THEME = 'ocean';
const REACT_JSON_STYLES = {
    backgroundColor: 'rgb(15, 23, 42)',
    fontSize: '0.778rem',
};

export const JsonViewer = ({ className, name = 'root', data = {}, expanded }) => {
    return (
        <ScrollArea
            className={cn(
                'block max-w-full max-h-[40vh] overflow-scroll p-4 pb-3 bg-slate-900 rounded-md',
                className,
            )}
            type='always'
        >
            <ReactJson
                name={name}
                src={data}
                theme={REACT_JSON_THEME}
                style={REACT_JSON_STYLES}
                collapsed={!expanded}
            />
        </ScrollArea>
    );
};
