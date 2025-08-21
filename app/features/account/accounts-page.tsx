import { getLoggedInUserId } from "~/features/auth/queries";
import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/accounts-page";
import { getAccountsByProfileId } from "./queries";
import { Link } from "react-router";
import { Badge } from "~/common/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { IconChevronRight, IconTrendingUp } from "@tabler/icons-react";
import { Button } from "~/common/components/ui/button";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const accounts = await getAccountsByProfileId(client, userId);
  return accounts;
};

export default function AccountsPage({ loaderData }: Route.ComponentProps) {
  const accounts = loaderData;
  return (
    <div className="flex flex-col gap-4">
      {accounts.map((account) => (
        <Link
          to={`/account/${account.account_id}/dashboard`}
          key={account.account_id}
        >
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>{account.name}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {account.total_savings.toLocaleString("en-US", {
                  style: "currency",
                  currency: account.currency,
                })}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <Badge variant="outline" className="bg-green-500/20">
                +{" "}
                {account.total_income.toLocaleString("en-US", {
                  style: "currency",
                  currency: account.currency,
                })}
              </Badge>
              <Badge variant="outline" className="bg-red-500/20">
                -{" "}
                {account.total_expense.toLocaleString("en-US", {
                  style: "currency",
                  currency: account.currency,
                })}
              </Badge>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
