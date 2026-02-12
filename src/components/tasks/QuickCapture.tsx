import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTasks } from "@/hooks/useTasks";
import { Plus } from "lucide-react";

export default function QuickCapture() {
  const [title, setTitle] = useState("");
  const { t } = useLanguage();
  const { create } = useTasks();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (trimmed.length < 2) return;
    create({ title: trimmed });
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
    </form>
  );
}
