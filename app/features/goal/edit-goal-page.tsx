import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { FormInput } from "~/common/components/form-input";
import type { Route } from "./+types/edit-goal-page";
import { Form, type MetaFunction, redirect, useNavigate } from "react-router";
import { getAccount } from "../manage/queries";
import { makeSSRClient } from "~/supa-client";
import { Button } from "~/common/components/ui/button";
import { z } from "zod";
import { createSavingsGoal } from "./mutations";

export const meta: MetaFunction = () => {
  return [
    { title: "Goals | MOA" },
    { name: "description", content: "Goals page" },
  ];
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);

  const account = await getAccount(client, params.accountId);
  return { account };
};

const goalSchema = z.object({
  name: z.string().min(1, "목표 이름을 입력해주세요."),
  goal_amount: z.coerce.number().min(1, "목표 금액을 입력해주세요."),
  current_amount: z.coerce.number().min(0, "현재 저축액을 입력해주세요."),
  monthly_savings: z.coerce.number().min(1, "월 저축액을 입력해주세요."),
});

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const formData = await request.formData();
  const { success, data, error } = goalSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!success) {
    return { success: false, fieldErrors: error.flatten().fieldErrors };
  }

  const goal = await createSavingsGoal(client, {
    accountId: params.accountId,
    goalAmount: data!.goal_amount,
    currentAmount: data!.current_amount,
    monthlySavings: data!.monthly_savings,
    name: data!.name,
  });

  return redirect(`/account/${params.accountId}/goal`);
};

export default function GoalsPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const navigate = useNavigate();
  const { account } = loaderData;

  return (
    <main className="h-full min-h-screen space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>목표 설정</CardTitle>
          <CardDescription>
            목표 설정하기 위해 필요한 정보를 입력해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post" className="space-y-4">
            <FormInput
              name="name"
              label="목표 이름"
              type="text"
              placeholder="목표 이름을 입력해주세요."
            />
            {actionData && "fieldErrors" in actionData && (
              <span className="text-sm text-destructive">
                {actionData.fieldErrors.name}
              </span>
            )}
            <FormInput
              name="goal_amount"
              label="목표 금액"
              type="number"
              placeholder="목표 금액을 입력해주세요."
            />
            {actionData && "fieldErrors" in actionData && (
              <span className="text-sm text-destructive">
                {actionData.fieldErrors.goal_amount}
              </span>
            )}
            <FormInput
              name="current_amount"
              label="현재 저축액"
              type="number"
              placeholder="현재 저축액을 입력해주세요."
            />
            {actionData && "fieldErrors" in actionData && (
              <span className="text-sm text-destructive">
                {actionData.fieldErrors.current_amount}
              </span>
            )}
            <FormInput
              name="monthly_savings"
              label="월 저축액"
              type="number"
              placeholder="월 저축액"
            />
            {actionData && "fieldErrors" in actionData && (
              <span className="text-sm text-destructive">
                {actionData.fieldErrors.monthly_savings}
              </span>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(`/account/${account.account_id}/goal`)}
              >
                취소
              </Button>
              <Button type="submit">목표 설정</Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
