import { Link, Outlet } from "react-router";
import type { Route } from "./+types/history-back-layout";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const pathSegments = pathname.split("/");
  pathSegments.pop();
  return { path: pathSegments.join("/") };
};

export default function HistoryBackLayout({
  loaderData,
}: Route.ComponentProps) {
  return (
    <main className="px-4 py-6 h-full min-h-screen">
      <Link to={loaderData.path}>
        <Button variant="outline" className="mb-4">
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </Link>

      <Outlet />
    </main>
  );
}
