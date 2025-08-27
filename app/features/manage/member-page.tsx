import { Link, redirect, useFetcher } from "react-router";
import { ChevronDown, ChevronLeft, Send, Trash2, UserPlus } from "lucide-react";

import { getAccountByIdAndProfileId } from "../account/queries";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId } from "../auth/queries";
import { Button } from "~/common/components/ui/button";

import { getMembers } from "./queries";
import { Badge } from "~/common/components/ui/badge";
import type { Route } from "./+types/member-page";
import {
  getInvitationsByAccountId,
  getInvitationsByAccountIdAndProfileId,
} from "../invite/queries";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/common/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
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
  console.log("loader");
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
    return { accountId, members, isOwner, invitations, account };
  }
  return { accountId, members, isOwner, invitations: null, account };
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
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      toast.success(fetcher.data.message);
    }
    if (fetcher.state === "idle" && fetcher.data?.error) {
      toast.error(fetcher.data.error);
    }
  }, [fetcher.state, fetcher.data]);
  const { accountId, members, isOwner, invitations, account } = loaderData;
  return (
    <main className="px-4 py-6 h-full min-h-screen space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <h3 className="font-semibold text-lg">공유</h3>
          </CardTitle>
          <CardDescription>
            <span className="font-semibold">{account.name}</span> 를 함께 사용할
            멤버를 초대하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isOwner && (
            <fetcher.Form method="post" action="/api/member/invite">
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
            </fetcher.Form>
          )}
          <Separator />

          {members.map((member) => (
            <div
              key={member.profile_id}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-4">
                <Avatar className="size-10">
                  <AvatarImage src={member.profiles.email ?? undefined} />
                  <AvatarFallback>
                    {member.profiles.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span>{member.profiles.name}</span>
                    {member.role !== "owner" && <Badge>{member.role}</Badge>}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {member.profiles.email}
                  </span>
                </div>
              </div>
              {member.role !== "owner" && (
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
                              fetcher.submit(
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
                              fetcher.submit(
                                {
                                  memberId: member.profile_id,
                                  accountId: accountId,
                                },
                                { method: "POST", action: "/api/member/revoke" }
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
                  {isOwner && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <ChevronDown />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
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
                                  fetcher.submit(
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
                  )}
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
    </main>
  );
}
