import { createElement, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs) => {
    return twMerge(clsx(inputs));
};

export const styled = (baseComponent, className) => {
    return forwardRef(({ children, className: classNameToOverride, ...props }, ref) => {
        return createElement(
            baseComponent,
            { className: cn(className, classNameToOverride), ref, ...props },
            children,
        );
    });
};

export const downloadLink = (url, name = 'file.link') => {
    if (url.trim() === '') {
        console.warn('There is not any URL to download.');
        return;
    }

    const link = document.createElement('a');

    link.href = url;
    link.download = name;
    link.target = '_blank';

    document.body.appendChild(link);

    link.dispatchEvent(
        new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
        }),
    );

    document.body.removeChild(link);
};

export const downloadBlob = (blobData, name = 'file.blob') => {
    const blobUrl = URL.createObjectURL(blobData);
    downloadLink(blobUrl, name);
};
