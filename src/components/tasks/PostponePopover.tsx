import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useLanguage } from "@/contexts/LanguageContext";
import { getPostponeDate } from "@/lib/tasks";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

interface PostponePopoverProps {
  onPostpone: (date: string) => void;
  children: React.ReactNode;
}

export default function PostponePopover({ onPostpone, children }: PostponePopoverProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const quickOptions = [
    { label: t("tomorrow"), value: "tomorrow" as const },
    { label: t("in3Days"), value: "+3days" as const },
    { label: t("nextWeek"), value: "nextWeek" as const },
    { label: t("nextMonth"), value: "nextMonth" as const },
  ];

  const handleQuick = (option: "tomorrow" | "+3days" | "nextWeek" | "nextMonth") => {
    onPostpone(getPostponeDate(option));
    setOpen(false);
    setShowCalendar(false);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onPostpone(format(date, "yyyy-MM-dd"));
      setOpen(false);
      setShowCalendar(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setShowCalendar(false); }}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="end">
        {showCalendar ? (
          <Calendar
            mode="single"
            onSelect={handleDateSelect}
            disabled={(date) => date < new Date()}
            initialFocus
          />
        ) : (
          <div className="flex flex-col gap-1">
            {quickOptions.map((opt) => (
              <Button
                key={opt.value}
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={() => handleQuick(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="justify-start"
              onClick={() => setShowCalendar(true)}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {t("pickDate")}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
