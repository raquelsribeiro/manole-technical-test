import { MantineProvider } from "@mantine/core";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

const emptyTasksResponse = {
  data: [],
  pagination: {
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0,
  },
};

function renderApp() {
  return render(
    <MantineProvider>
      <App />
    </MantineProvider>,
  );
}

describe("App", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => emptyTasksResponse,
      }),
    );
  });

  it("renderiza o título da aplicação", async () => {
    renderApp();

    expect(await screen.findByText("Gerenciador de tarefas")).toBeInTheDocument();
  });

  it("renderiza o empty state", async () => {
    renderApp();

    expect(
      await screen.findByText("Nenhuma tarefa encontrada"),
    ).toBeInTheDocument();
  });

  it("abre o modal de criação", async () => {
    const user = userEvent.setup();
    renderApp();

    const createButtons = await screen.findAllByRole("button", {
      name: "Criar tarefa",
    });
    await user.click(createButtons[0]);

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Nova tarefa")).toBeInTheDocument();
  });

  it("mantém o botão de criação desabilitado quando o título está vazio", async () => {
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
});
