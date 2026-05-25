import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Container,
  Loader,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import {
  AppHero,
  TaskFilters,
  TaskForm,
  TaskList,
  TaskListHeader,
  TaskPagination,
} from "./components";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "./services/tasksApi";
import type { CreateTaskPayload, Task, TaskStatus } from "./types/task";
import "./App.css";

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
          <AppHero />

          <TaskFilters
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            disabled={isInitialLoading || isRefreshing}
            onSearchChange={setSearchTerm}
            onStatusChange={(value) => void handleStatusFilterChange(value)}
          />

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
                <TaskListHeader
                  totalTasks={totalTasks}
                  isRefreshing={isRefreshing}
                  onCreateTask={() => setIsFormOpen(true)}
                />

                <TaskList
                  tasks={filteredTasks}
                  changingTaskId={changingTaskId}
                  deletingTaskId={deletingTaskId}
                  hasActiveFilters={hasActiveFilters}
                  onCreateTask={() => setIsFormOpen(true)}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteTask}
                />

                <TaskPagination
                  page={page}
                  totalPages={totalPages}
                  disabled={isRefreshing}
                  onPageChange={(nextPage) => void handlePageChange(nextPage)}
                />
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
