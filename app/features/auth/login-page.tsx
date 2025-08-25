import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "~/common/components/login-form";
import type { Route } from "./+types/login-page";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Login | MOA" }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const redirect = url.searchParams.get("redirect");
  console.log("login page redirect", redirect);
  return { redirect };
};

export default function LoginPage({ loaderData }: Route.ComponentProps) {
  const { redirect } = loaderData;

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-emerald-500 text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          MOA
        </a>
        <LoginForm redirect={redirect} />
      </div>
    </div>
  );
}
