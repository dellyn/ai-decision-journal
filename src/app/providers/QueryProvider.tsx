"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: true,
            staleTime: 0,
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