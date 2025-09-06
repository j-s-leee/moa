import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Route } from "./+types/expense-page";
import { formatCurrency } from "~/lib/utils";
import { getExpenses, getTotalExpense } from "./queries";
import { data, useFetcher, type MetaFunction } from "react-router";
import { makeSSRClient, type Database } from "~/supa-client";
import z from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createExpense, deleteTransaction } from "./mutations";
import { Input } from "~/common/components/ui/input";
import { useEffect, useRef } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Expense | MOA" },
    { name: "description", content: "Expense page" },
  ];
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { accountId } = params;
  const { client, headers } = makeSSRClient(request);
  const expenses = await getExpenses(client, accountId);
  const totalExpense = await getTotalExpense(client, accountId);
  return data({ expenses, totalExpense, accountId }, { headers });
};

const expenseSchema = z.object({
  note: z.string().min(1, "항목명을 입력해주세요."),
  amount: z.coerce.number().min(1, "금액을 입력해주세요."),
});

const deleteSchema = z.object({
  transaction_id: z.coerce.number(),
});

const handlePost = async ({
  client,
  formData,
  accountId,
}: {
  client: SupabaseClient<Database>;
  formData: FormData;
  accountId: string;
}) => {
  const { success, data, error } = expenseSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!success) {
    return { fieldErrors: error.flatten().fieldErrors };
  }
  return await createExpense(client, {
    accountId,
    note: data.note,
    amount: data.amount,
  });
};

const handleDelete = async ({
  client,
  formData,
  accountId,
}: {
  client: SupabaseClient<Database>;
  formData: FormData;
  accountId: string;
}) => {
  const { success, data, error } = deleteSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!success) {
    return { success: false, message: "Invalid data" };
  }
  return await deleteTransaction(client, accountId, data.transaction_id);
};

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const formData = await request.formData();
  const { accountId } = params;
  const _method = formData.get("_method")?.toString().toUpperCase();
  switch (_method) {
    case "CREATE":
      return await handlePost({ client, formData, accountId });
    case "DELETE":
      return await handleDelete({ client, formData, accountId });
    default:
      return { success: false, message: "Unsupported method" };
  }
};

export default function ExpensePage({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  const fetcher = useFetcher();
  const { expenses, totalExpense } = loaderData;
  const ref = useRef<HTMLFormElement>(null);
  const fieldErrors = fetcher.data?.fieldErrors;

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      ref.current?.reset();
    }
  }, [fetcher.state]);

  const deleteExpense = (id: number) => {
    fetcher.submit(
      {
        transaction_id: id,
        _method: "DELETE",
      },
      {
        method: "POST",
      }
    );
  };

  return (
    <main className="h-full min-h-screen space-y-6">
      <Card className="shadow-none">
        <CardContent>
          <fetcher.Form method="post" ref={ref} className="space-y-3">
            <input type="hidden" name="_method" value="CREATE" />
            <Input
              id="note"
              name="note"
              type="text"
              placeholder="지출 항목명"
            />
            {fieldErrors && "note" in fieldErrors && (
              <span className="text-sm text-destructive">
                {fieldErrors.note}
              </span>
            )}
            <Input name="amount" type="number" placeholder="금액" />
            {fieldErrors && "amount" in fieldErrors && (
              <span className="text-sm text-destructive">
                {fieldErrors.amount}
              </span>
            )}
            <Button type="submit" className="w-full">
              추가
            </Button>
          </fetcher.Form>
        </CardContent>
      </Card>
      <Card className="rounded-2xl shadow-none border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              총 고정 지출 : {formatCurrency(totalExpense)}
            </h3>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {expenses &&
            expenses.map((expense) => (
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
    </main>
  );
}
