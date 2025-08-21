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
  const redirectTo = `http://localhost:5173/auth/social/${provider}/complete`;
  const { client, headers } = makeSSRClient(request);
  const {
    data: { url },
    error,
  } = await client.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
    },
  });
  if (url) {
    return redirect(url, {
      headers,
    });
  }
  if (error) {
    throw error;
  }
};
