import { z } from "zod";
import type { Route } from "./+types/budget-add-page";
import { data, Form, Link, redirect } from "react-router";
import { Button } from "~/common/components/ui/button";
import { FormInput } from "~/common/components/form-input";
import { ChevronLeft } from "lucide-react";
import { makeSSRClient } from "~/supa-client";
import { createBudget } from "./mutations";
import { Alert, AlertDescription } from "~/common/components/ui/alert";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Add Budget | MOA" },
    { name: "description", content: "Budget Add Page" },
  ];
};

const paramSchema = z.object({
  accountId: z.string().uuid(),
});

const formSchema = z.object({
  budgetName: z.string().min(1, { message: "예산이름을 입력해주세요." }),
  amount: z.coerce.number().min(1, { message: "예산금액을 입력해주세요." }),
});

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
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
  const { accountId } = parsedParams;
  return data({ accountId }, { headers });
};

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const { accountId } = params;
  const formData = await request.formData();
  const {
    success,
    data: parsedData,
    error: formError,
  } = formSchema.safeParse(Object.fromEntries(formData));
  if (!success) {
    return { fieldErrors: formError.flatten().fieldErrors };
  }
  const { budgetName, amount } = parsedData;
  const { success: createSuccess, message } = await createBudget(client, {
    accountId,
    budgetName,
    amount,
  });
  if (!createSuccess) {
    return { fieldErrors: { budgetName: [message] } };
  }
  return redirect(`/account/${accountId}/budget`);
};

export default function BudgetAddPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { accountId } = loaderData;
  return (
    <main className="h-full min-h-screen space-y-6">
      <div className="flex items-center gap-2">
        <Link to={`/account/${accountId}/budget`}>
          <ChevronLeft className="size-6" />
        </Link>
        <h3 className="font-semibold text-lg">예산 추가</h3>
      </div>
      <div className="flex flex-col h-screen space-y-4">
        <Form className="flex flex-col gap-6" method="post">
          <FormInput label="예산이름" type="text" name="budgetName" />
          <FormInput label="예산금액" type="number" name="amount" />
          {actionData && "fieldErrors" in actionData && (
            <Alert variant="destructive">
              <AlertDescription className="text-sm">
                <ul className="text-sm text-destructive list-inside list-disc">
                  {actionData.fieldErrors.budgetName &&
                    actionData.fieldErrors.budgetName.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  {actionData.fieldErrors.amount &&
                    actionData.fieldErrors.amount.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          <Button type="submit">추가</Button>
        </Form>
      </div>
    </main>
  );
}
