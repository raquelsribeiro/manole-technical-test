import { Button, Group, Loader, Stack, Text } from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";

type TaskListHeaderProps = {
  totalTasks: number;
  selectedCount: number;
  isRefreshing: boolean;
  isDeletingSelected: boolean;
  onCreateTask: () => void;
  onDeleteSelected: () => void;
};

export const TaskListHeader = ({
  totalTasks,
  selectedCount,
  isRefreshing,
  isDeletingSelected,
  onCreateTask,
  onDeleteSelected,
}: TaskListHeaderProps) => {
  return (
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

      <Group gap="sm">
        {selectedCount > 1 && (
          <Button
            color="red"
            size="md"
            variant="light"
            leftSection={<IconTrash size={18} />}
            loading={isDeletingSelected}
            onClick={onDeleteSelected}
          >
            Apagar selecionadas ({selectedCount})
          </Button>
        )}

        <Button
          className="primary-action"
          size="md"
          leftSection={<IconPlus size={18} />}
          onClick={onCreateTask}
        >
          Criar tarefa
        </Button>
      </Group>
    </Group>
  );
};
