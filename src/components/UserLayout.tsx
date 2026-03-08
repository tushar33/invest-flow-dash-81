import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { DesktopSidebar } from "./DesktopSidebar";

interface UserLayoutProps {
  children: ReactNode;
}

export function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className="min-h-screen flex w-full">
      <DesktopSidebar role="user" />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="max-w-2xl mx-auto px-4 py-6 md:max-w-5xl">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
