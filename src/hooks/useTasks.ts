import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchTasks,
  createTask,
  updateTaskStatus,
  postponeTask,
  updateTaskTitle,
  updateTaskNotes,
  type Task,
  type TaskStatus,
  type RecurrenceRule,
} from "@/lib/tasks";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export function useTasks() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const tasksQuery = useQuery({
    queryKey: ["tasks", user?.id],
    queryFn: () => fetchTasks(user!.id),
    enabled: !!user,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["tasks"] });

  const createMutation = useMutation({
    mutationFn: (args: {
      title: string;
      date?: string;
      isRecurring?: boolean;
      recurrenceRule?: RecurrenceRule;
    }) =>
      createTask(
        user!.id,
        args.title,
        args.date,
        args.isRecurring,
        args.recurrenceRule
      ),
    onSuccess: invalidate,
    onError: () => toast.error(t("error")),
  });

  const statusMutation = useMutation({
    mutationFn: (args: { task: Task; newStatus: TaskStatus; newDate?: string }) =>
      updateTaskStatus(args.task, args.newStatus, args.newDate),
    onSuccess: invalidate,
    onError: () => toast.error(t("error")),
  });

  const postponeMutation = useMutation({
    mutationFn: (args: { task: Task; date: string }) =>
      postponeTask(args.task, args.date),
    onSuccess: invalidate,
    onError: () => toast.error(t("error")),
  });

  const updateTitleMutation = useMutation({
    mutationFn: (args: { taskId: string; title: string }) =>
      updateTaskTitle(args.taskId, args.title),
    onSuccess: invalidate,
    onError: () => toast.error(t("error")),
  });

  const updateNotesMutation = useMutation({
    mutationFn: (args: { taskId: string; notes: string }) =>
      updateTaskNotes(args.taskId, args.notes),
    onSuccess: invalidate,
    onError: () => toast.error(t("error")),
  });

  return {
    tasks: tasksQuery.data || [],
    isLoading: tasksQuery.isLoading,
    create: createMutation.mutate,
    updateStatus: statusMutation.mutate,
    postpone: postponeMutation.mutate,
    updateTitle: updateTitleMutation.mutate,
    updateNotes: updateNotesMutation.mutate,
  };
}
