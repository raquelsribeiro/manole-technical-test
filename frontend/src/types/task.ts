export const TaskStatus = {
  PENDING: "pendente",
  IN_PROGRESS: "em andamento",
  COMPLETED: "concluída",
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export type Task = {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
};

export type TasksResponse = {
  data: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CreateTaskPayload = {
  title: string;
  description?: string;
  status?: TaskStatus;
};

export type UpdateTaskPayload = Partial<CreateTaskPayload>;
