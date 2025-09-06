import { Link, useLocation } from "react-router";
import {
  Home,
  CreditCard,
  Target,
  PiggyBank,
  BarChart3,
  WalletMinimal,
  BanknoteArrowDown,
  BanknoteArrowUp,
} from "lucide-react";
import { cn } from "~/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    title: "홈",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "수입",
    href: "/income",
    icon: BanknoteArrowUp,
  },
  {
    title: "지출",
    href: "/expense",
    icon: BanknoteArrowDown,
  },
  {
    title: "예산",
    href: "/budget",
    icon: WalletMinimal,
  },
  {
    title: "저축",
    href: "/goal",
    icon: PiggyBank,
  },
  // {
  //   title: "분석",
  //   href: "/analysis",
  //   icon: BarChart3,
  // },
];

export default function BottomNav() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const accountId = pathSegments[2];
  const currentPath = pathSegments[3] || "";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background safe-area-inset-bottom border-t">
      <div className="grid h-16 grid-cols-5 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = currentPath === item.href.replace("/", "");
          const href = `/account/${accountId}${item.href}`;

          return (
            <Link
              key={item.title}
              to={href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-md px-3 py-2 text-xs transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  isActive ? "text-primary" : "text-muted-foreground"
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
