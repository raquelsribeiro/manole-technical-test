import { useState } from "react";
import type { CreateTaskPayload, TaskStatus } from "../types/task";

type TaskFormProps = {
  onSubmit: (payload: CreateTaskPayload) => Promise<void>;
};

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("pendente");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    setIsSubmitting(true);

    await onSubmit({
      title,
      description,
      status,
    });

    setTitle("");
    setDescription("");
    setStatus("pendente");
    setIsSubmitting(false);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Título da tarefa"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <textarea
        placeholder="Descrição"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      <select
        value={status}
        onChange={(event) => setStatus(event.target.value as TaskStatus)}
      >
        <option value="pendente">Pendente</option>
        <option value="em andamento">Em andamento</option>
        <option value="concluída">Concluída</option>
      </select>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Criando..." : "Criar tarefa"}
      </button>
    </form>
  );
}
