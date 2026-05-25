import express from "express";
import cors from "cors";

import { taskRoutes } from "./routes/task.routes";

export const app = express();

const corsOrigin = process.env.CORS_ORIGIN || "*";
const corsOptions = {
  origin: corsOrigin === "*" ? "*" : corsOrigin.split(",").map((o) => o.trim()),
  credentials: corsOrigin !== "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/health", (_, response) => {
  return response.status(200).json({
    status: "healthy",
  });
});

app.use(taskRoutes);
