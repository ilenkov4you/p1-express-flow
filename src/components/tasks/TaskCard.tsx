import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTasks } from "@/hooks/useTasks";
import type { Task } from "@/lib/tasks";
import PostponePopover from "./PostponePopover";
import { Check, X, Clock, Play, Repeat } from "lucide-react";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { t } = useLanguage();
  const { updateStatus, postpone } = useTasks();

  const isActive = task.status === "doing" || task.status === "postponed";

  return (
    <div className="group flex items-start gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {task.is_recurring && <Repeat className="h-3 w-3 text-muted-foreground shrink-0" />}
          <span className="text-sm leading-tight">{task.title}</span>
        </div>
        {task.notes && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{task.notes}</p>
        )}
      </div>

      {isActive && (
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          {task.status === "postponed" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              title={t("doToday")}
              onClick={() => updateStatus({ task, newStatus: "doing" })}
            >
              <Play className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-primary"
            title={t("finish")}
            onClick={() => updateStatus({ task, newStatus: "finished" })}
          >
            <Check className="h-3.5 w-3.5" />
          </Button>
          <PostponePopover onPostpone={(date) => postpone({ task, date })}>
            <Button variant="ghost" size="icon" className="h-7 w-7" title={t("postpone")}>
              <Clock className="h-3.5 w-3.5" />
            </Button>
          </PostponePopover>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive"
            title={t("cancel")}
            onClick={() => updateStatus({ task, newStatus: "canceled" })}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
