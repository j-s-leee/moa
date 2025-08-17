import { List, Settings, SquarePen } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "~/common/components/ui/sidebar";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { SidebarFooter, SidebarRail } from "./ui/sidebar";
import { NavSecondary } from "./nav-secondary";

interface Account {
  account_id: string;
  name: string;
}

interface Profile {
  name: string;
  email: string | null;
}

export function AppSidebar({
  accounts,
  profile,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  accounts: Account[];
  profile: Profile;
}) {
  const data = {
    navMain: [
      {
        title: "새 가계부",
        url: `/new`,
        icon: SquarePen,
      },
      {
        title: "설정",
        url: `/settings`,
        icon: Settings,
        items: [
          {
            title: "General",
            url: "#",
            icon: List,
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
            url: "#",
          },
        ],
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <span className="text-2xl font-bold">MOA</span>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={accounts} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={profile} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
