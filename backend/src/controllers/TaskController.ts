import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Task, TaskStatus } from "../entities/Task";

const taskRepository = AppDataSource.getRepository(Task);

const isValidStatus = (status: unknown): status is TaskStatus => {
  return Object.values(TaskStatus).includes(status as TaskStatus);
};

export class TaskController {
  static async create(request: Request, response: Response) {
    const { title, description, status } = request.body;

    if (!title || typeof title !== "string") {
      return response.status(400).json({
        message: "Title is required",
      });
    }

    if (status && !isValidStatus(status)) {
      return response.status(400).json({
        message: "Invalid status",
      });
    }

    const task = taskRepository.create({
      title,
      description,
      status: status ?? TaskStatus.PENDING,
    });

    await taskRepository.save(task);

    return response.status(201).json(task);
  }

  static async list(request: Request, response: Response) {
    const { status, page = "1", limit = "10" } = request.query;

    if (status !== undefined && !isValidStatus(status)) {
      return response.status(400).json({
        message: "Invalid status",
      });
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (
      Number.isNaN(pageNumber) ||
      Number.isNaN(limitNumber) ||
      pageNumber < 1 ||
      limitNumber < 1
    ) {
      return response.status(400).json({
        message: "Page and limit must be positive numbers",
      });
    }

    const [tasks, total] = await taskRepository.findAndCount({
      where: status ? { status: status as TaskStatus } : {},
      order: {
        createdAt: "DESC",
      },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });

    return response.status(200).json({
      data: tasks,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  }

  static async findById(request: Request, response: Response) {
    const { id } = request.params;

    const task = await taskRepository.findOneBy({
      id: Number(id),
    });

    if (!task) {
      return response.status(404).json({
        message: "Task not found",
      });
    }

    return response.status(200).json(task);
  }

  static async update(request: Request, response: Response) {
    const { id } = request.params;
    const { title, description, status } = request.body;

    const task = await taskRepository.findOneBy({
      id: Number(id),
    });

    if (!task) {
      return response.status(404).json({
        message: "Task not found",
      });
    }

    if (title !== undefined && typeof title !== "string") {
      return response.status(400).json({
        message: "Title must be a string",
      });
    }

    if (status !== undefined && !isValidStatus(status)) {
      return response.status(400).json({
        message: "Invalid status",
      });
    }

    taskRepository.merge(task, {
      title,
      description,
      status,
    });

    const updatedTask = await taskRepository.save(task);

    return response.status(200).json(updatedTask);
  }

  static async delete(request: Request, response: Response) {
    const { id } = request.params;

    const task = await taskRepository.findOneBy({
      id: Number(id),
    });

    if (!task) {
      return response.status(404).json({
        message: "Task not found",
      });
    }

    await taskRepository.remove(task);

    return response.status(204).send();
  }
}
