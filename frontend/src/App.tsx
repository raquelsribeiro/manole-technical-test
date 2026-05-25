import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Container,
  Group,
  Loader,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconFilter,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "./services/tasksApi";
import type { CreateTaskPayload, Task, TaskStatus } from "./types/task";
import "./App.css";

const statusFilterOptions = [
  { value: "all", label: "Todos os status" },
  { value: "pendente", label: "Pendente" },
  { value: "em andamento", label: "Em andamento" },
  { value: "concluída", label: "Concluída" },
];

const PAGE_SIZE = 6;

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [changingTaskId, setChangingTaskId] = useState<number | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const selectedStatus = statusFilter === "all" ? undefined : statusFilter;
  const hasActiveFilters = statusFilter !== "all" || searchTerm.trim() !== "";

  const loadTasks = useCallback(
    async (params: {
      nextPage: number;
      nextStatus?: TaskStatus;
      initial?: boolean;
    }) => {
      try {
        if (params.initial) {
          setIsInitialLoading(true);
        } else {
          setIsRefreshing(true);
        }

        setError("");

        const response = await getTasks({
          status: params.nextStatus,
          page: params.nextPage,
          limit: PAGE_SIZE,
        });

        setTasks(response.data);
        setTotalPages(Math.max(response.pagination.totalPages, 1));
        setTotalTasks(response.pagination.total);
      } catch {
        setError("Não foi possível carregar as tarefas.");
      } finally {
        setIsInitialLoading(false);
        setIsRefreshing(false);
      }
    },
    [],
  );

  const filteredTasks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return tasks;
    }

    return tasks.filter((task) => {
      const title = task.title.toLowerCase();
      const description = task.description?.toLowerCase() ?? "";

      return (
        title.includes(normalizedSearch) ||
        description.includes(normalizedSearch)
      );
    });
  }, [searchTerm, tasks]);

  async function handleCreateTask(payload: CreateTaskPayload) {
    await createTask(payload);
    setPage(1);

    await loadTasks({ nextPage: 1, nextStatus: selectedStatus });
  }

  async function handleStatusChange(id: number, status: TaskStatus) {
    try {
      setChangingTaskId(id);

      const updatedTask = await updateTask(id, { status });

      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === id ? updatedTask : task)),
      );

      if (selectedStatus && status !== selectedStatus) {
        await loadTasks({ nextPage: page, nextStatus: selectedStatus });
      }
    } finally {
      setChangingTaskId(null);
    }
  }

  async function handleDeleteTask(id: number) {
    try {
      setDeletingTaskId(id);
      await deleteTask(id);

      const nextPage = tasks.length === 1 && page > 1 ? page - 1 : page;

      if (nextPage !== page) {
        setPage(nextPage);
      }

      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
      setTotalTasks((currentTotal) => Math.max(currentTotal - 1, 0));
      await loadTasks({ nextPage, nextStatus: selectedStatus });
    } finally {
      setDeletingTaskId(null);
    }
  }

  async function handleStatusFilterChange(value: string | null) {
    const nextStatusFilter = (value as TaskStatus | "all" | null) ?? "all";
    const nextStatus =
      nextStatusFilter === "all" ? undefined : nextStatusFilter;

    setStatusFilter(nextStatusFilter);
    setPage(1);
    await loadTasks({ nextPage: 1, nextStatus });
  }

  async function handlePageChange(nextPage: number) {
    setPage(nextPage);
    await loadTasks({ nextPage, nextStatus: selectedStatus });
  }

  useEffect(() => {
    void Promise.resolve().then(() =>
      loadTasks({ nextPage: 1, initial: true }),
    );
  }, [loadTasks]);

  return (
    <main className="app-shell">
      <Container size="lg" py={{ base: "xl", md: 48 }}>
        <Stack gap="xl">
          <Paper className="hero-panel" radius="md">
            <Group justify="space-between" align="flex-end" gap="lg">
              <Stack gap="xs">
                <Badge variant="light" color="indigo">
                  <Group gap={6}>Manole Technical Test</Group>
                </Badge>
                <Title className="hero-title">Gerenciador de tarefas</Title>
                <Text className="hero-subtitle">
                  Organize, filtre e acompanhe tarefas.
                </Text>
              </Stack>
            </Group>
          </Paper>

          <Paper className="toolbar" radius="md" withBorder>
            <Group grow align="flex-end">
              <TextInput
                label="Pesquisar"
                placeholder="Título ou descrição"
                value={searchTerm}
                leftSection={<IconSearch size={16} />}
                onChange={(event) => setSearchTerm(event.currentTarget.value)}
              />

              <Select
                label="Status"
                data={statusFilterOptions}
                value={statusFilter}
                allowDeselect={false}
                leftSection={<IconFilter size={16} />}
                disabled={isInitialLoading || isRefreshing}
                onChange={(value) => void handleStatusFilterChange(value)}
              />
            </Group>
          </Paper>

          <section className="content-panel">
            {error ? (
              <Alert color="red" title="Erro ao carregar">
                {error}
              </Alert>
            ) : isInitialLoading ? (
              <Paper className="initial-loading" radius="md" withBorder>
                <Stack align="center" gap="sm">
                  <Loader color="indigo" />
                  <Text c="dimmed">Carregando tarefas...</Text>
                </Stack>
              </Paper>
            ) : (
              <Stack gap="lg">
                <Group justify="space-between" align="center" gap="md">
                  <Stack gap={2}>
                    <Text fw={600}>
                      {totalTasks} {totalTasks === 1 ? "tarefa" : "tarefas"}
                    </Text>
                    {isRefreshing && (
                      <Group gap={6}>
                        <Loader size="xs" color="indigo" />
                        <Text size="sm" c="dimmed">
                          Atualizando...
                        </Text>
                      </Group>
                    )}
                  </Stack>

                  <Button
                    className="primary-action"
                    size="md"
                    leftSection={<IconPlus size={18} />}
                    onClick={() => setIsFormOpen(true)}
                  >
                    Criar tarefa
                  </Button>
                </Group>

                <TaskList
                  tasks={filteredTasks}
                  changingTaskId={changingTaskId}
                  deletingTaskId={deletingTaskId}
                  hasActiveFilters={hasActiveFilters}
                  onCreateTask={() => setIsFormOpen(true)}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteTask}
                />

                <Group className="pagination-controls" justify="center">
                  <Tooltip label="Página anterior">
                    <ActionIcon
                      variant="default"
                      size="lg"
                      radius="xl"
                      aria-label="Página anterior"
                      disabled={page <= 1 || isRefreshing}
                      onClick={() => void handlePageChange(page - 1)}
                    >
                      <IconChevronLeft size={20} />
                    </ActionIcon>
                  </Tooltip>

                  <Text size="sm" fw={600}>
                    Página {page} de {totalPages}
                  </Text>

                  <Tooltip label="Próxima página">
                    <ActionIcon
                      variant="default"
                      size="lg"
                      radius="xl"
                      aria-label="Próxima página"
                      disabled={page >= totalPages || isRefreshing}
                      onClick={() => void handlePageChange(page + 1)}
                    >
                      <IconChevronRight size={20} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Stack>
            )}
          </section>
        </Stack>
      </Container>

      <TaskForm
        opened={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateTask}
      />
    </main>
  );
}

export default App;
