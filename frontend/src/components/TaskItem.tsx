import type { Task, TaskStatus } from "../types/task";

type TaskItemProps = {
  task: Task;
  onStatusChange: (id: number, status: TaskStatus) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

const statusLabels: Record<TaskStatus, string> = {
  pendente: "Pendente",
  "em andamento": "Em andamento",
  concluída: "Concluída",
};

const statusClassNames: Record<TaskStatus, string> = {
  pendente: "status-badge status-pending",
  "em andamento": "status-badge status-progress",
  concluída: "status-badge status-completed",
};

export function TaskItem({ task, onStatusChange, onDelete }: TaskItemProps) {
  return (
    <li className="task-item">
      <div className="task-content">
        <div className="task-title-row">
          <h3>{task.title}</h3>

          <span className={statusClassNames[task.status]}>
            {statusLabels[task.status]}
          </span>
        </div>

        {task.description && <p>{task.description}</p>}

        <small>
          Criada em: {new Date(task.createdAt).toLocaleDateString("pt-BR")}
        </small>
      </div>

      <div className="task-actions">
        <select
          value={task.status}
          onChange={(event) =>
            onStatusChange(task.id, event.target.value as TaskStatus)
          }
        >
          <option value="pendente">Pendente</option>
          <option value="em andamento">Em andamento</option>
          <option value="concluída">Concluída</option>
        </select>

        <button type="button" onClick={() => onDelete(task.id)}>
          Excluir
        </button>
      </div>
    </li>
  );
}
