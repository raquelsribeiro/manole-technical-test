import { useState } from "react";
import {
  Button,
  Group,
  Modal,
  Select,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import type { CreateTaskPayload, TaskStatus } from "../types/task";

type TaskFormProps = {
  opened: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateTaskPayload) => Promise<void>;
};

const statusOptions = [
  { value: "pendente", label: "Pendente" },
  { value: "em andamento", label: "Em andamento" },
  { value: "concluída", label: "Concluída" },
];

export function TaskForm({ opened, onClose, onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("pendente");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("pendente");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);

      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        status,
      });

      resetForm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Nova tarefa"
      centered
      radius="md"
    >
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Título"
            placeholder="Ex.: Revisar endpoints"
            value={title}
            onChange={(event) => setTitle(event.currentTarget.value)}
            required
          />

          <Textarea
            label="Descrição"
            placeholder="Detalhes importantes da tarefa"
            value={description}
            minRows={4}
            onChange={(event) => setDescription(event.currentTarget.value)}
          />

          <Select
            label="Status"
            data={statusOptions}
            value={status}
            allowDeselect={false}
            onChange={(value) => setStatus(value as TaskStatus)}
          />

          <Group justify="flex-end" mt="xs">
            <Button variant="default" onClick={onClose} type="button">
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={!title.trim()}
              className="primary-action"
            >
              Criar tarefa
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
