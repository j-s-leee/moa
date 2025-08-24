import { redirect } from "react-router";
import { z } from "zod";
import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/social-complete-page";

const paramsSchema = z.object({
  provider: z.enum(["google", "kakao"]),
});

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { success, data } = paramsSchema.safeParse(params);
  if (!success) {
    return redirect("/auth/login");
  }
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const redirectTo = url.searchParams.get("redirect");

  if (!code) {
    return redirect("/auth/login");
  }

  const { client, headers } = makeSSRClient(request);
  const { error } = await client.auth.exchangeCodeForSession(code);
  if (error) {
    throw error;
  }

  // redirect 쿼리 파라미터가 있으면 해당 페이지로, 없으면 기본 계정 페이지로
  const targetUrl = redirectTo || "/account";
  return redirect(targetUrl, {
    headers,
  });
};
