"use client";

import * as React from "react";
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  HandCoins,
  LayoutDashboard,
  List,
  Map,
  Pen,
  PieChart,
  Settings,
  SquarePen,
  Target,
  Users,
  Wallet,
} from "lucide-react";
import { useParams } from "react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "~/common/components/ui/sidebar";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { SidebarFooter, SidebarRail, SidebarSeparator } from "./ui/sidebar";
import { useLocation } from "react-router";
import { NavSecondary } from "./nav-secondary";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { householdId } = useParams();
  const { pathname } = useLocation();
  const { isMobile, toggleSidebar } = useSidebar();

  // navSecondary 데이터를 state로 관리
  const [navSecondary, setNavSecondary] = React.useState([
    {
      title: "부부 가계부",
      id: "couple",
    },
    {
      title: "가족 가계부",
      id: "family",
    },
    {
      title: "개인 가계부",
      id: "personal",
    },
  ]);

  // 항목 이름 변경 핸들러
  const handleItemChange = (id: string, newTitle: string) => {
    setNavSecondary((prev) =>
      prev.map((item) => (item.id === id ? { ...item, title: newTitle } : item))
    );
  };

  // 링크 클릭시 사이드바 닫기
  const handleLinkClick = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  const data = {
    user: {
      name: "j-s-leee",
      email: "j-s-leee@example.com",
      avatar: "https://github.com/j-s-leee.png",
    },
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
        <NavMain items={data.navMain} onLinkClick={handleLinkClick} />
        <NavSecondary
          items={navSecondary}
          onItemChange={handleItemChange}
          onLinkClick={handleLinkClick}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
