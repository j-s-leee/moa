import { cn } from "~/lib/utils";
import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Link } from "react-router";
import { ChromeIcon, MessageCircleIcon } from "lucide-react";

export function LoginForm({
  className,
  redirect,
  ...props
}: React.ComponentProps<"div"> & { redirect?: string | null }) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Kakao or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
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

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="#" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
