import { useQueryState } from 'nuqs';
import { useModalsStore } from '@/store/modals';

export const useModal = name => {
    const [modal, setModal] = useQueryState('modal', { history: 'replace' });
    const { props, setModalProps } = useModalsStore();

    const isOpen = modal === name;

    const open = (modalProps = {}) => {
        setModalProps(name, modalProps);
        setModal(name);
    };

    const close = () => setModal(null);

    return { isOpen, open, close, props: props[name] ?? {} };
};
