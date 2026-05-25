import { Select } from "@mantine/core";
import { taskStatusOptions } from "../constants/taskStatus";
import type { TaskStatus } from "../types/task";

type TaskStatusSelectProps = {
  label?: string;
  value: TaskStatus;
  disabled?: boolean;
  className?: string;
  onChange: (status: TaskStatus) => void;
};

export function TaskStatusSelect({
  label = "Status",
  value,
  disabled = false,
  className,
  onChange,
}: TaskStatusSelectProps) {
  return (
    <Select
      label={label}
      data={taskStatusOptions}
      value={value}
      allowDeselect={false}
      disabled={disabled}
      className={className}
      onChange={(selectedStatus) =>
        selectedStatus && onChange(selectedStatus as TaskStatus)
      }
    />
  );
}
