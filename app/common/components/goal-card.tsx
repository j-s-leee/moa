import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";

export default function GoalCard({ data }: { data: any }) {
  const progress = Math.round((data.current / data.target) * 100);
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="text-lg">{data.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex w-full justify-between">
            <Label>Progress</Label>
            <span className="text-sm">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <span className="flex justify-end text-xs text-muted-foreground">
            {data.current.toLocaleString()} / {data.target.toLocaleString()} KRW
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <span className="text-sm text-muted-foreground">
              estimated end date: {data.estimatedEndDate.toLocaleDateString()}
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Edit Goal</Button>
            <Button variant="destructive">Withdraw</Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
