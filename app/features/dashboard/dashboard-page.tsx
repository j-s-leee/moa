import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { cn, formatCurrency } from "~/lib/utils";

import { Progress } from "~/common/components/ui/progress";
import { data, type MetaFunction } from "react-router";
import type { Route } from "./+types/dashboard-page";
import { getAccount, getBudgets } from "../manage/queries";
import { getSavings } from "../goal/queries";
import { makeSSRClient } from "~/supa-client";
import { Alert, AlertDescription } from "~/common/components/ui/alert";

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard | MOA" },
    { name: "description", content: "Dashboard page" },
  ];
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  const account = await getAccount(client, params.accountId);
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

  return (
    <main className="h-full min-h-screen space-y-6">
      <Card className="p-6 rounded-2xl shadow-none border gap-2">
        <CardHeader className="px-0">
          <CardTitle className="text-lg flex items-center gap-2">
            재무 현황 요약
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-0">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-green-600 font-medium">월 총수입</div>
              <div className="font-bold text-green-800">
                {formatCurrency(account.total_income)}
              </div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="text-red-600 font-medium">월 고정지출</div>
              <div className="font-bold text-red-800">
                {formatCurrency(account.total_expense)}
              </div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="text-yellow-600 font-medium">월 비정기지출</div>
              <div className="font-bold text-yellow-800">
                {formatCurrency(
                  Math.round(account.total_expense - account.total_budget / 12)
                )}
              </div>
            </div>
            <div
              className={`p-3 rounded-lg ${
                account.total_income -
                  account.total_expense -
                  account.total_budget / 12 >
                0
                  ? "bg-blue-50"
                  : "bg-red-50"
              }`}
            >
              <div
                className={`font-medium ${
                  account.total_income -
                    account.total_expense -
                    account.total_budget / 12 >
                  0
                    ? "text-blue-600"
                    : "text-red-600"
                }`}
              >
                잉여자금
              </div>
              <div
                className={`font-bold ${
                  account.total_income -
                    account.total_expense -
                    account.total_budget / 12 >
                  0
                    ? "text-blue-800"
                    : "text-red-800"
                }`}
              >
                {formatCurrency(
                  Math.round(
                    account.total_income -
                      account.total_expense -
                      account.total_budget / 12
                  )
                )}
              </div>
            </div>
          </div>

          {account.total_income -
            account.total_expense -
            account.total_budget / 12 !==
            0 && (
            <Alert
              className={
                account.total_income -
                  account.total_expense -
                  account.total_budget / 12 <
                0
                  ? "border-red-200 bg-red-50"
                  : "border-green-200 bg-green-50"
              }
            >
              <AlertDescription
                className={
                  account.total_income -
                    account.total_expense -
                    account.total_budget / 12 <
                  0
                    ? "text-red-700"
                    : "text-green-700"
                }
              >
                저축 계획 후 실제 잉여:{" "}
                {formatCurrency(
                  Math.round(
                    account.total_income -
                      account.total_expense -
                      account.total_budget / 12
                  )
                )}
                {account.total_income -
                  account.total_expense -
                  account.total_budget / 12 <
                  0 && " (저축 계획을 조정해주세요)"}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* 비정기 지출 현황 */}
      <Card className="p-6 rounded-2xl shadow-none border gap-2">
        <CardHeader className="px-0">
          <CardTitle className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">비정기 지출 현황</h2>
            {/* <Dialog>
              <form>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="icon" className="size-8">
                    <Plus className="size-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>비정기 지출 추가</DialogTitle>
                  <DialogDescription>
                    비정기 지출 내역을 추가할 수 있습니다.
                  </DialogDescription>

                  <div className="grid gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="name-1">카테고리</Label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="카테고리 선택" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px] overflow-y-auto">
                          <SelectGroup>
                            <SelectLabel>카테고리</SelectLabel>
                            {budgets.map((budget) => (
                              <SelectItem
                                key={budget.budget_id}
                                value={budget.budget_id.toString()}
                              >
                                {budget.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <FormInput
                      label="금액"
                      id="amount"
                      name="amount"
                      type="number"
                      placeholder="사용 금액"
                    />
                    <FormInput
                      label="설명"
                      id="description"
                      name="description"
                      placeholder="지출 내용"
                    />
                    <DatePicker
                      label="날짜"
                      id="date"
                      name="date"
                      placeholder="날짜 선택"
                    />
                  </div>
                  <DialogFooter className="grid grid-cols-2 gap-2">
                    <DialogClose asChild>
                      <Button variant="outline">취소</Button>
                    </DialogClose>
                    <Button type="submit">추가</Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog> */}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="space-y-3">
            {budgets.map((budget) => {
              const usageRate =
                (budget.current_amount / budget.budget_amount) * 100;
              const remaining = budget.budget_amount - budget.current_amount;
              return (
                <div key={budget.budget_id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{budget.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(budget.current_amount)} /{" "}
                      {formatCurrency(budget.budget_amount)}
                    </span>
                  </div>
                  <Progress
                    value={usageRate}
                    className={cn(
                      "h-2",
                      remaining >= 0
                        ? "[&>div]:bg-emerald-500 dark:[&>div]:bg-emerald-400"
                        : "[&>div]:bg-destructive dark:[&>div]:bg-destructive"
                    )}
                  />
                  <div className="text-xs text-gray-600">
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
        <Card className="p-6 rounded-2xl shadow-none border gap-2">
          <CardHeader className="px-0">
            <CardTitle className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">저축 계획</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 space-y-3">
            {savingPlans.map((plan) => (
              <div key={plan.goal_id} className="p-3 bg-muted rounded-lg">
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
