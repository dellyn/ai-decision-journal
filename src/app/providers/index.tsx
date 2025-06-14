"use client";

import { ThemeProvider } from "./ThemeProvider";
import { QueryProvider } from "./QueryProvider";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
} 