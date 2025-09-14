import { Link } from "react-router";
import { SidebarTrigger } from "./ui/sidebar";
import { Home } from "lucide-react";
import { AnimatedThemeToggler } from "components/magicui/animated-theme-toggler";

export default function MobileHeader({
  name,
  accountName,
}: {
  name: string;
  accountName?: string;
}) {
  return (
    <header className="sticky top-0 z-50 w-full border-b text-primary bg-background/80 backdrop-blur-sm">
      <div className="flex h-14 items-center px-4 gap-2">
        <SidebarTrigger />
        {accountName ? (
          <div className="text-lg font-semibold">{accountName}</div>
        ) : (
          <div className="text-2xl font-bold">MOA</div>
        )}

        <div className="flex flex-1 items-center justify-end gap-2">
          {name ? (
            <Link to="/account">
              <Home className="w-4 h-4" />
            </Link>
          ) : (
            <Link to="/">
              <Home className="w-4 h-4" />
            </Link>
          )}
          <AnimatedThemeToggler size="icon" variant="ghost" />
        </div>
      </div>
    </header>
  );
}
