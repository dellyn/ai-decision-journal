"use client";

import { ReactNode } from "react";

interface TwoColumnLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function TwoColumnLayout({ sidebar, children }: TwoColumnLayoutProps) {
  return (
    <div className="grid grid-cols-[2fr_5fr] h-[calc(100vh-4rem)]">
      <div className="border-r overflow-y-auto">
        {sidebar}
      </div>
      <div className="overflow-y-auto">
        {children}
      </div>
    </div>
  );
} 