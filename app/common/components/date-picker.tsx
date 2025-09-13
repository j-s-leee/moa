"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "~/common/components/ui/button";
import { Calendar } from "~/common/components/ui/calendar";
import { Label } from "~/common/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/common/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function DatePicker({
  label,
  id,
  name,
  placeholder,
  bgColor,
  defaultDate,
  date,
  setDate,
}: {
  label: string;
  id: string;
  name: string;
  placeholder: string;
  bgColor?: string;
  defaultDate?: Date;
  date?: Date;
  setDate?: (date: Date) => void;
}) {
  const [open, setOpen] = React.useState(false);

  // 로컬 타임존을 유지하면서 YYYY-MM-DD 형식으로 변환
  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <Label htmlFor={id} className="px-1">
          {label}
        </Label>
      )}
      {/* Hidden input to submit the date value */}
      <input
        type="hidden"
        name={name}
        value={date ? formatDateForInput(date) : ""}
      />
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            id={id}
            type="button"
            className={`w-full justify-between font-normal ${bgColor ?? ""}`}
          >
            {date ? date.toLocaleDateString() : placeholder}
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-auto overflow-hidden p-0"
          align="start"
        >
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate?.(date);
              setOpen(false);
            }}
            required
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
