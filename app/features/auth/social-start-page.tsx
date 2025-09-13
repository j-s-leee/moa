import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/social-start-page";
import { z } from "zod";
import { redirect } from "react-router";

const paramsSchema = z.object({
  provider: z.enum(["google", "kakao"]),
});

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { success, data } = paramsSchema.safeParse(params);
  if (!success) {
    return redirect("/auth/login");
  }
  const { provider } = data;

  // redirect 쿼리 파라미터 확인
  const url = new URL(request.url);
  const redirectParam = url.searchParams.get("redirect");

  // redirect 파라미터가 있으면 완료 페이지 URL에 추가
  const redirectTo = `${
    new URL(request.url).origin
  }/auth/social/${provider}/complete${
    redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ""
  }`;

  const { client, headers } = makeSSRClient(request);
  const {
    data: { url: oauthUrl },
    error,
  } = await client.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
    },
  });
  if (oauthUrl) {
    return redirect(oauthUrl, {
      headers,
    });
  }
  if (error) {
    throw error;
  }
};
