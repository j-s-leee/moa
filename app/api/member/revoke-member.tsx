import { z } from "zod";
import type { Route } from "./+types/revoke-member";

const schema = z.object({
  memberId: z.string().uuid(),
  accountId: z.string().uuid(),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();

  const { success, data, error } = schema.safeParse(
    Object.fromEntries(formData)
  );

  if (!success) {
    return { error: error.message };
  }
  console.log("revoke", data);
  return { success: true, message: "제거 완료" };
};
