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

const renderApp = () => {
  return render(
    <MantineProvider>
      <App />
    </MantineProvider>,
  );
};

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
});
