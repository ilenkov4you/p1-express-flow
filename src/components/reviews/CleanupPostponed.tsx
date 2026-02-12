import { useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTasks } from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";
import PostponePopover from "@/components/tasks/PostponePopover";

export default function CleanupPostponed() {
  const { t } = useLanguage();
  const { tasks, updateStatus, postpone } = useTasks();
  const [index, setIndex] = useState(0);

  const postponedTasks = useMemo(
    () => tasks.filter((t) => t.status === "postponed"),
    [tasks]
  );

  const current = postponedTasks[index];

  const advance = () => {
    if (index < postponedTasks.length - 1) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  };

  if (postponedTasks.length === 0) {
    return (
      <div className="pt-4 text-center text-sm text-muted-foreground">
        {t("cleanupDone")}
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="space-y-6 pt-4">
      <h2 className="text-sm font-semibold">{t("cleanupPostponed")}</h2>

      <div className="text-xs text-muted-foreground text-center">
        {index + 1} {t("taskOf")} {postponedTasks.length}
      </div>

      <div className="rounded-lg border bg-card p-6 text-center space-y-4">
        <p className="text-base font-medium">{current.title}</p>
        {current.notes && (
          <p className="text-sm text-muted-foreground">{current.notes}</p>
        )}
        <p className="text-xs text-muted-foreground">{current.date}</p>
      </div>

      <div className="flex justify-center gap-2">
        <Button variant="outline" size="sm" onClick={advance}>
          {t("keep")}
        </Button>
        <PostponePopover
          onPostpone={(date) => {
            postpone({ task: current, date });
            advance();
          }}
        >
          <Button variant="outline" size="sm">
            {t("reschedule")}
          </Button>
        </PostponePopover>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            updateStatus({ task: current, newStatus: "canceled" });
            advance();
          }}
        >
          {t("cancel")}
        </Button>
      </div>
    </div>
  );
}
