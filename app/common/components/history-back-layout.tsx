import { Outlet, useNavigate } from "react-router";
import type { Route } from "./+types/history-back-layout";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

export default function HistoryBackLayout({
  loaderData,
}: Route.ComponentProps) {
  const navigate = useNavigate();
  return (
    <main className="px-4 py-6 h-full min-h-screen">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="w-4 h-4" />
      </Button>

      <Outlet />
    </main>
  );
}
