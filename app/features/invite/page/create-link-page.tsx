import { ChevronLeft } from "lucide-react";
import { Form, Link } from "react-router";
import type { Route } from "./+types/create-link-page";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId } from "~/features/auth/queries";
import { getAccountByIdAndProfileId } from "~/features/account/queries";
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
import { toast } from "sonner";

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
  const account = await getAccountByIdAndProfileId(client, accountId, userId);
  return { account, accountId };
};

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const { accountId } = params;
  const userId = await getLoggedInUserId(client);
  const account = await getAccountByIdAndProfileId(client, accountId, userId);
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

  return { invitation };
};

export default function CreateLinkPage({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  const { account } = loaderData;

  // invitation이 존재하는지 확인 후 사용
  const invitation =
    actionData && "invitation" in actionData
      ? actionData.invitation
      : undefined;

  return (
    <main className="px-4 py-6 h-full min-h-screen space-y-6">
      <Link to="/account">
        <ChevronLeft className="size-6" />
      </Link>
      <h1 className="text-2xl font-bold">Create Link for {account.name}</h1>

      {/* invitation이 성공적으로 생성된 경우 표시 */}
      {invitation && (
        <Alert>
          <AlertTitle>초대 링크가 생성되었습니다!</AlertTitle>
          <AlertDescription>토큰: {invitation.token}</AlertDescription>
          <Button
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText(
                `http://localhost:5173/invite/${invitation.token}`
              );
              toast.success("링크가 복사되었습니다.");
            }}
          >
            링크 복사
          </Button>
        </Alert>
      )}

      <Form method="post">
        <Select name="maxUses">
          <SelectTrigger>
            <SelectValue placeholder="Select a max uses" />
          </SelectTrigger>
          <SelectContent>
            {[...Array(10)].map((_, i) => (
              <SelectItem key={i} value={String(i + 1)}>
                {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        <Button type="submit">Create Link</Button>
      </Form>
    </main>
  );
}
