import express from "express";
import cors from "cors";

import { taskRoutes } from "./routes/task.routes";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_, response) => {
  return response.status(200).json({
    status: "healthy",
  });
});

app.use(taskRoutes);
