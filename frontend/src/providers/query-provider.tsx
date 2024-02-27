'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000, // 1 minute
			},
		},
	});
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
	if (typeof window === 'undefined') {
		return makeQueryClient();
	} else {
		if (!browserQueryClient) {
			browserQueryClient = makeQueryClient();
		}
		return browserQueryClient;
	}
}

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
	const [queryClient] = useState(getQueryClient);
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};
