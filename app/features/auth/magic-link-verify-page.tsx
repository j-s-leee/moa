import { redirect } from "react-router";
import type { Route } from "./+types/magic-link-verify-page";
import { makeSSRClient } from "~/supa-client";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const token_hash = url.searchParams.get("token_hash");
  const redirectTo = url.searchParams.get("redirect");

  if (!token_hash) {
    return redirect("/auth/login");
  }

  const { client, headers } = makeSSRClient(request);

  //   const { error } = await client.auth.exchangeCodeForSession(code);
  //   if (error) {
  //     throw error;
  //   }
  const { data, error } = await client.auth.verifyOtp({
    token_hash,
    type: "magiclink",
  });
  if (error) {
    throw error;
  }

  // redirect 쿼리 파라미터가 있으면 해당 페이지로, 없으면 기본 계정 페이지로
  const targetUrl = redirectTo || "/account";
  return redirect(targetUrl, {
    headers,
  });
};
