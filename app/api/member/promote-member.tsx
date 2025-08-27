import { z } from "zod";
import type { Route } from "./+types/promote-member";

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const schema = z.object({
    memberId: z.string().uuid(),
    accountId: z.string().uuid(),
  });

  const { success, data, error } = schema.safeParse(
    Object.fromEntries(formData)
  );

  if (!success) {
    return { error: error.message };
  }

  console.log("promote", data);
  return { success: true, message: "관리자 변경 완료" };
};
