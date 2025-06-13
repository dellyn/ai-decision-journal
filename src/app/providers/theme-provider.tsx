"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";

type ThemeProviderProps = {
  children: React.ReactNode;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemeProvider>
  );
}