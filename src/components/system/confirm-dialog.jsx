import { useModal } from '@/hooks/use-modal';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/ui/alert-dialog';

export const ConfirmDialog = () => {
    const { isOpen, close, props } = useModal('confirm');
    const {
        title,
        description,
        cancelLabel = 'Cancel',
        acceptLabel = 'Continue',
        onAccept,
        onCancel,
    } = props;

    return (
        <AlertDialog open={isOpen} onOpenChange={v => !v && close()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>{cancelLabel}</AlertDialogCancel>
                    <AlertDialogAction onClick={onAccept}>{acceptLabel}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
