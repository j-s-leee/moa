import z from "zod";
import { deleteSavingsGoal } from "./mutations";
import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/delete-saving-goal";

const routeSchema = z.object({
  goalId: z.coerce.number(),
});

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const { goalId } = params;
  const { success, data, error } = routeSchema.safeParse({ goalId });

  if (!success) {
    return { success: false, message: error.message };
  }

  const goal = await deleteSavingsGoal(client, data!.goalId);
  return { success: true, message: "목표 삭제 완료" };
};
