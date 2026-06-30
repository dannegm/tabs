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

export const pipe = fns => value => fns.reduce((acc, fn) => fn(acc), value);

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

export function match(action) {
    let hasMatch = false;
    let finalHandler = null;

    return {
        with(pattern, handler) {
            if (!hasMatch) {
                const entries = Object.entries(pattern);
                const isMatching = entries.every(([key, value]) => {
                    return action[key] === value;
                });

                if (isMatching) {
                    hasMatch = true;
                    finalHandler = handler;
                }
            }
            return this;
        },
        when(matcher, handler) {
            if (!hasMatch && matcher(action)) {
                hasMatch = true;
                finalHandler = handler;
            }
            return this;
        },
        otherwise(handler) {
            if (!hasMatch) {
                finalHandler = handler;
            }
            return this;
        },
        run() {
            return finalHandler?.(action) || finalHandler;
        },
    };
}
