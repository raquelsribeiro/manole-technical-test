import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { renderWithProviders } from "./test/render";
import { taskTest } from "./test/taskTestUtils";
import { TaskStatus } from "./types/task";

const renderApp = () => {
  return renderWithProviders(<App />);
};

describe("App", () => {
  beforeEach(() => {
    vi.useRealTimers();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(taskTest.okResponse(taskTest.emptyResponse)),
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("should render the application title", async () => {
    renderApp();

    expect(await screen.findByText("Gerenciador de tarefas")).toBeInTheDocument();
  });

  it("should render the empty state", async () => {
    renderApp();

    expect(
      await screen.findByText("Nenhuma tarefa encontrada"),
    ).toBeInTheDocument();
  });

  it("should open the create task modal", async () => {
    const user = userEvent.setup();
    renderApp();

    const createButtons = await screen.findAllByRole("button", {
      name: "Criar tarefa",
    });
    await user.click(createButtons[0]);

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Nova tarefa")).toBeInTheDocument();
  });

  it("should keep the create button disabled when title is empty", async () => {
    const user = userEvent.setup();
    renderApp();

    const createButtons = await screen.findAllByRole("button", {
      name: "Criar tarefa",
    });
    await user.click(createButtons[0]);

    const dialog = await screen.findByRole("dialog");
    const createButton = within(dialog).getByRole("button", {
      name: "Criar tarefa",
    });

    expect(createButton).toBeDisabled();
  });

  it("should render tasks returned by the API", async () => {
    vi.mocked(fetch).mockResolvedValue(
      taskTest.okResponse(taskTest.response([taskTest.makeTask()])),
    );

    renderApp();

    expect(await screen.findByText("Revisar API")).toBeInTheDocument();
    expect(screen.getByText("Validar endpoints principais")).toBeInTheDocument();
    expect(screen.getAllByText("Pendente").length).toBeGreaterThan(0);
  });

  it("should show an error when tasks cannot be loaded", async () => {
    vi.mocked(fetch).mockResolvedValue(taskTest.errorResponse());

    renderApp();

    expect(
      await screen.findByText("Não foi possível carregar as tarefas."),
    ).toBeInTheDocument();
  });

  it("should create a task and reload the list", async () => {
    const createdTask = taskTest.makeTask({
      id: 2,
      title: "Nova tarefa",
      description: "Criada pelo teste",
    });

    vi.mocked(fetch)
      .mockResolvedValueOnce(taskTest.okResponse(taskTest.emptyResponse))
      .mockResolvedValueOnce(taskTest.okResponse(createdTask))
      .mockResolvedValueOnce(taskTest.okResponse(taskTest.response([createdTask])));

    const user = userEvent.setup();
    renderApp();

    const createButtons = await screen.findAllByRole("button", {
      name: "Criar tarefa",
    });
    await user.click(createButtons[0]);

    const dialog = await screen.findByRole("dialog");
    await user.type(
      within(dialog).getByPlaceholderText("Ex.: Revisar endpoints"),
      "Nova tarefa",
    );
    await user.type(
      within(dialog).getByPlaceholderText("Detalhes importantes da tarefa"),
      "Criada pelo teste",
    );
    await user.click(within(dialog).getByRole("button", { name: "Criar tarefa" }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/tasks"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            title: "Nova tarefa",
            description: "Criada pelo teste",
            status: TaskStatus.PENDING,
          }),
        }),
      );
    });
    expect(await screen.findByText("Nova tarefa")).toBeInTheDocument();
  });

  it("should search tasks after debounce", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(taskTest.okResponse(taskTest.emptyResponse))
      .mockResolvedValue(
        taskTest.okResponse(taskTest.response([taskTest.makeTask({ title: "API" })])),
      );

    const user = userEvent.setup();
    renderApp();

    await screen.findByText("Nenhuma tarefa encontrada");
    await user.type(screen.getByLabelText("Pesquisar"), "api");

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("search=api"));
    }, { timeout: 1200 });
  });

  it("should request the next page", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(
        taskTest.okResponse(taskTest.response([taskTest.makeTask()], 2)),
      )
      .mockResolvedValueOnce(
        taskTest.okResponse(
          taskTest.response([taskTest.makeTask({ id: 2, title: "Página 2" })], 2),
        ),
      );

    const user = userEvent.setup();
    renderApp();

    await screen.findByText("Revisar API");
    await user.click(screen.getByRole("button", { name: "Próxima página" }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("page=2"));
    });
  });

  it("should delete a task after confirmation", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(
        taskTest.okResponse(taskTest.response([taskTest.makeTask()])),
      )
      .mockResolvedValueOnce(taskTest.noContentResponse())
      .mockResolvedValueOnce(taskTest.okResponse(taskTest.emptyResponse));

    const user = userEvent.setup();
    renderApp();

    await screen.findByText("Revisar API");
    await user.click(screen.getByRole("button", { name: "Excluir" }));

    const dialog = await screen.findByRole("dialog", { name: "Excluir tarefa" });
    await user.click(within(dialog).getByRole("button", { name: "Excluir" }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/tasks/1"),
        expect.objectContaining({ method: "DELETE" }),
      );
    });
  });

  it("should delete selected tasks after confirmation", async () => {
    const firstTask = taskTest.makeTask({ id: 1, title: "Primeira tarefa" });
    const secondTask = taskTest.makeTask({ id: 2, title: "Segunda tarefa" });

    vi.mocked(fetch)
      .mockResolvedValueOnce(
        taskTest.okResponse(taskTest.response([firstTask, secondTask])),
      )
      .mockResolvedValueOnce(taskTest.noContentResponse())
      .mockResolvedValueOnce(taskTest.noContentResponse())
      .mockResolvedValueOnce(taskTest.okResponse(taskTest.emptyResponse));

    const user = userEvent.setup();
    renderApp();

    await screen.findByText("Primeira tarefa");
    const selectionButtons = screen.getAllByRole("button", {
      name: "Selecionar tarefa",
    });
    await user.click(selectionButtons[0]);
    await user.click(selectionButtons[1]);
    await user.click(screen.getByRole("button", { name: "Apagar selecionadas (2)" }));

    const dialog = await screen.findByRole("dialog", { name: "Excluir tarefas" });
    await user.click(
      within(dialog).getByRole("button", { name: "Excluir tarefas" }),
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/tasks/1"),
        expect.objectContaining({ method: "DELETE" }),
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/tasks/2"),
        expect.objectContaining({ method: "DELETE" }),
      );
    });
  });
});
