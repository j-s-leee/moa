import { formatCurrency } from "~/lib/utils";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "~/common/components/ui/card";
import { Progress } from "~/common/components/ui/progress";
import type { Route } from "./+types/analysis-page";
import type { MetaFunction } from "react-router";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "~/common/components/ui/chart";
import { Pie, PieChart } from "recharts";
import { getAccount, getBudgets } from "../manage/queries";
import { getSavingsGoal } from "../goal/queries";
import { DateTime } from "luxon";

export const meta: MetaFunction = () => {
  return [
    { title: "Analysis | MOA" },
    { name: "description", content: "Analysis page" },
  ];
};

export const loader = async ({ params }: Route.LoaderArgs) => {
  const account = await getAccount(params.accountId);
  const budgets = await getBudgets(params.accountId);
  const goals = await getSavingsGoal(params.accountId);
  return {
    account,
    budgets,
    goals,
  };
};

export default function AnalysisPage({ loaderData }: Route.ComponentProps) {
  const { account, budgets, goals } = loaderData;
  const totalBudget = Math.round(
    budgets.reduce((acc, budget) => acc + budget.budget_amount, 0) / 12
  );

  const monthsToGoal = Math.ceil(
    (goals.goal_amount - goals.current_amount) / account.total_savings
  );

  const chartData = [
    {
      label: "expense",
      value: account.total_expense,
      fill: "var(--chart-1)",
    },
    {
      label: "irregular",
      value: totalBudget,
      fill: "var(--chart-2)",
    },
    {
      label: "savings",
      value: account.total_savings,
      fill: "var(--chart-3)",
    },
  ];
  const chartConfig = {
    expense: {
      color: "hsl(var(--chart-1))",
      label: "고정지출",
    },
    irregular: {
      color: "var(--chart-2)",
      label: "비정기지출",
    },
    savings: {
      color: "var(--chart-3)",
      label: "저축",
    },
  } satisfies ChartConfig;

  return (
    <div className="space-y-4">
      <Card className="flex flex-col gap-2">
        <CardHeader className="items-center pb-0">
          <CardTitle>재정 건강도</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="label" />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent labelKey="label" hideLabel />}
              />
              <ChartLegend
                content={<ChartLegendContent nameKey="label" />}
                className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
            <div className="text-sm text-emerald-600 dark:text-emerald-400">
              💡 <strong>권장 저축률은 20% 이상입니다.</strong>
              {(account.total_savings / account.total_income) * 100 >= 20
                ? " 훌륭한 저축률을 유지하고 있어요!"
                : " 저축률을 높여보는 것을 고려해보세요."}
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* 월별 예상 저축 추이 */}
      <Card className="p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold">저축 목표 달성 추이</h3>

        <div className="space-y-3">
          {Array.from({ length: Math.min(12, monthsToGoal) }, (_, i) => {
            const month = i + 1;
            const projectedAmount =
              goals.current_amount +
              (account.total_income - account.total_expense) * month;
            const progressRate = (projectedAmount / goals.goal_amount) * 100;

            return (
              <div key={month} className="flex items-center space-x-3">
                <div className="w-12 text-sm">{month}개월</div>
                <div className="flex-1">
                  <Progress
                    value={progressRate}
                    className="[&>div]:bg-emerald-500 dark:[&>div]:bg-emerald-400"
                  />
                </div>
                <div className="w-20 text-sm text-right">
                  {formatCurrency(projectedAmount)}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 비정기 지출 분석 */}
      <Card className="p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold">비정기 지출 분석</h3>

        <div className="space-y-4">
          {budgets.map((budget) => {
            const categorySpent = budget.current_amount;
            const monthlyAverage = categorySpent / DateTime.now().month;
            const projectedYearly = monthlyAverage * 12;
            const isOverBudget = projectedYearly > budget.budget_amount;

            return (
              <div
                key={budget.budget_id}
                className="p-4 border rounded-lg dark:bg-muted-foreground/10"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-primary/90">
                    {budget.name}
                  </span>
                  <span
                    className={`text-sm ${
                      isOverBudget
                        ? "text-red-600 dark:text-red-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {isOverBudget ? "예산 초과 예상" : "예산 내 관리"}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>현재 사용: {formatCurrency(categorySpent)}</div>
                  <div>월 평균: {formatCurrency(monthlyAverage)}</div>
                  <div>연말 예상: {formatCurrency(projectedYearly)}</div>
                  <div
                    className={
                      isOverBudget
                        ? "text-red-600 dark:text-red-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    }
                  >
                    예상 {isOverBudget ? "초과" : "절약"}:{" "}
                    {formatCurrency(
                      Math.abs(budget.budget_amount - projectedYearly)
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
