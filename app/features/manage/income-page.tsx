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
import type { Route } from "./+types/income-page";
import { formatCurrency } from "~/lib/utils";
import type { MonthlyIncome } from "~/lib/testData";

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { householdId } = params;
  const monthlyIncomes = [
    {
      id: "1",
      name: "월급",
      amount: 1000000,
    },
    {
      id: "2",
      name: "알바",
      amount: 100000,
    },
  ];
  const totalMonthlyIncome = monthlyIncomes.reduce(
    (acc, income) => acc + income.amount,
    0
  );
  return { monthlyIncomes, totalMonthlyIncome, householdId };
};

export default function IncomePage({ loaderData }: Route.ComponentProps) {
  const { monthlyIncomes, totalMonthlyIncome, householdId } = loaderData || {
    monthlyIncomes: [],
    totalMonthlyIncome: 0,
    householdId: "",
  };

  const deleteIncome = (id: string) => {
    console.log(id);
  };

  return (
    <Card className="rounded-2xl shadow-none border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            총 고정 수입 : {formatCurrency(totalMonthlyIncome)}
          </h3>
          <Dialog>
            <form action={`/household/${householdId}/manage/income`}>
              <DialogTrigger asChild>
                <Button variant="secondary" size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>월 수입 추가</DialogTitle>
                <DialogDescription>
                  월 수입 내역을 추가할 수 있습니다.
                </DialogDescription>

                <div className="grid gap-4">
                  <FormInput
                    label="수입 항목명"
                    id="name"
                    name="name"
                    type="text"
                    placeholder="수입 항목명"
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
        {monthlyIncomes &&
          monthlyIncomes.map((income: MonthlyIncome) => (
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
      </CardContent>
    </Card>
  );
}
