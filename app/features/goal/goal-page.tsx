import { Plus, Target, Trash2 } from "lucide-react";

import { formatCurrency } from "~/lib/utils";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import type { Route } from "./+types/goal-page";
import { data, Link, useFetcher, type MetaFunction } from "react-router";
import { getSavings } from "./queries";
import { makeSSRClient } from "~/supa-client";
import { Button } from "~/common/components/ui/button";
import { z } from "zod";
import { createSavingsGoal } from "./mutations";
import { getLoggedInUserId } from "../auth/queries";
import { getAccountByIdAndProfileId } from "../account/queries";

export const meta: MetaFunction = () => {
  return [
    { title: "Goals | MOA" },
    { name: "description", content: "Goals page" },
  ];
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const [savingsPlans, account] = await Promise.all([
    getSavings(client, params.accountId),
    getAccountByIdAndProfileId(client, params.accountId, userId),
  ]);
  if (!account) {
    throw new Error("Account not found");
  }
  if (!savingsPlans) {
    throw new Error("Savings plans not found");
  }

  return data(
    {
      savingsPlans,
      account,
    },
    {
      headers,
    }
  );
};

const goalSchema = z.object({
  name: z.string(),
  goal_amount: z.coerce.number(),
  current_amount: z.coerce.number(),
  monthly_savings: z.coerce.number(),
});

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const formData = await request.formData();
  const { success, data, error } = goalSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!success) {
    return { success: false, message: error.message };
  }

  const goal = await createSavingsGoal(client, {
    accountId: params.accountId,
    goalAmount: data!.goal_amount,
    currentAmount: data!.current_amount,
    monthlySavings: data!.monthly_savings,
    name: data!.name,
  });

  return { success: true, message: "목표 설정 완료" };
};

export default function GoalsPage({ loaderData }: Route.ComponentProps) {
  const { savingsPlans, account } = loaderData;
  const fetcher = useFetcher();

  return (
    <main className="h-full min-h-screen space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            저축 계획
          </CardTitle>
          <CardDescription>저축 계획을 세워보세요.</CardDescription>
          <CardAction>
            <Button asChild>
              <Link to={`/account/${account.account_id}/goal/edit`}>
                <Plus className="w-4 h-4" />
              </Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg p-2 bg-muted/50 flex justify-between items-center">
            <span>현재 여유 자금: </span>
            <span className="font-bold text-primary">
              {formatCurrency(
                account.total_income -
                  account.total_expense -
                  account.total_savings -
                  (account.budget_amount ?? 0) / 12
              )}
            </span>
          </div>
          <div className="space-y-3">
            {account.budget_amount !== null && account.budget_amount !== 0 && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium">내년 예산 준비금</div>
                    <div className="text-sm text-muted-foreground">
                      목표: {formatCurrency(account.budget_amount)}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">월 저축액</span>
                  <span className="font-bold text-primary">
                    {formatCurrency(account.budget_amount / 12)}
                  </span>
                </div>
              </div>
            )}
            {savingsPlans.map((plan) => (
              <div key={plan.goal_id} className="p-3 bg-muted rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium">{plan.name}</div>
                    <div className="text-sm text-muted-foreground">
                      목표: {formatCurrency(plan.goal_amount)}
                    </div>
                  </div>
                  <fetcher.Form
                    method="post"
                    action={`/account/${account.account_id}/goal/${plan.goal_id}/delete`}
                  >
                    <Button size="sm" variant="ghost" type="submit">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </fetcher.Form>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">월 저축액</span>
                  <span className="font-bold text-primary">
                    {formatCurrency(plan.monthly_savings)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  목표 달성까지:{" "}
                  {Math.ceil(
                    (plan.goal_amount - plan.current_amount) /
                      plan.monthly_savings
                  )}
                  개월
                </div>
              </div>
            ))}
            <div className="pt-2 border-t">
              <div className="flex justify-between font-bold">
                <span>총 월 저축</span>
                <span className="text-primary">
                  {formatCurrency(
                    account.total_savings + (account.budget_amount ?? 0) / 12
                  )}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
