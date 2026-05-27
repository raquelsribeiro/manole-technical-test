import { Repository } from "typeorm";

import { CreateTaskDTO, ListTasksDTO, UpdateTaskDTO } from "../dtos/task.dto";
import { Task } from "../entities/Task";

export class TaskService {
  constructor(private readonly taskRepository: Repository<Task>) {}

  async create(data: CreateTaskDTO): Promise<Task> {
    const task = this.taskRepository.create(data);

    return this.taskRepository.save(task);
  }

  async list({ status, search, page, limit }: ListTasksDTO) {
    const queryBuilder = this.taskRepository
      .createQueryBuilder("task")
      .orderBy("task.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    if (status) {
      queryBuilder.andWhere("task.status = :status", { status });
    }

    if (search) {
      queryBuilder.andWhere(
        "(LOWER(task.title) LIKE :search OR LOWER(task.description) LIKE :search)",
        { search: `%${search.toLowerCase()}%` },
      );
    }

    const [tasks, total] = await queryBuilder.getManyAndCount();

    return {
      data: tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: number): Promise<Task | null> {
    return this.taskRepository.findOneBy({ id });
  }

  async update(id: number, data: UpdateTaskDTO): Promise<Task | null> {
    const task = await this.findById(id);

    if (!task) {
      return null;
    }

    this.taskRepository.merge(task, data);

    return this.taskRepository.save(task);
  }

  async delete(id: number): Promise<boolean> {
    const task = await this.findById(id);

    if (!task) {
      return false;
    }

    await this.taskRepository.remove(task);

    return true;
  }
}
