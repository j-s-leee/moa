import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/verify-token-page";
import {
  getInvitationByToken,
  checkUserAlreadyAccepted,
} from "~/features/invite/queries";
import { acceptInvitation } from "~/features/invite/mutations";
import {
  getLoggedInUserId,
  getLoggedInUserIdWithRedirectUrl,
  getLoggedInUserEmail,
  getProfile,
} from "~/features/auth/queries";
import { redirect, useFetcher } from "react-router";
import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/common/components/ui/alert";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Form } from "react-router";
import { DateTime } from "luxon";
import { toast } from "sonner";
import { getAccountByIdAndProfileId } from "~/features/account/queries";
import { joinAccount } from "~/features/account/mutations";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Verify Token | MOA" }];
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const { token } = params;
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  const redirectUrl = `/auth/login?redirect=${encodeURIComponent(request.url)}`;
  const userId = await getLoggedInUserIdWithRedirectUrl(client, redirectUrl);
  let needRequestInvite = false;

  // 여기부턴 로그인 상태

  // 토큰으로 초대 정보 조회
  const invitation = await getInvitationByToken(client, token);
  if (!invitation || !invitation.account_id) {
    throw new Error("Invitation not found");
  }

  const userEmail = await getLoggedInUserEmail(client);
  console.log("invitation", invitation);
  console.log("userEmail", userEmail);
  if (invitation.email === userEmail && userEmail === email) {
    const accountMember = await getAccountByIdAndProfileId(
      client,
      invitation.account_id,
      userId
    );
    // 이미 가계부 멤버면 리다이렉트
    if (accountMember) {
      return redirect(`/account/${invitation.account_id}/dashboard`);
    }
    // 만료된 초대가 아니면 가계부 멤버로 수락
    if (
      invitation.expires_at &&
      DateTime.fromISO(invitation.expires_at, { zone: "utc" })
        .diffNow()
        .toMillis() > 0
    ) {
      await acceptInvitation(client, {
        token: invitation.token,
        email: userEmail,
      });
      const joinedAccount = await joinAccount(client, {
        accountId: invitation.account_id,
        userId,
      });
      return redirect(`/account/${joinedAccount.account_id}/dashboard`);
    }
  }
  // 이미 로그인 상태고 초대 받은 이메일이 다르면 초대 요청
  if (
    invitation.email === email &&
    userEmail !== email &&
    userId !== invitation.inviter_id
  ) {
    needRequestInvite = true;
  }

  return {
    invitation,
    needRequestInvite,
  };
};

export default function VerifyTokenPage({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  const { invitation, needRequestInvite } = loaderData;
  console.log("needRequestInvite", needRequestInvite);
  console.log("invitation", invitation);
  return (
    <main className="px-4 py-6 h-full min-h-screen space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="text-blue-500" />
            만료된 초대
          </CardTitle>
          <CardDescription>
            초대 만료되었습니다. 다시 초대를 요청해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => {
              // TODO: 초대 요청 로직 추가(notification방식으로)
              console.log("초대요청");
            }}
          >
            초대 요청
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <div>{error.message}</div>;
}
