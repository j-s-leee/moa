import { data, Outlet } from "react-router";

import { SidebarInset, SidebarProvider } from "~/common/components/ui/sidebar";
import type { Route } from "./+types/invite-layout";
import { AppSidebar } from "~/common/components/app-sidebar";
import { getProfile } from "~/common/components/queries";
import { makeSSRClient } from "~/supa-client";
import MobileHeader from "~/common/components/mobile-header";
import { getAccountsByProfileId } from "~/features/account/queries";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);

  try {
    // 인증 상태 확인 (리다이렉트 없이)
    const { data: userData } = await client.auth.getUser();
    const userId = userData.user?.id;

    if (userId) {
      // 로그인한 사용자: 실제 데이터 반환
      const profile = await getProfile(client, userId);
      const accounts = await getAccountsByProfileId(client, userId);
      return data({ accounts, profile, isLoggedIn: true }, { headers });
    } else {
      // 로그인하지 않은 사용자: 기본 데이터 반환
      return data({
        accounts: [],
        profile: {
          name: "Guest",
          profile_id: "guest",
          email: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        isLoggedIn: false,
      });
    }
  } catch (error) {
    // 에러 발생 시 기본 데이터 반환
    console.error("Error in invite layout loader:", error);
    return data({
      accounts: [],
      profile: {
        name: "Guest",
        profile_id: "guest",
        email: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      isLoggedIn: false,
    });
  }
};

export default function InviteLayout({ loaderData }: Route.ComponentProps) {
  return (
    <SidebarProvider>
      <AppSidebar accounts={loaderData.accounts} profile={loaderData.profile} />
      <SidebarInset>
        <MobileHeader name={loaderData.profile.name} />
        <main className="px-4 py-6 pb-24">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
