import { Form, redirect, useFetcher, useNavigation } from "react-router";
import {
  ArrowLeftRight,
  Loader2,
  Send,
  ShieldUser,
  UserRoundX,
} from "lucide-react";

import { getAccountByIdAndProfileId } from "../account/queries";
import { makeSSRClient } from "~/supa-client";
import {
  getLoggedInUserId,
  getProfile,
  getProfileIdByEmail,
} from "../auth/queries";
import { Button } from "~/common/components/ui/button";

import { getAccount, getMembers } from "./queries";
import { Badge } from "~/common/components/ui/badge";
import type { Route } from "./+types/member-page";
import { getInvitationsByAccountId } from "../account/queries";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { useRef } from "react";
import { z } from "zod";
import { Input } from "~/common/components/ui/input";
import { Separator } from "~/common/components/ui/separator";
import { Avatar, AvatarFallback } from "~/common/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/common/components/ui/alert-dialog";
import type { Database } from "database.types";
import { createInvitation } from "../account/mutations";
import MoaInvitationEmail from "react-email-starter/emails/invite-user";
import { render } from "@react-email/render";
import { sendEmail } from "~/lib/email";
export const meta: Route.MetaFunction = () => {
  return [
    { title: "Member | MOA" },
    { name: "description", content: "Member Page" },
  ];
};

const formSchema = z.object({
  memberId: z.string().uuid(),
});

const inviteSchema = z.object({
  email: z.string().email(),
  accountId: z.string().uuid(),
});

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const { accountId } = params;
  const account = await getAccountByIdAndProfileId(client, accountId, userId);
  if (!account) {
    return redirect(`/account`);
  }
  const members = await getMembers(client, accountId);

  const isOwner = members.some(
    (member) => member.role === "owner" && member.profile_id === userId
  );
  if (isOwner) {
    const invitations = await getInvitationsByAccountId(client, accountId);
    return { accountId, members, isOwner, invitations, account, userId };
  }
  return { accountId, members, isOwner, invitations: null, account, userId };
};

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const profile = await getProfile(client, userId);
  const formData = await request.formData();
  const { success, data, error } = inviteSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!success) {
    return { success: false, message: error.message };
  }

  const account = await getAccount(client, data.accountId);
  if (!account) {
    return { success: false, message: "Account not found" };
  }

  const profileId = await getProfileIdByEmail(client, data.email);

  if (profileId) {
    const accountMember = await getAccountByIdAndProfileId(
      client,
      data.accountId,
      profileId
    );

    if (accountMember) {
      return { success: false, message: "이미 가계부 멤버입니다." };
    }
  }

  const inviteData = await createInvitation(client, {
    accountId: data.accountId,
    email: data.email,
    userId,
  });

  if (!inviteData) {
    return { success: false, message: "Failed to invite member" };
  }

  const html = await render(
    <MoaInvitationEmail
      accountName={account.name}
      invitedByUsername={profile?.name}
      verificationCode={inviteData.token}
      invitationLink={`http://localhost:5173/account/${data.accountId}/verify?email=${data.email}`}
    />
  );

  const { success: emailSuccess, message: emailMessage } = await sendEmail({
    from: profile?.name
      ? `${profile?.name} via MOA <notify@mail.the-moa.top>`
      : "noreply@mail.the-moa.top",
    to: data.email,
    subject: `[MOA] ${account.name} 가계부 초대`,
    html,
  });

  if (!emailSuccess) {
    return { success: false, message: emailMessage };
  }

  return { success: true, message: "Email sent successfully" };
};

export default function MemberPage({ loaderData }: Route.ComponentProps) {
  const promoteFetcher = useFetcher();
  const revokeFetcher = useFetcher();
  const revokeInviteFetcher = useFetcher();
  const navigation = useNavigation();

  const inviteRef = useRef<HTMLFormElement>(null);

  const { accountId, members, isOwner, invitations, account, userId } =
    loaderData;
  return (
    <main className="min-h-screen space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <h3 className="font-semibold text-lg">
              {isOwner ? "공유" : "멤버"}
            </h3>
          </CardTitle>
          <CardDescription>
            <span className="font-semibold">{account.name}</span>{" "}
            {isOwner
              ? "를 함께 사용할 멤버를 초대하세요."
              : "를 함께 사용하는 멤버입니다."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isOwner && <InviteForm />}
          <Separator />

          {members.map((member) => (
            <div
              key={member.profile_id}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span>{member.profiles.name}</span>
                    {member.role === "owner" && (
                      <ShieldUser className="size-4 text-primary" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {member.profiles.email}
                  </span>
                </div>
              </div>
              {isOwner
                ? member.role !== "owner" && (
                    <MemberDialogs member={member} isOwner={isOwner} />
                  )
                : member.profile_id === userId && (
                    <MemberDialogs member={member} isOwner={isOwner} />
                  )}
            </div>
          ))}
          {invitations &&
            invitations.map((invitation) => (
              <div
                key={invitation.invitation_id}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span>{invitation.email.split("@")[0]}</span>
                      <Badge
                        variant={
                          invitation.status === "pending"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {invitation.status}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {invitation.email}
                    </span>
                  </div>
                </div>
                {isOwner && <InvitationRevokeDialog invitation={invitation} />}
              </div>
            ))}
        </CardContent>
      </Card>
    </main>
  );

  function InviteForm() {
    return (
      <Form method="post" ref={inviteRef}>
        <div className="flex items-center gap-2">
          <input type="hidden" name="accountId" value={accountId} />
          <Input
            name="email"
            type="email"
            placeholder="moa@gmail.com"
            className="w-full"
          />
          <Button
            size="icon"
            variant="outline"
            type="submit"
            disabled={navigation.state === "submitting"}
          >
            {navigation.state === "submitting" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send />
            )}
          </Button>
        </div>
      </Form>
    );
  }

  function MemberDialogs({
    member,
    isOwner,
  }: {
    member: {
      profile_id: string;
      role: "owner" | "member";
      profiles: { email: string | null; name: string };
    };
    isOwner: boolean;
  }) {
    return (
      <>
        {(isOwner || member.profile_id === userId) && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <UserRoundX />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {isOwner ? "제거" : "나가기"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {isOwner ? "제거하시겠습니까?" : "나가시겠습니까?"}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    revokeFetcher.submit(
                      {
                        memberId: member.profile_id,
                        accountId: accountId,
                      },
                      {
                        method: "POST",
                        action: "/api/member/revoke",
                      }
                    )
                  }
                >
                  확인
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </>
    );
  }

  function InvitationRevokeDialog({
    invitation,
  }: {
    invitation: {
      account_id: string | null;
      created_at: string;
      email: string;
      expires_at: string;
      invitation_id: number;
      inviter_id: string | null;
      status: Database["public"]["Enums"]["invitation_status"];
      token: string;
    };
  }) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <UserRoundX />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>제거</AlertDialogTitle>
            <AlertDialogDescription>제거하시겠습니까?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                revokeInviteFetcher.submit(
                  {
                    invitationId: invitation.invitation_id,
                    accountId: accountId,
                  },
                  {
                    method: "POST",
                    action: "/api/member/revoke-invite",
                  }
                )
              }
            >
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
}
