import { z } from "zod";
import { redirect } from "react-router";
import type { Route } from "./+types/magic-link-start-page";
import { makeSSRClient } from "~/supa-client";

const inputSchema = z.object({
  email: z.string().email(),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const {
    success,
    data: parsedData,
    error: parseError,
  } = inputSchema.safeParse(Object.fromEntries(formData));

  if (!success) {
    return { success: false, error: parseError.message };
  }

  const url = new URL(request.url);
  const redirectParam = url.searchParams.get("redirect");

  const { client, headers } = makeSSRClient(request);
  const { data, error } = await client.auth.signInWithOtp({
    email: parsedData.email,
    options: {
      emailRedirectTo: redirectParam ?? undefined,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, message: "Magic link sent to your email" };
};
