import "reflect-metadata";
import { DataSource } from "typeorm";
import { Task } from "../entities/Task";

const isTestEnv = process.env.NODE_ENV === "test";
const databasePath = isTestEnv
  ? ":memory:"
  : process.env.DATABASE_PATH || "./data/tasks.sqlite";

const shouldSynchronize =
  isTestEnv || process.env.DATABASE_SYNCHRONIZE !== "false";

const enableLogging = process.env.DATABASE_LOGGING === "true";

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: databasePath,
  synchronize: shouldSynchronize,
  logging: enableLogging,
  entities: [Task],
});
