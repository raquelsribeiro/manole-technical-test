import { Button, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { TaskItem } from "./TaskItem";
import type { Task, TaskStatus } from "../types/task";

type TaskListProps = {
  tasks: Task[];
  selectedTaskIds: number[];
  changingTaskId?: number | null;
  deletingTaskId?: number | null;
  hasActiveFilters: boolean;
  onCreateTask: () => void;
  onToggleTaskSelection: (id: number) => void;
  onStatusChange: (id: number, status: TaskStatus) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

export const TaskList = ({
  tasks,
  selectedTaskIds,
  changingTaskId,
  deletingTaskId,
  hasActiveFilters,
  onCreateTask,
  onToggleTaskSelection,
  onStatusChange,
  onDelete,
}: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <Paper className="empty-state" radius="md" withBorder>
        <Stack gap="sm" align="center">
          <Title order={3}>
            {hasActiveFilters
              ? "Não tem nenhuma tarefa com esse filtro"
              : "Nenhuma tarefa encontrada"}
          </Title>
          <Text c="dimmed" ta="center">
            {hasActiveFilters
              ? "Gostaria de criar uma nova tarefa para começar por aqui?"
              : "Crie uma tarefa para começar a organizar sua lista."}
          </Text>
          <Button
            className="primary-action"
            leftSection={<IconPlus size={18} />}
            onClick={onCreateTask}
            mt="xs"
          >
            Criar tarefa
          </Button>
        </Stack>
      </Paper>
    );
  }

  return (
    <SimpleGrid component="ul" className="task-list" cols={{ base: 1, md: 2 }}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          isSelected={selectedTaskIds.includes(task.id)}
          isChangingStatus={changingTaskId === task.id}
          isDeleting={deletingTaskId === task.id}
          onToggleSelect={onToggleTaskSelection}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </SimpleGrid>
  );
};
