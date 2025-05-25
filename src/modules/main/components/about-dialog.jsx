import { Github, Globe, Twitter, Heart, Coffee, Bug, MessageSquare, Zap } from 'lucide-react';

import { Button } from '@/modules/shadcn/components/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/modules/shadcn/components/avatar';
import { Badge } from '@/modules/shadcn/components/badge';
import { Separator } from '@/modules/shadcn/components/separator';
import { Tooltip } from '@/modules/shadcn/components/tooltip-simple';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/modules/shadcn/components/dialog';
import { Zelda } from '@/modules/common/components/zelda';

export const AboutDialog = ({ children }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent
                className='max-w-md bg-background border-border'
                onOpenAutoFocus={e => e.preventDefault()}
            >
                <div className='space-y-6'>
                    <DialogHeader>
                        <div className='flex items-start gap-4'>
                            <div className='flex items-center justify-center size-16 shadow-lg dark:shadow-blue-500/20'>
                                <img
                                    src='./icons/icon-128.png'
                                    alt='Tabs.'
                                    className='block size-16'
                                />
                            </div>
                            <div className='flex-1 space-y-2'>
                                <div className='flex items-center gap-2'>
                                    <DialogTitle className='text-2xl font-bold uppercase text-rose-600 dark:text-rose-400'>
                                        Tabs.
                                    </DialogTitle>
                                    <Badge
                                        variant='secondary'
                                        className='bg-secondary dark:bg-secondary text-secondary-foreground dark:text-secondary-foreground'
                                    >
                                        {__APP_VERSION__}
                                    </Badge>
                                </div>
                                <DialogDescription className='text-base text-left text-muted-foreground'>
                                    A browser extension to efficiently manage your tabs.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Author Section */}
                    <div className='space-y-3'>
                        <h4 className='font-semibold text-sm uppercase tracking-wide text-muted-foreground'>
                            Created by
                        </h4>
                        <div className='flex items-center gap-3'>
                            <Avatar className='w-12 h-12 ring-2 ring-border'>
                                <AvatarImage
                                    src='https://danielgarcia.me/avatare'
                                    alt='Daniel Garcia'
                                />
                                <AvatarFallback className='bg-primary/10 dark:bg-primary/20 text-primary font-semibold'>
                                    D
                                </AvatarFallback>
                            </Avatar>
                            <div className='flex-1'>
                                <div className='font-medium text-foreground'>Daniel García</div>
                                <div className='text-sm text-muted-foreground'>
                                    Inspired by the chrome extension{' '}
                                    <Tooltip content='Visit Toby website'>
                                        <Zelda
                                            className='text-rose-500 font-bold'
                                            href='https://www.gettoby.com/'
                                        >
                                            Toby
                                        </Zelda>
                                    </Tooltip>
                                    .
                                </div>
                            </div>
                            <div className='flex gap-1'>
                                <Tooltip content="Visit Daniel Garc&iacute;a's website">
                                    <Button
                                        variant='ghost'
                                        size='sm'
                                        className='h-8 w-8 p-0 hover:bg-accent dark:hover:bg-accent text-muted-foreground hover:text-foreground transition-colors'
                                        asChild
                                    >
                                        <Zelda href='https://danielgarcia.me' withReferrer>
                                            <Globe className='w-4 h-4' />
                                        </Zelda>
                                    </Button>
                                </Tooltip>
                                <Tooltip content='Follow Daniel Garc&iacute;a on Twitter (x)'>
                                    <Button
                                        variant='ghost'
                                        size='sm'
                                        className='h-8 w-8 p-0 hover:bg-accent dark:hover:bg-accent text-muted-foreground hover:text-foreground transition-colors'
                                        asChild
                                    >
                                        <Zelda href='https://x.com/dannegm'>
                                            <Twitter className='w-4 h-4' />
                                        </Zelda>
                                    </Button>
                                </Tooltip>
                            </div>
                        </div>
                    </div>

                    <Separator className='bg-border dark:bg-border' />

                    {/* Contribute Section */}
                    <div className='space-y-3'>
                        <h4 className='font-semibold text-sm uppercase tracking-wide text-muted-foreground'>
                            Contribute
                        </h4>
                        <Button
                            variant='outline'
                            className='w-full gap-2 border-border dark:border-border hover:bg-accent dark:hover:bg-accent transition-colors'
                            asChild
                        >
                            <Zelda href='https://github.com/dannegm/tabs'>
                                <Github className='w-4 h-4' />
                                View on GitHub
                            </Zelda>
                        </Button>
                        <p className='text-xs text-muted-foreground text-center'>
                            Help us improve by contributing code, reporting bugs, or suggesting
                            features
                        </p>
                    </div>

                    <Separator className='bg-border dark:bg-border' />

                    {/* Quick Actions */}
                    <div className='grid grid-cols-2 gap-2'>
                        <Button
                            variant='outline'
                            size='sm'
                            className='gap-2 h-9 hover:bg-accent dark:hover:bg-accent text-foreground transition-colors'
                            asChild
                        >
                            <Zelda href='https://github.com/dannegm/tabs/issues'>
                                <Bug className='w-3 h-3' />
                                Report Bug
                            </Zelda>
                        </Button>
                        <Button
                            variant='outline'
                            size='sm'
                            className='gap-2 h-9 hover:bg-accent dark:hover:bg-accent text-foreground transition-colors'
                            asChild
                        >
                            <Zelda href='https://github.com/dannegm/tabs/issues'>
                                <MessageSquare className='w-3 h-3' />
                                Feedback
                            </Zelda>
                        </Button>
                    </div>

                    <Separator className='bg-border dark:bg-border' />

                    {/* Support Section */}
                    <div className='text-center space-y-2'>
                        <div className='flex items-center justify-center gap-2 text-sm text-muted-foreground'>
                            <span>Made with</span>
                            <Heart className='w-4 h-4 text-red-500 dark:text-red-400 fill-current' />
                            <span>
                                by{' '}
                                <Zelda
                                    className='text-rose-500'
                                    href='https://danielgarcia.me'
                                    withReferrer
                                >
                                    @dannegm
                                </Zelda>
                            </span>
                        </div>
                        <Button
                            variant='ghost'
                            size='sm'
                            className='gap-2 text-xs hover:bg-accent dark:hover:bg-accent text-muted-foreground hover:text-foreground transition-colors'
                            asChild
                        >
                            <Zelda href='https://buymeacoffee.com/dannegm'>
                                <Coffee className='w-3 h-3' />
                                Buy me a coffee
                            </Zelda>
                        </Button>
                    </div>

                    {/* Footer */}
                    <div className='text-center'>
                        <p className='text-xs text-muted-foreground'>
                            Tabs. Licensed under{' '}
                            <Zelda
                                className='text-rose-500 font-bold'
                                href='https://github.com/dannegm/tabs/blob/main/LICENSE'
                            >
                                MIT.
                            </Zelda>
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
