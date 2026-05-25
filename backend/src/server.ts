import { AppDataSource } from "./config/data-source";
import express from "express";
import cors from "cors";
import "dotenv/config";
import { taskRoutes } from "./routes/task.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use(taskRoutes);

app.get("/", (_request, response) => {
  return response.json({
    message: "Manole Technical Test API",
  });
});

app.get("/health", (_request, response) => {
  return response.status(200).json({
    status: "healthy",
  });
});

const PORT = process.env.PORT || 3333;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
