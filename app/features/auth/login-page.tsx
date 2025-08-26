import { GalleryVerticalEnd } from "lucide-react";
import type { Route } from "./+types/login-page";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";
import { Link } from "react-router";
import { MessageCircleIcon, ChromeIcon, Mail } from "lucide-react";
import { FormInput } from "~/common/components/form-input";
import { Separator } from "~/common/components/ui/separator";
import { useFetcher } from "react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { Alert, AlertTitle } from "~/common/components/ui/alert";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Login | MOA" }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const redirect = url.searchParams.get("redirect");
  return { redirect };
};

export default function LoginPage({ loaderData }: Route.ComponentProps) {
  const { redirect } = loaderData;
  const fetcher = useFetcher();
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      toast.success(fetcher.data.message);
    }
    if (fetcher.state === "idle" && fetcher.data?.error) {
      toast.error(fetcher.data.error);
    }
  }, [fetcher.state, fetcher.data]);
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-emerald-500 text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          MOA
        </a>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <CardDescription>
                Login with your Email, Kakao or Google account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <fetcher.Form
                method="post"
                action={`/auth/magic-link/start?${
                  redirect ? `redirect=${encodeURIComponent(redirect)}` : ""
                }`}
              >
                <div className="grid gap-6">
                  <div className="flex flex-col gap-4">
                    <FormInput
                      name="email"
                      label="Email"
                      placeholder="Enter your email"
                      type="email"
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={fetcher.state === "submitting"}
                    >
                      Login
                    </Button>
                    <Separator className="my-4" orientation="horizontal" />

                    <Button variant="outline" className="w-full" asChild>
                      <Link
                        to={`/auth/social/kakao/start${
                          redirect
                            ? `?redirect=${encodeURIComponent(redirect)}`
                            : ""
                        }`}
                      >
                        <MessageCircleIcon className="size-4" />
                        Login with Kakao
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link
                        to={`/auth/social/google/start${
                          redirect
                            ? `?redirect=${encodeURIComponent(redirect)}`
                            : ""
                        }`}
                      >
                        <ChromeIcon className="size-4" />
                        Login with Google
                      </Link>
                    </Button>
                  </div>
                </div>
              </fetcher.Form>
            </CardContent>
          </Card>
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
