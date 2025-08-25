import { Link, redirect, useFetcher } from "react-router";
import { ChevronLeft, Link2, Trash2 } from "lucide-react";

import { getAccountByIdAndProfileId } from "../account/queries";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId } from "../auth/queries";
import { Button } from "~/common/components/ui/button";

import { getMembers } from "./queries";
import { Badge } from "~/common/components/ui/badge";
import type { Route } from "./+types/member-page";
import { getInvitationsByAccountIdAndProfileId } from "../invite/queries";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/common/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { DateTime } from "luxon";
import { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { removeMember } from "./mutations";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Member | MOA" },
    { name: "description", content: "Member Page" },
  ];
};

const formSchema = z.object({
  memberId: z.string().uuid(),
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
    const invitations = await getInvitationsByAccountIdAndProfileId(
      client,
      accountId,
      userId
    );
    return { accountId, members, isOwner, invitations };
  }
  return { accountId, members, isOwner, invitations: null };
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
  const { accountId, members, isOwner, invitations } = loaderData;
  return (
    <main className="px-4 py-6 h-full min-h-screen space-y-6">
      <div className="flex items-center gap-2">
        <Link to={`/account`}>
          <ChevronLeft className="size-6" />
        </Link>
        <h3 className="font-semibold text-lg">가계부 멤버 관리</h3>
      </div>

      <div>
        <Tabs defaultValue="members">
          <TabsList className="w-full">
            <TabsTrigger value="members">멤버</TabsTrigger>
            {isOwner && <TabsTrigger value="invitations">초대</TabsTrigger>}
          </TabsList>
          <TabsContent value="members" className="space-y-4">
            <div className="flex items-center justify-between h-6">
              <h1>멤버 목록</h1>
            </div>
            <Card>
              <CardContent className="space-y-4">
                {members.map((member) => (
                  <div
                    key={member.profile_id}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span>{member.profiles.name}</span>
                        <Badge
                          variant={
                            member.role === "owner" ? "default" : "secondary"
                          }
                        >
                          {member.role}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {member.profiles.email}
                      </span>
                    </div>
                    {member.role !== "owner" && (
                      <fetcher.Form method="post">
                        <input
                          type="hidden"
                          name="memberId"
                          value={member.profile_id}
                        />
                        <Button size="sm" variant="ghost" type="submit">
                          <Trash2 />
                        </Button>
                      </fetcher.Form>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          {isOwner && (
            <TabsContent value="invitations" className="space-y-4">
              <div className="flex items-center justify-between h-6">
                <h1>초대 목록</h1>
                <Button size="sm" asChild>
                  <Link
                    to={`/account/${accountId}/manage/link`}
                    className="flex items-center gap-2"
                  >
                    <Link2 />
                    <span>링크 생성</span>
                  </Link>
                </Button>
              </div>
              <Card>
                <CardContent className="space-y-4">
                  {invitations?.map((invitation) => (
                    <Link
                      to={`/invite/${invitation.token}`}
                      key={invitation.invitation_id}
                      className="block"
                    >
                      <div className="flex flex-col gap-2 bg-muted p-2 rounded-md">
                        <Badge>{invitation.token}</Badge>
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">
                            {invitation.used_count}명 수락 /{" "}
                            {invitation.max_uses}명 초대
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {DateTime.fromISO(invitation.expires_at, {
                              zone: "utc",
                            }).toRelative()}{" "}
                            만료
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </main>
  );
}
