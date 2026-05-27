import { Alert, Box, Container, Loader, Paper, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  AppHero,
  BulkDeleteConfirmationModal,
  TaskFilters,
  TaskForm,
  TaskList,
  TaskListHeader,
  TaskPagination,
} from "./components";
import { useTasks } from "./hooks/useTasks";
import "./App.css";

const App = () => {
  const [isFormOpen, formModal] = useDisclosure(false);
  const [isBulkDeleteModalOpen, bulkDeleteModal] = useDisclosure(false);
  const { state, actions } = useTasks();

  const handleConfirmBulkDelete = async () => {
    await actions.deleteSelectedTasks();
    bulkDeleteModal.close();
  };

  return (
    <Box component="main" className="app-shell">
      <Container size="lg" py={{ base: "xl", md: 48 }}>
        <Stack gap="xl">
          <AppHero />

          <TaskFilters
            searchTerm={state.searchTerm}
            statusFilter={state.statusFilter}
            disabled={state.isInitialLoading || state.isRefreshing}
            onSearchChange={actions.changeSearch}
            onStatusChange={(value) => void actions.changeStatusFilter(value)}
          />

          <Box component="section" className="content-panel">
            {state.error ? (
              <Alert color="red" title="Erro ao carregar">
                {state.error}
              </Alert>
            ) : state.isInitialLoading ? (
              <Paper className="initial-loading" radius="md" withBorder>
                <Stack align="center" gap="sm">
                  <Loader color="indigo" />
                  <Text c="dimmed">Carregando tarefas...</Text>
                </Stack>
              </Paper>
            ) : (
              <Stack gap="lg">
                <TaskListHeader
                  totalTasks={state.totalTasks}
                  selectedCount={state.selectedTaskIds.length}
                  isRefreshing={state.isRefreshing}
                  isDeletingSelected={state.isDeletingSelected}
                  onCreateTask={formModal.open}
                  onDeleteSelected={bulkDeleteModal.open}
                />

                <TaskList
                  tasks={state.tasks}
                  selectedTaskIds={state.selectedTaskIds}
                  changingTaskId={state.changingTaskId}
                  deletingTaskId={state.deletingTaskId}
                  hasActiveFilters={state.hasActiveFilters}
                  onCreateTask={formModal.open}
                  onToggleTaskSelection={actions.toggleTaskSelection}
                  onStatusChange={actions.changeTaskStatus}
                  onDelete={actions.deleteTask}
                />

                <TaskPagination
                  page={state.page}
                  totalPages={state.totalPages}
                  disabled={state.isRefreshing}
                  onPageChange={(nextPage) => void actions.changePage(nextPage)}
                />
              </Stack>
            )}
          </Box>
        </Stack>
      </Container>

      <TaskForm
        opened={isFormOpen}
        onClose={formModal.close}
        onSubmit={actions.createTask}
      />

      <BulkDeleteConfirmationModal
        opened={isBulkDeleteModalOpen}
        onClose={bulkDeleteModal.close}
        selectedCount={state.selectedTaskIds.length}
        isDeleting={state.isDeletingSelected}
        onConfirm={() => void handleConfirmBulkDelete()}
      />
    </Box>
  );
};

export default App;
