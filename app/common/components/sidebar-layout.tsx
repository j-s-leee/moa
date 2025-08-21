import { data, Outlet } from "react-router";

import { SidebarInset, SidebarProvider } from "~/common/components/ui/sidebar";
import type { Route } from "./+types/sidebar-layout";
import { AppSidebar } from "./app-sidebar";
import { getAccounts, getProfile } from "./queries";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId } from "~/features/auth/queries";
import MobileHeader from "./mobile-header";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const profile = await getProfile(client, userId);
  const accounts = await getAccounts(client);
  return data({ accounts, profile }, { headers });
};

export default function SidebarLayout({ loaderData }: Route.ComponentProps) {
  return (
    <SidebarProvider>
      <AppSidebar accounts={loaderData.accounts} profile={loaderData.profile} />
      <SidebarInset>
        <MobileHeader />
        <main className="px-4 py-6 pb-24">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
