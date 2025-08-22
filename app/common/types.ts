import type { Database } from "~/supa-client";

// Supabase 클라이언트의 실제 타입 사용
export type Account =
  Database["public"]["Views"]["account_budget_list_view"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
