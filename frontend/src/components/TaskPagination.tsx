import { ActionIcon, Group, Text, Tooltip } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

type TaskPaginationProps = {
  page: number;
  totalPages: number;
  disabled?: boolean;
  onPageChange: (page: number) => void;
};

export function TaskPagination({
  page,
  totalPages,
  disabled = false,
  onPageChange,
}: TaskPaginationProps) {
  return (
    <Group className="pagination-controls" justify="center">
      <Tooltip label="Página anterior">
        <ActionIcon
          variant="default"
          size="lg"
          radius="xl"
          aria-label="Página anterior"
          disabled={page <= 1 || disabled}
          onClick={() => onPageChange(page - 1)}
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
          disabled={page >= totalPages || disabled}
          onClick={() => onPageChange(page + 1)}
        >
          <IconChevronRight size={20} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}
