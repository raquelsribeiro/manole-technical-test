export type TaskStatus = "pendente" | "em andamento" | "concluída";

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
