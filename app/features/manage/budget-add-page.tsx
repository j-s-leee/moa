import { z } from "zod";
import type { Route } from "./+types/budget-add-page";
import { data } from "react-router";
import { Button } from "~/common/components/ui/button";
import { FormInput } from "~/common/components/form-input";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Add Budget | MOA" },
    { name: "description", content: "Budget Add Page" },
  ];
};

const paramSchema = z.object({
  householdId: z.string(),
});

export const loader = async ({ params }: Route.LoaderArgs) => {
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
  const { householdId } = parsedParams;
  return {
    householdId,
  };
};

export default function BudgetAddPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex flex-col h-screen space-y-4">
      <h3 className="font-semibold text-lg">예산 추가</h3>
      <form className="flex flex-col gap-6">
        <FormInput label="예산이름" type="text" name="budgetName" />
        <FormInput label="예산금액" type="number" name="amount" />
        <Button type="submit">추가</Button>
      </form>
    </div>
  );
}
