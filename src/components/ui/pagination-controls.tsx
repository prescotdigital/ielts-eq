'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
    hasNextPage: boolean;
    hasPrevPage: boolean;
    totalPages: number;
    totalCount: number;
}

export default function PaginationControls({
    hasNextPage,
    hasPrevPage,
    totalPages,
    totalCount,
}: PaginationControlsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const page = searchParams.get('page') ?? '1';
    const per_page = searchParams.get('per_page') ?? '10';

    return (
        <div className="flex items-center justify-between px-2 py-4">
            <div className="text-sm text-gray-500">
                Page <span className="font-medium">{page}</span> of{' '}
                <span className="font-medium">{totalPages}</span> ({totalCount} results)
            </div>

            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={!hasPrevPage}
                    onClick={() => {
                        router.push(`?page=${Number(page) - 1}&per_page=${per_page}`);
                    }}
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    disabled={!hasNextPage}
                    onClick={() => {
                        router.push(`?page=${Number(page) + 1}&per_page=${per_page}`);
                    }}
                >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </div>
        </div>
    );
}
