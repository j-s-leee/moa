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
import { FormInput } from "~/common/components/form-input";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Create Link | MOA" },
    { name: "description", content: "Create Link Page" },
  ];
};

const formSchema = z.object({
  email: z.string().email(),
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
    email: parsedData.email,
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
        <h3 className="text-lg font-semibold">{account.name} 초대 발송</h3>
      </div>
      <fetcher.Form method="post" className="space-y-4">
        <div className="space-y-2">
          <FormInput type="email" label="이메일" name="email" />
        </div>
        {actionData &&
          "fieldErrors" in actionData &&
          actionData.fieldErrors && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {actionData.fieldErrors.email}
              </AlertDescription>
            </Alert>
          )}
        <Button
          type="submit"
          className="w-full"
          disabled={fetcher.state !== "idle"}
        >
          {fetcher.state === "submitting" ? "초대 발송 중..." : "초대 발송"}
        </Button>
      </fetcher.Form>
    </main>
  );
}
