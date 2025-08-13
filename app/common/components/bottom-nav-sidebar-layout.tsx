import { Outlet } from "react-router";
import MobileHeader from "./mobile-header";
import BottomNav from "./bottom-nav";
import type { Route } from "./+types/bottom-nav-sidebar-layout";
import { SidebarProvider, SidebarInset } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";

export default function BottomNavSidebarLayout({
  loaderData,
}: Route.ComponentProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <MobileHeader />
        <main className="px-4 py-6 pb-24">
          <Outlet />
        </main>
        <BottomNav />
      </SidebarInset>
    </SidebarProvider>
  );
}
