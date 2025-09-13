import type { Database as SupabaseDatabase } from "database.types";
import {
  createBrowserClient,
  createServerClient,
  serializeCookieHeader,
} from "@supabase/ssr";
import { parseCookieHeader } from "@supabase/ssr";
import type { MergeDeep, SetFieldType, SetNonNullable } from "type-fest";

export type Database = MergeDeep<
  SupabaseDatabase,
  {
    public: {
      Views: {
        account_budget_list_view: {
          Row: SetFieldType<
            SetNonNullable<
              SupabaseDatabase["public"]["Views"]["account_budget_list_view"]["Row"]
            >,
            "current_budget" | "budget_amount",
            number | null
          >;
        };
      };
    };
  }
>;

export const browserClient = createBrowserClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export const makeSSRClient = (request: Request) => {
  const headers = new Headers();
  const serverSideClient = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const cookies = parseCookieHeader(
            request.headers.get("cookie") ?? ""
          );
          return cookies.filter(
            (cookie): cookie is { name: string; value: string } =>
              cookie.value !== undefined
          );
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            headers.append(
              "Set-Cookie",
              serializeCookieHeader(name, value, options)
            );
          });
        },
      },
    }
  );
  return { client: serverSideClient, headers };
};
