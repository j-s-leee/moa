import { z } from "zod";
import type { Route } from "./+types/promote-member";
import { makeSSRClient } from "~/supa-client";
import { promoteMember } from "~/features/account/mutations";
import { getLoggedInUserId } from "~/features/auth/queries";

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const formData = await request.formData();
  const schema = z.object({
    memberId: z.string().uuid(),
    accountId: z.string().uuid(),
  });

  const { success, data, error } = schema.safeParse(
    Object.fromEntries(formData)
  );

  if (!success) {
    return { success: false, message: error.message };
  }

  console.log("promote", data);
  const { success: promoteSuccess } = await promoteMember(client, {
    accountId: data.accountId,
    userId,
    memberId: data.memberId,
  });
  if (!promoteSuccess) {
    return { success: false, message: "관리자 변경 실패" };
  }
  return { success: true, message: "관리자 변경 완료" };
};
