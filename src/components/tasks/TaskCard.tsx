import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTasks } from "@/hooks/useTasks";
import type { Task } from "@/lib/tasks";
import PostponePopover from "./PostponePopover";
import { Check, X, Clock, Play, Repeat, Pencil } from "lucide-react";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { t } = useLanguage();
  const { updateStatus, postpone, updateTitle, updateNotes } = useTasks();
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editNotes, setEditNotes] = useState(task.notes || "");
  const inputRef = useRef<HTMLInputElement>(null);

  const isActive = task.status === "doing" || task.status === "postponed";

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const saveEdit = () => {
    const trimmed = editTitle.trim();
    if (trimmed.length < 2) return;
    if (trimmed !== task.title) updateTitle({ taskId: task.id, title: trimmed });
    const notesTrimmed = editNotes.trim();
    if (notesTrimmed !== (task.notes || "")) updateNotes({ taskId: task.id, notes: notesTrimmed });
    setEditing(false);
  };

  const cancelEdit = () => {
    setEditTitle(task.title);
    setEditNotes(task.notes || "");
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="rounded-lg border bg-card p-3 space-y-2">
        <Input
          ref={inputRef}
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveEdit();
            if (e.key === "Escape") cancelEdit();
          }}
          className="h-8 text-sm"
        />
        <Input
          value={editNotes}
          onChange={(e) => setEditNotes(e.target.value)}
          placeholder={t("notes") || "Notes"}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveEdit();
            if (e.key === "Escape") cancelEdit();
          }}
          className="h-8 text-sm"
        />
        <div className="flex gap-1 justify-end">
          <Button variant="ghost" size="sm" onClick={cancelEdit} className="h-7 px-2 text-xs">
            {t("cancel")}
          </Button>
          <Button size="sm" onClick={saveEdit} className="h-7 px-2 text-xs">
            {t("save")}
          </Button>
        </div>
      </div>
    );
  }

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

      <div className="flex items-center gap-1 shrink-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          title={t("edit")}
          onClick={() => setEditing(true)}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>

        {isActive && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
