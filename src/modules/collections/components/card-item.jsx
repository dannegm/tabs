import { useRef, useState } from 'react';
import { X, File, Pencil } from 'lucide-react';

import { cn } from '@/modules/common/helpers/utils';
import { fromJSON, toJSON } from '@/modules/common/helpers/objects';

import { Button } from '@/modules/shadcn/components/button';
import { Tooltip } from '@/modules/shadcn/components/tooltip-simple';
import { ConfirmPopover } from '@/modules/common/components/confirm-popover';
import { Zelda } from '@/modules/common/components/zelda';

import { EditCardDialog } from './edit-card-dialog';

export const CardItem = ({
    className,
    collectionId,
    item,
    index,
    onRemove,
    onUpdate,
    onSort,
    onTransfer,
}) => {
    const [dragging, setDragging] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const $anchor = useRef();

    const handleRemove = () => {
        onRemove?.(item);
    };

    const handleDragStart = event => {
        setDragging(true);
        const data = toJSON({ type: 'card', collectionId, data: item });
        event.dataTransfer.setData('text/plain', data);

        $anchor.current?.removeAttribute?.('href');
    };

    const handleDragEnd = () => {
        setDragging(false);

        setTimeout(() => {
            $anchor.current?.setAttribute?.('href', $anchor.current?.dataset?.href);
        }, 0);
    };

    const handleDragOver = event => {
        event.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleDrop = event => {
        event.preventDefault();
        setDragOver(false);

        const targetCollectionId = collectionId;
        const transferedData = event.dataTransfer.getData('text/plain');
        const { data, type, collectionId: originalCollectionId } = fromJSON(transferedData);

        if (type === 'card') {
            event.stopPropagation();

            if (targetCollectionId === originalCollectionId) {
                onSort?.({
                    active: data,
                    over: item,
                });
            }

            if (targetCollectionId !== originalCollectionId) {
                onTransfer?.({
                    originalCollectionId,
                    targetCollectionId,
                    active: data,
                    over: item,
                });
            }
        }
    };

    const composedCustomContent = item?.customTitle + item?.customDescription;
    const tooltipContent = composedCustomContent ? (
        <p className='flex flex-col gap-1 items-start'>
            <b>{item?.customTitle}</b>
            {item?.customDescription && <span>{item?.customDescription}</span>}
        </p>
    ) : (
        <p>{item?.title}</p>
    );

    return (
        <div
            className='relative group flex'
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className='invisible group-hover:visible flex flex-row-reverse gap-1 absolute z-20 top-2 right-2'>
                <ConfirmPopover
                    title='Remove card'
                    description='This action is permanent and cannot be undone.'
                    align={index === 0 ? 'start' : 'end'}
                    onAccept={handleRemove}
                >
                    <div>
                        <Tooltip content='Remove card'>
                            <Button
                                className='dark:hover:bg-neutral-700'
                                size='icon-xs'
                                variant='ghost'
                            >
                                <X />
                            </Button>
                        </Tooltip>
                    </div>
                </ConfirmPopover>

                <EditCardDialog item={item} onRemove={handleRemove} onUpdate={onUpdate}>
                    <div>
                        <Tooltip content='Edit card'>
                            <Button
                                className='dark:hover:bg-neutral-700'
                                size='icon-xs'
                                variant='ghost'
                            >
                                <Pencil />
                            </Button>
                        </Tooltip>
                    </div>
                </EditCardDialog>
            </div>

            <div
                className={cn(
                    'drag-over h-full w-0 transition-all duration-150 rounded-sm select-none bg-neutral-100 dark:bg-neutral-700',
                    { 'w-52 mr-4': dragOver },
                )}
            />

            <div
                className={cn(
                    'relative cursor-grab transition-all duration-150 rounded-sm select-none',
                    { 'cursor-grabbing shadow-lg opacity-50': dragging },
                    className,
                )}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                draggable
            >
                <Zelda
                    ref={$anchor}
                    className={cn(
                        'flex flex-col w-52 bg-white border border-neutral-200 rounded-sm',
                        'dark:bg-neutral-800 dark:border-neutral-700',
                        className,
                    )}
                    href={item?.url}
                    data-href={item?.url}
                >
                    <div className='flex flex-row gap-2 items-center justify-start h-16 px-4'>
                        {item?.favIconUrl ? (
                            <img className='size-6' src={item?.favIconUrl} />
                        ) : (
                            <File className='size-6' />
                        )}

                        <Tooltip side='top' content={tooltipContent}>
                            <span className='text-sm line-clamp-1'>
                                {item?.customTitle || item?.title}
                            </span>
                        </Tooltip>
                    </div>

                    <Tooltip content={item?.url}>
                        <div
                            className={cn(
                                'px-2 py-1.5 bg-neutral-100 text-xs text-ellipsis truncate',
                                'dark:bg-neutral-700',
                            )}
                        >
                            {item?.url}
                        </div>
                    </Tooltip>
                </Zelda>
            </div>
        </div>
    );
};
