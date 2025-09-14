import { getLoggedInUserId } from "~/features/auth/queries";
import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/accounts-page";
import { getAccountsByProfileId } from "./queries";
import { Link, useFetcher, useNavigate } from "react-router";
import { toast } from "sonner";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/common/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Plus, Trash, Users } from "lucide-react";
import { formatCurrency } from "~/lib/utils";
import { Progress } from "~/common/components/ui/progress";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const accounts = await getAccountsByProfileId(client, userId);

  return { accounts, userId, headers };
};

export default function AccountsPage({ loaderData }: Route.ComponentProps) {
  const { accounts, userId } = loaderData;
  const fetcher = useFetcher();
  const navigate = useNavigate();

  // fetcher 상태 모니터링
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      // 삭제 성공 시 toast 표시
      toast.success("가계부가 삭제되었습니다.", {
        action: {
          label: "확인",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      if (fetcher.data.redirectTo) {
        navigate(fetcher.data.redirectTo);
      }
    }
  }, [fetcher.state, fetcher.data]);

  const onClickDelete = (accountId: string) => {
    fetcher.submit(
      { accountId },
      { method: "post", action: `/account/delete` }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 계좌 추가 버튼 */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">내 가계부</h1>
        <Link to="/account/create">
          <Button className="flex items-center gap-2">
            <Plus className="size-4" />
          </Button>
        </Link>
      </div>

      {/* 계좌 목록 */}
      <div className="grid gap-4">
        {accounts.map((account) => (
          <Card key={account.account_id} className="@container/card gap-2">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold">
                    {account.name}
                  </CardTitle>
                </div>

                {/* More Vert 메뉴 */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="size-4" />
                      <span className="sr-only">메뉴 열기</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/account/${account.account_id}/member`}>
                        <div className="flex items-center gap-2">
                          <Users className="size-4" />
                          멤버 관리
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    {account.created_by === userId && (
                      <>
                        <DropdownMenuItem>
                          <Link
                            to={`/account/${account.account_id}/edit`}
                            className="flex items-center gap-2"
                          >
                            <Pencil className="size-4" />
                            수정하기
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => onClickDelete(account.account_id)}
                        >
                          <Trash className="size-4 text-destructive" />
                          삭제하기
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            {/* 계좌 정보 */}
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  비정기지출 예산 잔액
                </span>
                <span className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">
                  {account.current_budget && account.budget_amount ? (
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(
                        account.budget_amount - account.current_budget
                      )}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      예산 설정 안됨
                    </span>
                  )}
                </span>
              </div>

              <Progress
                value={
                  (((account.budget_amount ?? 0) -
                    (account.current_budget ?? 0)) /
                    (account.budget_amount ?? 0)) *
                  100
                }
              />
            </CardContent>

            {/* 계좌 대시보드로 이동 */}
            <CardFooter>
              <Link
                to={`/account/${account.account_id}/dashboard`}
                className="w-full"
              >
                <Button variant="outline" className="w-full justify-center">
                  <span>더보기</span>
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* 계좌가 없을 때 */}
      {accounts.length === 0 && (
        <Link to="/account/create">
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Plus size={24} className="text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">가계부가 없습니다</h3>
                <p className="text-muted-foreground">
                  첫 번째 가계부를 추가하고 재정 관리를 시작해보세요
                </p>
              </div>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                가계부 추가하기
              </Button>
            </div>
          </Card>
        </Link>
      )}
    </div>
  );
}
