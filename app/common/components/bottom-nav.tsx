import { Link, useLocation } from "react-router";
import {
  Home,
  CreditCard,
  Target,
  PiggyBank,
  Settings,
  Calendar,
  BarChart3,
} from "lucide-react";
import { cn } from "~/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    title: "대시보드",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "관리",
    href: "/manage",
    icon: CreditCard,
  },
  {
    title: "목표",
    href: "/goal",
    icon: Target,
  },
  {
    title: "분석",
    href: "/analysis",
    icon: BarChart3,
  },
];

export default function BottomNav() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const accountId = pathSegments[2];
  const currentPath = pathSegments[3] || "";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm safe-area-inset-bottom border-t">
      <div className="grid h-16 grid-cols-4 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = currentPath === item.href.replace("/", "");
          const href = `/account/${accountId}${item.href}`;

          return (
            <Link
              key={item.title}
              to={href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-md px-3 py-2 text-xs transition-colors",
                isActive
                  ? "text-white bg-emerald-500 dark:bg-emerald-600"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  isActive ? "text-white" : "text-muted-foreground"
                )}
              />
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
