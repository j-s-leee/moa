import { Link, redirect } from "react-router";
import { ChevronLeft, Link2, Plus } from "lucide-react";

import { getAccountByIdAndProfileId } from "../account/queries";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId } from "../auth/queries";
import { Button } from "~/common/components/ui/button";

import { getMembers } from "./queries";
import { Badge } from "~/common/components/ui/badge";
import type { Route } from "./+types/member-page";
import { Separator } from "~/common/components/ui/separator";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Member | MOA" },
    { name: "description", content: "Member Page" },
  ];
};

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
  return { accountId, members, isOwner };
};

export default function MemberPage({ loaderData }: Route.ComponentProps) {
  const { accountId, members, isOwner } = loaderData;
  return (
    <main className="px-4 py-6 h-full min-h-screen space-y-6">
      <div className="flex items-center gap-2">
        <Link to={`/account`}>
          <ChevronLeft className="size-6" />
        </Link>
        <h3 className="font-semibold text-lg">가계부 멤버 관리</h3>
      </div>
      {/* 계좌 추가 버튼 */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">가계부 멤버 관리</h1>
        {isOwner && (
          <>
            <Link to={`/account/${accountId}/invite`}>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                멤버 초대
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Link to={`/account/${accountId}/manage/link`}>
              <Button className="flex items-center gap-2">
                <Link2 size={16} />
                링크 생성
              </Button>
            </Link>
          </>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-lg">멤버 목록</h4>
        </div>
        <div className="flex flex-col gap-4">
          {members.map((member) => (
            <div key={member.profile_id} className="flex items-center gap-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span>{member.profiles.name}</span>
                  <Badge
                    variant={member.role === "owner" ? "default" : "secondary"}
                  >
                    {member.role}
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground">
                  {member.profiles.email}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
