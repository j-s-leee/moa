import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

export const removeMember = async (
  client: SupabaseClient<Database>,
  accountId: string,
  memberId: string
) => {
  const { error } = await client
    .from("account_members")
    .delete()
    .eq("account_id", accountId)
    .eq("profile_id", memberId);
  if (error) throw error;
  return { success: true, message: "멤버 삭제 완료" };
};
