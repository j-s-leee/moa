import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
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
import { getExpenses, getTotalExpense } from "./queries";

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { accountId } = params;
  const expenses = await getExpenses(accountId);
  const totalExpense = await getTotalExpense(accountId);
  return { expenses, totalExpense, accountId };
};

interface Expense {
  transaction_id: string;
  note: string;
  amount: number;
  occurred_at: string;
}

export default function ExpensePage({ loaderData }: Route.ComponentProps) {
  const { expenses, totalExpense, accountId } = loaderData || {
    expenses: [],
    totalExpense: 0,
    accountId: "",
  };

  const deleteExpense = (id: string) => {
    console.log(id);
  };

  return (
    <Card className="rounded-2xl shadow-none border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            총 고정 지출 : {formatCurrency(totalExpense)}
          </h3>
          <Dialog>
            <form action={`/account/${accountId}/manage/expense`}>
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
        {expenses &&
          expenses.map((expense: Expense) => (
            <div
              key={expense.transaction_id}
              className="flex items-center justify-between p-3 rounded-lg border-none bg-muted/50 dark:bg-muted/20"
            >
              <div>
                <div className="font-medium">{expense.note}</div>
                <div className="text-sm text-muted-foreground">
                  {formatCurrency(expense.amount)}
                </div>
              </div>
              <button
                onClick={() => deleteExpense(expense.transaction_id)}
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
