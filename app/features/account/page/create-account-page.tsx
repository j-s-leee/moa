import { z } from "zod";
import type { Route } from "./+types/create-account-page";
import { Link, redirect } from "react-router";
import { AlertCircleIcon, ChevronLeft } from "lucide-react";
import { Form } from "react-router";
import { Button } from "~/common/components/ui/button";
import { FormInput } from "~/common/components/form-input";
import { getLoggedInUserId } from "~/features/auth/queries";
import { makeSSRClient } from "~/supa-client";
import { createAccount } from "../mutations";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/common/components/ui/alert";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Create Account | MOA" },
    { name: "description", content: "Create Account Page" },
  ];
};

const formSchema = z.object({
  name: z.string().min(1).max(40),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const formData = await request.formData();
  const { success, error, data } = formSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!success) {
    return { fieldErrors: error.flatten().fieldErrors };
  }

  const { name } = data;
  const { account_id } = await createAccount(client, { name, userId });
  return redirect(`/account/${account_id}/manage`);
};

export default function CreateAccountPage({
  actionData,
}: Route.ComponentProps) {
  return (
    <main className="px-4 py-6 h-full min-h-screen space-y-6">
      <div className="flex items-center gap-2">
        <Link to={`/account`}>
          <ChevronLeft className="size-6" />
        </Link>
        <h3 className="font-semibold text-lg">가계부 추가</h3>
      </div>
      <Form method="post" className="flex flex-col gap-6">
        <FormInput label="가계부 이름" type="text" name="name" />
        {actionData && "fieldErrors" in actionData && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>가계부 추가 실패</AlertTitle>
            <AlertDescription>
              <p>아래 내용을 참고해 이름을 수정해주세요.</p>
              <ul className="list-inside list-disc text-sm">
                {actionData.fieldErrors.name &&
                  actionData.fieldErrors.name.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        <Button type="submit">추가</Button>
      </Form>
    </main>
  );
}
