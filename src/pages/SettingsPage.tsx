import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/hooks/useTasks";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Download, Upload, Sun, Moon, Monitor } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function SettingsPage() {
  const { t, lang, setLang } = useLanguage();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();

  const handleExport = async () => {
    if (!user) return;
    const [tasksRes, goalsRes] = await Promise.all([
      supabase.from("tasks").select("*").eq("user_id", user.id),
      supabase.from("goals").select("*").eq("user_id", user.id),
    ]);
    const payload = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      tasks: tasksRes.data || [],
      goals: goalsRes.data || [],
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `p1express-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t("exportSuccess"));
  };

  const handleImport = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file || !user) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (data.version !== "1.0") throw new Error("Invalid version");

        // Upsert tasks
        if (data.tasks?.length) {
          for (const task of data.tasks) {
            task.user_id = user.id;
            await supabase.from("tasks").upsert(task, { onConflict: "id" });
          }
        }
        // Upsert goals
        if (data.goals?.length) {
          for (const goal of data.goals) {
            goal.user_id = user.id;
            await supabase.from("goals").upsert(goal, { onConflict: "id" });
          }
        }

        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        queryClient.invalidateQueries({ queryKey: ["goals"] });
        toast.success(t("importSuccess"));
      } catch {
        toast.error(t("importError"));
      }
    };
    input.click();
  };

  return (
    <div className="mx-auto max-w-lg space-y-8 p-4">
      {/* Theme */}
      <section className="space-y-3">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {t("theme")}
        </h2>
        <div className="flex gap-2">
          {[
            { value: "light", label: t("light"), icon: Sun },
            { value: "dark", label: t("dark"), icon: Moon },
            { value: "system", label: t("system"), icon: Monitor },
          ].map((opt) => (
            <Button
              key={opt.value}
              variant={theme === opt.value ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme(opt.value)}
              className="gap-1.5"
            >
              <opt.icon className="h-3.5 w-3.5" />
              {opt.label}
            </Button>
          ))}
        </div>
      </section>

      {/* Language */}
      <section className="space-y-3">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {t("language")}
        </h2>
        <div className="flex gap-2">
          <Button
            variant={lang === "en" ? "default" : "outline"}
            size="sm"
            onClick={() => setLang("en")}
          >
            English
          </Button>
          <Button
            variant={lang === "ru" ? "default" : "outline"}
            size="sm"
            onClick={() => setLang("ru")}
          >
            Русский
          </Button>
        </div>
      </section>

      {/* Export/Import */}
      <section className="space-y-3">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {t("exportData")} / {t("importData")}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
            <Download className="h-3.5 w-3.5" />
            {t("exportData")}
          </Button>
          <Button variant="outline" size="sm" onClick={handleImport} className="gap-1.5">
            <Upload className="h-3.5 w-3.5" />
            {t("importData")}
          </Button>
        </div>
      </section>

      {/* About */}
      <section className="space-y-2">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {t("about")}
        </h2>
        <p className="text-sm text-muted-foreground">{t("aboutText")}</p>
        <a
          href="https://omimo.org/en/modules/p1.express/manual/v1/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline"
        >
          {t("attribution")}
        </a>
      </section>
    </div>
  );
}
