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
import { Link, useFetcher, useNavigate } from "react-router";
import { Button } from "./ui/button";
import type { Account } from "~/common/types";
import { useEffect } from "react";
import { toast } from "sonner";

export function NavSecondary({
  accounts,
  ...props
}: {
  accounts: Account[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { isMobile, setOpenMobile } = useSidebar();
  const fetcher = useFetcher();
  const navigate = useNavigate();

  // fetcher 상태 모니터링
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.success && fetcher.data.redirectTo) {
        // 삭제 성공 시 toast 표시
        toast.success("가계부가 삭제되었습니다.", {
          action: {
            label: "확인",
            onClick: () => {
              toast.dismiss();
              navigate(fetcher.data.redirectTo);
            },
          },
        });
      } else if (fetcher.data.error) {
        // 삭제 실패 시 에러 처리
        toast.error(fetcher.data.error);
      }
    }
  }, [fetcher.state, fetcher.data, navigate]);

  const onClickDelete = (accountId: string) => {
    setOpenMobile(false);

    fetcher.submit(
      { accountId },
      { method: "post", action: "/account/delete" }
    );
  };
  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel>가계부</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {accounts.map((item) => (
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
                    <DropdownMenuItem asChild>
                      <Link to={`/account/${item.account_id}/edit`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>이름 바꾸기</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/account/${item.account_id}/member`}>
                        <Users className="mr-2 h-4 w-4" />
                        <span>멤버 관리</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onClickDelete(item.account_id)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4 text-destructive" />
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
