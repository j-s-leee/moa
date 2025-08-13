import { Outlet } from "react-router";
import MobileHeader from "./mobile-header";
import BottomNav from "./bottom-nav";
import type { Route } from "./+types/navbar-layout";

export default function NavbarLayout({ loaderData }: Route.ComponentProps) {
  return (
    <div className="min-h-screen">
      <MobileHeader />
      <main className="px-4 py-6 pb-24">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
