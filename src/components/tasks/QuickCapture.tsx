import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTasks } from "@/hooks/useTasks";
import { Plus } from "lucide-react";
import type { TaskStatus } from "@/lib/tasks";

interface QuickCaptureProps {
  date?: string;
  status?: TaskStatus;
}

export default function QuickCapture({ date, status }: QuickCaptureProps) {
  const [title, setTitle] = useState("");
  const { t } = useLanguage();
  const { create } = useTasks();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (trimmed.length < 2) return;
    create({ title: trimmed, date, status });
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative flex-1">
        <Plus className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("addTask")}
          className="pl-9"
          autoComplete="off"
        />
      </div>
      <Button
        type="submit"
        size="icon"
        disabled={title.trim().length < 2}
        aria-label={t("addTask")}
        title={t("addTask")}
        className="shrink-0"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </form>
  );
}
