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

interface Account {
  account_id: string;
  name: string;
}

export function NavSecondary({
  items,
  ...props
}: {
  items: Account[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel>가계부</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.account_id}>
              <div className="flex w-full items-center">
                <SidebarMenuButton className="flex-1">
                  <Link to={`/account/${item.account_id}/dashboard`}>
                    <span>{item.name}</span>
                  </Link>
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
                    <DropdownMenuItem>
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
