import { useMemo } from "react";
import { format, addDays } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTasks } from "@/hooks/useTasks";
import TaskCard from "@/components/tasks/TaskCard";
import QuickCapture from "@/components/tasks/QuickCapture";
import { Button } from "@/components/ui/button";

export default function PlanTomorrow() {
  const { t } = useLanguage();
  const { tasks, updateStatus } = useTasks();

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const tomorrowStr = format(addDays(new Date(), 1), "yyyy-MM-dd");

  const unfinishedToday = useMemo(
    () => tasks.filter((t) => t.status === "doing" && t.date === todayStr),
    [tasks, todayStr]
  );

  const tomorrowTasks = useMemo(
    () =>
      tasks.filter(
        (t) =>
          (t.status === "doing" || t.status === "postponed") &&
          t.date === tomorrowStr
      ),
    [tasks, tomorrowStr]
  );

  const moveAllToTomorrow = () => {
    unfinishedToday.forEach((task) => {
      updateStatus({ task, newStatus: "doing", newDate: tomorrowStr });
    });
  };

  return (
    <div className="mx-auto max-w-lg space-y-6 p-4">
      <div>
        <h1 className="text-lg font-semibold">{t("planTomorrowTitle")}</h1>
        <p className="text-sm text-muted-foreground">{t("planTomorrowDesc")}</p>
      </div>

      {/* Quick capture for tomorrow */}
      <QuickCapture date={tomorrowStr} status="postponed" />

      {/* Unfinished from today */}
      {unfinishedToday.length > 0 && (
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t("candidates")}
            </h2>
            <Button variant="outline" size="sm" onClick={moveAllToTomorrow}>
              {t("moveToTomorrow")}
            </Button>
          </div>
          <div className="space-y-1.5">
            {unfinishedToday.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </section>
      )}

      {/* Tomorrow's plan */}
      <section className="space-y-2">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {t("tomorrowPlan")}{" "}
          <span className="text-muted-foreground/60">
            ({tomorrowTasks.length} {t("tasksPlanned")})
          </span>
        </h2>
        <div className="space-y-1.5">
          {tomorrowTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </section>
    </div>
  );
}
