import type {
  CreateTaskPayload,
  Task,
  TaskStatus,
  TasksResponse,
  UpdateTaskPayload,
} from "../types/task";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

type GetTasksParams = {
  status?: TaskStatus;
  search?: string;
  page?: number;
  limit?: number;
};

export async function getTasks({
  status,
  search,
  page = 1,
  limit = 6,
}: GetTasksParams = {}): Promise<TasksResponse> {
  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (status) {
    searchParams.set("status", status);
  }

  if (search?.trim()) {
    searchParams.set("search", search.trim());
  }

  const response = await fetch(`${API_URL}/tasks?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error("Erro ao carregar tarefas");
  }

  return response.json();
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar tarefa");
  }

  return response.json();
}

export async function updateTask(
  id: number,
  payload: UpdateTaskPayload,
): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar tarefa");
  }

  return response.json();
}

export async function deleteTask(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Erro ao excluir tarefa");
  }
}
