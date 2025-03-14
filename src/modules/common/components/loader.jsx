import PuffLoader from 'react-spinners/PuffLoader';

export const Loader = () => {
    return (
        <div className='fixed inset-0 flex items-center justify-center'>
            <PuffLoader />
        </div>
    );
};
