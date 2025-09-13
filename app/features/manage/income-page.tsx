import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Route } from "./+types/income-page";
import { formatCurrency } from "~/lib/utils";
import { getIncomes, getTotalIncome } from "./queries";
import { data, Form, useFetcher, type MetaFunction } from "react-router";
import { makeSSRClient, type Database } from "~/supa-client";
import { Input } from "~/common/components/ui/input";
import { z } from "zod";
import { createIncome, deleteTransaction } from "./mutations";
import type { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useRef } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Income | MOA" },
    { name: "description", content: "Income page" },
  ];
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { accountId } = params;
  const { client, headers } = makeSSRClient(request);
  const [incomes, totalIncome] = await Promise.all([
    getIncomes(client, accountId),
    getTotalIncome(client, accountId),
  ]);
  return data({ incomes, accountId, totalIncome }, { headers });
};

const incomeSchema = z.object({
  note: z.string().min(1, { message: "항목명을 입력해주세요." }),
  amount: z.coerce.number().min(1, { message: "금액을 입력해주세요." }),
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
  const { success, data, error } = incomeSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!success) {
    return { fieldErrors: error.flatten().fieldErrors };
  }

  return await createIncome(client, {
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
      return handlePost({ client, formData, accountId });
    case "DELETE":
      return handleDelete({ client, formData, accountId });
    default:
      return { success: false, message: "Unsupported method" };
  }
};

export default function IncomePage({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  const { incomes = [], accountId = "", totalIncome = 0 } = loaderData || {};
  const fetcher = useFetcher();
  const ref = useRef<HTMLFormElement>(null);
  const deleteIncome = (id: number) => {
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

  useEffect(() => {
    if (actionData && "success" in actionData && actionData.success) {
      ref.current?.reset();
    }
  }, [actionData]);

  return (
    <main className="h-full min-h-screen space-y-6">
      <Card className="shadow-none">
        <CardContent>
          <Form method="post" ref={ref} className="space-y-3">
            <input type="hidden" name="_method" value="CREATE" />
            <Input
              id="note"
              name="note"
              type="text"
              placeholder="수입 항목명"
            />
            {actionData && "fieldErrors" in actionData && (
              <span className="text-sm text-destructive">
                {actionData.fieldErrors.note}
              </span>
            )}
            <Input name="amount" type="number" placeholder="금액" />
            {actionData && "fieldErrors" in actionData && (
              <span className="text-sm text-destructive">
                {actionData.fieldErrors.amount}
              </span>
            )}
            <Button type="submit" className="w-full">
              추가
            </Button>
          </Form>
        </CardContent>
      </Card>
      <Card className="rounded-2xl shadow-none border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              총 고정 수입 : {formatCurrency(totalIncome)}
            </h3>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {incomes &&
            incomes.map((income) => (
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
