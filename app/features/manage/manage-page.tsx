import { cn, formatCurrency } from "~/lib/utils";
import { Plus, Trash2, Wallet } from "lucide-react";
import { useState } from "react";
import {
  initialMonthlyIncomes,
  initialMonthlyExpenses,
  initialIrregularExpenses,
  irregularCategories,
  getTotalMonthlyIncome,
  getTotalMonthlyExpenses,
  type MonthlyIncome,
  type MonthlyExpense,
  getCategorySpent,
  calculateMonthlySavingsPotential,
  getTotalIrregularBudget,
} from "~/lib/testData";
import { generateId } from "~/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";
import { Progress } from "~/common/components/ui/progress";
import { Separator } from "~/common/components/ui/separator";

import { Link, useParams, type MetaFunction } from "react-router";
import type { Route } from "./+types/manage-page";

export const meta: MetaFunction = () => {
  return [
    { title: "Manage | MOA" },
    { name: "description", content: "Manage page" },
  ];
};

export const loader = async () => {
  return {
    initialMonthlyIncomes,
    initialMonthlyExpenses,
    irregularCategories,
    initialIrregularExpenses,
  };
};

export default function ManagePage({ loaderData }: Route.ComponentProps) {
  const { householdId } = useParams();
  const [monthlyIncomes, setMonthlyIncomes] = useState<MonthlyIncome[]>(
    loaderData.initialMonthlyIncomes
  );
  const [monthlyExpenses, setMonthlyExpenses] = useState<MonthlyExpense[]>(
    loaderData.initialMonthlyExpenses
  );

  const [newIncomeForm, setNewIncomeForm] = useState({
    name: "",
    amount: "",
  });
  const [newExpenseForm, setNewExpenseForm] = useState({
    name: "",
    amount: "",
  });
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const addIncome = () => {
    if (newIncomeForm.name && newIncomeForm.amount) {
      const newIncome: MonthlyIncome = {
        id: generateId(),
        name: newIncomeForm.name,
        amount: parseInt(newIncomeForm.amount),
        effectiveFrom: new Date().toISOString().split("T")[0],
      };
      loaderData.initialMonthlyIncomes.push(newIncome);
      setNewIncomeForm({ name: "", amount: "" });
      setShowIncomeForm(false);
    }
  };

  const addExpense = () => {
    if (newExpenseForm.name && newExpenseForm.amount) {
      const newExpense: MonthlyExpense = {
        id: generateId(),
        name: newExpenseForm.name,
        amount: parseInt(newExpenseForm.amount),
        effectiveFrom: new Date().toISOString().split("T")[0],
      };
      loaderData.initialMonthlyExpenses.push(newExpense);
      setNewExpenseForm({ name: "", amount: "" });
      setShowExpenseForm(false);
    }
  };

  const deleteIncome = (id: string) => {
    setMonthlyIncomes(monthlyIncomes.filter((income) => income.id !== id));
  };

  const deleteExpense = (id: string) => {
    setMonthlyExpenses(monthlyExpenses.filter((expense) => expense.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* 월 저축 가능액 하이라이트 */}
      <Card className="p-6 rounded-2xl shadow-lg border-none gap-2 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-1">월 저축 가능액</h2>
            <div className="text-3xl font-bold">
              {formatCurrency(
                calculateMonthlySavingsPotential(
                  loaderData.initialMonthlyIncomes,
                  loaderData.initialMonthlyExpenses,
                  loaderData.irregularCategories
                )
              )}
            </div>
          </div>
          <Wallet className="w-8 h-8" />
        </div>
      </Card>

      {/* 월 수입 관리 */}
      <Card className="rounded-2xl shadow-none border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">월 수입</h3>
            <Button
              onClick={() => setShowIncomeForm(!showIncomeForm)}
              variant="secondary"
              size="icon"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>

        {showIncomeForm && (
          <div className="mb-4 p-4 rounded-xl">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="수입 항목명"
                value={newIncomeForm.name}
                onChange={(e) =>
                  setNewIncomeForm({ ...newIncomeForm, name: e.target.value })
                }
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="number"
                placeholder="금액"
                value={newIncomeForm.amount}
                onChange={(e) =>
                  setNewIncomeForm({
                    ...newIncomeForm,
                    amount: e.target.value,
                  })
                }
                className="w-full p-3 border rounded-lg"
              />
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => setShowIncomeForm(false)}
                  variant="outline"
                >
                  취소
                </Button>
                <Button onClick={addIncome}>추가</Button>
              </div>
            </div>
          </div>
        )}

        <CardContent className="space-y-3">
          {monthlyIncomes.map((income) => (
            <div
              key={income.id}
              className="flex items-center justify-between p-3 rounded-lg border-none bg-muted/50 dark:bg-muted/20"
            >
              <div>
                <div className="font-medium">{income.name}</div>
                <div className="text-sm text-muted-foreground">
                  {formatCurrency(income.amount)}
                </div>
              </div>
              <button
                onClick={() => deleteIncome(income.id)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <Separator />
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-2">
          <span className="font-semibold">총 수입</span>
          <span className="font-bold text-primary">
            {formatCurrency(getTotalMonthlyIncome(monthlyIncomes))}
          </span>
        </CardFooter>
      </Card>

      {/* 월 고정지출 관리 */}
      <Card className="rounded-2xl shadow-none border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">월 고정지출</h3>
            <Button
              onClick={() => setShowExpenseForm(!showExpenseForm)}
              variant="secondary"
              size="icon"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>

        {showExpenseForm && (
          <div className="mb-4 p-4 rounded-xl">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="지출 항목명"
                value={newExpenseForm.name}
                onChange={(e) =>
                  setNewExpenseForm({
                    ...newExpenseForm,
                    name: e.target.value,
                  })
                }
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="number"
                placeholder="금액"
                value={newExpenseForm.amount}
                onChange={(e) =>
                  setNewExpenseForm({
                    ...newExpenseForm,
                    amount: e.target.value,
                  })
                }
                className="w-full p-3 border rounded-lg"
              />
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => setShowExpenseForm(false)}
                  variant="outline"
                >
                  취소
                </Button>
                <Button onClick={addExpense} variant="default">
                  추가
                </Button>
              </div>
            </div>
          </div>
        )}

        <CardContent className="space-y-3">
          {monthlyExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-3 rounded-lg border-none bg-muted/50 dark:bg-muted/20"
            >
              <div>
                <div className="font-medium">{expense.name}</div>
                <div className="text-sm text-muted-foreground">
                  {formatCurrency(expense.amount)}
                </div>
              </div>
              <button
                onClick={() => deleteExpense(expense.id)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <Separator />
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-2">
          <span className="font-semibold">총 지출</span>
          <span className="font-bold text-destructive">
            {formatCurrency(getTotalMonthlyExpenses(monthlyExpenses))}
          </span>
        </CardFooter>
      </Card>

      {/* 비정기지출 예산 관리 */}
      <Card className="rounded-2xl shadow-none border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">연간 비정기지출 예산</h3>
            <Link to={`/household/${householdId}/manage/budget/add`}>
              <Button variant="secondary" size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {loaderData.irregularCategories.map((category) => {
            const categorySpent = getCategorySpent(
              category.id,
              loaderData.initialIrregularExpenses
            );
            const remaining = category.annualBudget - categorySpent;
            const usageRate = (categorySpent / category.annualBudget) * 100;

            return (
              <Card
                key={category.id}
                className="w-full p-4 shadow-none rounded-lg text-left border-none bg-muted"
              >
                <Link
                  to={`/household/${householdId}/manage/budget/${category.id}`}
                >
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(categorySpent)} /{" "}
                        {formatCurrency(category.annualBudget)}
                      </span>
                    </div>
                    <Progress
                      value={usageRate}
                      className={cn(
                        "mb-2",
                        remaining >= 0
                          ? "[&>div]:bg-emerald-500 dark:[&>div]:bg-emerald-400"
                          : "[&>div]:bg-destructive dark:[&>div]:bg-destructive"
                      )}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{usageRate.toFixed(1)}% 사용</span>
                      <span
                        className={
                          remaining >= 0 ? "text-primary" : "text-destructive"
                        }
                      >
                        {remaining >= 0 ? "잔여" : "초과"}:{" "}
                        {formatCurrency(Math.abs(remaining))}
                      </span>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
          <Separator />
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-2">
          <span className="font-semibold">월 평균 예산</span>
          <span className="font-bold text-primary">
            {formatCurrency(
              getTotalIrregularBudget(loaderData.irregularCategories) / 12
            )}
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
