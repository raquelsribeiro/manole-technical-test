import { Router } from "express";
import { TaskController } from "../controllers/TaskController";

const taskRoutes = Router();

taskRoutes.post("/tasks", TaskController.create);
taskRoutes.get("/tasks", TaskController.list);
taskRoutes.get("/tasks/:id", TaskController.findById);
taskRoutes.put("/tasks/:id", TaskController.update);
taskRoutes.delete("/tasks/:id", TaskController.delete);

export { taskRoutes };
