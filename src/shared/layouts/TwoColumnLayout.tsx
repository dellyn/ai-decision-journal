"use client";

import { ReactNode, useRef, useState } from "react";
import { cn } from "@/shared/utils";
import { useUIStore } from "@/shared/store/ui";

interface TwoColumnLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function TwoColumnLayout({ 
  sidebar, 
  children
}: TwoColumnLayoutProps) {
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { isSidebarOpen, closeSidebar } = useUIStore();

  const startResizing = () => setIsResizing(true);
  const stopResizing = () => setIsResizing(false);

  const resize = (e: MouseEvent) => {
    if (!isResizing || !sidebarRef.current) return;
    const newWidth = e.clientX;
    sidebarRef.current.style.width = `${newWidth}px`;
  };

  return (
    <div 
      className="flex h-[calc(100vh-4rem)] "
      onMouseMove={(e) => resize(e as unknown as MouseEvent)}
      onMouseUp={stopResizing}
      onMouseLeave={stopResizing}
    >
      <div 
        ref={sidebarRef}
        className={cn(
          "min-w-[300px] max-w-[600px] w-[300px] border-r overflow-y-auto relative",
          "lg:translate-x-0 transition-transform duration-300 ease-in-out",
          "fixed lg:relative inset-y-0 left-0 z-40 bg-background ",
          
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebar}
        <div
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-gray-300 active:bg-gray-400 hidden lg:block"
          onMouseDown={startResizing}
        />
      </div>
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      <div className="flex-1 overflow-y-auto w-full">
        {children}
      </div>
    </div>
  );
}