"use client";

import * as React from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/common/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Users } from "lucide-react";
import { Link } from "react-router";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function NavSecondary({
  items,
  onItemChange,
  onLinkClick,
  ...props
}: {
  items: {
    title: string;
    id: string;
  }[];
  onItemChange?: (id: string, newTitle: string) => void;
  onLinkClick?: () => void;
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { isMobile } = useSidebar();
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editingTitle, setEditingTitle] = React.useState("");

  const handleEditStart = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditingTitle(currentTitle);
  };

  const handleEditComplete = () => {
    if (editingId && editingTitle.trim() && onItemChange) {
      onItemChange(editingId, editingTitle.trim());
    }
    setEditingId(null);
    setEditingTitle("");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEditComplete();
    } else if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  const handleLinkClick = () => {
    onLinkClick?.();
  };

  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel>가계부</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <div className="flex w-full items-center">
                <SidebarMenuButton
                  asChild={editingId !== item.id}
                  className="flex-1"
                >
                  {editingId === item.id ? (
                    <div className="flex w-full">
                      <Input
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onBlur={handleEditComplete}
                        onKeyDown={handleKeyDown}
                        className="h-8 text-sm"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <Link
                      to={`/household/${item.id}/dashboard`}
                      onClick={handleLinkClick}
                    >
                      <span>{item.title}</span>
                    </Link>
                  )}
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 data-[state=open]:bg-sidebar-accent"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">메뉴 열기</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                    className="min-w-56 rounded-lg"
                  >
                    <DropdownMenuItem
                      onClick={() => handleEditStart(item.id, item.title)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>이름 바꾸기</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Users className="mr-2 h-4 w-4" />
                      <span>멤버 관리</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-400">
                      <Trash2 className="mr-2 h-4 w-4 text-red-400" />
                      <span>삭제</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
