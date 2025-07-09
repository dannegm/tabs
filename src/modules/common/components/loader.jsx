import PuffLoader from 'react-spinners/PuffLoader';
import { useDarkMode } from '@/modules/common/hooks/use-dark-mode';

export const Loader = () => {
    const [theme] = useDarkMode();

    return (
        <div className='fixed z-max inset-0 flex items-center justify-center bg-white dark:bg-neutral-950'>
            <PuffLoader color={theme === 'dark' ? '#fff' : '#000'} />
        </div>
    );
};
