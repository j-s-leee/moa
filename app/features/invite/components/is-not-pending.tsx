import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { XCircle } from "lucide-react";

export default function IsNotPending({
  maxUses,
  usedCount,
}: {
  maxUses: number;
  usedCount: number;
}) {
  return (
    <main className="px-4 py-6 h-full min-h-screen space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="text-red-500" />
            초대 수락 불가
          </CardTitle>
          <CardDescription>
            이 초대는 더 이상 수락할 수 없습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            최대 수락 가능 인원: {maxUses}명<br />
            현재 수락된 인원: {usedCount}명
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
