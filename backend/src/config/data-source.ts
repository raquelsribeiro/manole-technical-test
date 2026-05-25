import "reflect-metadata";
import { DataSource } from "typeorm";
import { Task } from "../entities/Task";

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [Task],
});
