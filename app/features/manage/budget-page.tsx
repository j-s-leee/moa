import { Card, CardContent } from "~/common/components/ui/card";
import { data, isRouteErrorResponse, Link } from "react-router";
import { cn, formatCurrency } from "~/lib/utils";
import { Progress } from "~/common/components/ui/progress";
import { Button } from "~/common/components/ui/button";
import { FormInput } from "~/common/components/form-input";
import { DatePicker } from "~/common/components/date-picker";
import { ChevronLeft, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "~/common/components/ui/dialog";
import type { Route } from "./+types/budget-page";
import { z } from "zod";
import {
  getBudget,
  getBudgetExpenses,
  getBudgetExpensesCount,
} from "./queries";
import BudgetExpensePagination from "~/common/components/budget-expense-pagination";
import { makeSSRClient } from "~/supa-client";

export const meta: Route.MetaFunction = ({ data }: Route.MetaArgs) => {
  return [
    { title: `${data?.budget.name || "Budget"} | MOA` },
    { name: "description", content: "Budget page" },
  ];
};

const paramSchema = z.object({
  budgetId: z.coerce.number(),
  accountId: z.string(),
});

const searchParamsSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
});

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const { success, data: parsedParams } = paramSchema.safeParse(params);
  const { success: searchParamsSuccess, data: parsedSearchParams } =
    searchParamsSchema.safeParse(Object.fromEntries(url.searchParams));
  if (!success || !searchParamsSuccess) {
    throw data(
      {
        error_code: "INVALID_PARAMS",
        error_message: "Invalid Params",
      },
      { status: 400 }
    );
  }
  const { budgetId, accountId } = parsedParams;
  const { page } = parsedSearchParams;
  const { client, headers } = makeSSRClient(request);
  const budget = await getBudget(client, budgetId);
  const expenses = await getBudgetExpenses({ client, budgetId, page });
  const totalPages = await getBudgetExpensesCount({ client, budgetId });
  return data(
    {
      budgetId,
      accountId,
      budget,
      page,
      expenses,
      totalPages,
    },
    {
      headers,
    }
  );
};

export default function BudgetPage({ loaderData }: Route.ComponentProps) {
  const { budget, expenses, page, totalPages, accountId } = loaderData;
  const usageRate = (budget.current_amount / budget.budget_amount) * 100;
  const remaining = budget.budget_amount - budget.current_amount;

  return (
    <main className="px-4 py-6 h-screen flex flex-col">
      <div className="flex flex-col space-y-4 flex-1 min-h-0">
        <div className="flex items-center gap-2">
          <Link to={`/account/${accountId}/manage`}>
            <ChevronLeft className="size-6" />
          </Link>
          <h3 className="font-semibold text-lg">{budget.name} 지출 내역</h3>
        </div>
        <div className="flex flex-col space-y-4 flex-1 min-h-0">
          <Card className="w-full p-4 rounded-lg text-left border">
            <CardContent className="p-0">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{budget.name}</span>
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(budget.current_amount)} /{" "}
                  {formatCurrency(budget.budget_amount)}
                </span>
              </div>
              <Progress
                value={usageRate}
                className={cn(
                  "mb-2",
                  remaining >= 0
                    ? "[&>div]:bg-emerald-500 dark:[&>div]:bg-emerald-600"
                    : "[&>div]:bg-destructive"
                )}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{usageRate.toFixed(1)}% 사용</span>
                <span
                  className={
                    remaining >= 0
                      ? "text-emerald-500 dark:text-emerald-600"
                      : "text-destructive"
                  }
                >
                  {remaining >= 0 ? "잔여" : "초과"}:{" "}
                  {formatCurrency(Math.abs(remaining))}
                </span>
              </div>
            </CardContent>
          </Card>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">지출 추가</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>지출 추가</DialogTitle>
              <DialogDescription>
                지출 내역을 추가할 수 있습니다.
              </DialogDescription>
              <form className="flex flex-col gap-2">
                <FormInput label="금액" type="number" name="amount" />
                <FormInput label="설명" type="text" name="description" />
                <DatePicker
                  label="날짜"
                  id="date"
                  name="date"
                  placeholder="날짜 선택"
                />
                <DialogFooter className="mt-4">
                  <div className="grid grid-cols-2 gap-2">
                    <DialogClose asChild>
                      <Button variant="outline">취소</Button>
                    </DialogClose>
                    <Button>추가</Button>
                  </div>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <div className="flex-1 flex flex-col min-h-0">
            <div className="space-y-3 overflow-auto flex-1">
              {expenses.map((expense) => (
                <div
                  key={expense.budget_expense_id}
                  className="flex items-center justify-between p-3 rounded-lg border-none bg-muted/60 dark:bg-muted/80"
                >
                  <div>
                    <div className="font-medium">{expense.note}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(expense.amount)} •{" "}
                      {new Date(expense.occurred_at).toLocaleDateString(
                        "ko-KR"
                      )}
                    </div>
                  </div>
                  <button onClick={() => {}} className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <BudgetExpensePagination totalPages={totalPages} />
          </div>
        </div>
      </div>
    </main>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        {error.data.error_message} {error.data.error_code}
      </div>
    );
  }
  if (error instanceof Error) {
    return <div>{error.message}</div>;
  }
  return <div>An unknown error occurred</div>;
}
