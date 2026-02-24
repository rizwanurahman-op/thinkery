'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Data is considered fresh for 30s — after that it will be refetched
                        staleTime: 30_000,
                        // Always refetch when component mounts (catches stale data)
                        refetchOnMount: true,
                        // Refetch when browser tab regains focus
                        refetchOnWindowFocus: true,
                        // Retry once on failure (not 3 times)
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
