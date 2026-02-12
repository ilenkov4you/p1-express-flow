import { useMemo, useState } from "react";
import { subDays, format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTasks } from "@/hooks/useTasks";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import QuickCapture from "@/components/tasks/QuickCapture";

export default function WeeklyReview() {
  const { t } = useLanguage();
  const { tasks } = useTasks();
  const [notes, setNotes] = useState("");

  const weekAgo = format(subDays(new Date(), 7), "yyyy-MM-dd");

  const finished = useMemo(
    () => tasks.filter((t) => t.status === "finished" && t.date >= weekAgo),
    [tasks, weekAgo]
  );

  const canceled = useMemo(
    () => tasks.filter((t) => t.status === "canceled" && t.date >= weekAgo),
    [tasks, weekAgo]
  );

  return (
    <div className="space-y-6 pt-4">
      <div>
        <h2 className="text-sm font-semibold">{t("weeklyReview")}</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border p-3 text-center">
          <div className="text-2xl font-bold">{finished.length}</div>
          <div className="text-xs text-muted-foreground">{t("completedThisPeriod")}</div>
        </div>
        <div className="rounded-lg border p-3 text-center">
          <div className="text-2xl font-bold">{canceled.length}</div>
          <div className="text-xs text-muted-foreground">{t("canceledThisPeriod")}</div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">
          {t("whatDrainedEnergy")}
        </label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">
          {t("createFixTask")}
        </label>
        <QuickCapture />
      </div>
    </div>
  );
}
