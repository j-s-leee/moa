import { Outlet } from "react-router";
import { AppSidebar } from "~/common/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "~/common/components/ui/sidebar";
import type { Route } from "./+types/sidebar-layout";
import SiteHeader from "./site-header";

export default function SidebarLayout({ loaderData }: Route.ComponentProps) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
