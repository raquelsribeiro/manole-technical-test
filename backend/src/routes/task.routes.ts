import { Router } from "express";
import { AppDataSource } from "../config/data-source";
import { TaskController } from "../controllers/TaskController";
import { Task } from "../entities/Task";
import { TaskService } from "../services/TaskService";

const taskRoutes = Router();
const taskRepository = AppDataSource.getRepository(Task);
const taskService = new TaskService(taskRepository);
const taskController = new TaskController(taskService);

taskRoutes.post("/tasks", taskController.create);
taskRoutes.get("/tasks", taskController.list);
taskRoutes.get("/tasks/:id", taskController.findById);
taskRoutes.put("/tasks/:id", taskController.update);
taskRoutes.delete("/tasks/:id", taskController.delete);

export { taskRoutes };
