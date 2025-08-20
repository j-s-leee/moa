import { data, Outlet } from "react-router";
import MobileHeader from "./mobile-header";
import BottomNav from "./bottom-nav";
import type { Route } from "./+types/bottom-nav-sidebar-layout";
import { SidebarProvider, SidebarInset } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { getAccounts, getProfile } from "./queries";
import { makeSSRClient } from "~/supa-client";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  const accounts = await getAccounts(client);
  const profile = await getProfile(client);
  return data({ accounts, profile }, { headers });
};

export default function BottomNavSidebarLayout({
  loaderData,
}: Route.ComponentProps) {
  return (
    <SidebarProvider>
      <AppSidebar accounts={loaderData.accounts} profile={loaderData.profile} />
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
