import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Group,
  Loader,
  Modal,
  Paper,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { IconAlertTriangle, IconTrash } from "@tabler/icons-react";
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
const SEARCH_DEBOUNCE_MS = 550;

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [changingTaskId, setChangingTaskId] = useState<number | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
  const [isDeletingSelected, setIsDeletingSelected] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([]);
  const [error, setError] = useState("");
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedStatus = statusFilter === "all" ? undefined : statusFilter;
  const selectedSearch = searchTerm.trim() || undefined;
  const hasActiveFilters = statusFilter !== "all" || searchTerm.trim() !== "";

  const loadTasks = useCallback(
    async (params: {
      nextPage: number;
      nextStatus?: TaskStatus;
      nextSearch?: string;
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
          search: params.nextSearch,
          page: params.nextPage,
          limit: PAGE_SIZE,
        });

        setTasks(response.data);
        setSelectedTaskIds((currentSelectedIds) =>
          currentSelectedIds.filter((taskId) =>
            response.data.some((task) => task.id === taskId),
          ),
        );
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

  const clearSearchDebounce = useCallback(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = null;
    }
  }, []);

  async function handleCreateTask(payload: CreateTaskPayload) {
    await createTask(payload);
    setPage(1);

    await loadTasks({
      nextPage: 1,
      nextStatus: selectedStatus,
      nextSearch: selectedSearch,
    });
  }

  async function handleStatusChange(id: number, status: TaskStatus) {
    try {
      setChangingTaskId(id);

      const updatedTask = await updateTask(id, { status });

      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === id ? updatedTask : task)),
      );

      if (selectedStatus && status !== selectedStatus) {
        await loadTasks({
          nextPage: page,
          nextStatus: selectedStatus,
          nextSearch: selectedSearch,
        });
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

      setSelectedTaskIds((currentSelectedIds) =>
        currentSelectedIds.filter((taskId) => taskId !== id),
      );
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
      setTotalTasks((currentTotal) => Math.max(currentTotal - 1, 0));
      await loadTasks({
        nextPage,
        nextStatus: selectedStatus,
        nextSearch: selectedSearch,
      });
    } finally {
      setDeletingTaskId(null);
    }
  }

  async function handleDeleteSelectedTasks() {
    try {
      setIsDeletingSelected(true);

      await Promise.all(selectedTaskIds.map((taskId) => deleteTask(taskId)));

      const nextPage =
        selectedTaskIds.length >= tasks.length && page > 1 ? page - 1 : page;

      if (nextPage !== page) {
        setPage(nextPage);
      }

      setSelectedTaskIds([]);
      setIsBulkDeleteModalOpen(false);
      await loadTasks({
        nextPage,
        nextStatus: selectedStatus,
        nextSearch: selectedSearch,
      });
    } finally {
      setIsDeletingSelected(false);
    }
  }

  function handleToggleTaskSelection(id: number) {
    setSelectedTaskIds((currentSelectedIds) =>
      currentSelectedIds.includes(id)
        ? currentSelectedIds.filter((taskId) => taskId !== id)
        : [...currentSelectedIds, id],
    );
  }

  function handleSearchChange(value: string) {
    const nextSearch = value.trim() || undefined;

    setSearchTerm(value);
    setPage(1);
    clearSearchDebounce();

    searchDebounceRef.current = setTimeout(() => {
      void loadTasks({
        nextPage: 1,
        nextStatus: selectedStatus,
        nextSearch,
      });
    }, SEARCH_DEBOUNCE_MS);
  }

  async function handleStatusFilterChange(value: string | null) {
    clearSearchDebounce();

    const nextStatusFilter = (value as TaskStatus | "all" | null) ?? "all";
    const nextStatus =
      nextStatusFilter === "all" ? undefined : nextStatusFilter;

    setStatusFilter(nextStatusFilter);
    setPage(1);
    await loadTasks({
      nextPage: 1,
      nextStatus,
      nextSearch: selectedSearch,
    });
  }

  async function handlePageChange(nextPage: number) {
    setPage(nextPage);
    await loadTasks({
      nextPage,
      nextStatus: selectedStatus,
      nextSearch: selectedSearch,
    });
  }

  useEffect(() => {
    void Promise.resolve().then(() =>
      loadTasks({ nextPage: 1, initial: true }),
    );
  }, [loadTasks]);

  useEffect(() => {
    return () => clearSearchDebounce();
  }, [clearSearchDebounce]);

  return (
    <Box component="main" className="app-shell">
      <Container size="lg" py={{ base: "xl", md: 48 }}>
        <Stack gap="xl">
          <AppHero />

          <TaskFilters
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            disabled={isInitialLoading || isRefreshing}
            onSearchChange={handleSearchChange}
            onStatusChange={(value) => void handleStatusFilterChange(value)}
          />

          <Box component="section" className="content-panel">
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
                  selectedCount={selectedTaskIds.length}
                  isRefreshing={isRefreshing}
                  isDeletingSelected={isDeletingSelected}
                  onCreateTask={() => setIsFormOpen(true)}
                  onDeleteSelected={() => setIsBulkDeleteModalOpen(true)}
                />

                <TaskList
                  tasks={tasks}
                  selectedTaskIds={selectedTaskIds}
                  changingTaskId={changingTaskId}
                  deletingTaskId={deletingTaskId}
                  hasActiveFilters={hasActiveFilters}
                  onCreateTask={() => setIsFormOpen(true)}
                  onToggleTaskSelection={handleToggleTaskSelection}
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
          </Box>
        </Stack>
      </Container>

      <TaskForm
        opened={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateTask}
      />

      <Modal
        opened={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        title="Excluir tarefas"
        centered
        radius="md"
        size="sm"
      >
        <Stack gap="md">
          <Paper className="delete-confirmation-box" radius="md">
            <Group align="center" gap="md" wrap="nowrap">
              <ThemeIcon
                color="red"
                variant="light"
                radius="xl"
                size={46}
                className="delete-confirmation-icon"
              >
                <IconAlertTriangle size={26} />
              </ThemeIcon>

              <Stack gap={4}>
                <Text fw={700} className="delete-confirmation-title">
                  Tem certeza que gostaria de excluir as tarefas selecionadas?
                </Text>
                <Text size="sm" c="dimmed">
                  {selectedTaskIds.length} tarefas serão removidas. Esta ação
                  não pode ser desfeita.
                </Text>
              </Stack>
            </Group>
          </Paper>

          <Group justify="flex-end" gap="sm" mt="xs">
            <Button
              variant="default"
              type="button"
              onClick={() => setIsBulkDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              color="red"
              type="button"
              leftSection={<IconTrash size={16} />}
              loading={isDeletingSelected}
              className="delete-confirmation-action"
              onClick={() => void handleDeleteSelectedTasks()}
            >
              Excluir tarefas
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}

export default App;
