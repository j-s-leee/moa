import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { formatCurrency } from "~/lib/utils";

import { Progress } from "~/common/components/ui/progress";
import { data } from "react-router";
import type { Route } from "./+types/dashboard-page";
import { getBudgets } from "../manage/queries";
import { getSavings } from "../goal/queries";
import { makeSSRClient } from "~/supa-client";
import { Alert, AlertDescription } from "~/common/components/ui/alert";
import { getLoggedInUserId } from "../auth/queries";
import { getAccountByIdAndProfileId } from "../account/queries";

export const meta: Route.MetaFunction = () => {
  return [{ title: "홈 | MOA" }, { name: "description", content: "홈 페이지" }];
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const account = await getAccountByIdAndProfileId(
    client,
    params.accountId,
    userId
  );
  if (!account) {
    throw new Error("Account not found");
  }
  const savingPlans = await getSavings(client, params.accountId);
  const budgets = await getBudgets(client, params.accountId);

  return data(
    {
      savingPlans,
      account,
      budgets,
    },
    {
      headers,
    }
  );
};

export default function DashboardPage({ loaderData }: Route.ComponentProps) {
  const { account, savingPlans, budgets } = loaderData;

  const balance =
    account.total_income -
    account.total_expense -
    account.total_savings -
    (account.budget_amount ?? 0) / 12;

  return (
    <main className="h-full min-h-screen space-y-6">
      <Card className="p-6 rounded-2xl gap-2">
        <CardHeader className="px-0">
          <CardTitle className="text-lg flex items-center gap-2">
            재무 현황 요약
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-0">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-muted-foreground font-medium">월 총수입</div>
              <div className="font-bold text-primary">
                {formatCurrency(account.total_income)}
              </div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-muted-foreground font-medium">
                월 고정지출
              </div>
              <div className="font-bold text-primary">
                {formatCurrency(account.total_expense)}
              </div>
            </div>
          </div>
          <div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-muted-foreground flex justify-between items-center">
                <span className="font-medium text-sm">월 저축 계획</span>
                <span className="text-xs">내년 예산 준비금 + 저축</span>
              </div>
              <div className="font-bold text-muted-foreground flex justify-between items-center">
                <span className="font-bold text-primary">
                  {formatCurrency(
                    account.total_savings + (account.budget_amount ?? 0) / 12
                  )}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatCurrency((account.budget_amount ?? 0) / 12)} +{" "}
                  {formatCurrency(account.total_savings)}
                </span>
              </div>
            </div>
          </div>

          {balance !== 0 && (
            <Alert
              className={
                balance < 0
                  ? "border-destructive bg-destructive/10"
                  : "border-primary bg-muted/50"
              }
            >
              <AlertDescription
                className={balance < 0 ? "text-destructive" : "text-primary"}
              >
                저축 계획 후 여유 자금: {formatCurrency(Math.round(balance))}
                {balance < 0 && " (저축 계획을 조정해주세요)"}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* 비정기 지출 현황 */}
      <Card className="p-6 rounded-2xl gap-2">
        <CardHeader className="px-0">
          <CardTitle className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">비정기 지출 현황</h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="space-y-3">
            {budgets.map((budget) => {
              const usageRate =
                (budget.current_amount / budget.budget_amount) * 100;
              return (
                <div key={budget.budget_id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{budget.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(budget.current_amount)} /{" "}
                      {formatCurrency(budget.budget_amount)}
                    </span>
                  </div>
                  <Progress value={usageRate} />
                  <div className="text-xs text-muted-foreground">
                    잔여:{" "}
                    {formatCurrency(
                      budget.budget_amount - budget.current_amount
                    )}{" "}
                    ({Math.round(100 - usageRate)}%)
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      {/* 저축 계획 카드 */}
      {savingPlans && (
        <Card className="p-6 rounded-2xl gap-2">
          <CardHeader className="px-0">
            <CardTitle className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">저축 계획</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 space-y-3">
            {savingPlans.map((plan) => (
              <div key={plan.goal_id} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium">{plan.name}</div>
                  <div className="font-bold text-primary">
                    <span>{formatCurrency(plan.monthly_savings)} </span>
                    <span className="text-sm text-muted-foreground"> / 월</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  목표: {formatCurrency(plan.goal_amount)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </main>
  );
}
