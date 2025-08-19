import { z } from "zod";
import type { Route } from "./+types/budget-add-page";
import { data, Link } from "react-router";
import { Button } from "~/common/components/ui/button";
import { FormInput } from "~/common/components/form-input";
import { ChevronLeft } from "lucide-react";
import { makeSSRClient } from "~/supa-client";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Add Budget | MOA" },
    { name: "description", content: "Budget Add Page" },
  ];
};

const paramSchema = z.object({
  accountId: z.string(),
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

export default function BudgetAddPage({ loaderData }: Route.ComponentProps) {
  const { accountId } = loaderData;
  return (
    <main className="px-4 py-6 h-full min-h-screen">
      <div className="flex items-center gap-2 mb-4">
        <Link to={`/account/${accountId}/manage`}>
          <ChevronLeft className="size-6" />
        </Link>
        <h3 className="font-semibold text-lg">예산 추가</h3>
      </div>
      <div className="flex flex-col h-screen space-y-4">
        <form className="flex flex-col gap-6">
          <FormInput label="예산이름" type="text" name="budgetName" />
          <FormInput label="예산금액" type="number" name="amount" />
          <Button type="submit">추가</Button>
        </form>
      </div>
    </main>
  );
}
