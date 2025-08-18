import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
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
import { getIncomes, getTotalIncome } from "./queries";
import { Link } from "react-router";

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { accountId } = params;
  const incomes = await getIncomes(accountId);
  const totalIncome = await getTotalIncome(accountId);

  return { incomes, accountId, totalIncome };
};

interface Income {
  transaction_id: string;
  note: string;
  amount: number;
  occurred_at: string;
}

export default function IncomePage({ loaderData }: Route.ComponentProps) {
  const { incomes = [], accountId = "", totalIncome = 0 } = loaderData || {};
  const deleteIncome = (id: string) => {
    console.log(id);
  };

  return (
    <main className="px-4 py-6 h-full min-h-screen">
      <div className="flex items-center gap-2 mb-4">
        <Link to={`/account/${accountId}/manage`}>
          <ChevronLeft className="size-6" />
        </Link>
        <h3 className="font-semibold text-lg">수입 내역</h3>
      </div>
      <Card className="rounded-2xl shadow-none border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              총 고정 수입 : {formatCurrency(totalIncome)}
            </h3>
            <Dialog>
              <form action={`/account/${accountId}/manage/income`}>
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
          {incomes &&
            incomes.map((income: Income) => (
              <div
                key={income.transaction_id}
                className="flex items-center justify-between p-3 rounded-lg border-none bg-muted/50 dark:bg-muted/20"
              >
                <div>
                  <div className="font-medium">{income.note}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(income.amount)}
                  </div>
                </div>
                <button
                  onClick={() => deleteIncome(income.transaction_id)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
        </CardContent>
      </Card>
    </main>
  );
}
