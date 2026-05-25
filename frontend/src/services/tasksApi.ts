import type {
  CreateTaskPayload,
  Task,
  TaskStatus,
  TasksResponse,
  UpdateTaskPayload,
} from "../types/task";

const API_URL = "http://localhost:3333";

export async function getTasks(status?: TaskStatus): Promise<TasksResponse> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";

  const response = await fetch(`${API_URL}/tasks${query}`);

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
