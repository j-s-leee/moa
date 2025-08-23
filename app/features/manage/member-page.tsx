import { Link } from "react-router";
import { ChevronLeft } from "lucide-react";
import type { Route } from "./+types/member-page";
import { getAccountByIdAndProfileId } from "../account/queries";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId } from "../auth/queries";

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
  return { account, accountId };
};

export default function MemberPage() {
  return (
    <main className="px-4 py-6 h-full min-h-screen space-y-6">
      <div className="flex items-center gap-2">
        <Link to={`/account`}>
          <ChevronLeft className="size-6" />
        </Link>
        <h3 className="font-semibold text-lg">가계부 멤버 관리</h3>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-lg">멤버 목록</h4>
        </div>
      </div>
    </main>
  );
}
