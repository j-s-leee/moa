import { data, Outlet } from "react-router";
import MobileHeader from "./mobile-header";
import BottomNav from "./bottom-nav";
import type { Route } from "./+types/bottom-nav-sidebar-layout";
import { SidebarProvider, SidebarInset } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { getProfile } from "./queries";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId } from "~/features/auth/queries";
import { getAccountsByProfileId } from "~/features/account/queries";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const profile = await getProfile(client, userId);
  const accounts = await getAccountsByProfileId(client, userId);
  const accountName = accounts.find(
    (account) => account.account_id === params.accountId
  )?.name;
  return data({ accounts, profile, accountName }, { headers });
};

export default function BottomNavSidebarLayout({
  loaderData,
}: Route.ComponentProps) {
  return (
    <SidebarProvider>
      <AppSidebar accounts={loaderData.accounts} profile={loaderData.profile} />
      <SidebarInset>
        <MobileHeader
          name={loaderData.profile.name}
          accountName={loaderData.accountName}
        />
        <main className="px-4 py-6 pb-24">
          <Outlet />
        </main>
        <BottomNav />
      </SidebarInset>
    </SidebarProvider>
  );
}
