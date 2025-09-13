import { z } from "zod";
import type { Route } from "./+types/revoke-member";
import { revokeMember } from "~/features/account/mutations";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId } from "~/features/auth/queries";

const schema = z.object({
  memberId: z.string().uuid(),
  accountId: z.string().uuid(),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const formData = await request.formData();

  const { success, data, error } = schema.safeParse(
    Object.fromEntries(formData)
  );

  if (!success) {
    return { error: error.message };
  }
  const { success: revokeSuccess } = await revokeMember(client, {
    accountId: data.accountId,
    userId: data.memberId,
  });
  if (!revokeSuccess) {
    return { error: "Failed to revoke member" };
  }
  return { success: true, message: "제거 완료" };
};
