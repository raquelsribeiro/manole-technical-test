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

  it("should return 400 when status is invalid", async () => {
    const response = await request(app).post("/tasks").send({
      title: "Status inválido",
      description: "Teste de validação",
      status: "finalizado",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Invalid status",
    });
  });

  it("should return 404 when task does not exist", async () => {
    const response = await request(app).get("/tasks/99999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Task not found",
    });
  });

  it("should return 400 when title is missing", async () => {
    const response = await request(app).post("/tasks").send({
      description: "Tarefa sem título",
      status: "pendente",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Title is required",
    });
  });

  it("should return 400 when title is blank", async () => {
    const response = await request(app).post("/tasks").send({
      title: "   ",
      description: "Tarefa com título vazio",
      status: "pendente",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Title is required",
    });
  });

  it("should return 400 when description is not a string", async () => {
    const response = await request(app).post("/tasks").send({
      title: "Descrição inválida",
      description: 123,
      status: "pendente",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Description must be a string",
    });
  });

  it("should return 400 when task id is invalid", async () => {
    const response = await request(app).get("/tasks/abc");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Task id must be a positive integer",
    });
  });

  it("should return 400 when page or limit are invalid", async () => {
    const response = await request(app).get("/tasks?page=1.5&limit=10");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Page and limit must be positive integers",
    });
  });

  it("should return 400 when limit is greater than the maximum", async () => {
    const response = await request(app).get("/tasks?limit=101");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Limit must be less than or equal to 100",
    });
  });

  it("should return 400 when update payload is empty", async () => {
    const createdTask = await request(app).post("/tasks").send({
      title: "Atualização vazia",
      status: "pendente",
    });

    const response = await request(app)
      .put(`/tasks/${createdTask.body.id}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "At least one field must be provided",
    });
  });

  it("should filter tasks by status", async () => {
    await request(app).post("/tasks").send({
      title: "Tarefa pendente",
      status: "pendente",
    });

    await request(app).post("/tasks").send({
      title: "Tarefa concluída",
      status: "concluída",
    });

    const response = await request(app).get("/tasks?status=concluída");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].status).toBe("concluída");
  });

  it("should search tasks by title or description before pagination", async () => {
    const commonTasks = [
      "Tarefa comum 1",
      "Tarefa comum 2",
      "Tarefa comum 3",
      "Tarefa comum 4",
      "Tarefa comum 5",
      "Tarefa comum 6",
      "Tarefa comum 7",
    ];

    await Promise.all(
      commonTasks.map((title) =>
        request(app).post("/tasks").send({
          title,
          description: "Sem termo especial",
          status: "pendente",
        }),
      ),
    );

    await request(app).post("/tasks").send({
      title: "Revisar documentação",
      description: "Garantir busca global no backend",
      status: "pendente",
    });

    const response = await request(app).get("/tasks?search=documentação&limit=6");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].title).toBe("Revisar documentação");
    expect(response.body.pagination.total).toBe(1);
  });
});
