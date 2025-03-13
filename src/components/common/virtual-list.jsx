import { useState, useRef, useEffect, useCallback } from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { cn } from '@/helpers/utils';

export default function VirtualList({ className, data = [], children }) {
    const $list = useRef();
    const [sizes, setSizes] = useState(new Map());

    const virtualizer = useWindowVirtualizer({
        count: data.length,
        estimateSize: index => sizes.get(index) ?? 200,
        overscan: 5,
        scrollMargin: $list.current?.offsetTop ?? 0,
    });

    const measureRef = useCallback(
        index => el => {
            if (!el) return;
            const observer = new ResizeObserver(() => {
                const height = el.getBoundingClientRect().height;
                setSizes(prev => {
                    if (prev.get(index) === height) return prev;
                    const newSizes = new Map(prev);
                    newSizes.set(index, height);
                    return newSizes;
                });
            });

            observer.observe(el);
            return () => observer.disconnect();
        },
        [],
    );

    useEffect(() => {
        virtualizer.measure();
    }, [sizes]);

    if (!data.length) return null;

    return (
        <div ref={$list} className={cn('max-w-full', className)}>
            <div
                style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                }}
            >
                {virtualizer.getVirtualItems().map(item => (
                    <div
                        key={item.key}
                        ref={measureRef(item.index)}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            transform: `translateY(${
                                item.start - virtualizer.options.scrollMargin
                            }px)`,
                        }}
                    >
                        {children(data[item.index])}
                    </div>
                ))}
            </div>
        </div>
    );
}
