import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Group,
  Modal,
  Paper,
  Select,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconCalendar,
  IconTrash,
} from "@tabler/icons-react";
import type { Task, TaskStatus } from "../types/task";

type TaskItemProps = {
  task: Task;
  isChangingStatus?: boolean;
  isDeleting?: boolean;
  onStatusChange: (id: number, status: TaskStatus) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

const statusLabels: Record<TaskStatus, string> = {
  pendente: "Pendente",
  "em andamento": "Em andamento",
  concluída: "Concluída",
};

const statusColors: Record<TaskStatus, string> = {
  pendente: "yellow",
  "em andamento": "indigo",
  concluída: "green",
};

const statusOptions = [
  { value: "pendente", label: "Pendente" },
  { value: "em andamento", label: "Em andamento" },
  { value: "concluída", label: "Concluída" },
];

export function TaskItem({
  task,
  isChangingStatus = false,
  isDeleting = false,
  onStatusChange,
  onDelete,
}: TaskItemProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const isBusy = isChangingStatus || isDeleting;

  const handleConfirmDelete = async () => {
    await onDelete(task.id);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <Card component="li" className="task-card" radius="md" withBorder>
        <Stack gap="md" h="100%">
          <Group justify="space-between" align="flex-start" gap="sm">
            <Title order={3} className="task-title">
              {task.title}
            </Title>
            <Badge color={statusColors[task.status]} variant="light">
              {statusLabels[task.status]}
            </Badge>
          </Group>

          <Text c="dimmed" size="sm" className="task-description">
            {task.description || "Sem descrição."}
          </Text>

          <Group gap={6}>
            <IconCalendar size={14} color="#667085" />
            <Text size="xs" c="dimmed">
              Criada em {new Date(task.createdAt).toLocaleDateString("pt-BR")}
            </Text>
          </Group>

          <Group className="task-actions" mt="auto" align="flex-end">
            <Select
              label="Status"
              data={statusOptions}
              value={task.status}
              allowDeselect={false}
              disabled={isBusy}
              onChange={(value) =>
                value && onStatusChange(task.id, value as TaskStatus)
              }
              className="status-select"
            />

            {isChangingStatus && (
              <Text size="xs" c="dimmed">
                Salvando...
              </Text>
            )}

            <Button
              type="button"
              color="red"
              variant="light"
              leftSection={<IconTrash size={16} />}
              disabled={isChangingStatus}
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Excluir
            </Button>
          </Group>
        </Stack>
      </Card>

      <Modal
        opened={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Excluir tarefa"
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
                  Tem certeza que gostaria de excluir essa tarefa?
                </Text>
                <Text size="sm" c="dimmed">
                  Esta ação não pode ser desfeita.
                </Text>
              </Stack>
            </Group>
          </Paper>

          <Group justify="flex-end" gap="sm" mt="xs">
            <Button
              variant="default"
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              color="red"
              type="button"
              leftSection={<IconTrash size={16} />}
              loading={isDeleting}
              className="delete-confirmation-action"
              onClick={() => void handleConfirmDelete()}
            >
              Excluir
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
