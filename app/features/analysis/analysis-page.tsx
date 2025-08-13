import { formatCurrency } from "~/lib/utils";
import {
  initialMonthlyIncomes,
  initialMonthlyExpenses,
  irregularCategories,
  savingsGoal,
  calculateMonthlySavingsPotential,
  getCategorySpent,
  getTotalMonthlyIncome,
  calculateMonthsToGoal,
  getTotalIrregularBudget,
  getTotalMonthlyExpenses,
  initialIrregularExpenses,
} from "~/lib/testData";
import { Card } from "~/common/components/ui/card";
import { Progress } from "~/common/components/ui/progress";
import type { Route } from "./+types/analysis-page";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "Analysis | MOA" },
    { name: "description", content: "Analysis page" },
  ];
};

export const loader = async () => {
  return {
    initialMonthlyIncomes,
    initialMonthlyExpenses,
    irregularCategories,
    savingsGoal,
    initialIrregularExpenses,
  };
};

export default function AnalysisPage({ loaderData }: Route.ComponentProps) {
  const monthlySavingsPotential = calculateMonthlySavingsPotential(
    loaderData.initialMonthlyIncomes,
    loaderData.initialMonthlyExpenses,
    loaderData.irregularCategories
  );
  const totalMonthlyIncome = getTotalMonthlyIncome(
    loaderData.initialMonthlyIncomes
  );
  const totalMonthlyExpenses = getTotalMonthlyExpenses(
    loaderData.initialMonthlyExpenses
  );
  const monthlyIrregularBudget = getTotalIrregularBudget(
    loaderData.irregularCategories
  );
  const monthsToGoal = calculateMonthsToGoal(
    loaderData.savingsGoal,
    monthlySavingsPotential
  );

  return (
    <div className="space-y-6">
      {/* 재정 건강도 */}
      <Card className="p-6 rounded-2xl shadow-sm border">
        <h3 className="text-lg font-semibold">재정 건강도</h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">저축률</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {((monthlySavingsPotential / totalMonthlyIncome) * 100).toFixed(
                1
              )}
              %
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">고정지출 비율</span>
            <span className="font-semibold">
              {((totalMonthlyExpenses / totalMonthlyIncome) * 100).toFixed(1)}%
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">비정기지출 비율</span>
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              {((monthlyIrregularBudget / totalMonthlyIncome) * 100).toFixed(1)}
              %
            </span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
          <div className="text-sm text-emerald-600 dark:text-emerald-400">
            💡 <strong>권장 저축률은 20% 이상입니다.</strong>
            {(monthlySavingsPotential / totalMonthlyIncome) * 100 >= 20
              ? " 훌륭한 저축률을 유지하고 있어요!"
              : " 저축률을 높여보는 것을 고려해보세요."}
          </div>
        </div>
      </Card>

      {/* 월별 예상 저축 추이 */}
      <Card className="p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold">저축 목표 달성 추이</h3>

        <div className="space-y-3">
          {Array.from({ length: Math.min(12, monthsToGoal) }, (_, i) => {
            const month = i + 1;
            const projectedAmount =
              loaderData.savingsGoal.currentAmount +
              monthlySavingsPotential * month;
            const progressRate =
              (projectedAmount / loaderData.savingsGoal.targetAmount) * 100;

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
          {loaderData.irregularCategories.map((category) => {
            const categorySpent = getCategorySpent(
              category.id,
              loaderData.initialIrregularExpenses
            );
            const monthlyAverage = categorySpent / 7; // 7개월 기준 (가정)
            const projectedYearly = monthlyAverage * 12;
            const isOverBudget = projectedYearly > category.annualBudget;

            return (
              <div
                key={category.id}
                className="p-4 border rounded-lg dark:bg-muted-foreground/10"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-primary/90">
                    {category.name}
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
                      Math.abs(category.annualBudget - projectedYearly)
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
