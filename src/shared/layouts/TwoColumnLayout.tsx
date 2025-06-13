"use client";

import { ReactNode, useRef, useState } from "react";

interface TwoColumnLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function TwoColumnLayout({ sidebar, children }: TwoColumnLayoutProps) {
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const startResizing = () => setIsResizing(true);

  const stopResizing = () => setIsResizing(false);

  const resize = (e: MouseEvent) => {
    if (!isResizing || !sidebarRef.current) return;

    const newWidth = e.clientX;
    sidebarRef.current.style.width = `${newWidth}px`;
  };

  return (
    <div 
      className="flex h-[calc(100vh-4rem)]"
      onMouseMove={(e) => resize(e as unknown as MouseEvent)}
      onMouseUp={stopResizing}
      onMouseLeave={stopResizing}
    >
      <div 
        ref={sidebarRef}
        className="min-w-[300px] max-w-[600px] w-[300px] border-r overflow-y-auto relative"
      >
        {sidebar}
        <div
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-gray-300 active:bg-gray-400"
          onMouseDown={startResizing}
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}