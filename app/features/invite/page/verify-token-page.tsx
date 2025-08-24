import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/verify-token-page";
import {
  getInvitationByToken,
  checkUserAlreadyAccepted,
} from "~/features/invite/queries";
import { acceptInvitation } from "~/features/invite/mutations";
import { getLoggedInUserId } from "~/features/auth/queries";
import { redirect } from "react-router";
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
import { Form, Link } from "react-router";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Verify Token | MOA" }];
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);

  const { token } = params;
  console.log("token", token);

  try {
    // 토큰으로 초대 정보 조회
    const invitation = await getInvitationByToken(client, token);
    console.log("invitation", invitation);
    // 로그인 상태 확인
    let isLoggedIn = false;
    let userId = null;

    try {
      userId = await getLoggedInUserId(client);
      console.log("userId", userId);
      isLoggedIn = true;
    } catch {
      // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
      const loginUrl = `/auth/login?redirect=${encodeURIComponent(
        request.url
      )}`;
      console.log("loginUrl", loginUrl);
      return redirect(loginUrl);
    }

    // 초대 수락 가능 여부 확인
    const acceptsCount = invitation.used_count;
    console.log("acceptsCount", acceptsCount);
    const canAccept = invitation.max_uses > acceptsCount;
    console.log("canAccept", canAccept);
    // 이미 수락했는지 확인
    let alreadyAccepted = false;
    if (isLoggedIn && userId) {
      console.log("checkUserAlreadyAccepted");
      alreadyAccepted = await checkUserAlreadyAccepted(
        client,
        invitation.invitation_id,
        userId
      );
    }

    return {
      invitation,
      isLoggedIn,
      userId,
      canAccept,
      alreadyAccepted,
      acceptsCount,
    };
  } catch (error) {
    console.log("error", error);
    throw new Response("Invalid or expired invitation token", { status: 404 });
  }
};

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const { token } = params;

  try {
    const userId = await getLoggedInUserId(client);
    const invitation = await getInvitationByToken(client, token);

    // 초대 수락 처리
    await acceptInvitation(client, invitation.invitation_id, userId);

    return { success: true };
  } catch (error) {
    console.log("error", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to accept invitation",
    };
  }
};

export default function VerifyTokenPage({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  const { invitation, isLoggedIn, canAccept, alreadyAccepted, acceptsCount } =
    loaderData;

  console.log("alreadyAccepted", alreadyAccepted);
  console.log("canAccept", canAccept);

  if (alreadyAccepted) {
    return (
      <main className="px-4 py-6 h-full min-h-screen space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="text-green-500" />
              이미 초대를 수락했습니다
            </CardTitle>
            <CardDescription>이 초대는 이미 수락되었습니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              초대 링크: {invitation.token}
            </p>
            <div className="mt-4">
              <Link to="/dashboard" className="text-blue-500 hover:underline">
                대시보드로 이동하기
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!canAccept) {
    return (
      <main className="px-4 py-6 h-full min-h-screen space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="text-red-500" />
              초대 수락 불가
            </CardTitle>
            <CardDescription>
              이 초대는 더 이상 수락할 수 없습니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              최대 수락 가능 인원: {invitation.max_uses}명<br />
              현재 수락된 인원: {acceptsCount}명
            </p>
          </CardContent>
        </Card>
      </main>
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
            {invitation.accounts?.name} 계정에 초대되었습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">초대 정보</p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>계정명: {invitation.accounts?.name}</p>
              <p>최대 수락 가능 인원: {invitation.max_uses}명</p>
              <p>현재 수락된 인원: {acceptsCount}명</p>
              <p>
                만료일: {new Date(invitation.expires_at).toLocaleDateString()}
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

          <Form method="post">
            <Button type="submit" className="w-full">
              초대 수락하기
            </Button>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
