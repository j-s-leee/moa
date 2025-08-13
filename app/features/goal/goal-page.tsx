import { useState } from "react";
import { Target } from "lucide-react";
import {
  initialMonthlyExpenses,
  irregularCategories,
  initialMonthlyIncomes,
  savingsGoal,
} from "~/lib/testData";
import { formatCurrency } from "~/lib/utils";
import { calculateMonthlySavingsPotential } from "~/lib/testData";
import { Card } from "~/common/components/ui/card";
import { FormInput } from "~/common/components/form-input";
import { DatePicker } from "~/common/components/date-picker";
import type { Route } from "./+types/goal-page";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "Goals | MOA" },
    { name: "description", content: "Goals page" },
  ];
};

export const loader = async () => {
  return {
    initialMonthlyIncomes,
    initialMonthlyExpenses,
    irregularCategories,
    savingsGoal,
  };
};

export default function GoalsPage({ loaderData }: Route.ComponentProps) {
  const [editGoal, setEditGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(loaderData.savingsGoal);

  const monthlySavingsPotential = calculateMonthlySavingsPotential(
    loaderData.initialMonthlyIncomes,
    loaderData.initialMonthlyExpenses,
    loaderData.irregularCategories
  );
  const remainingGoal =
    loaderData.savingsGoal.targetAmount - loaderData.savingsGoal.currentAmount;
  const monthsToGoal = Math.ceil(remainingGoal / monthlySavingsPotential);

  const saveGoal = () => {
    setEditGoal(false);
  };

  const cancelEdit = () => {
    setTempGoal(loaderData.savingsGoal);
    setEditGoal(false);
  };

  return (
    <div className="space-y-6">
      {/* 목표 설정 카드 */}
      <Card className="bg-gradient-to-br border-none from-indigo-500 dark:from-indigo-900 to-purple-600 dark:to-purple-900 text-white p-6 gap-4 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">저축 목표</h2>
          <Target className="w-6 h-6" />
        </div>

        {!editGoal ? (
          <div className="space-y-4">
            <div>
              <div className="text-sm text-indigo-100 mb-1">목표 금액</div>
              <div className="text-2xl font-bold">
                {formatCurrency(loaderData.savingsGoal.targetAmount)}
              </div>
            </div>
            <div>
              <div className="text-sm text-indigo-100 mb-1">현재 저축액</div>
              <div className="text-xl font-semibold">
                {formatCurrency(loaderData.savingsGoal.currentAmount)}
              </div>
            </div>
            {loaderData.savingsGoal.deadline && (
              <div>
                <div className="text-sm text-indigo-100 mb-1">
                  목표 달성 희망일
                </div>
                <div className="text-lg">
                  {new Date(loaderData.savingsGoal.deadline).toLocaleDateString(
                    "ko-KR"
                  )}
                </div>
              </div>
            )}
            <button
              onClick={() => setEditGoal(true)}
              className="w-full bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg transition-colors"
            >
              수정하기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <FormInput
                label="목표 금액"
                type="number"
                value={tempGoal.targetAmount}
                onChange={(e) =>
                  setTempGoal({
                    ...tempGoal,
                    targetAmount: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full"
              />
            </div>
            <div>
              <FormInput
                label="현재 저축액"
                type="number"
                value={tempGoal.currentAmount}
                onChange={(e) =>
                  setTempGoal({
                    ...tempGoal,
                    currentAmount: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full"
              />
            </div>
            <div>
              <DatePicker
                label="목표 달성 예정일 (선택사항)"
                id="deadline"
                name="deadline"
                placeholder="목표 달성 예정일 (선택사항)"
                bgColor="bg-transparent"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={saveGoal}
                className="flex-1 bg-white text-indigo-600 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                저장
              </button>
              <button
                onClick={cancelEdit}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* 목표 달성 계획 */}
      <Card className="p-6 rounded-2xl shadow-sm border">
        <h3 className="text-lg font-semibold">목표 달성 계획</h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <span className="text-primary/90">월 저축 가능액</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {formatCurrency(monthlySavingsPotential)}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <span className="">남은 목표 금액</span>
            <span className="font-semibold text-orange-600 dark:text-orange-400">
              {formatCurrency(remainingGoal)}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <span className="text-primary/90">예상 달성 기간</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {monthsToGoal}개월
            </span>
          </div>
        </div>
      </Card>

      {/* 절약 시뮬레이터 */}
      <Card className="p-6 rounded-2xl shadow-sm border">
        <h3 className="text-lg font-semibold">절약 시뮬레이터</h3>

        <div className="space-y-3">
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-muted-foreground">
                월 10만원 절약 시
              </span>
              <span className="font-semibold">
                {Math.ceil(remainingGoal / (monthlySavingsPotential + 100000))}
                개월
              </span>
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400">
              {monthsToGoal -
                Math.ceil(remainingGoal / (monthlySavingsPotential + 100000))}
              개월 단축
            </div>
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-muted-foreground">
                월 20만원 절약 시
              </span>
              <span className="font-semibold">
                {Math.ceil(remainingGoal / (monthlySavingsPotential + 200000))}
                개월
              </span>
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400">
              {monthsToGoal -
                Math.ceil(remainingGoal / (monthlySavingsPotential + 200000))}
              개월 단축
            </div>
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-muted-foreground">
                월 50만원 절약 시
              </span>
              <span className="font-semibold">
                {Math.ceil(remainingGoal / (monthlySavingsPotential + 500000))}
                개월
              </span>
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400">
              {monthsToGoal -
                Math.ceil(remainingGoal / (monthlySavingsPotential + 500000))}
              개월 단축
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
