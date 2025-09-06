import { deleteBudget } from "./mutations";
import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/delete-budget";
import { z } from "zod";
import { redirect } from "react-router";

const routeSchema = z.object({
  budgetId: z.coerce.number(),
  accountId: z.string().uuid(),
});

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const { accountId, budgetId } = params;

  const { success, data, error } = routeSchema.safeParse({
    budgetId,
    accountId,
  });

  if (!success) {
    return { success: false, message: error.message };
  }

  const budget = await deleteBudget(client, data!.budgetId);
  return redirect(`/account/${accountId}/budget`);
};
