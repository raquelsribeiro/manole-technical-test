import request from "supertest";
import { AppDataSource } from "../config/data-source";
import { app } from "../app";

describe("Tasks", () => {
  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  beforeEach(async () => {
    await AppDataSource.getRepository("Task").clear();
  });

  it("should create a task", async () => {
    const response = await request(app).post("/tasks").send({
      title: "Testar API",
      description: "Criar teste automatizado para criação de tarefa",
      status: "pendente",
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      title: "Testar API",
      description: "Criar teste automatizado para criação de tarefa",
      status: "pendente",
    });
    expect(response.body.id).toBeDefined();
    expect(response.body.createdAt).toBeDefined();
  });

  it("should list tasks", async () => {
    await request(app).post("/tasks").send({
      title: "Tarefa 1",
      description: "Primeira tarefa",
      status: "pendente",
    });

    const response = await request(app).get("/tasks");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.pagination.total).toBe(1);
  });
  it("should update task status", async () => {
    const createdTask = await request(app).post("/tasks").send({
      title: "Atualizar status",
      description: "Teste de atualização",
      status: "pendente",
    });

    const response = await request(app)
      .put(`/tasks/${createdTask.body.id}`)
      .send({
        status: "concluída",
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("concluída");
  });

  it("should delete a task", async () => {
    const createdTask = await request(app).post("/tasks").send({
      title: "Excluir tarefa",
      description: "Teste de exclusão",
      status: "pendente",
    });

    const response = await request(app).delete(`/tasks/${createdTask.body.id}`);

    expect(response.status).toBe(204);

    const tasksResponse = await request(app).get("/tasks");

    expect(tasksResponse.body.data).toHaveLength(0);
  });
});
