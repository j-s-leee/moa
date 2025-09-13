import { Form, Link, redirect, useNavigate, useNavigation } from "react-router";
import { getBudget } from "./queries";
import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/edit-budget-page";
import { z } from "zod";
import { ChevronLeft, Loader2 } from "lucide-react";
import { FormInput } from "~/common/components/form-input";
import { Button } from "~/common/components/ui/button";
import { updateBudget } from "./mutations";

export const paramSchema = z.object({
  accountId: z.string().uuid(),
  budgetId: z.coerce.number(),
});

export const formSchema = z.object({
  budgetName: z.string().min(1, { message: "예산이름을 입력해주세요." }),
  amount: z.coerce.number().min(1, { message: "예산금액을 입력해주세요." }),
});

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const { success, data: parsedParams, error } = paramSchema.safeParse(params);
  if (!success) {
    return {
      success: false,
      fieldErrors: error?.flatten().fieldErrors,
    };
  }
  const { accountId, budgetId } = parsedParams;

  const budget = await getBudget(client, budgetId);
  if (!budget) {
    return {
      success: false,
      fieldErrors: {
        budgetId: "Budget not found",
      },
    };
  }
  return { accountId, budgetId, budget };
};

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = await makeSSRClient(request);
  const {
    success: paramSuccess,
    data: parsedParams,
    error: paramError,
  } = paramSchema.safeParse(params);
  if (!paramSuccess) {
    return {
      success: false,
      fieldErrors: paramError?.flatten().fieldErrors,
    };
  }

  const { accountId, budgetId } = parsedParams;
  const formData = await request.formData();
  const {
    success,
    data: parsedData,
    error: formError,
  } = formSchema.safeParse(Object.fromEntries(formData));
  if (!success) {
    return {
      success: false,
      fieldErrors: formError?.flatten().fieldErrors,
    };
  }
  const { budgetName, amount } = parsedData;
  const { success: updateSuccess, message } = await updateBudget(client, {
    budgetId,
    budgetName,
    amount,
  });

  return redirect(`/account/${accountId}/budget/${budgetId}`);
};

export default function EditBudgetPage({ loaderData }: Route.ComponentProps) {
  const { accountId, budgetId, budget } = loaderData;

  const navigation = useNavigation();
  return (
    <main className="h-full min-h-screen space-y-6">
      <div className="flex flex-col space-y-4 flex-1 min-h-0">
        <Link
          to={`/account/${accountId}/budget/${budgetId}`}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="size-6" />
          <h3 className="font-semibold text-lg">예산 수정</h3>
        </Link>
      </div>
      <div className="flex flex-col h-screen space-y-4">
        <Form className="flex flex-col gap-6" method="post">
          <FormInput
            label="예산이름"
            type="text"
            name="budgetName"
            defaultValue={budget?.name}
          />
          <FormInput
            label="예산금액"
            type="number"
            name="amount"
            defaultValue={budget?.budget_amount}
          />
          <Button type="submit" disabled={navigation.state === "submitting"}>
            {navigation.state === "submitting" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "수정"
            )}
          </Button>
        </Form>
      </div>
    </main>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <div>{error instanceof Error ? error.message : "Unknown error"}</div>;
}
