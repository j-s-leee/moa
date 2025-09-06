import React, { useState, useEffect } from "react";

import { z } from "zod";
import { format } from "date-fns";

import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "~/common/components/ui/button";
import { useFetcher } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/common/components/ui/dialog";
import { Input } from "~/common/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/common/components/ui/popover";
import { Calendar } from "~/common/components/ui/calendar";
import { cn } from "~/lib/utils";

// Props 타입 정의
interface ExpenseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExpenseFormDialog({
  open,
  onOpenChange,
}: ExpenseFormDialogProps) {
  const fetcher = useFetcher();
  const [date, setDate] = useState<Date>();
  const fieldErrors = (fetcher.data as any)?.fieldErrors || {};
  const isSubmitting = fetcher.state === "submitting";

  // 폼 제출 성공 시 Dialog 닫기
  useEffect(() => {
    if (fetcher.state === "idle" && (fetcher.data as any)?.ok) {
      onOpenChange(false);
      setDate(undefined); // 날짜 상태 초기화
    }
  }, [fetcher.state, fetcher.data, onOpenChange]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // DatePicker에서 선택된 날짜를 FormData에 추가
    if (date) {
      formData.set("date", format(date, "yyyy-MM-dd"));
    }

    fetcher.submit(formData, { method: "post" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 지출 추가2</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input name="content" placeholder="내용" />
            {fieldErrors.content && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.content}</p>
            )}
          </div>
          <div>
            <Input name="amount" type="number" placeholder="금액" />
            {fieldErrors.amount && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.amount}</p>
            )}
          </div>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>날짜 선택</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {fieldErrors.date && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.date}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "등록 중..." : "추가"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
