import { Request, Response } from "express";
import {
  parseCreateTaskDTO,
  parseListTasksDTO,
  parseTaskId,
  parseUpdateTaskDTO,
  ValidationError,
} from "../dtos/task.dto";
import { TaskService } from "../services/TaskService";

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  create = async (request: Request, response: Response) => {
    try {
      const data = parseCreateTaskDTO(request.body);
      const task = await this.taskService.create(data);

      return response.status(201).json(task);
    } catch (error) {
      return this.handleError(error, response);
    }
  };

  list = async (request: Request, response: Response) => {
    try {
      const query = parseListTasksDTO(request.query);
      const tasks = await this.taskService.list(query);

      return response.status(200).json(tasks);
    } catch (error) {
      return this.handleError(error, response);
    }
  };

  findById = async (request: Request, response: Response) => {
    try {
      const id = parseTaskId(request.params.id);
      const task = await this.taskService.findById(id);

      if (!task) {
        return response.status(404).json({
          message: "Task not found",
        });
      }

      return response.status(200).json(task);
    } catch (error) {
      return this.handleError(error, response);
    }
  };

  update = async (request: Request, response: Response) => {
    try {
      const id = parseTaskId(request.params.id);
      const data = parseUpdateTaskDTO(request.body);
      const task = await this.taskService.update(id, data);

      if (!task) {
        return response.status(404).json({
          message: "Task not found",
        });
      }

      return response.status(200).json(task);
    } catch (error) {
      return this.handleError(error, response);
    }
  };

  delete = async (request: Request, response: Response) => {
    try {
      const id = parseTaskId(request.params.id);
      const wasDeleted = await this.taskService.delete(id);

      if (!wasDeleted) {
        return response.status(404).json({
          message: "Task not found",
        });
      }

      return response.status(204).send();
    } catch (error) {
      return this.handleError(error, response);
    }
  };

  private handleError(error: unknown, response: Response) {
    if (error instanceof ValidationError) {
      return response.status(400).json({
        message: error.message,
      });
    }

    throw error;
  }
}
