import type { Route } from "./+types/delete-account-page";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId } from "~/features/auth/queries";
import { z } from "zod";
import { deleteAccount } from "../mutations";

const formSchema = z.object({
  accountId: z.string().uuid(),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const formData = await request.formData();
  const { success, error, data } = formSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!success) {
    return { fieldErrors: error.flatten().fieldErrors };
  }

  const { accountId } = data;
  const result = await deleteAccount(client, { accountId, userId });

  if (result.success) {
    return { success: true, redirectTo: "/account" };
  }
  return { error: "Failed to delete account" };
};
