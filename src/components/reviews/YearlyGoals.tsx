import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  description: string | null;
  status: "open" | "closed";
}

export default function YearlyGoals() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newGoal, setNewGoal] = useState("");
  const [filter, setFilter] = useState<"open" | "closed">("open");

  const { data: goals = [] } = useQuery({
    queryKey: ["goals", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Goal[];
    },
    enabled: !!user,
  });

  const createGoal = useMutation({
    mutationFn: async (title: string) => {
      const { error } = await supabase.from("goals").insert({
        user_id: user!.id,
        title,
        status: "open",
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["goals"] }),
  });

  const closeGoal = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("goals")
        .update({ status: "closed", closed_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["goals"] }),
  });

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.trim().length < 2) return;
    createGoal.mutate(newGoal.trim());
    setNewGoal("");
  };

  const filtered = goals.filter((g) => g.status === filter);

  return (
    <div className="space-y-6 pt-4">
      <h2 className="text-sm font-semibold">{t("yearlyGoals")}</h2>

      <form onSubmit={handleAddGoal} className="flex gap-2">
        <Input
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder={t("addGoal")}
          className="flex-1"
        />
        <Button type="submit" size="icon" variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      <div className="flex gap-2">
        <Button
          variant={filter === "open" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("open")}
        >
          {t("openGoals")}
        </Button>
        <Button
          variant={filter === "closed" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("closed")}
        >
          {t("closedGoals")}
        </Button>
      </div>

      <div className="space-y-2">
        {filtered.map((goal) => (
          <div
            key={goal.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <span className="text-sm">{goal.title}</span>
            {goal.status === "open" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => closeGoal.mutate(goal.id)}
              >
                <Check className="mr-1 h-3.5 w-3.5" />
                {t("closeGoal")}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
