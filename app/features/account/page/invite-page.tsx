import { Resend } from "resend";
import type { Route } from "./+types/invite-page";
import { AlertCircleIcon, ChevronLeft } from "lucide-react";
import { Link, redirect } from "react-router";
import { Form } from "react-router";
import { FormInput } from "~/common/components/form-input";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/common/components/ui/alert";
import { Button } from "~/common/components/ui/button";
import { z } from "zod";
import { makeSSRClient } from "~/supa-client";
import { toast } from "sonner";
import { getLoggedInUserId } from "~/features/auth/queries";
import { getAccountByIdAndProfileId } from "../queries";

const resendClient = new Resend(process.env.RESEND_API_KEY);

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Invite | MOA" },
    { name: "description", content: "Invite Page" },
  ];
};

const formSchema = z.object({
  email: z.string().email(),
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

  //TODO 이메일 초대 정보 저장 로직 추가

  const { error } = await resendClient.emails.send({
    from: "pang-in@mail.the-moa.top",
    to: parsedData.email,
    subject: `Invitation to join the ${account.name} account`,
    html: `<p>You are invited to join the ${account.name} account</p>`,
  });

  if (error) {
    toast.error("이메일 초대 실패");
  }
  toast.success("이메일 초대 성공");

  return redirect(`/account/${accountId}/manage/member`);
};

export default function InvitePage({ actionData }: Route.ComponentProps) {
  return (
    <main className="px-4 py-6 h-full min-h-screen space-y-6">
      <div className="flex items-center gap-2">
        <Link to={`/account`}>
          <ChevronLeft className="size-6" />
        </Link>
        <h3 className="font-semibold text-lg">가계부 초대</h3>
      </div>
      <Form method="post" className="flex flex-col gap-6">
        <FormInput label="이메일" type="email" name="email" />
        {actionData && "fieldErrors" in actionData && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>이메일 초대 실패</AlertTitle>
            <AlertDescription>
              <p>아래 내용을 참고해 이메일을 수정해주세요.</p>
              <ul className="list-inside list-disc text-sm">
                {actionData.fieldErrors.email &&
                  actionData.fieldErrors.email.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        <Button type="submit">초대</Button>
      </Form>
    </main>
  );
}
