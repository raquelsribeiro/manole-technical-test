import type { TaskStatus } from "../types/task";

export const taskStatusOptions: { value: TaskStatus; label: string }[] = [
  { value: "pendente", label: "Pendente" },
  { value: "em andamento", label: "Em andamento" },
  { value: "concluída", label: "Concluída" },
];

export const taskStatusFilterOptions = [
  { value: "all", label: "Todos os status" },
  ...taskStatusOptions,
];

export const taskStatusLabels: Record<TaskStatus, string> = {
  pendente: "Pendente",
  "em andamento": "Em andamento",
  concluída: "Concluída",
};

export const taskStatusColors: Record<TaskStatus, string> = {
  pendente: "yellow",
  "em andamento": "indigo",
  concluída: "green",
};
