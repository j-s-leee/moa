import { Link, redirect, useFetcher } from "react-router";
import { ChevronDown, Send } from "lucide-react";

import { getAccountByIdAndProfileId } from "../account/queries";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId } from "../auth/queries";
import { Button } from "~/common/components/ui/button";

import { getMembers } from "./queries";
import { Badge } from "~/common/components/ui/badge";
import type { Route } from "./+types/member-page";
import { getInvitationsByAccountId } from "../invite/queries";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { removeMember } from "./mutations";
import { Input } from "~/common/components/ui/input";
import { Separator } from "~/common/components/ui/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/common/components/ui/dropdown-menu";
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
  const { accountId } = params;
  const account = await getAccountByIdAndProfileId(client, accountId, userId);
  if (!account) {
    return redirect(`/account`);
  }
  const isOwner = account.created_by === userId;
  if (!isOwner) {
    return redirect(`/account`);
  }
  const formData = await request.formData();
  const { success, data, error } = formSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!success) {
    return { success: false, error: error.message };
  }
  const { memberId } = data;
  const { success: removeSuccess, message: removeMessage } = await removeMember(
    client,
    accountId,
    memberId
  );
  if (!removeSuccess) {
    return { success: false, error: removeMessage };
  }
  return { success: true, message: removeMessage };
};

export default function MemberPage({ loaderData }: Route.ComponentProps) {
  const inviteFetcher = useFetcher();
  const promoteFetcher = useFetcher();
  const revokeFetcher = useFetcher();

  const inviteRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (inviteFetcher.state === "idle" && inviteFetcher.data) {
      if (inviteFetcher.data.success) {
        toast.success(inviteFetcher.data.message);
      } else if (inviteFetcher.data.success === false) {
        toast.error(inviteFetcher.data.message);
      }
      inviteRef.current?.reset();
    }
  }, [
    inviteFetcher.state,
    inviteFetcher.data?.success,
    inviteFetcher.data?.message,
  ]);

  useEffect(() => {
    if (promoteFetcher.state === "idle" && promoteFetcher.data?.success) {
      toast.success(promoteFetcher.data.message);
    }
    if (promoteFetcher.state === "idle" && promoteFetcher.data?.error) {
      toast.error(promoteFetcher.data.error);
    }
  }, [promoteFetcher.state, promoteFetcher.data]);

  useEffect(() => {
    if (revokeFetcher.state === "idle" && revokeFetcher.data?.success) {
      toast.success(revokeFetcher.data.message);
    }
    if (revokeFetcher.state === "idle" && revokeFetcher.data?.error) {
      toast.error(revokeFetcher.data.error);
    }
  }, [revokeFetcher.state, revokeFetcher.data]);
  const { accountId, members, isOwner, invitations, account, userId } =
    loaderData;
  return (
    <main className="px-4 py-6 h-full min-h-screen space-y-6">
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
                <Avatar className="size-10">
                  <AvatarFallback>
                    {member.profiles.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span>{member.profiles.name}</span>
                    {member.role === "owner" && (
                      <Badge variant="outline">👑</Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {member.profiles.email}
                  </span>
                </div>
              </div>
              {isOwner
                ? member.role !== "owner" && (
                    <MemberDropdown member={member} isOwner={isOwner} />
                  )
                : member.profile_id === userId && (
                    <MemberDropdown member={member} isOwner={isOwner} />
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
                  <Avatar className="size-10">
                    <AvatarImage src={invitation.email ?? undefined} />
                    <AvatarFallback>
                      {invitation.email.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
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
                {isOwner && <InvitationDropdown invitation={invitation} />}
              </div>
            ))}
        </CardContent>
      </Card>
    </main>
  );

  function InviteForm() {
    return (
      <inviteFetcher.Form
        method="post"
        action="/api/member/invite"
        ref={inviteRef}
      >
        <div className="flex items-center gap-2">
          <input type="hidden" name="accountId" value={accountId} />
          <Input
            name="email"
            type="email"
            placeholder="moa@gmail.com"
            className="w-full"
          />
          <Button size="icon" variant="outline" type="submit">
            <Send />
          </Button>
        </div>
      </inviteFetcher.Form>
    );
  }

  function MemberDropdown({
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {isOwner && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  관리자 변경
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>관리자 변경</AlertDialogTitle>
                  <AlertDialogDescription>
                    관리자 변경하시겠습니까?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      promoteFetcher.submit(
                        {
                          memberId: member.profile_id,
                          accountId: accountId,
                        },
                        {
                          method: "POST",
                          action: "/api/member/promote",
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
          {(isOwner || member.profile_id === userId) && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  {isOwner ? "제거" : "나가기"}
                </DropdownMenuItem>
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
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  function InvitationDropdown({
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                제거
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>제거</AlertDialogTitle>
                <AlertDialogDescription>
                  제거하시겠습니까?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    revokeFetcher.submit(
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
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
