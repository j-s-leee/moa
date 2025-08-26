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
} from "~/features/auth/queries";
import { useFetcher } from "react-router";
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
import AlreadyAccepted from "../components/already-accepted";
import { useEffect } from "react";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Verify Token | MOA" }];
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const { token } = params;
  const redirectUrl = `/auth/login?redirect=${encodeURIComponent(request.url)}`;
  const userId = await getLoggedInUserIdWithRedirectUrl(client, redirectUrl);

  // 여기부턴 로그인 상태

  // 토큰으로 초대 정보 조회
  const invitation = await getInvitationByToken(client, token);
  if (!invitation || !invitation.account_id) {
    throw new Error("Invitation not found");
  }

  if (invitation.status !== "pending") {
    throw new Error("Invitation not pending");
  }

  const userEmail = await getLoggedInUserEmail(client);
  if (invitation.email !== userEmail) {
    throw new Error("Invitation email not match");
  }

  // 이미 수락했는지 확인
  const alreadyAccepted = await checkUserAlreadyAccepted(
    client,
    invitation.account_id,
    userId
  );

  return {
    invitation,

    alreadyAccepted,
    isExpired:
      DateTime.fromISO(invitation.expires_at, { zone: "utc" })
        .diffNow()
        .toMillis() < 0,
    isOwner: invitation.inviter_id === userId,
  };
};

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const { token } = params;

  try {
    const userEmail = await getLoggedInUserEmail(client);
    if (!userEmail) {
      throw new Error("User email not found");
    }
    const invitation = await getInvitationByToken(client, token);

    // 초대 수락 처리
    await acceptInvitation(client, invitation.token, userEmail);

    return { success: true, message: "초대 수락 완료" };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to accept invitation",
      success: false,
    };
  }
};

export default function VerifyTokenPage({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  const { invitation, alreadyAccepted, isExpired, isOwner } = loaderData;
  const fetcher = useFetcher();
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      toast.success(fetcher.data.message);
    }
    if (fetcher.state === "idle" && fetcher.data?.error) {
      toast.error(fetcher.data.error);
    }
  }, [fetcher.state, fetcher.data]);

  if (!isOwner && alreadyAccepted) {
    return (
      <AlreadyAccepted
        token={invitation.token}
        accountId={invitation.account_id}
      />
    );
  }

  return (
    <main className="px-4 py-6 h-full min-h-screen space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="text-blue-500" />
            초대 확인
          </CardTitle>
          <CardDescription>
            <span>{invitation.accounts?.name}에 초대되었습니다.</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">초대 정보</p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{invitation.accounts?.name}</p>
              <p>
                {DateTime.fromISO(invitation.expires_at, {
                  zone: "utc",
                }).toRelative()}{" "}
                만료
              </p>
            </div>
          </div>

          {actionData?.success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>초대 수락 완료!</AlertTitle>
              <AlertDescription>
                성공적으로 초대를 수락했습니다.
              </AlertDescription>
            </Alert>
          )}

          {actionData?.error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>오류 발생</AlertTitle>
              <AlertDescription>{actionData.error}</AlertDescription>
            </Alert>
          )}

          {isExpired && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>초대 만료</AlertTitle>
              <AlertDescription>초대가 만료되었습니다.</AlertDescription>
            </Alert>
          )}

          {isOwner && invitation.status === "pending" && (
            <fetcher.Form
              method="post"
              action={`/invite/${invitation.token}/close`}
            >
              <Button
                type="submit"
                className="w-full"
                disabled={fetcher.state !== "idle"}
              >
                초대 마감하기
              </Button>
            </fetcher.Form>
          )}

          {!isOwner && !alreadyAccepted && invitation.status === "pending" && (
            <Form method="post">
              <Button
                type="submit"
                className="w-full"
                disabled={fetcher.state !== "idle"}
              >
                초대 수락하기
              </Button>
            </Form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <div>{error.message}</div>;
}
