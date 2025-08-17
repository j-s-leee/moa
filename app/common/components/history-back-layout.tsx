import { Link, Outlet, useNavigate } from "react-router";
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
  const navigate = useNavigate();

  const handleBackClick = () => {
    // 브라우저 히스토리에서 이전 페이지가 있는지 확인
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // 이전 페이지가 없으면 홈으로 이동
      navigate("/");
    }
  };

  return (
    <main className="px-4 py-6 h-full min-h-screen">
      <Button variant="outline" className="mb-4" onClick={handleBackClick}>
        <ArrowLeft className="w-4 h-4" />
      </Button>

      <Outlet />
    </main>
  );
}
