import { Link } from "react-router";
import { ThemeToggle } from "./theme-toggle";
import { SidebarTrigger } from "./ui/sidebar";

export default function MobileHeader({ name }: { name: string }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b text-primary bg-background/80 backdrop-blur-sm">
      <div className="flex h-14 items-center px-4 gap-2">
        <SidebarTrigger />
        {name ? (
          <Link to="/account">
            <div className="text-2xl font-bold">MOA</div>
          </Link>
        ) : (
          <Link to="/">
            <div className="text-2xl font-bold">MOA</div>
          </Link>
        )}

        <div className="flex flex-1 items-center justify-end gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
