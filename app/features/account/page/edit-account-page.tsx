import { Form, Link, redirect } from "react-router";
import type { Route } from "./+types/edit-account-page";
import { FormInput } from "~/common/components/form-input";
import { Button } from "~/common/components/ui/button";
import { Alert } from "~/common/components/ui/alert";
import { AlertCircleIcon, ChevronLeft } from "lucide-react";
import { AlertTitle } from "~/common/components/ui/alert";
import { AlertDescription } from "~/common/components/ui/alert";
import { getLoggedInUserId } from "~/features/auth/queries";
import { makeSSRClient } from "~/supa-client";
import { z } from "zod";
import { updateAccount } from "../mutations";
import { getAccountByIdAndProfileId } from "../queries";

const formSchema = z.object({
  name: z.string().min(1).max(40),
});

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const { accountId } = params;
  const formData = await request.formData();

  const { success, error, data } = formSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!success) {
    return { fieldErrors: error.flatten().fieldErrors };
  }

  const { name } = data;
  const result = await updateAccount(client, { name, userId, accountId });

  if (result) {
    return redirect(`/account/${accountId}/manage`);
  }
  return { error: "Failed to update account" };
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const { accountId } = params;
  const account = await getAccountByIdAndProfileId(client, accountId, userId);
  return { account };
};

export default function EditAccountPage({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  return (
    <main className="px-4 py-6 h-full min-h-screen space-y-6">
      <div className="flex items-center gap-2">
        <Link to={`/account`}>
          <ChevronLeft className="size-6" />
        </Link>
        <h3 className="font-semibold text-lg">가계부 수정</h3>
      </div>
      <Form method="post" className="flex flex-col gap-6">
        <FormInput
          label="가계부 이름"
          type="text"
          name="name"
          defaultValue={loaderData?.account?.name}
        />
        {actionData && "fieldErrors" in actionData && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>가계부 수정 실패</AlertTitle>
            <AlertDescription>
              <p>아래 내용을 참고해 이름을 수정해주세요.</p>
              <ul className="list-inside list-disc text-sm">
                {actionData?.fieldErrors?.name &&
                  actionData?.fieldErrors?.name.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        <Button type="submit">수정</Button>
      </Form>
    </main>
  );
}
