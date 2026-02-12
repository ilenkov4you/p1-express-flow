import { useMemo, useState } from "react";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTasks } from "@/hooks/useTasks";
import QuickCapture from "@/components/tasks/QuickCapture";
import TaskCard from "@/components/tasks/TaskCard";
import { Button } from "@/components/ui/button";
import { Dices } from "lucide-react";
import PostponePopover from "@/components/tasks/PostponePopover";
import type { Task } from "@/lib/tasks";

export default function Today() {
  const { t } = useLanguage();
  const { tasks, isLoading, updateStatus, postpone } = useTasks();
  const [lotteryTask, setLotteryTask] = useState<Task | null>(null);

  const todayStr = format(new Date(), "yyyy-MM-dd");

  const doingToday = useMemo(
    () => tasks.filter((t) => t.status === "doing" && t.date === todayStr),
    [tasks, todayStr]
  );

  const postponedToday = useMemo(
    () => tasks.filter((t) => t.status === "postponed" && t.date === todayStr),
    [tasks, todayStr]
  );

  const runLottery = () => {
    const eligible = tasks.filter(
      (t) => t.status === "postponed" && !t.is_recurring
    );
    if (eligible.length === 0) return;
    const pick = eligible[Math.floor(Math.random() * eligible.length)];
    setLotteryTask(pick);
  };

  return (
    <div className="mx-auto max-w-lg space-y-6 p-4">
      {/* Quick capture */}
      <QuickCapture />

      {/* Doing today */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t("doing")}
          </h2>
          <span className="text-xs text-muted-foreground">
            {doingToday.length} {t("tasksForToday")}
          </span>
        </div>
        {doingToday.length === 0 && !isLoading && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {t("noTasksToday")}
          </p>
        )}
        <div className="space-y-1.5">
          {doingToday.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </section>

      {/* Postponed today (inbox) */}
      {postponedToday.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t("postponed")} — {t("today")}
          </h2>
          <div className="space-y-1.5">
            {postponedToday.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </section>
      )}

      {/* Lottery */}
      <section className="space-y-3">
        <Button variant="outline" size="sm" onClick={runLottery} className="w-full gap-2">
          <Dices className="h-4 w-4" />
          {t("lottery")}
        </Button>

        {lotteryTask && (
          <div className="rounded-lg border bg-card p-4 space-y-3">
            <p className="text-sm font-medium">{lotteryTask.title}</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  updateStatus({ task: lotteryTask, newStatus: "doing" });
                  setLotteryTask(null);
                }}
              >
                {t("doToday")}
              </Button>
              <PostponePopover
                onPostpone={(date) => {
                  postpone({ task: lotteryTask, date });
                  setLotteryTask(null);
                }}
              >
                <Button variant="outline" size="sm">
                  {t("postpone")}
                </Button>
              </PostponePopover>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  updateStatus({ task: lotteryTask, newStatus: "canceled" });
                  setLotteryTask(null);
                }}
              >
                {t("cancel")}
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
