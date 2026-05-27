import { Group, Paper, Select, TextInput } from "@mantine/core";
import { IconFilter, IconSearch } from "@tabler/icons-react";
import { taskStatusFilterOptions } from "../constants/taskStatus";
import type { TaskStatus } from "../types/task";

type TaskFiltersProps = {
  searchTerm: string;
  statusFilter: TaskStatus | "all";
  disabled?: boolean;
  onSearchChange: (searchTerm: string) => void;
  onStatusChange: (status: string | null) => void;
};

export const TaskFilters = ({
  searchTerm,
  statusFilter,
  disabled = false,
  onSearchChange,
  onStatusChange,
}: TaskFiltersProps) => {
  return (
    <Paper className="toolbar" radius="md" withBorder>
      <Group grow align="flex-end">
        <TextInput
          label="Pesquisar"
          placeholder="Título ou descrição"
          value={searchTerm}
          leftSection={<IconSearch size={16} />}
          onChange={(event) => onSearchChange(event.currentTarget.value)}
        />

        <Select
          label="Status"
          data={taskStatusFilterOptions}
          value={statusFilter}
          allowDeselect={false}
          leftSection={<IconFilter size={16} />}
          disabled={disabled}
          onChange={onStatusChange}
        />
      </Group>
    </Paper>
  );
};
