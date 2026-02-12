import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTasks } from "@/hooks/useTasks";
import TaskCard from "@/components/tasks/TaskCard";
import type { TaskStatus } from "@/lib/tasks";

const statusOrder: TaskStatus[] = ["doing", "postponed", "finished", "canceled"];

export default function Board() {
  const { t } = useLanguage();
  const { tasks, isLoading } = useTasks();

  const grouped = useMemo(() => {
    const map: Record<TaskStatus, typeof tasks> = {
      doing: [],
      postponed: [],
      finished: [],
      canceled: [],
    };
    tasks.forEach((task) => map[task.status].push(task));
    return map;
  }, [tasks]);

  const statusLabels: Record<TaskStatus, string> = {
    doing: t("doing"),
    postponed: t("postponed"),
    finished: t("finished"),
    canceled: t("canceled"),
  };

  return (
    <div className="mx-auto max-w-4xl p-4 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statusOrder.map((status) => (
          <section key={status} className="space-y-2">
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {statusLabels[status]}{" "}
              <span className="text-muted-foreground/60">({grouped[status].length})</span>
            </h2>
            <div className="space-y-1.5">
              {grouped[status].slice(0, 50).map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
