'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Global Error Boundary caught:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="text-center space-y-6 max-w-md">
                <div className="flex justify-center">
                    <div className="bg-red-100 p-4 rounded-full">
                        <AlertTriangle className="h-12 w-12 text-red-600" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900">Something went wrong!</h1>

                <p className="text-gray-600">
                    We apologize for the inconvenience. An unexpected error has occurred.
                    Our team has been notified.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button
                        onClick={() => reset()}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Try again
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => window.location.href = '/'}
                    >
                        Go back home
                    </Button>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left overflow-auto max-h-64 w-full text-xs font-mono text-red-800 border border-red-200">
                        <p className="font-bold mb-2">Error Details (Dev Only):</p>
                        <p>{error.message}</p>
                        {error.digest && <p className="mt-1 text-gray-500">Digest: {error.digest}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
