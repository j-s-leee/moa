import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "~/common/components/ui/card";
import { CardTitle } from "~/common/components/ui/card";
import { Progress } from "~/common/components/ui/progress";
import { formatCurrency } from "~/lib/utils";
import { Link, useLoaderData } from "react-router";
import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/budget-page";
import { Button } from "~/common/components/ui/button";
import { Plus } from "lucide-react";
import { getBudgets } from "./queries";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "비정기 지출 현황 | MOA" },
    { name: "description", content: "비정기 지출 현황 페이지" },
  ];
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const { accountId } = params;
  const budgets = await getBudgets(client, accountId);
  return { accountId, budgets };
};

export default function BudgetPage() {
  const { accountId, budgets } = useLoaderData<typeof loader>();
  const totalBudget = budgets.reduce(
    (acc, budget) => acc + budget.budget_amount,
    0
  );
  const totalUsage = budgets.reduce(
    (acc, budget) => acc + budget.current_amount,
    0
  );

  return (
    <main className="h-full min-h-screen space-y-6">
      {/* 비정기 지출 현황 */}
      {budgets && (
        <Card className="p-6 rounded-2xl shadow-none border gap-2">
          <CardHeader className="px-0">
            <CardTitle className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">비정기 지출</h2>
            </CardTitle>
            <CardAction>
              <Link to={`/account/${accountId}/budget/add`}>
                <Button variant="default">
                  <Plus />
                </Button>
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent className="px-0">
            <div className="space-y-3">
              <div className="space-y-2 bg-muted rounded-lg p-3">
                <div className="flex justify-between items-center text-sm">
                  <span>사용: {formatCurrency(totalUsage)}</span>
                  <span>예산: {formatCurrency(totalBudget)}</span>
                </div>
                <Progress value={(totalUsage / totalBudget) * 100} />
              </div>

              {budgets.map((budget) => {
                const usageRate =
                  (budget.current_amount / budget.budget_amount) * 100;

                return (
                  <Link
                    key={budget.budget_id}
                    to={`/account/${accountId}/budget/${budget.budget_id}`}
                    className="bg-muted/50 space-y-2 rounded-lg p-3 block"
                  >
                    <div className="pb-2 flex items-center justify-between">
                      <span className="font-medium">{budget.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>사용: {formatCurrency(budget.current_amount)}</span>
                      <span>예산: {formatCurrency(budget.budget_amount)}</span>
                    </div>
                    <Progress value={usageRate} className="h-2" />
                    <div className="text-xs text-muted-foreground flex justify-between">
                      <span>
                        잔여:{" "}
                        {formatCurrency(
                          budget.budget_amount - budget.current_amount
                        )}
                      </span>
                      <span>{Math.round(usageRate)}% 사용</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
