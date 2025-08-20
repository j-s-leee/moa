import type { Database } from "database.types";
import {
  createBrowserClient,
  createServerClient,
  serializeCookieHeader,
} from "@supabase/ssr";
import { parseCookieHeader } from "@supabase/ssr";

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
