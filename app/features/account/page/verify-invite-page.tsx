import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";

import { AlertCircleIcon } from "lucide-react";
import { GalleryVerticalEnd } from "lucide-react";
import { FormInput } from "~/common/components/form-input";
import { Form, Link, redirect, useFetcher } from "react-router";
import type { Route } from "./+types/verify-invite-page";
import { makeSSRClient } from "~/supa-client";
import {
  getLoggedInUserId,
  getLoggedInUserIdWithRedirectUrl,
} from "~/features/auth/queries";
import { getAccountByIdAndProfileId } from "../queries";
import { z } from "zod";
import { acceptInvitation } from "../mutations";
import { joinAccount } from "../mutations";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/common/components/ui/alert";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Verify Invite | MOA" }];
};

const emailSchema = z.object({
  email: z.string().email(),
});

const accountIdSchema = z.object({
  accountId: z.string().uuid(),
});

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const url = new URL(request.url);

  const { success, data, error } = emailSchema.safeParse(
    Object.fromEntries(url.searchParams)
  );
  if (!success) {
    return { errors: error.flatten().fieldErrors };
  }
  const { email } = data;
  const redirectTo = `/auth/login?redirect=${encodeURIComponent(url.href)}`;

  // 로그인 체크
  const userId = await getLoggedInUserIdWithRedirectUrl(client, redirectTo);

  // 어카운트 멤버인지 체크
  const {
    success: accountIdSuccess,
    data: accountIdData,
    error: accountIdError,
  } = accountIdSchema.safeParse(params);
  if (!accountIdSuccess) {
    return { errors: accountIdError.flatten().fieldErrors };
  }
  const { accountId } = accountIdData;
  const account = await getAccountByIdAndProfileId(client, accountId, userId);
  // 어카운트 멤버면 어카운트 페이지로 이동
  if (account) {
    return redirect(`/account/${accountId}/dashboard`);
  }

  return { account, email };
};

const tokenSchema = z.object({
  email: z.string().email(),
  token: z.string().min(1, "토큰을 입력해주세요."),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const formData = await request.formData();
  const { success, error, data } = tokenSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!success) {
    return { fieldErrors: error.flatten().fieldErrors };
  }

  // verify email & token at invitation table
  // update invitation_status
  try {
    const invitation = await acceptInvitation(client, data);
    if (!invitation) {
      return { error: "초대 정보를 찾을 수 없습니다." };
    }
    if (!invitation.account_id) {
      return { error: "초대 정보를 찾을 수 없습니다." };
    }
    if (invitation && invitation.account_id) {
      const userId = await getLoggedInUserId(client);
      const accountMember = await joinAccount(client, {
        accountId: invitation.account_id,
        userId: userId,
      });
    }
    // redirect to account dashboard
    return redirect(`/account/${invitation.account_id}/dashboard`);
  } catch (error) {
    console.error("acceptInvitation error", error);
    return { error: "초대 정보를 찾을 수 없습니다." };
  }
};
export default function VerifyInvitePage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { email } = loaderData;

  const fetcher = useFetcher();
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to="/accounts"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="bg-emerald-500 text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          MOA
        </Link>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">
                이메일 인증하고 초대 수락하기
              </CardTitle>
              <CardDescription>
                {email} 이메일로 전송된 토큰을 입력해주세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form method="post">
                <div className="grid gap-6">
                  <div className="flex flex-col gap-4">
                    <input type="hidden" name="email" value={email} />
                    <FormInput
                      name="token"
                      label="인증 코드"
                      placeholder="코드 입력"
                      type="text"
                    />
                    {actionData && "fieldErrors" in actionData && (
                      <Alert variant="destructive">
                        <AlertCircleIcon />
                        <AlertTitle>이메일 인증 실패</AlertTitle>
                        <AlertDescription>
                          <ul className="list-inside list-disc text-sm">
                            {actionData.fieldErrors?.token &&
                              actionData.fieldErrors.token.map((error) => (
                                <li key={error}>{error}</li>
                              ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                    {actionData && "error" in actionData && (
                      <Alert variant="destructive">
                        <AlertCircleIcon />
                        <AlertTitle>이메일 인증 실패</AlertTitle>
                        <AlertDescription>{actionData.error}</AlertDescription>
                      </Alert>
                    )}
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={fetcher.state === "submitting"}
                    >
                      계속
                    </Button>
                  </div>
                </div>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
