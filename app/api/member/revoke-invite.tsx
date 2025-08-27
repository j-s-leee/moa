import { z } from "zod";
import type { Route } from "./+types/revoke-invite";
import { revokeInvitation } from "~/features/invite/mutations";
import { makeSSRClient } from "~/supa-client";

const schema = z.object({
  invitationId: z.coerce.bigint(),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const formData = await request.formData();
  const {
    success: parseSuccess,
    data: parseData,
    error: parseError,
  } = schema.safeParse(Object.fromEntries(formData));

  if (!parseSuccess) {
    return { error: parseError.message };
  }
  const { success } = await revokeInvitation(client, parseData.invitationId);
  console.log("revoke-invite", success);
  if (!success) {
    return { error: "Failed to revoke invitation" };
  }
  return { success: true, message: "초대 제거 완료" };
};
