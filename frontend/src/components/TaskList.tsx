import { TaskItem } from "./TaskItem";
import type { Task, TaskStatus } from "../types/task";

type TaskListProps = {
  tasks: Task[];
  onStatusChange: (id: number, status: TaskStatus) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

export function TaskList({ tasks, onStatusChange, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="empty-state">Nenhuma tarefa encontrada.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
