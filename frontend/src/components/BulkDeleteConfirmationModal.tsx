import { Button, Group, Modal, Paper, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconAlertTriangle, IconTrash } from "@tabler/icons-react";

type BulkDeleteConfirmationModalProps = {
  opened: boolean;
  selectedCount: number;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const BulkDeleteConfirmationModal = ({
  opened,
  selectedCount,
  isDeleting,
  onClose,
  onConfirm,
}: BulkDeleteConfirmationModalProps) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
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
                {selectedCount} tarefas serão removidas. Esta ação não pode ser
                desfeita.
              </Text>
            </Stack>
          </Group>
        </Paper>

        <Group justify="flex-end" gap="sm" mt="xs">
          <Button variant="default" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            color="red"
            type="button"
            leftSection={<IconTrash size={16} />}
            loading={isDeleting}
            className="delete-confirmation-action"
            onClick={onConfirm}
          >
            Excluir tarefas
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
