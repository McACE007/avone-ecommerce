"use client";

import SuperAdminSidebar from "@/components/super-admin/sidebar";
import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";

const SuperAdminLayout = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-background flex">
      <SuperAdminSidebar
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div
        className={cn(
          "transition-all duration-300 flex-1",
          isSidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default SuperAdminLayout;
