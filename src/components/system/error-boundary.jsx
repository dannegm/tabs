import { Component } from 'react';

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback(this.state.error);
            }
            return (
                <div className='flex flex-col gap-2 p-4 bg-red-50 text-red-600 rounded-md text-sm dark:bg-red-950 dark:text-red-400'>
                    <strong>Something went wrong</strong>
                    <code className='text-xs opacity-70'>{this.state.error?.message}</code>
                </div>
            );
        }
        return this.props.children;
    }
}
