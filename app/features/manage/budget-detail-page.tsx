import { Card, CardContent } from "~/common/components/ui/card";
import {
  data,
  Form,
  isRouteErrorResponse,
  Link,
  useFetcher,
} from "react-router";
import { cn, formatCurrency } from "~/lib/utils";
import { Progress } from "~/common/components/ui/progress";
import { Button } from "~/common/components/ui/button";
import { DatePicker } from "~/common/components/date-picker";
import { ChevronLeft, Trash2 } from "lucide-react";
import type { Route } from "./+types/budget-detail-page";
import { z } from "zod";
import {
  getBudget,
  getBudgetExpenses,
  getBudgetExpensesCount,
} from "./queries";
import BudgetExpensePagination from "~/common/components/budget-expense-pagination";
import { makeSSRClient, type Database } from "~/supa-client";
import { Input } from "~/common/components/ui/input";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createBudgetExpense, deleteBudgetExpense } from "./mutations";
import { useEffect, useRef } from "react";

export const meta: Route.MetaFunction = ({ data }: Route.MetaArgs) => {
  return [
    { title: `${data?.budget.name || "Budget"} | MOA` },
    { name: "description", content: "Budget page" },
  ];
};

const paramSchema = z.object({
  budgetId: z.coerce.number(),
  accountId: z.string().uuid(),
});

const searchParamsSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
});

const createSchema = z.object({
  amount: z.coerce.number().min(1, "금액을 입력해주세요."),
  note: z.string().min(1, "설명을 입력해주세요."),
  date: z.string().min(1, "날짜를 선택해주세요."),
});

const deleteSchema = z.object({
  budgetExpenseId: z.coerce.number(),
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

const handlePost = async ({
  client,
  formData,
  budgetId,
}: {
  client: SupabaseClient<Database>;
  formData: FormData;
  budgetId: number;
}) => {
  const { success, data, error } = createSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!success) {
    return { fieldErrors: error.flatten().fieldErrors };
  }
  return await createBudgetExpense(client, {
    budgetId,
    amount: data.amount,
    note: data.note,
    occurredAt: new Date(data.date),
  });
};

const handleDelete = async ({
  client,
  formData,
}: {
  client: SupabaseClient<Database>;
  formData: FormData;
}) => {
  const { success, data, error } = deleteSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!success) {
    return { success: false, message: "Invalid data" };
  }
  return await deleteBudgetExpense(client, {
    budgetExpenseId: data.budgetExpenseId,
  });
};

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const formData = await request.formData();
  const { success, data: parsedParams } = paramSchema.safeParse(params);
  if (!success) {
    throw data(
      {
        error_code: "INVALID_PARAMS",
        error_message: "Invalid Params",
      },
      { status: 400 }
    );
  }
  const _method = formData.get("_method")?.toString().toUpperCase();

  switch (_method) {
    case "CREATE":
      return handlePost({ client, formData, budgetId: parsedParams.budgetId });
    case "DELETE":
      return handleDelete({ client, formData });
  }
};

export default function BudgetPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const ref = useRef<HTMLFormElement>(null);
  const fetcher = useFetcher();
  const { budget, expenses, page, totalPages, accountId } = loaderData;
  const usageRate = (budget.current_amount / budget.budget_amount) * 100;
  const remaining = budget.budget_amount - budget.current_amount;
  const deleteExpense = (id: number) => {
    fetcher.submit(
      {
        budgetExpenseId: id,
        _method: "DELETE",
      },
      {
        method: "POST",
      }
    );
  };

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      ref.current?.reset();
    }
  }, [fetcher.state]);

  return (
    <main className="h-full min-h-screen space-y-6">
      <div className="flex flex-col space-y-4 flex-1 min-h-0">
        <div className="flex items-center gap-2">
          <Link to={`/account/${accountId}/budget`}>
            <ChevronLeft className="size-6" />
          </Link>
          <h3 className="font-semibold text-lg">{budget.name} 지출 내역</h3>
        </div>
        <div className="flex flex-col space-y-4 flex-1 min-h0">
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

          <fetcher.Form
            ref={ref}
            className="flex flex-col gap-3 border rounded-lg p-4"
            method="post"
          >
            <input type="hidden" name="_method" value="CREATE" />
            <Input name="amount" type="number" placeholder="금액" />
            <Input name="note" type="text" placeholder="설명" />
            <DatePicker
              label=""
              id="date"
              name="date"
              placeholder="날짜 선택"
            />
            {actionData && "fieldErrors" in actionData && (
              <ul className="text-sm text-destructive list-inside list-disc">
                {actionData.fieldErrors.amount &&
                  actionData.fieldErrors.amount.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                {actionData.fieldErrors.note &&
                  actionData.fieldErrors.note.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                {actionData.fieldErrors.date &&
                  actionData.fieldErrors.date.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
              </ul>
            )}
            <Button type="submit">추가</Button>
          </fetcher.Form>

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
                  <button
                    onClick={() => deleteExpense(expense.budget_expense_id)}
                    className="text-destructive"
                  >
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
