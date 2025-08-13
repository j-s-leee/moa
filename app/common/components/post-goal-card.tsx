import { CheckCheck } from "lucide-react";
import { Badge } from "./ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function PostGoalCard({ data }: { data: any }) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          <CheckCheck className="size-4" />{" "}
          <span>Completed at {data.completedAt.toLocaleDateString()}</span>
        </CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {data.target.toLocaleString()} KRW
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2">{data.name}</div>
      </CardFooter>
    </Card>
  );
}
