import { ChevronLeft } from "lucide-react";
import { redirect, useFetcher, useNavigate } from "react-router";
import type { Route } from "./+types/create-link-page";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId } from "~/features/auth/queries";
import { getAccountByIdAndCreatedBy } from "~/features/account/queries";
import { z } from "zod";
import { createInvitation } from "../mutations";
import { Button } from "~/common/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "~/common/components/ui/select";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/common/components/ui/alert";
import { Label } from "~/common/components/ui/label";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Create Link | MOA" },
    { name: "description", content: "Create Link Page" },
  ];
};

const formSchema = z.object({
  maxUses: z.coerce.number().min(1).max(10),
});

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const { accountId } = params;
  const account = await getAccountByIdAndCreatedBy(client, accountId, userId);
  return { account, accountId };
};

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const { accountId } = params;
  const userId = await getLoggedInUserId(client);
  const account = await getAccountByIdAndCreatedBy(client, accountId, userId);
  if (!account) {
    return { error: "Account not found" };
  }
  const formData = await request.formData();
  const {
    success,
    error: formError,
    data: parsedData,
  } = formSchema.safeParse(Object.fromEntries(formData));

  if (!success) {
    return { fieldErrors: formError.flatten().fieldErrors };
  }

  const invitation = await createInvitation(client, {
    accountId,
    userId,
    maxUses: parsedData.maxUses,
  });

  return redirect(`/invite/${invitation.token}`);
};

export default function CreateLinkPage({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  const { account } = loaderData;
  const fetcher = useFetcher();

  const navigate = useNavigate();
  return (
    <main className="px-4 py-6 h-full min-h-screen space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ChevronLeft className="size-6" />
        </Button>
        <h3 className="text-lg font-semibold">{account.name} 초대 링크 생성</h3>
      </div>
      <fetcher.Form method="post" className="space-y-4">
        <div className="space-y-2">
          <Label>최대 초대 인원</Label>
          <Select name="maxUses" defaultValue="1">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="최대 초대 인원" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(10)].map((_, i) => (
                <SelectItem key={(i + 1).toString()} value={String(i + 1)}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {actionData &&
          "fieldErrors" in actionData &&
          actionData.fieldErrors && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {actionData.fieldErrors.maxUses}
              </AlertDescription>
            </Alert>
          )}
        <Button
          type="submit"
          className="w-full"
          disabled={fetcher.state !== "idle"}
        >
          {fetcher.state === "submitting" ? "링크 생성 중..." : "링크 생성"}
        </Button>
      </fetcher.Form>
    </main>
  );
}
