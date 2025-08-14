import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Separator } from "~/common/components/ui/separator";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "~/common/components/ui/dialog";
import { FormInput } from "~/common/components/form-input";
import type { Route } from "./+types/expense-page";
import { formatCurrency } from "~/lib/utils";
import type { MonthlyExpense, MonthlyIncome } from "~/lib/testData";
import { useParams } from "react-router";

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { householdId } = params;
  const monthlyExpenses = [
    {
      id: "1",
      name: "월급",
      amount: 1000000,
    },
  ];
  const totalMonthlyExpense = monthlyExpenses.reduce(
    (acc, expense) => acc + expense.amount,
    0
  );
  return { monthlyExpenses, totalMonthlyExpense, householdId };
};

export default function ExpensePage({ loaderData }: Route.ComponentProps) {
  const { monthlyExpenses, totalMonthlyExpense, householdId } = loaderData || {
    monthlyExpenses: [],
    totalMonthlyExpense: 0,
    householdId: "",
  };

  const deleteExpense = (id: string) => {
    console.log(id);
  };

  return (
    <Card className="rounded-2xl shadow-none border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            총 고정 지출 : {formatCurrency(totalMonthlyExpense)}
          </h3>
          <Dialog>
            <form action={`/household/${householdId}/manage/expense`}>
              <DialogTrigger asChild>
                <Button variant="secondary" size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>월 지출 추가</DialogTitle>
                <DialogDescription>
                  월 지출 내역을 추가할 수 있습니다.
                </DialogDescription>

                <div className="grid gap-4">
                  <FormInput
                    label="지출 내용"
                    id="content"
                    name="content"
                    type="text"
                    placeholder="지출 내용"
                  />
                  <FormInput
                    label="금액"
                    id="amount"
                    name="amount"
                    type="number"
                    placeholder="금액"
                  />
                </div>
                <DialogFooter>
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

      <CardContent className="space-y-3">
        {monthlyExpenses &&
          monthlyExpenses.map((expense: MonthlyExpense) => (
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
      </CardContent>
    </Card>
  );
}
