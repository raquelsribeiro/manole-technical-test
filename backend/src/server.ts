import { AppDataSource } from "./config/data-source";
import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_request, response) => {
  return response.json({
    message: "Manole Technical Test API",
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
