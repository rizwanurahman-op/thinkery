'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // 30s stale time: aligns with Blob CDN propagation time.
                        // After a mutation, React Query won't auto-refetch for 30s,
                        // preventing stale CDN data from overwriting correct cache.
                        staleTime: 30_000,
                        // Only refetch on mount when data is actually stale (>30s old)
                        refetchOnMount: true,
                        // Don't refetch on focus — would fetch stale CDN data
                        refetchOnWindowFocus: false,
                        // Retry once on genuine failures
                        retry: 1,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
