import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Calendar, Plus, PiggyBank, TrendingUp } from "lucide-react";
import { cn, formatCurrency } from "~/lib/utils";
import {
  savingsGoal,
  irregularCategories,
  initialMonthlyIncomes,
  initialMonthlyExpenses,
  initialIrregularExpenses,
  getCategorySpent,
  calculateMonthlySavingsPotential,
  calculateMonthsToGoal,
} from "~/lib/testData";
import { Button } from "~/common/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/common/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/common/components/ui/select";
import { DatePicker } from "~/common/components/date-picker";
import { Progress } from "~/common/components/ui/progress";
import { FormInput } from "~/common/components/form-input";
import { Label } from "~/common/components/ui/label";
import type { MetaFunction } from "react-router";
import type { Route } from "./+types/dashboard-page";
import { getAccount, getBudgets } from "../manage/queries";
import { getSavingsGoal } from "../goal/queries";

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard | MOA" },
    { name: "description", content: "Dashboard page" },
  ];
};

export const loader = async ({ params }: Route.LoaderArgs) => {
  const account = await getAccount(params.accountId);
  const savingsGoal = await getSavingsGoal(params.accountId);
  const budgets = await getBudgets(params.accountId);

  return {
    savingsGoal,
    account,
    budgets,
  };
};

export default function DashboardPage({ loaderData }: Route.ComponentProps) {
  const { account, savingsGoal, budgets } = loaderData;

  return (
    <div className="space-y-6">
      {/* 저축 진행률 카드 */}
      <Card className="rounded-2xl shadow-lg gap-2 bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 border-none text-white">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">저축 목표 진행률</h2>
            <PiggyBank className="size-6" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="">현재 금액</span>
            <span className="text-xl font-bold">
              {formatCurrency(savingsGoal.current_amount)}
            </span>
          </div>
          <Progress
            value={(savingsGoal.current_amount / savingsGoal.goal_amount) * 100}
            className="h-3 [&>div]:bg-white bg-muted/20"
          />
          <div className="flex justify-between items-center text-sm">
            <span>
              {(
                (savingsGoal.current_amount / savingsGoal.goal_amount) *
                100
              ).toFixed(1)}
              % 달성
            </span>
            <span>목표: {formatCurrency(savingsGoal.goal_amount)}</span>
          </div>
        </CardContent>
      </Card>

      {/* 저축 계획 요약 */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 rounded-xl shadow-none border gap-2">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm text-muted-foreground">월 저축 가능</span>
          </div>
          <div className="text-lg font-bold">
            {formatCurrency(account.total_savings)}
          </div>
        </Card>
        <Card className="p-4 rounded-xl shadow-none border gap-2">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="size-4" />
            <span className="text-sm text-muted-foreground">목표 달성까지</span>
          </div>
          <div className="text-lg font-bold">
            {Math.ceil(
              (savingsGoal.goal_amount - savingsGoal.current_amount) /
                account.total_savings
            )}
            개월
          </div>
        </Card>
      </div>

      {/* 비정기 지출 현황 */}
      <Card className="p-6 rounded-2xl shadow-none border gap-2">
        <CardHeader className="px-0">
          <CardTitle className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">비정기 지출 현황</h2>
            <Dialog>
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
                            {irregularCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
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
            </Dialog>
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
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
