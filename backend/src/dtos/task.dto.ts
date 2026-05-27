import { TaskStatus } from "../entities/Task";

const MAX_PAGE_LIMIT = 100;

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export type CreateTaskDTO = {
  title: string;
  description?: string;
  status: TaskStatus;
};

export type UpdateTaskDTO = {
  title?: string;
  description?: string;
  status?: TaskStatus;
};

export type ListTasksDTO = {
  status?: TaskStatus;
  search?: string;
  page: number;
  limit: number;
};

export const parseTaskId = (id: unknown): number => {
  if (typeof id !== "string") {
    throw new ValidationError("Task id must be a positive integer");
  }

  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId < 1) {
    throw new ValidationError("Task id must be a positive integer");
  }

  return parsedId;
};

export const parseCreateTaskDTO = (body: unknown): CreateTaskDTO => {
  const payload = asRecord(body);
  const title = parseTitle(payload.title, "Title is required");
  const description = parseOptionalString(payload.description, "Description must be a string");
  const status = parseOptionalStatus(payload.status) ?? TaskStatus.PENDING;
  const dto: CreateTaskDTO = {
    title,
    status,
  };

  if (description !== undefined) {
    dto.description = description;
  }

  return dto;
};

export const parseUpdateTaskDTO = (body: unknown): UpdateTaskDTO => {
  const payload = asRecord(body);
  const dto: UpdateTaskDTO = {};
  const description = parseOptionalString(payload.description, "Description must be a string");
  const status = parseOptionalStatus(payload.status);

  if (payload.title !== undefined) {
    dto.title = parseTitle(payload.title, "Title must be a non-empty string");
  }

  if (description !== undefined) {
    dto.description = description;
  }

  if (status !== undefined) {
    dto.status = status;
  }

  if (Object.keys(dto).length === 0) {
    throw new ValidationError("At least one field must be provided");
  }

  return dto;
};

export const parseListTasksDTO = (query: Record<string, unknown>): ListTasksDTO => {
  const status = parseOptionalStatus(query.status);
  const search = parseOptionalString(query.search, "Search must be a string")?.trim();
  const page = parsePositiveInteger(query.page ?? "1");
  const limit = parsePositiveInteger(query.limit ?? "10");

  if (limit > MAX_PAGE_LIMIT) {
    throw new ValidationError(`Limit must be less than or equal to ${MAX_PAGE_LIMIT}`);
  }

  const dto: ListTasksDTO = {
    page,
    limit,
  };

  if (status !== undefined) {
    dto.status = status;
  }

  if (search) {
    dto.search = search;
  }

  return dto;
};

const asRecord = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, unknown>;
};

const parseTitle = (value: unknown, errorMessage: string): string => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ValidationError(errorMessage);
  }

  return value.trim();
};

const parseOptionalString = (
  value: unknown,
  errorMessage: string,
): string | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new ValidationError(errorMessage);
  }

  return value.trim();
};

const parseOptionalStatus = (value: unknown): TaskStatus | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (!Object.values(TaskStatus).includes(value as TaskStatus)) {
    throw new ValidationError("Invalid status");
  }

  return value as TaskStatus;
};

const parsePositiveInteger = (value: unknown): number => {
  if (typeof value !== "string") {
    throw new ValidationError("Page and limit must be positive integers");
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    throw new ValidationError("Page and limit must be positive integers");
  }

  return parsedValue;
};
