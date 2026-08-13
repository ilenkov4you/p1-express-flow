import { supabase } from "@/integrations/supabase/client";
import { format, addDays, addWeeks, addMonths, startOfWeek, startOfMonth } from "date-fns";

export type TaskStatus = "doing" | "postponed" | "finished" | "canceled";

export interface RecurrenceRule {
  period: "daily" | "weekly" | "monthly" | "yearly";
  interval: number;
}

export interface HistoryEntry {
  timestamp: string;
  from: TaskStatus;
  to: TaskStatus;
  date: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  status: TaskStatus;
  date: string;
  is_recurring: boolean;
  notes: string | null;
  recurrence_rule: RecurrenceRule | null;
  history: HistoryEntry[];
  parent_recurring_id: string | null;
  created_at: string;
  updated_at: string;
}

const today = () => format(new Date(), "yyyy-MM-dd");
const tomorrowDate = () => format(addDays(new Date(), 1), "yyyy-MM-dd");

function getNextOccurrence(currentDate: string, rule: RecurrenceRule): string {
  const d = new Date(currentDate);
  switch (rule.period) {
    case "daily":
      return format(addDays(d, rule.interval), "yyyy-MM-dd");
    case "weekly":
      return format(addWeeks(d, rule.interval), "yyyy-MM-dd");
    case "monthly":
      return format(addMonths(d, rule.interval), "yyyy-MM-dd");
    case "yearly":
      return format(addMonths(d, rule.interval * 12), "yyyy-MM-dd");
  }
}

export async function createTask(
  userId: string,
  title: string,
  date?: string,
  isRecurring = false,
  recurrenceRule?: RecurrenceRule,
  status: TaskStatus = "postponed"
) {
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: userId,
      title,
      status: status as TaskStatus,
      date: date || today(),
      is_recurring: isRecurring,
      recurrence_rule: recurrenceRule as any,
      history: [] as any,
    })
    .select()
    .single();
  if (error) throw error;
  return data as unknown as Task;
}

export async function updateTaskStatus(
  task: Task,
  newStatus: TaskStatus,
  newDate?: string
) {
  const historyEntry: HistoryEntry = {
    timestamp: new Date().toISOString(),
    from: task.status,
    to: newStatus,
    date: newDate || task.date,
  };

  const updatedHistory = [...(task.history || []), historyEntry];

  // If finishing a recurring task, create a finished copy and advance the original
  if (newStatus === "finished" && task.is_recurring && task.recurrence_rule) {
    // Create finished instance
    await supabase.from("tasks").insert({
      user_id: task.user_id,
      title: task.title,
      status: "finished" as TaskStatus,
      date: today(),
      is_recurring: false,
      parent_recurring_id: task.id,
      history: [historyEntry] as any,
    });

    // Advance recurring task to next date
    const nextDate = getNextOccurrence(task.date, task.recurrence_rule as RecurrenceRule);
    const { error } = await supabase
      .from("tasks")
      .update({
        date: nextDate,
        status: "postponed" as TaskStatus,
        history: updatedHistory as any,
      })
      .eq("id", task.id);
    if (error) throw error;
    return;
  }

  const updateData: Record<string, any> = {
    status: newStatus,
    history: updatedHistory as any,
  };

  if (newStatus === "finished" || newStatus === "canceled") {
    updateData.date = today();
  } else if (newDate) {
    updateData.date = newDate;
  }

  const { error } = await supabase
    .from("tasks")
    .update(updateData)
    .eq("id", task.id);
  if (error) throw error;
}

export async function postponeTask(task: Task, newDate: string) {
  return updateTaskStatus(task, "postponed", newDate);
}

export async function updateTaskTitle(taskId: string, title: string) {
  const { error } = await supabase
    .from("tasks")
    .update({ title })
    .eq("id", taskId);
  if (error) throw error;
}

export async function updateTaskNotes(taskId: string, notes: string) {
  const { error } = await supabase
    .from("tasks")
    .update({ notes })
    .eq("id", taskId);
  if (error) throw error;
}

export async function fetchTasks(userId: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: true });
  if (error) throw error;
  return (data || []) as unknown as Task[];
}

export async function fetchTasksByStatusAndDate(
  userId: string,
  status: TaskStatus,
  date: string
) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .eq("status", status)
    .eq("date", date)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data || []) as unknown as Task[];
}

export function getPostponeDate(option: "tomorrow" | "+3days" | "nextWeek" | "nextMonth"): string {
  const now = new Date();
  switch (option) {
    case "tomorrow":
      return format(addDays(now, 1), "yyyy-MM-dd");
    case "+3days":
      return format(addDays(now, 3), "yyyy-MM-dd");
    case "nextWeek":
      return format(addWeeks(now, 1), "yyyy-MM-dd");
    case "nextMonth":
      return format(addMonths(now, 1), "yyyy-MM-dd");
  }
}
