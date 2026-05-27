import { useCallback, useEffect, useRef, useState } from "react";

import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../services/tasksApi";
import type { CreateTaskPayload, Task, TaskStatus } from "../types/task";

const PAGE_SIZE = parseInt(import.meta.env.VITE_PAGE_SIZE || "6", 10);
const SEARCH_DEBOUNCE_MS = parseInt(
  import.meta.env.VITE_SEARCH_DEBOUNCE_MS || "550",
  10,
);

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
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

  const handleCreateTask = async (payload: CreateTaskPayload) => {
    await createTask(payload);
    setPage(1);

    await loadTasks({
      nextPage: 1,
      nextStatus: selectedStatus,
      nextSearch: selectedSearch,
    });
  };

  const handleStatusChange = async (id: number, status: TaskStatus) => {
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
  };

  const handleDeleteTask = async (id: number) => {
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
  };

  const handleDeleteSelectedTasks = async () => {
    try {
      setIsDeletingSelected(true);

      await Promise.all(selectedTaskIds.map((taskId) => deleteTask(taskId)));

      const nextPage =
        selectedTaskIds.length >= tasks.length && page > 1 ? page - 1 : page;

      if (nextPage !== page) {
        setPage(nextPage);
      }

      setSelectedTaskIds([]);
      await loadTasks({
        nextPage,
        nextStatus: selectedStatus,
        nextSearch: selectedSearch,
      });
    } finally {
      setIsDeletingSelected(false);
    }
  };

  const handleToggleTaskSelection = (id: number) => {
    setSelectedTaskIds((currentSelectedIds) =>
      currentSelectedIds.includes(id)
        ? currentSelectedIds.filter((taskId) => taskId !== id)
        : [...currentSelectedIds, id],
    );
  };

  const handleSearchChange = (value: string) => {
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
  };

  const handleStatusFilterChange = async (value: string | null) => {
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
  };

  const handlePageChange = async (nextPage: number) => {
    setPage(nextPage);
    await loadTasks({
      nextPage,
      nextStatus: selectedStatus,
      nextSearch: selectedSearch,
    });
  };

  useEffect(() => {
    void Promise.resolve().then(() =>
      loadTasks({ nextPage: 1, initial: true }),
    );
  }, [loadTasks]);

  useEffect(() => {
    return () => clearSearchDebounce();
  }, [clearSearchDebounce]);

  return {
    state: {
      tasks,
      page,
      totalPages,
      totalTasks,
      statusFilter,
      searchTerm,
      isInitialLoading,
      isRefreshing,
      changingTaskId,
      deletingTaskId,
      isDeletingSelected,
      selectedTaskIds,
      error,
      hasActiveFilters,
    },
    actions: {
      createTask: handleCreateTask,
      changeTaskStatus: handleStatusChange,
      deleteTask: handleDeleteTask,
      deleteSelectedTasks: handleDeleteSelectedTasks,
      toggleTaskSelection: handleToggleTaskSelection,
      changeSearch: handleSearchChange,
      changeStatusFilter: handleStatusFilterChange,
      changePage: handlePageChange,
    },
  };
};
