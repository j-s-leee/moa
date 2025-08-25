import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router";

export default function AlreadyAccepted({
  token,
  accountId,
}: {
  token: string;
  accountId: string | null;
}) {
  return (
    <main className="px-4 py-6 h-full min-h-screen space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="text-green-500" />
            이미 초대를 수락했습니다
          </CardTitle>
          <CardDescription>이 초대는 이미 수락되었습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">초대 링크: {token}</p>
          <div className="mt-4">
            {accountId ? (
              <Link
                to={`/account/${accountId}/dashboard`}
                className="text-blue-500 hover:underline"
              >
                대시보드로 이동하기
              </Link>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
