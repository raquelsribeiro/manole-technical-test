import type { Task, TaskStatus } from "../types/task";

type TaskItemProps = {
  task: Task;
  onStatusChange: (id: number, status: TaskStatus) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

export function TaskItem({ task, onStatusChange, onDelete }: TaskItemProps) {
  return (
    <li className="task-item">
      <div>
        <h3>{task.title}</h3>

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
