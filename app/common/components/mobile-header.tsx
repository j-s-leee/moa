import { ThemeToggle } from "./theme-toggle";
import { SidebarTrigger } from "./ui/sidebar";

export default function MobileHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b text-primary bg-background/80 backdrop-blur-sm">
      <div className="flex h-14 items-center px-4 gap-2">
        <SidebarTrigger />
        <div className="text-2xl font-bold">MOA</div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
