import { create } from 'zustand';

export const useModalsStore = create(set => ({
    props: {},
    setModalProps: (modal, modalProps) =>
        set(state => ({ props: { ...state.props, [modal]: modalProps } })),
}));
