import { useEffect, useState } from "react";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "./services/tasksApi";
import type { CreateTaskPayload, Task, TaskStatus } from "./types/task";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadTasks() {
    try {
      setIsLoading(true);
      setError("");

      const response = await getTasks();
      setTasks(response.data);
    } catch {
      setError("Não foi possível carregar as tarefas.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateTask(payload: CreateTaskPayload) {
    const newTask = await createTask(payload);
    setTasks((currentTasks) => [newTask, ...currentTasks]);
  }

  async function handleStatusChange(id: number, status: TaskStatus) {
    const updatedTask = await updateTask(id, { status });

    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === id ? updatedTask : task)),
    );
  }

  async function handleDeleteTask(id: number) {
    await deleteTask(id);

    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <main className="app-container">
      <section className="app-header">
        <h1>ToDo - Manole Technical Test</h1>
        <p>Gerencie suas tarefas de forma simples.</p>
      </section>

      <TaskForm onSubmit={handleCreateTask} />

      {isLoading && (
        <div className="loading-state">
          <div className="spinner" />
          <p>Carregando tarefas...</p>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}

      {!isLoading && !error && (
        <TaskList
          tasks={tasks}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteTask}
        />
      )}
    </main>
  );
}

export default App;
