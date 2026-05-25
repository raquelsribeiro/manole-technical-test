import { Button, Group, Loader, Stack, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

type TaskListHeaderProps = {
  totalTasks: number;
  isRefreshing: boolean;
  onCreateTask: () => void;
};

export function TaskListHeader({
  totalTasks,
  isRefreshing,
  onCreateTask,
}: TaskListHeaderProps) {
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

      <Button
        className="primary-action"
        size="md"
        leftSection={<IconPlus size={18} />}
        onClick={onCreateTask}
      >
        Criar tarefa
      </Button>
    </Group>
  );
}
