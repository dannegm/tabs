import ReactJson from 'react-json-view';
import { cn } from '@/helpers/utils';

const REACT_JSON_THEME = 'ocean';
const REACT_JSON_STYLES = {
    backgroundColor: 'rgb(15, 23, 42)',
    fontSize: '0.778rem',
};

export const JsonViewer = ({ className, name = 'root', data = {}, expanded }) => {
    return (
        <div className={cn('block max-w-full p-4 pb-3 bg-slate-900 rounded-md', className)}>
            <ReactJson
                name={name}
                src={data}
                theme={REACT_JSON_THEME}
                style={REACT_JSON_STYLES}
                collapsed={!expanded}
            />
        </div>
    );
};
