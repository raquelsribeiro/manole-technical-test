import { TaskStatus } from "../types/task";

export const taskStatusOptions: { value: TaskStatus; label: string }[] = [
  { value: TaskStatus.PENDING, label: "Pendente" },
  { value: TaskStatus.IN_PROGRESS, label: "Em andamento" },
  { value: TaskStatus.COMPLETED, label: "Concluída" },
];

export const taskStatusFilterOptions = [
  { value: "all", label: "Todos os status" },
  ...taskStatusOptions,
];

export const taskStatusLabels: Record<TaskStatus, string> = {
  [TaskStatus.PENDING]: "Pendente",
  [TaskStatus.IN_PROGRESS]: "Em andamento",
  [TaskStatus.COMPLETED]: "Concluída",
};

export const taskStatusColors: Record<TaskStatus, string> = {
  [TaskStatus.PENDING]: "yellow",
  [TaskStatus.IN_PROGRESS]: "indigo",
  [TaskStatus.COMPLETED]: "green",
};
