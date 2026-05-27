import { Badge } from "@mantine/core";
import { taskStatusColors, taskStatusLabels } from "../constants/taskStatus";
import type { TaskStatus } from "../types/task";

type TaskStatusBadgeProps = {
  status: TaskStatus;
};

export const TaskStatusBadge = ({ status }: TaskStatusBadgeProps) => {
  return (
    <Badge color={taskStatusColors[status]} variant="light">
      {taskStatusLabels[status]}
    </Badge>
  );
};
