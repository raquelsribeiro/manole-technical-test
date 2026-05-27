import { TaskStatus, type Task, type TasksResponse } from "../types/task";

export const emptyTasksResponse: TasksResponse = {
  data: [],
  pagination: {
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0,
  },
};

export const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: 1,
  title: "Revisar API",
  description: "Validar endpoints principais",
  status: TaskStatus.PENDING,
  createdAt: "2026-05-26T10:00:00.000Z",
  ...overrides,
});

export const tasksResponse = (
  tasks: Task[],
  totalPages = 1,
): TasksResponse => ({
  data: tasks,
  pagination: {
    page: 1,
    limit: 6,
    total: tasks.length,
    totalPages,
  },
});

export const okResponse = (body: unknown) =>
  ({
    ok: true,
    json: async () => body,
  }) as Response;

export const noContentResponse = () =>
  ({
    ok: true,
    json: async () => undefined,
  }) as Response;

export const errorResponse = () =>
  ({
    ok: false,
    json: async () => ({}),
  }) as Response;

export const taskTest = {
  emptyResponse: emptyTasksResponse,
  errorResponse,
  makeTask,
  noContentResponse,
  okResponse,
  response: tasksResponse,
};
